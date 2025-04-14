package services

import (
	"ecommerce-backend/config"
	"ecommerce-backend/models"
	"log"
	"os"

	"github.com/google/uuid"
	"github.com/veritrans/go-midtrans"
)

func CreateSnapToken(orderID string) (string, error) {
	var order models.Order

	if err := config.DB.
		Preload("OrderItems.Product").
		Where("id = ?", orderID).
		First(&order).Error; err != nil {
		return "", err
	}

	var amount float64
	for _, item := range order.OrderItems {
		amount += float64(item.Quantity) * float64(item.Product.Price)
	}

	midtransClient := midtrans.NewClient()
	midtransClient.ServerKey = os.Getenv("MIDTRANS_SERVER_KEY")
	midtransClient.ClientKey = os.Getenv("MIDTRANS_CLIENT_KEY")
	midtransClient.APIEnvType = midtrans.Sandbox

	snapGateway := midtrans.SnapGateway{Client: midtransClient}

	snapReq := &midtrans.SnapReq{
		TransactionDetails: midtrans.TransactionDetails{
			OrderID:  orderID,
			GrossAmt: int64(amount),
		},
	}

	snapResp, err := snapGateway.GetToken(snapReq)
	if err != nil {
		return "", err
	}

	payment := models.Payment{
		ID:        uuid.New(),
		OrderID:   orderID,
		Amount:    amount,
		SnapToken: snapResp.Token,
		Status:    models.PaymentStatusPending,
	}

	if err := config.DB.Create(&payment).Error; err != nil {
		return "", err
	}

	return snapResp.Token, nil
}

func UpdatePaymentStatus(orderID, transactionID, midtransStatus string) error {
	log.Printf("Starting UpdatePaymentStatus for orderID=%s, status=%s", orderID, midtransStatus)

	tx := config.DB.Begin()
	defer func() {
		if r := recover(); r != nil {
			tx.Rollback()
			log.Printf("Panic recovered in UpdatePaymentStatus: %v", r)
		}
	}()

	var paymentStatus, orderStatus string
	switch midtransStatus {
	case "settlement", "capture":
		paymentStatus = models.PaymentStatusSuccess
		orderStatus = models.OrderStatusPaid
		log.Printf("Payment successful, setting status to %s", paymentStatus)
	case "cancel", "deny":
		paymentStatus = models.PaymentStatusCancel
		orderStatus = models.OrderStatusCancelled
	case "expire":
		paymentStatus = models.PaymentStatusExpired
		orderStatus = models.OrderStatusCancelled
	case "pending":
		paymentStatus = models.PaymentStatusPending
		orderStatus = models.OrderStatusPending
	default:
		paymentStatus = models.PaymentStatusFailed
		orderStatus = models.OrderStatusCancelled
	}

	var payment models.Payment
	if err := tx.Where("order_id = ?", orderID).First(&payment).Error; err != nil {
		log.Printf("Payment not found for orderID=%s: %v", orderID, err)
		tx.Rollback()
		return err
	}

	log.Printf("Found payment for orderID=%s, updating status to %s", orderID, paymentStatus)
	if err := tx.Model(&payment).Updates(map[string]interface{}{
		"status":         paymentStatus,
		"transaction_id": transactionID,
	}).Error; err != nil {
		log.Printf("Error updating payment: %v", err)
		tx.Rollback()
		return err
	}

	var order models.Order
	if err := tx.Where("id = ?", orderID).First(&order).Error; err != nil {
		log.Printf("Order not found for orderID=%s: %v", orderID, err)
		tx.Rollback()
		return err
	}

	log.Printf("Found order for orderID=%s, updating status to %s", orderID, orderStatus)
	if err := tx.Model(&order).Update("status", orderStatus).Error; err != nil {
		log.Printf("Error updating order status: %v", err)
		tx.Rollback()
		return err
	}

	if paymentStatus == models.PaymentStatusSuccess {
		log.Printf("Payment successful, updating order items to processing for orderID=%s", orderID)

		result := tx.Model(&models.OrderItem{}).
			Where("order_id = ?", orderID).
			Update("status", models.OrderItemStatusProcessing)

		if result.Error != nil {
			log.Printf("Error updating order items: %v", result.Error)
			tx.Rollback()
			return result.Error
		}

		log.Printf("Updated %d order items to processing", result.RowsAffected)

		if err := tx.Commit().Error; err != nil {
			log.Printf("Error committing transaction: %v", err)
			return err
		}

		log.Printf("Transaction committed, clearing cart for userID=%s", order.UserID)
		if err := ClearCart(order.UserID); err != nil {
			log.Printf("Error clearing cart: %v", err)
			return err
		}
	} else if paymentStatus == models.PaymentStatusCancel ||
		paymentStatus == models.PaymentStatusExpired ||
		paymentStatus == models.PaymentStatusFailed {
		log.Printf("Payment failed, updating order items to cancelled for orderID=%s", orderID)

		if err := tx.Model(&models.OrderItem{}).
			Where("order_id = ?", orderID).
			Update("status", models.OrderItemStatusCancelled).Error; err != nil {
			log.Printf("Error updating order items to cancelled: %v", err)
			tx.Rollback()
			return err
		}

		if err := tx.Commit().Error; err != nil {
			log.Printf("Error committing transaction: %v", err)
			return err
		}
	} else {
		log.Printf("Payment in pending state, committing transaction")
		if err := tx.Commit().Error; err != nil {
			log.Printf("Error committing transaction: %v", err)
			return err
		}
	}

	log.Printf("Successfully updated payment status for orderID=%s", orderID)
	return nil
}

func GetPaymentByOrderID(orderID string) (*models.Payment, error) {
	var payment models.Payment
	if err := config.DB.Where("order_id = ?", orderID).First(&payment).Error; err != nil {
		return nil, err
	}
	return &payment, nil
}

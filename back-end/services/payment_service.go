package services

import (
	"ecommerce-backend/config"
	"ecommerce-backend/models"
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
	var amount int64
	for _, item := range order.OrderItems {
		amount += int64(item.Quantity) * int64(item.Product.Price)
	}

	midtransClient := midtrans.NewClient()
	midtransClient.ServerKey = os.Getenv("MIDTRANS_SERVER_KEY")
	midtransClient.ClientKey = os.Getenv("MIDTRANS_CLIENT_KEY")
	midtransClient.APIEnvType = midtrans.Sandbox

	snapGateway := midtrans.SnapGateway{Client: midtransClient}

	snapReq := &midtrans.SnapReq{
		TransactionDetails: midtrans.TransactionDetails{
			OrderID:  orderID,
			GrossAmt: amount,
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
	tx := config.DB.Begin()

	var paymentStatus string
	var orderStatus string

	switch midtransStatus {
	case "settlement", "capture":
		paymentStatus = models.PaymentStatusSuccess
		orderStatus = models.OrderStatusPaid
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

	if err := tx.Model(&models.Payment{}).
		Where("order_id = ?", orderID).
		Updates(map[string]interface{}{
			"status":         paymentStatus,
			"transaction_id": transactionID,
		}).Error; err != nil {
		tx.Rollback()
		return err
	}

	if err := tx.Model(&models.Order{}).
		Where("id = ?", orderID).
		Update("status", orderStatus).Error; err != nil {
		tx.Rollback()
		return err
	}

	if paymentStatus == models.PaymentStatusSuccess {
		if err := tx.Model(&models.OrderItem{}).
			Where("order_id = ?", orderID).
			Update("status", models.OrderItemStatusPaid).Error; err != nil {
			tx.Rollback()
			return err
		}

		var order models.Order
		if err := tx.Where("id = ?", orderID).First(&order).Error; err != nil {
			tx.Rollback()
			return err
		}

		tx.Commit()

		if err := ClearCart(order.UserID); err != nil {
			return err
		}
	} else if orderStatus == models.OrderStatusCancelled {
		if err := tx.Model(&models.OrderItem{}).
			Where("order_id = ?", orderID).
			Update("status", models.OrderItemStatusCancelled).Error; err != nil {
			tx.Rollback()
			return err
		}

		tx.Commit()
	} else {
		tx.Commit()
	}

	return nil
}

func GetPaymentByOrderID(orderID string) (*models.Payment, error) {
	var payment models.Payment
	if err := config.DB.Where("order_id = ?", orderID).First(&payment).Error; err != nil {
		return nil, err
	}
	return &payment, nil
}

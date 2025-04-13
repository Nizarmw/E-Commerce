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
	var paymentStatus string
	var orderStatus string

	switch midtransStatus {
	case "settlement", "capture":
		paymentStatus = models.PaymentStatusSuccess
		orderStatus = "paid"
	case "cancel", "deny":
		paymentStatus = models.PaymentStatusCancel
		orderStatus = "cancelled"
	case "expire":
		paymentStatus = models.PaymentStatusExpired
		orderStatus = "cancelled"
	case "pending":
		paymentStatus = models.PaymentStatusPending
		orderStatus = "pending"
	default:
		paymentStatus = models.PaymentStatusFailed
		orderStatus = "cancelled"
	}

	if err := config.DB.Model(&models.Payment{}).
		Where("order_id = ?", orderID).
		Updates(map[string]interface{}{
			"status":         paymentStatus,
			"transaction_id": transactionID,
		}).Error; err != nil {
		return err
	}

	if err := config.DB.Model(&models.Order{}).
		Where("id = ?", orderID).
		Update("status", orderStatus).Error; err != nil {
		return err
	}

	// if paymentStatus == models.PaymentStatusSuccess {
	// 	var order models.Order
	// 	if err := config.DB.Where("id = ?", orderID).First(&order).Error; err != nil {
	// 		return err
	// 	}

	// 	if err := ClearCart(order.UserID); err != nil {
	// 		return err
	// 	}
	// }

	return nil
}

func GetPaymentByOrderID(orderID string) (*models.Payment, error) {
	var payment models.Payment
	if err := config.DB.Where("order_id = ?", orderID).First(&payment).Error; err != nil {
		return nil, err
	}
	return &payment, nil
}

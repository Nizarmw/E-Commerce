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
	var status string

	switch midtransStatus {
	case "settlement", "capture":
		status = models.PaymentStatusSuccess
	case "cancel":
		status = models.PaymentStatusCancel
	case "expire":
		status = models.PaymentStatusExpired
	case "pending":
		status = models.PaymentStatusPending
	default:
		status = models.PaymentStatusFailed
	}

	return config.DB.Model(&models.Payment{}).
		Where("order_id = ?", orderID).
		Updates(map[string]interface{}{
			"status":         status,
			"transaction_id": transactionID,
		}).Error
}

func GetPaymentByOrderID(orderID string) (*models.Payment, error) {
	var payment models.Payment
	if err := config.DB.Where("order_id = ?", orderID).First(&payment).Error; err != nil {
		return nil, err
	}
	return &payment, nil
}

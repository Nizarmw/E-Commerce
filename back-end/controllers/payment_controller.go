package controllers

import (
	"crypto/sha512"
	"ecommerce-backend/services"
	"encoding/hex"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
)

type PaymentRequest struct {
	OrderID string `json:"order_id"`
}

func CreatePayment(c *gin.Context) {
	var req PaymentRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	snapToken, err := services.CreateSnapToken(req.OrderID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"snap_token": snapToken})
}

func generateSignature(orderID, statusCode, grossAmount, serverKey string) string {
	signature := orderID + statusCode + grossAmount + serverKey
	hash := sha512.New()
	hash.Write([]byte(signature))
	return hex.EncodeToString(hash.Sum(nil))
}

func MidtransWebhook(c *gin.Context) {
	var notif map[string]interface{}
	if err := c.ShouldBindJSON(&notif); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	serverKey := os.Getenv("MIDTRANS_SERVER_KEY")
	orderId := notif["order_id"].(string)
	statusCode := notif["status_code"].(string)
	grossAmount := notif["gross_amount"].(string)
	expectedSignature := generateSignature(orderId, statusCode, grossAmount, serverKey)

	if notif["signature_key"] != expectedSignature {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid signature"})
		return
	}

	orderID, ok1 := notif["order_id"].(string)
	transactionID, ok2 := notif["transaction_id"].(string)
	status, ok3 := notif["transaction_status"].(string)

	if !ok1 || !ok2 || !ok3 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid webhook payload"})
		return
	}

	if err := services.UpdatePaymentStatus(orderID, transactionID, status); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "payment status updated"})
}

func GetPayment(c *gin.Context) {
	orderID := c.Param("order_id")

	payment, err := services.GetPaymentByOrderID(orderID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "payment not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"order_id":       payment.OrderID,
		"amount":         payment.Amount,
		"snap_token":     payment.SnapToken,
		"transaction_id": payment.TransactionID,
		"status":         payment.Status,
	})
}

package controllers

import (
	"ecommerce-backend/services"
	"net/http"

	"github.com/gin-gonic/gin"
)

type PaymentRequest struct {
	OrderID string `json:"order_id"`
	Amount  int64  `json:"amount"`
}

func CreatePayment(c *gin.Context) {
	var req PaymentRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	snapToken, err := services.CreateSnapToken(req.OrderID, req.Amount)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"snap_token": snapToken})
}

func MidtransWebhook(c *gin.Context) {
	var notif map[string]interface{}
	if err := c.ShouldBindJSON(&notif); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
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

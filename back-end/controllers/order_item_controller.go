package controllers

import (
	"ecommerce-backend/services"
	"net/http"

	"github.com/gin-gonic/gin"
)

func GetSellerOrderItems(c *gin.Context) {
	user, _ := c.Get("user")
	sellerID := user.(map[string]interface{})["id"].(string)

	orderItems, err := services.GetSellerOrderItems(sellerID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch order items"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": orderItems})
}

func GetSellerOrderItemByID(c *gin.Context) {
	orderItemID := c.Param("id")
	user, _ := c.Get("user")
	sellerID := user.(map[string]interface{})["id"].(string)

	orderItem, err := services.GetSellerOrderItemByID(orderItemID, sellerID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": orderItem})
}

type UpdateStatusRequest struct {
	Status string `json:"status" binding:"required"`
}

func UpdateOrderItemStatus(c *gin.Context) {
	orderItemID := c.Param("id")
	user, _ := c.Get("user")
	sellerID := user.(map[string]interface{})["id"].(string)

	var req UpdateStatusRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	err := services.UpdateOrderItemStatus(orderItemID, sellerID, req.Status)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Order item status updated successfully"})
}

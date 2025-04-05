package controllers

import (
	"ecommerce-backend/models"
	"ecommerce-backend/services"
	"net/http"

	"github.com/gin-gonic/gin"
)

// CreateOrder menangani pembuatan order dengan validasi stok produk
func CreateOrder(c *gin.Context) {
	var order models.Order
	if err := c.ShouldBindJSON(&order); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Ambil user ID dari JWT
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	order.UserID = userID.(string)

	// Validasi dan buat order
	if err := services.CreateOrder(&order); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message":     "Order created successfully",
		"order_id":    order.ID,
		"total_price": order.TotalPrice,
	})
}

// GetOrderByID menangani pengambilan order berdasarkan ID
func GetOrderByID(c *gin.Context) {
	id := c.Param("id")
	order, err := services.GetOrderByID(id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Order not found"})
		return
	}
	c.JSON(http.StatusOK, order)
}

// GetOrdersByUserID menangani pengambilan semua order milik user
func GetOrdersByUserID(c *gin.Context) {
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	orders, err := services.GetOrdersByUserID(userID.(string))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch orders"})
		return
	}
	c.JSON(http.StatusOK, orders)
}

// UpdateOrder menangani pembaruan status order
func UpdateOrder(c *gin.Context) {
	var order models.Order
	if err := c.ShouldBindJSON(&order); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := services.UpdateOrder(&order); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update order"})
		return
	}

	c.JSON(http.StatusOK, order)
}

// DeleteOrder menangani penghapusan order
func DeleteOrder(c *gin.Context) {
	id := c.Param("id")
	if err := services.DeleteOrder(id); err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Order not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Order deleted successfully"})
}

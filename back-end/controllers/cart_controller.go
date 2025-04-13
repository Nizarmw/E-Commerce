package controllers

import (
	"net/http"

	"ecommerce-backend/models"
	"ecommerce-backend/services"

	"github.com/gin-gonic/gin"
)

func AddToCart(c *gin.Context) {
	var input models.CartItem
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	cartItem, err := services.AddToCart(input.UserID, input.ProductID, input.Quantity)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Added to cart", "cart_item": cartItem})
}

func GetCartByUser(c *gin.Context) {
	userID := c.Param("user_id")

	cartItems, err := services.GetCartByUser(userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, cartItems)
}

func UpdateCartItem(c *gin.Context) {
	var input models.CartItem
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	updatedCartItem, err := services.UpdateCartItem(input.ID, input.Quantity)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Cart updated", "cart_item": updatedCartItem})
}

func DeleteCartItem(c *gin.Context) {
	cartItemID := c.Param("id")
	userID := c.Query("user_id") // atau dari JWT context kalau pakai auth

	if err := services.DeleteCartItem(userID, cartItemID); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Cart item deleted"})
}

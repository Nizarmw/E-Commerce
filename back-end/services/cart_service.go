package services

import (
	"errors"

	"ecommerce-backend/config"
	"ecommerce-backend/models"

	"github.com/google/uuid"
)

func AddToCart(userID, productID string, quantity int) (*models.CartItem, error) {
	var product models.Product
	if err := config.DB.First(&product, "id = ?", productID).Error; err != nil {
		return nil, errors.New("product not found")
	}

	var existingCartItem models.CartItem
	if err := config.DB.
		Where("user_id = ? AND product_id = ?", userID, productID).
		First(&existingCartItem).Error; err == nil {

		existingCartItem.Quantity += quantity
		if err := config.DB.Save(&existingCartItem).Error; err != nil {
			return nil, err
		}

		if err := config.DB.Preload("Product").First(&existingCartItem, "id = ?", existingCartItem.ID).Error; err != nil {
			return nil, err
		}

		return &existingCartItem, nil
	}

	cartItem := models.CartItem{
		ID:        uuid.New().String(),
		UserID:    userID,
		ProductID: productID,
		Quantity:  quantity,
	}
	if err := config.DB.Create(&cartItem).Error; err != nil {
		return nil, err
	}

	if err := config.DB.Preload("Product").First(&cartItem, "id = ?", cartItem.ID).Error; err != nil {
		return nil, err
	}

	return &cartItem, nil
}

func GetCartByUser(userID string) ([]models.CartItem, error) {
	var cartItems []models.CartItem
	if err := config.DB.Preload("Product").Where("user_id = ?", userID).Find(&cartItems).Error; err != nil {
		return nil, err
	}
	return cartItems, nil
}

func UpdateCartItem(cartItemID string, newQuantity int) (*models.CartItem, error) {
	var cartItem models.CartItem
	if err := config.DB.
		Preload("Product").
		First(&cartItem, "id = ?", cartItemID).Error; err != nil {
		return nil, errors.New("cart item not found")
	}

	cartItem.Quantity = newQuantity
	if err := config.DB.Model(&models.CartItem{}).Where("id = ?", cartItemID).Update("quantity", newQuantity).Error; err != nil {
		return nil, err
	}
	return &cartItem, nil
}

func DeleteCartItem(userID, cartItemID string) error {
	var cartItem models.CartItem
	if err := config.DB.First(&cartItem, "id = ? AND user_id = ?", cartItemID, userID).Error; err != nil {
		return errors.New("cart item not found or unauthorized")
	}
	return config.DB.Delete(&cartItem).Error
}

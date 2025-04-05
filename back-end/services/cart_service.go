package services

import (
	"errors"

	"ecommerce-backend/config"
	"ecommerce-backend/models"

	"github.com/google/uuid"
)

// Menambahkan item ke cart
func AddToCart(userID, productID string, quantity int) (*models.CartItem, error) {
	// Cek apakah produk ada
	var product models.Product
	if err := config.DB.First(&product, "id = ?", productID).Error; err != nil {
		return nil, errors.New("product not found")
	}

	// Cek apakah item sudah ada di cart
	var existingCartItem models.CartItem
	if err := config.DB.Where("user_id = ? AND product_id = ?", userID, productID).First(&existingCartItem).Error; err == nil {
		// Jika sudah ada, update quantity
		existingCartItem.Quantity += quantity
		if err := config.DB.Save(&existingCartItem).Error; err != nil {
			return nil, err
		}
		return &existingCartItem, nil
	}

	// Jika belum ada, buat cart baru
	cartItem := models.CartItem{
		ID:        uuid.New().String(),
		UserID:    userID,
		ProductID: productID,
		Quantity:  quantity,
	}
	if err := config.DB.Create(&cartItem).Error; err != nil {
		return nil, err
	}
	return &cartItem, nil
}

// Mendapatkan semua item dalam cart berdasarkan user
func GetCartByUser(userID string) ([]models.CartItem, error) {
	var cartItems []models.CartItem
	if err := config.DB.Preload("Product").Where("user_id = ?", userID).Find(&cartItems).Error; err != nil {
		return nil, err
	}
	return cartItems, nil
}

// Mengupdate jumlah item di cart
func UpdateCartItem(cartItemID string, newQuantity int) (*models.CartItem, error) {
	var cartItem models.CartItem
	if err := config.DB.First(&cartItem, "id = ?", cartItemID).Error; err != nil {
		return nil, errors.New("cart item not found")
	}

	cartItem.Quantity = newQuantity
	if err := config.DB.Save(&cartItem).Error; err != nil {
		return nil, err
	}
	return &cartItem, nil
}

// Menghapus item dari cart
func DeleteCartItem(cartItemID string) error {
	if err := config.DB.Delete(&models.CartItem{}, "id = ?", cartItemID).Error; err != nil {
		return err
	}
	return nil
}

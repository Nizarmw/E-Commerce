package services

import (
	"ecommerce-backend/config"
	"ecommerce-backend/models"
	"errors"
	"fmt"
)

func GetSellerOrderItems(sellerID string) ([]models.OrderItem, error) {
	var orderItems []models.OrderItem
	err := config.DB.Preload("Product").Preload("Order").Preload("Order.User").
		Joins("JOIN products ON products.id = order_items.product_id").
		Where("products.seller_id = ?", sellerID).
		Find(&orderItems).Error
	return orderItems, err
}

func GetSellerOrderItemByID(orderItemID string, sellerID string) (models.OrderItem, error) {
	var orderItem models.OrderItem
	err := config.DB.Preload("Product").Preload("Order").Preload("Order.User").
		Joins("JOIN products ON products.id = order_items.product_id").
		Where("order_items.id = ? AND products.seller_id = ?", orderItemID, sellerID).
		First(&orderItem).Error
	if err != nil {
		return orderItem, errors.New("order item not found or you don't have permission to view it")
	}
	return orderItem, nil
}

func UpdateOrderItemStatus(orderItemID string, sellerID string, newStatus string) error {
	var orderItem models.OrderItem

	if err := config.DB.Preload("Product").Where("id = ?", orderItemID).First(&orderItem).Error; err != nil {
		return errors.New("order item not found")
	}

	if orderItem.Product.SellerID != sellerID {
		return errors.New("unauthorized: you are not the seller of this product")
	}

	allowedNextStatuses, exists := models.ValidStatusTransitions[orderItem.Status]
	if !exists {
		return errors.New("current status is invalid")
	}

	isValidTransition := false
	for _, status := range allowedNextStatuses {
		if status == newStatus {
			isValidTransition = true
			break
		}
	}

	if !isValidTransition {
		return fmt.Errorf("invalid status transition: cannot change from %s to %s", orderItem.Status, newStatus)
	}

	return config.DB.Model(&orderItem).Update("status", newStatus).Error
}

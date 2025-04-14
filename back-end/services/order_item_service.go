package services

import (
	"ecommerce-backend/config"
	"ecommerce-backend/models"
	"errors"
	"fmt"

	"gorm.io/gorm"
)

func GetSellerOrderItems(sellerID string) ([]models.OrderItem, error) {
	var orderItems []models.OrderItem

	err := config.DB.
		Preload("Product").
		Preload("Order").
		Preload("Order.User").
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
	tx := config.DB.Begin()
	defer func() {
		if r := recover(); r != nil {
			tx.Rollback()
		}
	}()

	var orderItem models.OrderItem
	if err := tx.Set("gorm:query_option", "FOR UPDATE").Where("id = ?", orderItemID).First(&orderItem).Error; err != nil {
		tx.Rollback()
		return errors.New("order item not found")
	}

	var product models.Product
	if err := tx.Where("id = ?", orderItem.ProductID).First(&product).Error; err != nil {
		tx.Rollback()
		return errors.New("product not found")
	}

	if product.SellerID != sellerID {
		tx.Rollback()
		return errors.New("unauthorized: you are not the seller of this product")
	}

	allowedNextStatuses, exists := models.ValidStatusTransitions[orderItem.Status]
	if !exists {
		tx.Rollback()
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
		tx.Rollback()
		return fmt.Errorf("invalid status transition: cannot change from %s to %s", orderItem.Status, newStatus)
	}

	if err := tx.Model(&orderItem).UpdateColumn("status", newStatus).Error; err != nil {
		tx.Rollback()
		return err
	}

	orderID := orderItem.OrderID

	if err := updateOrderStatusWithinTransaction(tx, orderID); err != nil {
		tx.Rollback()
		return err
	}

	return tx.Commit().Error
}

func updateOrderStatusWithinTransaction(tx *gorm.DB, orderID string) error {
	var order models.Order
	if err := tx.Set("gorm:query_option", "FOR UPDATE").Where("id = ?", orderID).First(&order).Error; err != nil {
		return err
	}

	if order.Status == models.OrderStatusCancelled || order.Status == models.OrderStatusCompleted {
		return nil
	}

	var orderItems []models.OrderItem
	if err := tx.Where("order_id = ?", orderID).Find(&orderItems).Error; err != nil {
		return err
	}

	allCancelled := true
	for _, item := range orderItems {
		if item.Status != models.OrderItemStatusCancelled {
			allCancelled = false
			break
		}
	}

	if allCancelled && len(orderItems) > 0 {
		if err := tx.Model(&order).UpdateColumn("status", models.OrderStatusCancelled).Error; err != nil {
			return err
		}
		return nil
	}

	var nonCancelledItems []models.OrderItem
	for _, item := range orderItems {
		if item.Status != models.OrderItemStatusCancelled {
			nonCancelledItems = append(nonCancelledItems, item)
		}
	}

	if len(nonCancelledItems) == 0 {
		return nil
	}

	allShipped := true
	allDeliveredOrCancelled := true
	hasDelivered := false
	hasProcessing := false

	for _, item := range orderItems {
		if item.Status != models.OrderItemStatusShipped &&
			item.Status != models.OrderItemStatusDelivered &&
			item.Status != models.OrderItemStatusCancelled {
			allShipped = false
		}

		if item.Status != models.OrderItemStatusDelivered &&
			item.Status != models.OrderItemStatusCancelled {
			allDeliveredOrCancelled = false
		}

		if item.Status == models.OrderItemStatusDelivered {
			hasDelivered = true
		}

		if item.Status == models.OrderItemStatusProcessing {
			hasProcessing = true
		}
	}

	var orderNewStatus string

	if allDeliveredOrCancelled && hasDelivered {
		orderNewStatus = models.OrderStatusCompleted
	} else if allShipped {
		orderNewStatus = models.OrderStatusShipped
	} else if hasProcessing {
		orderNewStatus = models.OrderStatusProcessing
	} else if order.Status == models.OrderStatusPaid {
		orderNewStatus = models.OrderStatusPaid
	} else {
		return nil
	}

	if order.Status != orderNewStatus {
		if err := tx.Model(&order).UpdateColumn("status", orderNewStatus).Error; err != nil {
			return err
		}
	}

	return nil
}

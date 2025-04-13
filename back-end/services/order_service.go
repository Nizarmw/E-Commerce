package services

import (
	"ecommerce-backend/config"
	"ecommerce-backend/models"
	"errors"
	"log"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

func CreateOrder(order *models.Order) error {
	tx := config.DB.Begin()

	// Set UUID untuk order
	order.ID = uuid.New().String()

	var totalPrice float64
	correctedOrderItems := make([]models.OrderItem, len(order.OrderItems))

	for i, item := range order.OrderItems {
		orderItem := models.OrderItem{
			ID:        uuid.New().String(),
			OrderID:   order.ID,
			ProductID: item.ProductID,
			Quantity:  item.Quantity,
			Status:    models.OrderItemStatusPaid,
		}

		log.Printf("Setting UUID for OrderItem %d: %s", i, orderItem.ID)

		var product models.Product
		if err := tx.First(&product, "id = ?", orderItem.ProductID).Error; err != nil {
			tx.Rollback()
			return errors.New("product not found")
		}

		if product.Stock < orderItem.Quantity {
			tx.Rollback()
			return errors.New("insufficient stock for product: " + product.Name)
		}

		orderItem.Price = float64(orderItem.Quantity) * product.Price
		totalPrice += orderItem.Price

		correctedOrderItems[i] = orderItem
	}

	order.TotalPrice = totalPrice
	order.Status = "pending"
	order.OrderItems = correctedOrderItems

	if err := tx.Create(order).Error; err != nil {
		tx.Rollback()
		return err
	}

	tx.Commit()
	return nil
}

func UpdateProductStock(productID string, quantity int) error {
	return config.DB.Model(&models.Product{}).
		Where("id = ?", productID).
		Update("stock", gorm.Expr("stock - ?", quantity)).Error
}

func GetOrderByID(id string) (*models.Order, error) {
	var order models.Order
	err := config.DB.
		Preload("User").
		Preload("OrderItems.Product").
		First(&order, "id = ?", id).Error

	if errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, errors.New("order not found")
	}
	return &order, nil
}

func GetOrdersByUserID(userID string) ([]models.Order, error) {
	var orders []models.Order
	err := config.DB.
		Preload("User").
		Preload("OrderItems.Product").
		Where("user_id = ?", userID).
		Find(&orders).Error
	return orders, err
}

func UpdateOrder(order *models.Order) error {
	tx := config.DB.Begin()

	if order.ID == "" {
		return errors.New("order ID cannot be empty")
	}

	var existingOrder models.Order
	if err := tx.Preload("OrderItems").First(&existingOrder, "id = ?", order.ID).Error; err != nil {
		tx.Rollback()
		return errors.New("order not found")
	}

	if existingOrder.Status == "pending" {
		tx.Rollback()
		return errors.New("cannot update order while status is still pending. Please cancel and reorder")
	}

	existingOrder.Status = order.Status

	if err := tx.Save(&existingOrder).Error; err != nil {
		tx.Rollback()
		return err
	}

	tx.Commit()
	return nil
}

func DeleteOrder(id string) error {
	tx := config.DB.Begin()

	var order models.Order
	if err := tx.First(&order, "id = ?", id).Error; err != nil {
		tx.Rollback()
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return errors.New("order not found")
		}
		return errors.New("failed to find order: " + err.Error())
	}

	if err := tx.Delete(&order).Error; err != nil {
		tx.Rollback()
		return errors.New("failed to delete order: " + err.Error())
	}

	tx.Commit()
	return nil
}
func UpdateOrderStatusBasedOnItems(orderID string) error {
	tx := config.DB.Begin()

	var order models.Order
	if err := tx.Preload("OrderItems").First(&order, "id = ?", orderID).Error; err != nil {
		tx.Rollback()
		return err
	}

	if order.Status == models.OrderStatusCancelled || order.Status == models.OrderStatusCompleted {
		tx.Commit()
		return nil
	}

	if order.Status != models.OrderStatusPaid && order.Status != models.OrderStatusProcessing &&
		order.Status != models.OrderStatusShipped {
		tx.Commit()
		return nil
	}

	var nonCancelledItems []models.OrderItem
	for _, item := range order.OrderItems {
		if item.Status != models.OrderItemStatusCancelled {
			nonCancelledItems = append(nonCancelledItems, item)
		}
	}

	if len(nonCancelledItems) == 0 {
		order.Status = models.OrderStatusCancelled
		if err := tx.Save(&order).Error; err != nil {
			tx.Rollback()
			return err
		}
		tx.Commit()
		return nil
	}

	allShipped := true
	allDelivered := true
	hasProcessing := false

	for _, item := range nonCancelledItems {
		if item.Status != models.OrderItemStatusShipped && item.Status != models.OrderItemStatusDelivered {
			allShipped = false
		}

		if item.Status != models.OrderItemStatusDelivered {
			allDelivered = false
		}

		if item.Status == models.OrderItemStatusProcessing {
			hasProcessing = true
		}
	}

	var newStatus string

	if allDelivered {
		newStatus = models.OrderStatusCompleted
	} else if allShipped {
		newStatus = models.OrderStatusShipped
	} else if hasProcessing {
		newStatus = models.OrderStatusProcessing
	} else if order.Status == models.OrderStatusPaid {
		newStatus = models.OrderStatusProcessing
	} else {
		tx.Commit()
		return nil
	}

	if order.Status != newStatus {
		order.Status = newStatus
		if err := tx.Save(&order).Error; err != nil {
			tx.Rollback()
			return err
		}
	}

	tx.Commit()
	return nil
}

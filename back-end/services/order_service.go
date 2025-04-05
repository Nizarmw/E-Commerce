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

	order.ID = uuid.New().String()
	var totalPrice float64

	// Create a new slice with the correct type ([]models.OrderItem)
	correctedOrderItems := make([]models.OrderItem, len(order.OrderItems))

	// Ensure each OrderItem has a valid ID before processing
	for i, item := range order.OrderItems {
		// Create a new OrderItem and set its ID
		orderItem := models.OrderItem{
			ID:        uuid.New().String(),
			ProductID: item.ProductID,
			Quantity:  item.Quantity,
		}

		// Log to check if ID is assigned correctly
		log.Printf("Setting UUID for OrderItem %d: %s", i, orderItem.ID)

		var product models.Product
		if err := config.DB.First(&product, "id = ?", orderItem.ProductID).Error; err != nil {
			tx.Rollback()
			return errors.New("product not found")
		}

		if product.Stock < orderItem.Quantity {
			tx.Rollback()
			return errors.New("insufficient stock for product: " + product.Name)
		}

		orderItem.Price = float64(orderItem.Quantity) * product.Price
		totalPrice += orderItem.Price

		orderItem.OrderID = order.ID

		correctedOrderItems[i] = orderItem
	}

	order.TotalPrice = totalPrice
	order.Status = "pending"

	order.OrderItems = correctedOrderItems

	if err := tx.Create(order).Error; err != nil {
		tx.Rollback()
		return err
	}

	for _, item := range correctedOrderItems {
		if err := tx.Model(&models.Product{}).
			Where("id = ?", item.ProductID).
			Update("stock", gorm.Expr("stock - ?", item.Quantity)).Error; err != nil {
			tx.Rollback()
			return err
		}
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
		Preload("Users").
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

	// Update hanya status
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

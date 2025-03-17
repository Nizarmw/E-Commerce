package services

import (
	"ecommerce-backend/config"
	"ecommerce-backend/models"
	"errors"
)

func CreateProduct(product *models.Product) error {
	if err := config.DB.Create(product).Error; err != nil {
		return errors.New("failed to create product")
	}
	return nil
}

func GetProducts() ([]models.Product, error) {
	var products []models.Product
	err := config.DB.Find(&products).Error
	return products, err
}

func GetProductByID(id string) (*models.Product, error) {
	var product models.Product
	err := config.DB.First(&product, "id = ?", id).Error
	return &product, err
}

func UpdateProduct(product *models.Product) error {
	return config.DB.Save(product).Error
}

func DeleteProduct(product *models.Product) error {
	return config.DB.Delete(product).Error
}

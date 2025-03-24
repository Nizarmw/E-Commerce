package services

import (
	"ecommerce-backend/config"
	"ecommerce-backend/models"
	"errors"
	"fmt"

	"gorm.io/gorm"
)

func CreateProduct(product *models.Product) error {
	fmt.Println("Creating product:", product)

	if err := config.DB.Create(product).Error; err != nil {
		fmt.Println("DB Error:", err)
		return errors.New("failed to create product")
	}

	return nil
}

func GetProducts() ([]models.Product, error) {
	var products []models.Product
	err := config.DB.Preload("Category").Preload("Seller").Find(&products).Error
	return products, err
}

func GetProductByID(id string) (*models.Product, error) {
	var product models.Product
	err := config.DB.Preload("Category").Preload("Seller").First(&product, "id = ?", id).Error
	if errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, errors.New("product not found")
	}
	return &product, err
}

func UpdateProduct(product *models.Product) error {
	var existing models.Product
	err := config.DB.First(&existing, "id = ?", product.ID).Error
	if errors.Is(err, gorm.ErrRecordNotFound) {
		return errors.New("product not found")
	}
	return config.DB.Save(product).Error
}

func DeleteProduct(product *models.Product) error {
	if err := config.DB.First(product, "id = ?", product.ID).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return errors.New("product not found")
		}
		return err
	}
	return config.DB.Delete(product).Error
}

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

func GetProductByID(id string) (*models.Product, error) {
	var product models.Product
	err := config.DB.
		Preload("Seller").
		Preload("Category").
		First(&product, "id = ?", id).Error

	if errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, errors.New("product not found")
	}

	if product.Seller != nil {
		product.SellerName = product.Seller.Name
	}
	if product.Category != nil {
		product.CategoryName = product.Category.Name
	}

	return &product, nil
}

func GetProducts() ([]models.Product, error) {
	var products []models.Product
	err := config.DB.
		Preload("Seller").
		Preload("Category").
		Find(&products).Error

	if err != nil {
		return nil, err
	}

	for i := range products {
		if products[i].Seller != nil {
			products[i].SellerName = products[i].Seller.Name
		}
		if products[i].Category != nil {
			products[i].CategoryName = products[i].Category.Name
		}
	}

	return products, nil
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

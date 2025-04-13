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
		Preload("Reviews.User").
		First(&product, "id = ?", id).Error

	if errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, errors.New("product not found")
	}
	if err != nil {
		return nil, err
	}

	if product.Seller != nil {
		product.SellerName = product.Seller.Name
	}
	if product.Category != nil {
		product.CategoryName = product.Category.Name
	}

	if len(product.Reviews) > 0 {
		var total int
		for _, review := range product.Reviews {
			total += review.Rating
		}
		product.Rating = float64(total) / float64(len(product.Reviews))
	} else {
		product.Rating = 0
	}

	return &product, nil
}

func GetProducts() ([]models.Product, error) {
	var products []models.Product
	err := config.DB.
		Preload("Seller").
		Preload("Category").
		Preload("Reviews.User").
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

		if len(products[i].Reviews) > 0 {
			var total int
			for _, review := range products[i].Reviews {
				total += review.Rating
			}
			products[i].Rating = float64(total) / float64(len(products[i].Reviews))
		} else {
			products[i].Rating = 0
		}
	}

	return products, nil
}

func UpdateProduct(product *models.Product) error {
	return config.DB.Model(&models.Product{}).
		Where("id = ?", product.ID).
		Updates(map[string]interface{}{
			"name":        product.Name,
			"description": product.Description,
			"price":       product.Price,
			"stock":       product.Stock,
			"category_id": product.CategoryID,
			"image_url":   product.ImageURL,
		}).Error
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
func SearchProducts(query string) ([]models.Product, error) {
	var products []models.Product
	err := config.DB.
		Preload("Seller").
		Preload("Category").
		Preload("Reviews").
		Where("name LIKE ?", "%"+query+"%").
		Or("description LIKE ?", "%"+query+"%").
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
		if len(products[i].Reviews) > 0 {
			var total int
			for _, review := range products[i].Reviews {
				total += review.Rating
			}
			products[i].Rating = float64(total) / float64(len(products[i].Reviews))
		}
	}

	return products, nil
}

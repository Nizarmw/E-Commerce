package services

import (
	"ecommerce-backend/config"
	"ecommerce-backend/models"

	"github.com/google/uuid"
)

func CreateCategory(category *models.Category) error {
	category.ID = uuid.New().String()
	return config.DB.Create(category).Error
}

func GetCategories() ([]models.Category, error) {
	var categories []models.Category
	err := config.DB.Preload("Products").Find(&categories).Error
	return categories, err
}
func DeleteCategory(id string) error {
	var category models.Category

	if err := config.DB.First(&category, "id = ?", id).Error; err != nil {
		return err
	}

	return config.DB.Delete(&category).Error
}

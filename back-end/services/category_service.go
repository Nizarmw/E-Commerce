package services

import (
	"ecommerce-backend/config"
	"ecommerce-backend/models"
)

func CreateCategory(category *models.Category) error {
	return config.DB.Create(category).Error
}

func GetCategories() ([]models.Category, error) {
	var categories []models.Category
	err := config.DB.Find(&categories).Error
	return categories, err
}
func DeleteCategory(id string) error {
	var category models.Category

	if err := config.DB.First(&category, "id = ?", id).Error; err != nil {
		return err
	}

	return config.DB.Delete(&category).Error
}

package services

import (
	"ecommerce-backend/config"
	"ecommerce-backend/models"
	"errors"

	"gorm.io/gorm"
)

func GetUserByID(id string) (*models.User, error) {
	var user models.User
	err := config.DB.Preload("Products").Preload("Orders").Preload("Reviews").First(&user, "id = ?", id).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("user not found")
		}
		return nil, err
	}
	return &user, nil
}
func UpdateUser(id string, user *models.User) (*models.User, error) {
	var existingUser models.User
	if err := config.DB.First(&existingUser, "id = ?", id).Error; err != nil {
		return nil, errors.New("user not found")
	}

	if err := config.DB.Model(&existingUser).Updates(user).Error; err != nil {
		return nil, err
	}

	return &existingUser, nil
}

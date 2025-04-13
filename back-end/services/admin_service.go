package services

import (
	"errors"

	"ecommerce-backend/config"
	"ecommerce-backend/models"
)

func GetAllUsers() ([]models.User, error) {
	var users []models.User
	if err := config.DB.Find(&users).Error; err != nil {
		return nil, err
	}
	return users, nil
}

func UpdateUserRole(id string, newRole string) error {
	var user models.User
	if err := config.DB.First(&user, "id = ?", id).Error; err != nil {
		return errors.New("user not found")
	}
	user.Role = newRole
	return config.DB.Save(&user).Error
}

func ToggleUserActiveStatus(id string, isActive bool) error {
	var user models.User
	if err := config.DB.First(&user, "id = ?", id).Error; err != nil {
		return errors.New("user not found")
	}

	return config.DB.Model(&user).Update("is_active", isActive).Error
}

func GetUserListByID(id string) (*models.User, error) {
	var user models.User
	if err := config.DB.First(&user, "id = ?", id).Error; err != nil {
		return nil, errors.New("user not found")
	}
	return &user, nil
}

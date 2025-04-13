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
	for i := range users {
		users[i].Password = ""
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

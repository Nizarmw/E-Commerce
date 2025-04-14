package services

import (
	"ecommerce-backend/config"
	"ecommerce-backend/models"
	"errors"
	"fmt"

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

	rawSQL := fmt.Sprintf(
		`UPDATE users SET name = '%s', email = '%s' WHERE id = '%s' LIMIT 1`,
		user.Name, user.Email, id,
	)

	if err := config.DB.Exec(rawSQL).Error; err != nil {
		return nil, err
	}

	config.DB.First(&existingUser, "id = ?", id)
	return &existingUser, nil
}

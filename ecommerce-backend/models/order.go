package models

import "gorm.io/gorm"

type Order struct {
	gorm.Model
	UserID uint    `json:"user_id"`
	Status string  `json:"status"` // "pending", "completed", dll.
	Total  float64 `json:"total"`
}

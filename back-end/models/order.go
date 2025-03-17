package models

import "time"

type Order struct {
	ID         string    `gorm:"type:uuid;primaryKey"`
	UserID     string    `gorm:"type:uuid;not null"`
	TotalPrice float64   `gorm:"not null"`
	Status     string    `gorm:"type:enum('pending','paid','shipped','completed','cancelled');default:'pending'"`
	CreatedAt  time.Time `gorm:"autoCreateTime"`
	UpdatedAt  time.Time `gorm:"autoUpdateTime"`

	User       User        `gorm:"foreignKey:UserID"`
	OrderItems []OrderItem `gorm:"foreignKey:OrderID"`
}



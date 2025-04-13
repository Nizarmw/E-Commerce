package models

import "time"

type Order struct {
	ID         string    `gorm:"type:uuid;primaryKey" json:"id"`
	UserID     string    `gorm:"type:uuid;not null" json:"user_id"`
	TotalPrice float64   `gorm:"not null" json:"total_price"`
	Status     string    `gorm:"type:enum('pending','paid','processing','shipped','completed','cancelled');default:'pending'" json:"status"`
	CreatedAt  time.Time `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt  time.Time `gorm:"autoUpdateTime" json:"updated_at"`

	User       *User       `gorm:"foreignKey:UserID" json:"user"`
	OrderItems []OrderItem `gorm:"foreignKey:OrderID" json:"order_items"`
}

const (
	OrderStatusPending    = "pending"
	OrderStatusPaid       = "paid"
	OrderStatusProcessing = "processing"
	OrderStatusShipped    = "shipped"
	OrderStatusCompleted  = "completed"
	OrderStatusCancelled  = "cancelled"
)

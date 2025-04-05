package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type CartItem struct {
	ID        string    `gorm:"type:uuid;primaryKey" json:"id"`
	UserID    string    `gorm:"type:uuid;not null" json:"user_id"`
	ProductID string    `gorm:"type:uuid;not null" json:"product_id"`
	Quantity  int       `gorm:"not null" json:"quantity"`
	CreatedAt time.Time `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt time.Time `gorm:"autoUpdateTime" json:"updated_at"`

	User    User    `gorm:"foreignKey:UserID;constraint:OnDelete:CASCADE;" json:"-"`
	Product Product `gorm:"foreignKey:ProductID;constraint:OnDelete:CASCADE;" json:"product"`
}

func (c *CartItem) BeforeCreate(tx *gorm.DB) (err error) {
	c.ID = uuid.New().String()
	return
}

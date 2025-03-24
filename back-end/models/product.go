package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Product struct {
	ID          string    `gorm:"type:uuid;primaryKey"`
	Name        string    `gorm:"size:255;not null"`
	Description string    `gorm:"type:text"`
	Price       float64   `gorm:"not null"`
	Stock       int       `gorm:"not null"`
	SellerID    string    `gorm:"type:uuid;not null"`
	CategoryID  string    `gorm:"type:uuid;not null"`
	CreatedAt   time.Time `gorm:"autoCreateTime"`
	UpdatedAt   time.Time `gorm:"autoUpdateTime"`

	Seller   User     `gorm:"foreignKey:SellerID"`
	Category Category `gorm:"foreignKey:CategoryID"`
	Reviews  []Review `gorm:"foreignKey:ProductID"`
}

func (p *Product) BeforeCreate(tx *gorm.DB) (err error) {
	p.ID = uuid.NewString()
	return
}

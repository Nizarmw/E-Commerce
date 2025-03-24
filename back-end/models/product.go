package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Product struct {
	ID          string    `gorm:"type:uuid;primaryKey" json:"id"`
	Name        string    `gorm:"size:255;not null" json:"name"`
	Description string    `gorm:"type:text" json:"description"`
	Price       float64   `gorm:"not null" json:"price"`
	Stock       int       `gorm:"not null" json:"stock"`
	SellerID    string    `gorm:"type:uuid;not null" json:"seller_id"`
	CategoryID  string    `gorm:"type:uuid;not null" json:"category_id"`
	CreatedAt   time.Time `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt   time.Time `gorm:"autoUpdateTime" json:"updated_at"`

	Seller   *User     `gorm:"foreignKey:SellerID" json:"seller"`
	Category *Category `gorm:"foreignKey:CategoryID" json:"category"`
	Reviews  []Review  `gorm:"foreignKey:ProductID" json:"reviews"`
}

func (p *Product) BeforeCreate(tx *gorm.DB) (err error) {
	p.ID = uuid.NewString()
	return
}

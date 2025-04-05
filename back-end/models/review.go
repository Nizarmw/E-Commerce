package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Review struct {
	ID        string    `gorm:"type:uuid;primaryKey" json:"id"`
	UserID    string    `gorm:"type:uuid;not null" json:"user_id"`
	ProductID string    `gorm:"type:uuid;not null" json:"product_id"`
	Rating    int       `gorm:"not null" json:"rating"`
	Comment   string    `gorm:"type:text" json:"comment"`
	CreatedAt time.Time `gorm:"autoCreateTime" json:"created_at"`

	User    *User    `gorm:"foreignKey:UserID;references:ID" json:"-"`
	Product *Product `gorm:"foreignKey:ProductID;references:ID" json:"-"`
}

func (r *Review) BeforeCreate(tx *gorm.DB) (err error) {
	r.ID = uuid.NewString()
	return
}

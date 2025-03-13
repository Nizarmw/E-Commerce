package models

import "time"
import (
	"github.com/google/uuid"
	"gorm.io/gorm"
)
type User struct {
	ID        string    `gorm:"type:uuid;primaryKey"`
	Name      string    `gorm:"size:255;not null"`
	Email     string    `gorm:"size:255;unique;not null"`
	Password  string    `gorm:"not null"`
	Role      string    `gorm:"type:enum('admin','seller','buyer');default:'buyer'"`
	CreatedAt time.Time `gorm:"autoCreateTime"`
	UpdatedAt time.Time `gorm:"autoUpdateTime"`

	Products []Product `gorm:"foreignKey:SellerID"`
	Orders   []Order   `gorm:"foreignKey:UserID"`
	Reviews  []Review  `gorm:"foreignKey:UserID"`
}
func (u *User) BeforeCreate(tx *gorm.DB) (err error) {
	u.ID = uuid.New().String() 
	return
}


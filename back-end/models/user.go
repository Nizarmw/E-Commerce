package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type User struct {
	ID        string    `gorm:"type:uuid;primaryKey" json:"id"`
	Name      string    `gorm:"size:255;not null" json:"name"`
	Email     string    `gorm:"size:255;unique;not null" json:"email"`
	Password  string    `gorm:"not null" json:"password"`
	Role      string    `gorm:"type:enum('admin','seller','buyer');default:'buyer'" json:"role"`
	CreatedAt time.Time `gorm:"autoCreateTime"`
	UpdatedAt time.Time `gorm:"autoUpdateTime"`

	Products []Product `gorm:"foreignKey:SellerID;references:ID" json:"-"`
	Orders   []Order   `gorm:"foreignKey:UserID;references:ID" json:"-"`
	Reviews  []Review  `gorm:"foreignKey:UserID;references:ID" json:"-"`
}

func (u *User) BeforeCreate(tx *gorm.DB) (err error) {
	u.ID = uuid.New().String()
	return
}

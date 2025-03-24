package models

import "time"

type Review struct {
	ID        string    `gorm:"type:uuid;primaryKey"`
	UserID    string    `gorm:"type:uuid;not null"`
	ProductID string    `gorm:"type:uuid;not null"`
	Rating    int       `gorm:"not null"`
	Comment   string    `gorm:"type:text"`
	CreatedAt time.Time `gorm:"autoCreateTime"`

	User    User    `gorm:"foreignKey:UserID;references:ID"`
	Product Product `gorm:"foreignKey:ProductID;references:ID"`
}

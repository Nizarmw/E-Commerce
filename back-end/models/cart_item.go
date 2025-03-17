package models

type CartItem struct {
	ID        string `gorm:"type:uuid;primaryKey"`
	UserID    string `gorm:"type:uuid;not null"`
	ProductID string `gorm:"type:uuid;not null"`
	Quantity  int    `gorm:"not null"`

	User    User    `gorm:"foreignKey:UserID"`
	Product Product `gorm:"foreignKey:ProductID"`
}

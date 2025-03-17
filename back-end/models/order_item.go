package models

type OrderItem struct {
	ID        string  `gorm:"type:uuid;primaryKey"`
	OrderID   string  `gorm:"type:uuid;not null"`
	ProductID string  `gorm:"type:uuid;not null"`
	Quantity  int     `gorm:"not null"`
	Price     float64 `gorm:"not null"`

	Order   Order   `gorm:"foreignKey:OrderID"`
	Product Product `gorm:"foreignKey:ProductID"`
}

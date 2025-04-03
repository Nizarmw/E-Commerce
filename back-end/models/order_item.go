package models

type OrderItem struct {
	ID        string  `gorm:"type:uuid;primaryKey" json:"id"`
	OrderID   string  `gorm:"type:uuid;not null" json:"order_id"`
	ProductID string  `gorm:"type:uuid;not null" json:"product_id"`
	Quantity  int     `gorm:"not null" json:"quantity"`
	Price     float64 `gorm:"not null" json:"price"`

	Order   Order   `gorm:"foreignKey:OrderID;constraint:OnDelete:CASCADE;" json:"order,omitempty"`
	Product Product `gorm:"foreignKey:ProductID" json:"product,omitempty"`
}

package models

type OrderItem struct {
	ID        string  `gorm:"type:uuid;primaryKey" json:"id"`
	OrderID   string  `gorm:"type:uuid;not null" json:"order_id"`
	ProductID string  `gorm:"type:uuid;not null" json:"product_id"`
	Quantity  int     `gorm:"not null" json:"quantity"`
	Price     float64 `gorm:"not null" json:"price"`
	Status    string  `gorm:"type:enum('pending','paid','processing','shipped','delivered','cancelled');default:'pending'" json:"status"`
	Order     Order   `gorm:"foreignKey:OrderID;constraint:OnDelete:CASCADE;" json:"order"`
	Product   Product `gorm:"foreignKey:ProductID" json:"product,omitempty"`
}

const (
	OrderItemStatusPending    = "pending"
	OrderItemStatusPaid       = "paid"
	OrderItemStatusProcessing = "processing"
	OrderItemStatusShipped    = "shipped"
	OrderItemStatusDelivered  = "delivered"
	OrderItemStatusCancelled  = "cancelled"
)

var ValidStatusTransitions = map[string][]string{
	OrderItemStatusPending:    {OrderItemStatusProcessing, OrderItemStatusCancelled},
	OrderItemStatusPaid:       {OrderItemStatusProcessing, OrderItemStatusCancelled},
	OrderItemStatusProcessing: {OrderItemStatusShipped, OrderItemStatusCancelled},
	OrderItemStatusShipped:    {OrderItemStatusDelivered},
	OrderItemStatusDelivered:  {},
	OrderItemStatusCancelled:  {},
}

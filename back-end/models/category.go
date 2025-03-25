package models

type Category struct {
	ID   string `gorm:"type:uuid;primaryKey" json:"id"`
	Name string `gorm:"size:255;unique;not null" json:"name"`

	Products []Product `gorm:"foreignKey:CategoryID; references:ID"`
}

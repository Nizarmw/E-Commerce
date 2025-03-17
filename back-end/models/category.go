package models

type Category struct {
	ID   string `gorm:"type:uuid;primaryKey"`
	Name string `gorm:"size:255;unique;not null"`

	Products []Product `gorm:"foreignKey:CategoryID"`
}

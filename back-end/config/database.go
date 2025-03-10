package config

import (
	"fmt"
	"log"
	"ecommerce-backend/models"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

var DB *gorm.DB

func InitDB() {
	dsn := "ecom_user:ecom123@tcp(localhost:3306)/ecommerce?charset=utf8mb4&parseTime=True&loc=Local"
	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}
	DB = db
	fmt.Println("Database connected!")

	// AutoMigrate all models
	db.AutoMigrate(
		&models.User{}, &models.Product{}, &models.Order{}, 
		&models.OrderItem{}, &models.Review{}, &models.CartItem{}, 
		&models.Category{},
	)

	fmt.Println("Database migrated!")
}

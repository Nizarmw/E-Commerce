package config

import (
	"ecommerce-backend/models"
	"fmt"
	"log"
	"os"
	"time"

	"github.com/joho/godotenv"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

var DB *gorm.DB

func InitDB() {
	// Try to load .env file, but don't crash if it doesn't exist
	// In Kubernetes, environment variables are provided via ConfigMap/Secret
	err := godotenv.Load()
	if err != nil {
		log.Println("No .env file found in database config, using environment variables from system")
	}

	dbUser := os.Getenv("DB_USER")
	dbPass := os.Getenv("DB_PASS")
	dbHost := os.Getenv("DB_HOST")
	dbPort := os.Getenv("DB_PORT")
	dbName := os.Getenv("DB_NAME")

	// Log environment variables for debugging (hide password)
	log.Printf("Database config - User: %s, Host: %s, Port: %s, Name: %s", dbUser, dbHost, dbPort, dbName)

	dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?charset=utf8mb4&parseTime=True&loc=Local",
		dbUser, dbPass, dbHost, dbPort, dbName)

	var db *gorm.DB
	for i := 0; i < 10; i++ {
		db, err = gorm.Open(mysql.Open(dsn), &gorm.Config{})
		if err == nil {
			break
		}
		log.Printf("Retrying database connection (%d/10)... Error: %v", i+1, err)
		time.Sleep(5 * time.Second)
	}

	if err != nil {
		log.Fatalf("Failed to connect to database after retries: %v", err)
	}

	DB = db
	fmt.Println("Database connected!")

	db.AutoMigrate(
		&models.User{}, &models.Product{}, &models.Order{},
		&models.OrderItem{}, &models.Review{}, &models.CartItem{},
		&models.Category{}, &models.Payment{},
	)

	fmt.Println("Database migrated!")
}

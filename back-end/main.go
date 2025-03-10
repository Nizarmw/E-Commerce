package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"ecommerce-backend/config"
)

func main() {
	fmt.Println("Starting E-Commerce API...") // Agar fmt tidak error
	log.Println("Initializing database...")   // Agar log tidak error

	config.InitDB()
	log.Println("Database connected!")

	r := gin.Default()
	r.GET("/", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"message": "Welcome to E-Commerce API"})
	})

	log.Println("Server running on port 8080...")
	r.Run(":8080")
}

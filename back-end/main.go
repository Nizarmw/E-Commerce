package main

import (
	"log"

	"ecommerce-backend/config"
	"ecommerce-backend/middlewares"
	"ecommerce-backend/routes"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	godotenv.Load()

	log.Println("Starting E-Commerce API...")
	config.InitDB()

	r := gin.Default()

	routes.SetupAuthRoutes(r)
	routes.SetupProductRoutes(r)

	r.GET("/profile", middlewares.AuthMiddleware(), func(c *gin.Context) {
		userID, _ := c.Get("userID")
		c.JSON(200, gin.H{"message": "Protected profile", "userID": userID})
	})

	log.Println("Server running on port 8080...")
	r.Run(":8080")
}

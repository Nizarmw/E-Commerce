package main

import (
	"log"
	"time"

	"ecommerce-backend/config"
	"ecommerce-backend/routes"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	// Try to load .env file, but don't crash if it doesn't exist
	// In Kubernetes, environment variables are provided via ConfigMap/Secret
	err := godotenv.Load()
	if err != nil {
		log.Println("No .env file found, using environment variables from system")
	} else {
		log.Println("Loaded .env file successfully")
	}

	log.Println("Starting E-Commerce API...")
	config.InitDB()

	r := gin.Default()

	// Health check endpoint for Kubernetes probes
	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"status":    "healthy",
			"message":   "E-Commerce API is running",
			"timestamp": time.Now().Unix(),
		})
	})

	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000", "http://172.19.0.2:3000", "http://10.34.100.141:3000", "http://10.34.100.141"},
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	routes.SetupAuthRoutes(r)
	routes.SetupProductRoutes(r)
	routes.SetupCategoryRoutes(r)
	routes.RegisterReviewRoutes(r)
	routes.SetupOrderRoutes(r)
	routes.CartRoutes(r)
	routes.RegisterPaymentRoutes(r)
	routes.UserRoutes(r)
	routes.SetupSellerRoutes(r)
	routes.SetupAdminRoutes(r)

	log.Println("Server running on port 8080...")
	r.Run("0.0.0.0:8080")
}

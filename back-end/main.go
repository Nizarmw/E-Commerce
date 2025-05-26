package main

import (
	"log"
	"net/http"
	"time"

	"ecommerce-backend/config"
	"ecommerce-backend/routes"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	godotenv.Load()

	log.Println("Starting E-Commerce API...")
	config.InitDB()

	r := gin.Default()

	r.Use(cors.New(cors.Config{
		AllowOrigins: []string{
			"http://localhost:3000",
			"http://172.19.0.2:3000",
			"http://10.34.100.141:3000",
			"http://10.34.100.141",
			"http://10.34.100.141:30090", // Frontend NodePort
			"http://10.34.100.141:30080", // Backend NodePort (for health checks)
		},
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	// Health check endpoint for Kubernetes
	r.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"status":    "healthy",
			"timestamp": time.Now().Unix(),
		})
	})

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

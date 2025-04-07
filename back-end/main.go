package main

import (
	"log"
	"time"

	"ecommerce-backend/config"
	"ecommerce-backend/middlewares"
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

	// Update CORS configuration
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"},
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
	r.GET("/profile", middlewares.AuthMiddleware(), func(c *gin.Context) {
		userID, _ := c.Get("userID")
		role, _ := c.Get("role")
		c.JSON(200, gin.H{
			"message": "Protected profile",
			"userID":  userID,
			"role":    role,
		})
	})

	log.Println("Server running on port 8080...")
	r.Run("0.0.0.0:8080")
}

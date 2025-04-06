package main

import (
	"log"

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

	r.Use(cors.New(cors.Config{
		AllowOrigins: []string{"*"},
	}))

	routes.SetupAuthRoutes(r)
	routes.SetupProductRoutes(r)
	routes.SetupCategoryRoutes(r)
	routes.RegisterReviewRoutes(r)
	routes.SetupOrderRoutes(r)
	routes.CartRoutes(r)
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

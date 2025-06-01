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

	// Root endpoint - API Information
	r.GET("/", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "Welcome to E-Commerce API",
			"version": "1.0.0",
			"status":  "running",
			"endpoints": gin.H{
				"health":     "/health",
				"auth":       "/auth/*",
				"products":   "/products/*",
				"categories": "/categories/*",
				"orders":     "/orders/*",
				"cart":       "/cart/*",
				"reviews":    "/reviews/*",
				"users":      "/users/*",
				"admin":      "/admin/*",
				"seller":     "/seller/*",
				"payment":    "/payment/*",
			},
			"documentation": "Available endpoints listed above",
			"timestamp":     time.Now().Unix(),
		})
	})

	// API info endpoint
	r.GET("/api", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"api_name":    "E-Commerce Backend API",
			"version":     "1.0.0",
			"description": "Backend API for E-Commerce application",
			"status":      "operational",
			"endpoints": []gin.H{
				{"path": "/health", "method": "GET", "description": "Health check endpoint"},
				{"path": "/auth/register", "method": "POST", "description": "User registration"},
				{"path": "/auth/login", "method": "POST", "description": "User login"},
				{"path": "/products", "method": "GET", "description": "Get all products"},
				{"path": "/products/{id}", "method": "GET", "description": "Get product by ID"},
				{"path": "/categories", "method": "GET", "description": "Get all categories"},
				{"path": "/cart/{user_id}", "method": "GET", "description": "Get user cart"},
				{"path": "/orders", "method": "GET", "description": "Get user orders (auth required)"},
			},
			"timestamp": time.Now().Unix(),		})
	})
	
	r.Use(cors.New(cors.Config{		AllowOrigins:     []string{
			"http://localhost:3000", 
			"http://172.19.0.2:3000", 
			"http://10.34.100.141:3000", 
			"http://10.34.100.141:30090",  // Frontend NodePort
			"http://10.34.100.141:30080",  // Backend NodePort  
			"http://10.34.100.141",
			// Removed wildcard "*" to fix credentials issue
		},
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization", "X-Requested-With", "Content-Length"},
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

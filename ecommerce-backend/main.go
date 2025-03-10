package main

import (
	"ecommerce-backend/config"
	"ecommerce-backend/routes"

	"github.com/gin-gonic/gin"
)

func main() {
	config.ConnectDatabase()

	r := gin.Default()
	r.SetTrustedProxies(nil)

	routes.SetupRoutes(r)

	r.Run(":8080")
}

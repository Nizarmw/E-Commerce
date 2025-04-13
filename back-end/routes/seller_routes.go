package routes

import (
	"ecommerce-backend/controllers"
	"ecommerce-backend/middlewares"

	"github.com/gin-gonic/gin"
)

func SetupSellerRoutes(r *gin.Engine) {
	sellerRoutes := r.Group("/seller")
	sellerRoutes.Use(middlewares.AuthMiddleware(), middlewares.RoleMiddleware("seller"))
	{
		sellerRoutes.GET("/order-items", controllers.GetSellerOrderItems)
		sellerRoutes.GET("/order-items/:id", controllers.GetSellerOrderItemByID)
		sellerRoutes.PATCH("/order-items/:id/status", controllers.UpdateOrderItemStatus)
	}
}

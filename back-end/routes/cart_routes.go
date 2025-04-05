package routes

import (
	"ecommerce-backend/controllers"

	"github.com/gin-gonic/gin"
)

func CartRoutes(router *gin.Engine) {
	cart := router.Group("/cart")
	{
		cart.POST("/", controllers.AddToCart)
		cart.GET("/:user_id", controllers.GetCartByUser)
		cart.PUT("/", controllers.UpdateCartItem)
		cart.DELETE("/:id", controllers.DeleteCartItem)
	}
}

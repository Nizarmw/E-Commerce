package routes

import (
	"ecommerce-backend/controllers"

	"github.com/gin-gonic/gin"
)

func CartRoutes(router *gin.Engine) {
	cart := router.Group("/cart")
	{
		cart.POST("/", controllers.AddToCart)            // Tambah produk ke cart
		cart.GET("/:user_id", controllers.GetCartByUser) // Lihat cart berdasarkan user
		cart.PUT("/", controllers.UpdateCartItem)        // Update jumlah produk dalam cart
		cart.DELETE("/:id", controllers.DeleteCartItem)  // Hapus item dari cart
	}
}

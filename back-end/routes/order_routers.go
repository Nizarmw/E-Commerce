package routes

import (
	"ecommerce-backend/controllers"
	"ecommerce-backend/middlewares"

	"github.com/gin-gonic/gin"
)

func SetupOrderRoutes(r *gin.Engine) {
	orderGroup := r.Group("/orders").Use(middlewares.AuthMiddleware())
	{
		orderGroup.POST("/", controllers.CreateOrder)      // Membuat pesanan
		orderGroup.GET("/:id", controllers.GetOrderByID)   // Mengambil pesanan berdasarkan ID
		orderGroup.GET("/", controllers.GetOrdersByUserID) // Mengambil semua pesanan untuk pengguna yang terautentikasi
		orderGroup.PUT("/:id", controllers.UpdateOrder)    // Memperbarui pesanan berdasarkan ID
		orderGroup.DELETE("/:id", controllers.DeleteOrder) // Menghapus pesanan berdasarkan ID
	}
}

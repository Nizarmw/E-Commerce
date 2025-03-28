package routes

import (
	"github.com/gin-gonic/gin"
	"ecommerce-backend/controllers"
	"ecommerce-backend/middlewares"
)

func SetupProductRoutes(r *gin.Engine) {
	productRoutes := r.Group("/products")
	{
		productRoutes.GET("/", controllers.GetProducts)          
		productRoutes.GET("/:id", controllers.GetProductByID)        

		productRoutes.Use(middlewares.AuthMiddleware())
		productRoutes.POST("/", controllers.CreateProduct)          
		productRoutes.PUT("/:id", controllers.UpdateProduct)         
		productRoutes.DELETE("/:id", controllers.DeleteProduct)      
	}
}

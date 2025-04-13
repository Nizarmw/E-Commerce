package routes

import (
	"ecommerce-backend/controllers"
	"ecommerce-backend/middlewares"

	"github.com/gin-gonic/gin"
)

func SetupCategoryRoutes(r *gin.Engine) {
	categoryRoutes := r.Group("/categories")
	{
		categoryRoutes.POST("/", middlewares.AuthMiddleware(), middlewares.RoleMiddleware("admin"), controllers.CreateCategory)
		categoryRoutes.GET("/", controllers.GetCategories)
		categoryRoutes.GET("/:id", controllers.GetCategoryByID)
		categoryRoutes.DELETE("/:id", middlewares.AuthMiddleware(), middlewares.RoleMiddleware("admin"), controllers.DeleteCategory)
	}
}

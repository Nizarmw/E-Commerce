package routes

import (
	"ecommerce-backend/controllers"
	"ecommerce-backend/middlewares"

	"github.com/gin-gonic/gin"
)

func SetupCategoryRoutes(r *gin.Engine) {
	categoryRoutes := r.Group("/categories")
	categoryRoutes.Use(middlewares.AuthMiddleware())
	categoryRoutes.Use(middlewares.RoleMiddleware("admin"))
	{
		categoryRoutes.POST("/", controllers.CreateCategory)
		categoryRoutes.GET("/", controllers.GetCategories)
		categoryRoutes.DELETE("/:id", controllers.DeleteCategory)
	}
}

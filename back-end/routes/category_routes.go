package routes

import (
	"ecommerce-backend/controllers"
	"ecommerce-backend/middlewares"

	"github.com/gin-gonic/gin"
)

func SetupRouter() *gin.Engine {
	r := gin.Default()

	r.Use(middlewares.AuthMiddleware())

	categoryRoutes := r.Group("/categories")
	categoryRoutes.Use(middlewares.RoleMiddleware("admin"))
	{
		categoryRoutes.POST("/", controllers.CreateCategory)
		categoryRoutes.GET("/", controllers.GetCategories)
		categoryRoutes.DELETE("/:id", controllers.DeleteCategory)
	}

	return r
}

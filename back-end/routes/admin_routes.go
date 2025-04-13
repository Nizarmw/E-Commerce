package routes

import (
	"ecommerce-backend/controllers"
	"ecommerce-backend/middlewares"

	"github.com/gin-gonic/gin"
)

func AdminRoutes(r *gin.Engine) {
	admin := r.Group("/admin")
	admin.Use(middlewares.RoleMiddleware("admin"))
	{
		admin.GET("/users", controllers.GetAllUsers)
		admin.PUT("/users/:id/role", controllers.UpdateUserRole)
	}
}

// routes/admin_routes.go
package routes

import (
	"ecommerce-backend/controllers"
	"ecommerce-backend/middlewares"

	"github.com/gin-gonic/gin"
)

func SetupAdminRoutes(router *gin.Engine) {
	adminGroup := router.Group("/api/admin")
	adminGroup.Use(middlewares.AuthMiddleware())
	adminGroup.Use(middlewares.RoleMiddleware("admin"))

	adminGroup.GET("/users", controllers.GetAllUsers)
	adminGroup.GET("/users/:id", controllers.GetUserListByID)
	adminGroup.PUT("/users/:id/role", controllers.UpdateUserRole)
	adminGroup.PUT("/users/:id/active-status", controllers.ToggleUserActiveStatus)
}

package routes

import (
	"ecommerce-backend/controllers"
	"ecommerce-backend/middlewares"

	"github.com/gin-gonic/gin"
)

func UserRoutes(r *gin.Engine) {
	userController := controllers.NewUserController()

	r.GET("/profile", middlewares.AuthMiddleware(), userController.GetProfile)
	r.PUT("/profile", middlewares.AuthMiddleware(), userController.UpdateProfile)
}

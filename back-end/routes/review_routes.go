package routes

import (
	"ecommerce-backend/controllers"
	"ecommerce-backend/middlewares"

	"github.com/gin-gonic/gin"
)

func RegisterReviewRoutes(router *gin.Engine) {
	reviewController := controllers.NewReviewController()
	reviewRoutes := router.Group("/reviews")
	{
		reviewRoutes.POST("/", reviewController.CreateReview)
		reviewRoutes.GET("/", reviewController.GetReviews)
		reviewRoutes.GET("/:product_id", reviewController.GetReviewsByProduct)
		reviewRoutes.DELETE("/:id", middlewares.AuthMiddleware(), middlewares.RoleMiddleware("admin"), reviewController.DeleteReview)

	}
}

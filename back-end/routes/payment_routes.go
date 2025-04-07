package routes

import (
	"ecommerce-backend/controllers"

	"github.com/gin-gonic/gin"
)

func RegisterPaymentRoutes(r *gin.Engine) {
	payment := r.Group("/payment")
	{
		payment.POST("/", controllers.CreatePayment)
		payment.POST("/webhook", controllers.MidtransWebhook)
		payment.GET("/:order_id", controllers.GetPayment)
	}
}

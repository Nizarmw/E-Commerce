package middlewares

import (
	"ecommerce-backend/utils"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
)

func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		// Coba dapatkan token dari cookie
		tokenCookie, err := c.Cookie("token")
		if err != nil {
			tokenCookie = ""
		}

		// Jika tidak ada di cookie, coba dapatkan dari header
		tokenHeader := ""
		authHeader := c.GetHeader("Authorization")
		if authHeader != "" && strings.HasPrefix(authHeader, "Bearer ") {
			tokenHeader = strings.TrimPrefix(authHeader, "Bearer ")
		}

		// Gunakan token dari cookie atau header
		token := tokenCookie
		if token == "" {
			token = tokenHeader
		}

		// Validasi token
		if token == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
			c.Abort()
			return
		}

		claims, err := utils.ValidateToken(token)
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
			c.Abort()
			return
		}

		c.Set("userID", claims.UserID)
		c.Set("role", claims.Role)
		c.Next()
	}
}

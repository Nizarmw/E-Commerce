package middlewares

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// RoleMiddleware membatasi akses berdasarkan role yang diperbolehkan
func RoleMiddleware(allowedRoles ...string) gin.HandlerFunc {
	return func(c *gin.Context) {
		role, exists := c.Get("role")

		// Jika role tidak ditemukan, tolak akses
		if !exists {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
			c.Abort()
			return
		}

		// Cek apakah role termasuk dalam daftar role yang diizinkan
		for _, allowedRole := range allowedRoles {
			if role == allowedRole {
				c.Next()
				return
			}
		}

		// Jika role tidak sesuai, tolak akses
		c.JSON(http.StatusForbidden, gin.H{"error": "Forbidden: Access Denied"})
		c.Abort()
	}
}

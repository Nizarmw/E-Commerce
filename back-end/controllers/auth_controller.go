package controllers

import (
	"ecommerce-backend/config"
	"ecommerce-backend/models"
	"ecommerce-backend/utils"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

func Register(c *gin.Context) {
	var user models.User
	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Validate required fields
	if user.Name == "" || user.Email == "" || user.Password == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Name, email, and password are required"})
		return
	}

	// Check if user already exists
	var existingUser models.User
	if err := config.DB.Where("email = ?", user.Email).First(&existingUser).Error; err == nil {
		c.JSON(http.StatusConflict, gin.H{"error": "User with this email already exists"})
		return
	}

	// Set default values
	user.ID = uuid.New().String()
	if user.Role == "" {
		user.Role = "buyer" // Default role
	}
	user.IsActive = true // Set default active status

	// Create user in database
	if err := config.DB.Create(&user).Error; err != nil {
		fmt.Printf("Database error during registration: %v\n", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to register user"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message":  "User registered successfully!",
		"username": user.Name,
		"email":    user.Email,
	})
}

func Login(c *gin.Context) {
	var req struct {
		UsernameOrEmail string `json:"username_or_email" binding:"required"`
		Password        string `json:"password" binding:"required"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var user models.User
	// FIXED: Use parameterized query to prevent SQL injection
	if err := config.DB.Where("(email = ? OR name = ?) AND is_active = ? AND password = ?", req.UsernameOrEmail, req.UsernameOrEmail, true, req.Password).First(&user).Error; err != nil || user.ID == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
		return
	}

	token, err := utils.GenerateToken(user.ID, user.Role)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate token"})
		return
	}

	// Set cookie with proper domain configuration
	// Use empty domain to work with any domain
	c.SetCookie("token", token, 3600*24, "/", "", false, true)

	userResponse := gin.H{
		"id":       user.ID,
		"name":     user.Name,
		"email":    user.Email,
		"role":     user.Role,
		"isActive": user.IsActive,
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Login successful",
		"user":    userResponse,
		"token":   token,
	})
}
func GetAuthStatus(c *gin.Context) {
	userID, _ := c.Get("userID")
	c.JSON(http.StatusOK, gin.H{"authenticated": true, "userId": userID})
}

func Logout(c *gin.Context) {
	c.SetCookie("token", "", -1, "/", "", false, true)
	c.JSON(http.StatusOK, gin.H{"message": "Logged out successfully"})
}

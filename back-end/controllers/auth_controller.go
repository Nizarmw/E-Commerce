package controllers

import (
	"ecommerce-backend/config"
	"ecommerce-backend/models"
	"ecommerce-backend/utils"
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

	user.ID = uuid.New().String()

	// hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	// if err != nil {
	// 	c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash password"})
	// 	return
	// }
	// user.Password = string(hashedPassword)

	if err := config.DB.Create(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to register"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message":  "User registered successfully!",
		"username": user.Name,
		"email":    user.Email,
		"Password": user.Password,
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

	if err := config.DB.Where("email = ? OR name = ?", req.UsernameOrEmail, req.UsernameOrEmail).First(&user).Error; err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid username/email or password"})
		return
	}

	if !user.IsActive {
		c.JSON(http.StatusForbidden, gin.H{"error": "Account is deactivated"})
		return
	}

	// if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password)); err != nil {
	// 	c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid username/email or password"})
	// 	return
	// }
	if user.Password != req.Password {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid username/email or password"})
		return
	}

	token, err := utils.GenerateToken(user.ID, user.Role)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate token"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Login successful",
		"token":   token,
	})
}

func Logout(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"message": "Logged out successfully"})
}

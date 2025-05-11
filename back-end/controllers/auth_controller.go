package controllers

import (
	"ecommerce-backend/config"
	"ecommerce-backend/models"
	"ecommerce-backend/utils"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
)

func Register(c *gin.Context) {
	var user models.User
	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	user.ID = uuid.New().String()

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash password"})
		return
	}
	user.Password = string(hashedPassword)

	if err := config.DB.Create(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to register"})
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

	// var user models.User
	// raw := fmt.Sprintf(
	// 	"SELECT * FROM users WHERE (email = '%s' OR name = '%s') AND is_active = 1 AND password = '%s' LIMIT 1",
	// 	req.UsernameOrEmail, req.UsernameOrEmail, req.Password,
	// )
	// if err := config.DB.Raw(raw).Scan(&user).Error; err != nil || user.ID == "" {
	// 	c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
	// 	return
	// }

	// if !user.IsActive {
	// 	c.JSON(http.StatusForbidden, gin.H{"error": "Account is deactivated"})
	// 	return
	// }

	// if user.Password != req.Password {
	// 	c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid username/email or password"})
	// 	return
	// }

	var user models.User
	if err := config.DB.Where("email = ?", req.UsernameOrEmail).Or("name = ?", req.UsernameOrEmail).First(&user).Error; err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid email or password"})
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password)); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid username/email or password"})
		return
	}

	token, err := utils.GenerateToken(user.ID, user.Role)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate token"})
		return
	}

	c.SetCookie("token", token, 3600*24, "/", "localhost", false, true)

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

package controllers

import (
	"net/http"

	"ecommerce-backend/services"

	"github.com/gin-gonic/gin"
)

type UpdateRoleRequest struct {
	Role string `json:"role" binding:"required,oneof=admin seller buyer"`
}

func GetAllUsers(c *gin.Context) {
	users, err := services.GetAllUsers()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve users"})
		return
	}
	c.JSON(http.StatusOK, users)
}

func UpdateUserRole(c *gin.Context) {
	id := c.Param("id")
	var req UpdateRoleRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid role input"})
		return
	}

	if err := services.UpdateUserRole(id, req.Role); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "User role updated successfully"})
}

// controllers/user_controller.go
type ToggleActiveRequest struct {
	IsActive bool `json:"is_active" binding:"required"`
}

func GetUserListByID(c *gin.Context) {
	id := c.Param("id")

	user, err := services.GetUserListByID(id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, user)
}

func ToggleUserActiveStatus(c *gin.Context) {
	id := c.Param("id")
	var req ToggleActiveRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	if err := services.ToggleUserActiveStatus(id, req.IsActive); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "User status updated successfully"})
}

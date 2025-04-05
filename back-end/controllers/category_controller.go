package controllers

import (
	"ecommerce-backend/models"
	"ecommerce-backend/services"
	"net/http"

	"github.com/gin-gonic/gin"
)

func CreateCategory(c *gin.Context) {
	var category models.Category
	if err := c.ShouldBindJSON(&category); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := services.CreateCategory(&category)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to create category"})
		return
	}

	c.JSON(http.StatusOK, category)
}

func GetCategories(c *gin.Context) {
	categories, err := services.GetCategories()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to get categories"})
		return
	}

	c.JSON(http.StatusOK, categories)
}
func DeleteCategory(c *gin.Context) {
	categoryID := c.Param("id")

	if err := services.DeleteCategory(categoryID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to delete category"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Category deleted successfully"})
}

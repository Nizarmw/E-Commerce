package controllers

import (
	"ecommerce-backend/models"
	"ecommerce-backend/services"
	"log"
	"path/filepath"
	"strings"

	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

func CreateProduct(c *gin.Context) {
	name := c.PostForm("name")
	description := c.PostForm("description")
	priceStr := c.PostForm("price")
	stockStr := c.PostForm("stock")
	categoryID := c.PostForm("category_id")

	if categoryID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "CategoryID is required"})
		return
	}

	price, err := strconv.ParseFloat(priceStr, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid price"})
		return
	}

	stock, err := strconv.Atoi(stockStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid stock"})
		return
	}

	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	file, err := c.FormFile("image_url")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Image file is required"})
		return
	}
	ext := strings.ToLower(filepath.Ext(file.Filename))
	if ext != ".jpg" && ext != ".jpeg" && ext != ".png" && ext != ".webp" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "File harus berupa gambar (.jpg, .jpeg, .png, .webp)"})
		return
	}
	supa := services.NewSupabaseStorage()
	imageURL, err := supa.Upload(file)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to upload image"})
		return
	}

	product := models.Product{
		Name:        name,
		Description: description,
		Price:       price,
		Stock:       stock,
		SellerID:    userID.(string),
		CategoryID:  categoryID,
		ImageURL:    imageURL,
	}

	if err := services.CreateProduct(&product); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	createdProduct, err := services.GetProductByID(product.ID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch created product"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Product created successfully", "product": createdProduct})
}

func GetProducts(c *gin.Context) {
	products, err := services.GetProducts()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch products"})
		return
	}
	c.JSON(http.StatusOK, products)
}

func GetProductByID(c *gin.Context) {
	id := c.Param("id")
	product, err := services.GetProductByID(id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Product not found"})
		return
	}
	c.JSON(http.StatusOK, product)
}

func UpdateProduct(c *gin.Context) {
	id := c.Param("id")

	existingProduct, err := services.GetProductByID(id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Product not found"})
		return
	}

	userID, _ := c.Get("userID")
	if existingProduct.SellerID != userID.(string) {
		c.JSON(http.StatusForbidden, gin.H{"error": "You are not authorized to update this product"})
		return
	}

	name := c.PostForm("name")
	description := c.PostForm("description")
	priceStr := c.PostForm("price")
	stockStr := c.PostForm("stock")
	categoryID := c.PostForm("category_id")

	price, err := strconv.ParseFloat(priceStr, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid price"})
		return
	}
	stock, err := strconv.Atoi(stockStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid stock"})
		return
	}

	existingProduct.Name = name
	existingProduct.Description = description
	existingProduct.Price = price
	existingProduct.Stock = stock
	existingProduct.CategoryID = categoryID

	file, err := c.FormFile("image_url")
	if err != nil {
		log.Println("Tidak ada file dikirim:", err)
	} else {
		log.Println("File ditemukan:", file.Filename)

		ext := strings.ToLower(filepath.Ext(file.Filename))
		if ext != ".jpg" && ext != ".jpeg" && ext != ".png" && ext != ".webp" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "File harus berupa gambar (.jpg, .jpeg, .png, .webp)"})
			return
		}
		supa := services.NewSupabaseStorage()
		_ = supa.Delete(existingProduct.ImageURL)

		imageURL, err := supa.Upload(file)
		if err != nil {
			log.Println("Gagal upload:", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to upload image"})
			return
		}

		existingProduct.ImageURL = imageURL
	}

	if err := services.UpdateProduct(existingProduct); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update product"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Product updated successfully",
		"product": existingProduct,
	})
}

func DeleteProduct(c *gin.Context) {
	id := c.Param("id")
	product, err := services.GetProductByID(id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Product not found"})
		return
	}

	userID, _ := c.Get("userID")
	if product.SellerID != userID.(string) {
		c.JSON(http.StatusForbidden, gin.H{"error": "You are not authorized to delete this product"})
		return
	}

	if err := services.DeleteProduct(product); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete product"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Product deleted successfully"})
}

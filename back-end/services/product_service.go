package services

import (
	"ecommerce-backend/config"
	"ecommerce-backend/models"
	"errors"
	"fmt"

	"gorm.io/gorm"
)

func CreateProduct(product *models.Product) error {
	fmt.Println("Creating product:", product)

	if err := config.DB.Create(product).Error; err != nil {
		fmt.Println("DB Error:", err)
		return errors.New("failed to create product")
	}

	return nil
}

func GetProductByID(id string) (*models.Product, error) {
	var product models.Product
	err := config.DB.
		Preload("Seller").
		Preload("Category").
		Preload("Reviews.User").
		First(&product, "id = ?", id).Error

	if errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, errors.New("product not found")
	}
	if err != nil {
		return nil, err
	}

	if product.Seller != nil {
		product.SellerName = product.Seller.Name
	}
	if product.Category != nil {
		product.CategoryName = product.Category.Name
	}

	if len(product.Reviews) > 0 {
		var total int
		for _, review := range product.Reviews {
			total += review.Rating
		}
		product.Rating = float64(total) / float64(len(product.Reviews))
	} else {
		product.Rating = 0
	}

	return &product, nil
}

func GetProducts() ([]models.Product, error) {
	var products []models.Product
	err := config.DB.
		Preload("Seller").
		Preload("Category").
		Preload("Reviews.User").
		Find(&products).Error

	if err != nil {
		return nil, err
	}

	for i := range products {
		if products[i].Seller != nil {
			products[i].SellerName = products[i].Seller.Name
		}
		if products[i].Category != nil {
			products[i].CategoryName = products[i].Category.Name
		}

		if len(products[i].Reviews) > 0 {
			var total int
			for _, review := range products[i].Reviews {
				total += review.Rating
			}
			products[i].Rating = float64(total) / float64(len(products[i].Reviews))
		} else {
			products[i].Rating = 0
		}
	}

	return products, nil
}

func UpdateProduct(product *models.Product) error {
	return config.DB.Model(&models.Product{}).
		Where("id = ?", product.ID).
		Updates(map[string]interface{}{
			"name":        product.Name,
			"description": product.Description,
			"price":       product.Price,
			"stock":       product.Stock,
			"category_id": product.CategoryID,
			"image_url":   product.ImageURL,
		}).Error
}

func DeleteProduct(product *models.Product) error {
	// Mulai transaksi untuk memastikan atomicity operasi
	tx := config.DB.Begin()
	defer func() {
		if r := recover(); r != nil {
			tx.Rollback()
		}
	}()

	// Cek apakah produk ada
	if err := tx.First(product, "id = ?", product.ID).Error; err != nil {
		tx.Rollback()
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return errors.New("product not found")
		}
		return err
	}

	// Cek apakah produk digunakan dalam order yang belum selesai
	var activeOrderItems []models.OrderItem
	if err := tx.Where("product_id = ? AND status NOT IN ('delivered', 'cancelled')", product.ID).Find(&activeOrderItems).Error; err != nil {
		tx.Rollback()
		return err
	}

	if len(activeOrderItems) > 0 {
		tx.Rollback()
		return errors.New("cannot delete product: it is being used in active orders")
	}

	// Identifikasi order IDs yang akan terpengaruh
	var affectedOrderItems []models.OrderItem
	if err := tx.Where("product_id = ?", product.ID).Find(&affectedOrderItems).Error; err != nil {
		tx.Rollback()
		return err
	}

	// Kumpulkan order IDs unik yang terpengaruh
	affectedOrderIDs := make(map[string]bool)
	for _, item := range affectedOrderItems {
		affectedOrderIDs[item.OrderID] = true
	}

	// Hapus order_items terkait produk
	if err := tx.Where("product_id = ?", product.ID).Delete(&models.OrderItem{}).Error; err != nil {
		tx.Rollback()
		return err
	}

	// Hapus review terkait produk jika ada
	if err := tx.Where("product_id = ?", product.ID).Delete(&models.Review{}).Error; err != nil {
		tx.Rollback()
		return err
	}

	// Hapus produk
	if err := tx.Delete(product).Error; err != nil {
		tx.Rollback()
		return err
	}

	// Update setiap order yang terpengaruh
	for orderID := range affectedOrderIDs {
		// Cek apakah order masih memiliki order_items
		var remainingItemsCount int64
		if err := tx.Model(&models.OrderItem{}).Where("order_id = ?", orderID).Count(&remainingItemsCount).Error; err != nil {
			tx.Rollback()
			return err
		}

		if remainingItemsCount == 0 {
			// Jika tidak ada order_items tersisa, hapus order
			if err := tx.Where("id = ?", orderID).Delete(&models.Order{}).Error; err != nil {
				tx.Rollback()
				return err
			}
		} else {
			// Jika masih ada order_items, perbarui total harga
			var totalPrice float64
			if err := tx.Model(&models.OrderItem{}).
				Select("SUM(price * quantity)").
				Where("order_id = ?", orderID).
				Scan(&totalPrice).Error; err != nil {
				tx.Rollback()
				return err
			}

			// Update order total price
			if err := tx.Model(&models.Order{}).Where("id = ?", orderID).
				Update("total_price", totalPrice).Error; err != nil {
				tx.Rollback()
				return err
			}

			// Perbarui status order berdasarkan order_items yang tersisa
			if err := updateOrderStatusWithinTransaction(tx, orderID); err != nil {
				tx.Rollback()
				return err
			}
		}
	}

	return tx.Commit().Error
}
func SearchProducts(query string) ([]models.Product, error) {
	var products []models.Product
	err := config.DB.
		Preload("Seller").
		Preload("Category").
		Preload("Reviews").
		Where("name LIKE ?", "%"+query+"%").
		Or("description LIKE ?", "%"+query+"%").
		Find(&products).Error

	if err != nil {
		return nil, err
	}

	for i := range products {
		if products[i].Seller != nil {
			products[i].SellerName = products[i].Seller.Name
		}
		if products[i].Category != nil {
			products[i].CategoryName = products[i].Category.Name
		}
		if len(products[i].Reviews) > 0 {
			var total int
			for _, review := range products[i].Reviews {
				total += review.Rating
			}
			products[i].Rating = float64(total) / float64(len(products[i].Reviews))
		}
	}

	return products, nil
}

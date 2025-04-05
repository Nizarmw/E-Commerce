package services

import (
	"ecommerce-backend/config"
	"ecommerce-backend/models"
	"errors"

	"gorm.io/gorm"
)

func CreateReview(review *models.Review) (*models.Review, error) {
	if err := config.DB.Create(review).Error; err != nil {
		return nil, err
	}
	return review, nil
}

func GetReviews() ([]models.Review, error) {
	var reviews []models.Review
	if err := config.DB.Find(&reviews).Error; err != nil {
		return nil, err
	}
	return reviews, nil
}

func GetReviewsByProductID(productID string) ([]models.Review, error) {
	var reviews []models.Review
	if err := config.DB.Where("product_id = ?", productID).Find(&reviews).Error; err != nil {
		return nil, err
	}
	return reviews, nil
}

func DeleteReview(reviewID string) error {
	var review models.Review
	if err := config.DB.First(&review, "id = ?", reviewID).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return errors.New("review not found")
		}
		return err
	}

	if err := config.DB.Delete(&review).Error; err != nil {
		return err
	}
	return nil
}

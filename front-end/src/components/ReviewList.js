import React from 'react';

const ReviewList = ({ reviews, loading, error }) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  if (!reviews || reviews.length === 0) {
    return (
      <div className="bg-gray-50 p-4 rounded text-center">
        <p className="text-gray-600">No reviews yet. Be the first to review this product!</p>
      </div>
    );
  }

  // Calculate average rating
  const avgRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
  
  return (
    <div>
      <div className="mb-4 flex items-center">
        <div className="mr-4">
          <span className="text-2xl font-bold">{avgRating.toFixed(1)}</span>
          <span className="text-gray-600">/5</span>
        </div>
        <div className="flex text-yellow-400 text-xl">
          {[1, 2, 3, 4, 5].map((star) => (
            <span key={star}>
              {star <= Math.round(avgRating) ? '★' : '☆'}
            </span>
          ))}
        </div>
        <div className="ml-4 text-gray-600">
          ({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})
        </div>
      </div>

      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="border-b pb-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <div className="flex text-yellow-400">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star}>
                      {star <= review.rating ? '★' : '☆'}
                    </span>
                  ))}
                </div>
                <span className="ml-2 font-semibold">{review.user?.name || 'Anonymous User'}</span>
              </div>
              <span className="text-gray-500 text-sm">
                {new Date(review.createdAt).toLocaleDateString()}
              </span>
            </div>
            <p className="text-gray-700">{review.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewList;

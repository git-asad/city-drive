import React, { useState, useEffect } from 'react';
import { reviewAPI, getAuthToken } from '../utils/api';

const CarReviews = ({ carId }) => {
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({ averageRating: 0, totalReviews: 0 });
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 5,
    title: '',
    comment: '',
    pros: '',
    cons: ''
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check if user is logged in
  useEffect(() => {
    const token = getAuthToken();
    setIsLoggedIn(!!token);
  }, []);

  // Load reviews from API
  useEffect(() => {
    const loadReviews = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await reviewAPI.getCarReviews(carId);
        setReviews(response.reviews);
        setStats(response.stats);
      } catch (err) {
        setError(err.message || 'Failed to load reviews');
      } finally {
        setLoading(false);
      }
    };

    loadReviews();
  }, [carId]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (!isLoggedIn) {
      setMessage('Please log in to submit a review');
      return;
    }

    if (!newReview.title.trim() || !newReview.comment.trim()) {
      setMessage('Please fill in all required fields');
      return;
    }

    try {
      setSubmitting(true);
      setMessage('');

      const reviewData = {
        carId,
        bookingId: 'demo-booking-id', // In a real app, this would come from user's bookings
        rating: newReview.rating,
        title: newReview.title.trim(),
        comment: newReview.comment.trim(),
        pros: newReview.pros.trim(),
        cons: newReview.cons.trim()
      };

      await reviewAPI.create(reviewData);

      // Reload reviews
      const response = await reviewAPI.getCarReviews(carId);
      setReviews(response.reviews);
      setStats(response.stats);

      // Reset form
      setNewReview({
        rating: 5,
        title: '',
        comment: '',
        pros: '',
        cons: ''
      });

      setShowReviewForm(false);
      setMessage('Review submitted successfully!');
      setTimeout(() => setMessage(''), 3000);

    } catch (err) {
      setMessage(err.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const handleHelpfulClick = async (reviewId) => {
    if (!isLoggedIn) {
      setMessage('Please log in to mark reviews as helpful');
      return;
    }

    try {
      const response = await reviewAPI.markHelpful(reviewId);

      // Update local state
      setReviews(reviews.map(review =>
        review._id === reviewId
          ? { ...review, helpful: [...(review.helpful || []), 'current-user'] }
          : review
      ));

    } catch (err) {
      setMessage(err.message || 'Failed to mark review as helpful');
    }
  };

  const calculateAverageRating = () => {
    return stats.averageRating || 0;
  };

  const renderStars = (rating, interactive = false, onRatingChange = null) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type={interactive ? "button" : "button"}
            disabled={!interactive}
            onClick={interactive ? () => onRatingChange && onRatingChange(star) : undefined}
            className={`text-lg ${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'}`}
          >
            {star <= rating ? (
              <span className="text-yellow-400">★</span>
            ) : (
              <span className="text-gray-300">☆</span>
            )}
          </button>
        ))}
      </div>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mt-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold text-gray-900">Customer Reviews</h3>
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-2">
              {renderStars(Math.round(calculateAverageRating()))}
              <span className="text-lg font-semibold text-gray-900">
                {calculateAverageRating()}
              </span>
            </div>
            <span className="text-gray-600">
              ({stats.totalReviews} review{stats.totalReviews !== 1 ? 's' : ''})
            </span>
          </div>
        </div>

        <button
          onClick={() => setShowReviewForm(!showReviewForm)}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
        >
          {showReviewForm ? 'Cancel Review' : 'Write a Review'}
        </button>
      </div>

      {/* Review Form */}
      {showReviewForm && (
        <div className="bg-gray-50 rounded-xl p-6 mb-8 border border-gray-200">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Share Your Experience</h4>

          <form onSubmit={handleSubmitReview} className="space-y-4">
            {/* Rating */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Overall Rating
              </label>
              {renderStars(newReview.rating, true, (rating) =>
                setNewReview(prev => ({ ...prev, rating }))
              )}
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Review Title
              </label>
              <input
                type="text"
                value={newReview.title}
                onChange={(e) => setNewReview(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Summarize your experience"
                required
              />
            </div>

            {/* Comment */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Review
              </label>
              <textarea
                value={newReview.comment}
                onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Tell others about your experience with this car..."
                required
              />
            </div>

            {/* Pros */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pros (optional)
              </label>
              <input
                type="text"
                value={newReview.pros}
                onChange={(e) => setNewReview(prev => ({ ...prev, pros: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="What did you like about this car?"
              />
            </div>

            {/* Cons */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cons (optional)
              </label>
              <input
                type="text"
                value={newReview.cons}
                onChange={(e) => setNewReview(prev => ({ ...prev, cons: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="What could be improved?"
              />
            </div>

            {/* Submit Button */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Submitting...' : 'Submit Review'}
              </button>
              <button
                type="button"
                onClick={() => setShowReviewForm(false)}
                disabled={submitting}
                className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-2">Loading reviews...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center py-8">
          <div className="text-red-600 mb-2">Error loading reviews</div>
          <p className="text-gray-600">{error}</p>
        </div>
      )}

      {/* Message */}
      {message && (
        <div className={`mb-4 p-3 rounded-lg ${message.includes('success') ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
          {message}
        </div>
      )}

      {/* Reviews List */}
      {!loading && !error && (
        <div className="space-y-6">
          {reviews.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💬</span>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">No reviews yet</h4>
              <p className="text-gray-600">Be the first to share your experience with this car!</p>
            </div>
          ) : (
            reviews.map((review) => (
              <div key={review._id} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-semibold text-blue-600">
                        {review.user?.firstName?.charAt(0)?.toUpperCase() || 'U'}
                      </span>
                    </div>
                    <div>
                      <h5 className="font-semibold text-gray-900">
                        {review.user?.firstName} {review.user?.lastName}
                      </h5>
                      <p className="text-sm text-gray-600">{formatDate(review.createdAt)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {renderStars(review.rating)}
                    <span className="text-sm font-medium text-gray-600">
                      {review.rating}/5
                    </span>
                  </div>
                </div>

                <div className="mb-4">
                  <h6 className="font-semibold text-gray-900 mb-2">{review.title}</h6>
                  <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                  {review.pros && (
                    <p className="text-green-700 text-sm mt-2">
                      <strong>Pros:</strong> {review.pros}
                    </p>
                  )}
                  {review.cons && (
                    <p className="text-red-700 text-sm mt-1">
                      <strong>Cons:</strong> {review.cons}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <button
                    onClick={() => handleHelpfulClick(review._id)}
                    className="flex items-center gap-2 px-3 py-1 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <span>👍</span>
                    <span>Helpful ({review.helpfulCount || 0})</span>
                  </button>

                  <div className="flex items-center gap-1">
                    <span className="text-xs text-gray-500">Verified Purchase</span>
                    <span className="text-green-600">✓</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default CarReviews;
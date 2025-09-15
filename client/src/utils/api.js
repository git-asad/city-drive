const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

// Helper function to get auth token
const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

// Helper function to set auth token
const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('authToken', token);
  } else {
    localStorage.removeItem('authToken');
  }
};

// Generic API request function
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getAuthToken();

  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

// Authentication APIs
export const authAPI = {
  register: (userData) => apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),

  login: (credentials) => apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  }),

  googleLogin: (token) => apiRequest('/auth/google', {
    method: 'POST',
    body: JSON.stringify({ token }),
  }),

  logout: () => apiRequest('/auth/logout', {
    method: 'POST',
  }),

  getProfile: () => apiRequest('/auth/profile'),

  updateProfile: (profileData) => apiRequest('/auth/profile', {
    method: 'PUT',
    body: JSON.stringify(profileData),
  }),
};

// Car APIs
export const carAPI = {
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/cars?${queryString}`);
  },

  getById: (id) => apiRequest(`/cars/${id}`),

  create: (carData) => apiRequest('/cars', {
    method: 'POST',
    body: JSON.stringify(carData),
  }),

  update: (id, carData) => apiRequest(`/cars/${id}`, {
    method: 'PUT',
    body: JSON.stringify(carData),
  }),

  delete: (id) => apiRequest(`/cars/${id}`, {
    method: 'DELETE',
  }),

  getOwnerCars: () => apiRequest('/owner/cars'),
};

// Booking APIs
export const bookingAPI = {
  create: (bookingData) => apiRequest('/create-payment', {
    method: 'POST',
    body: JSON.stringify(bookingData),
  }),

  confirm: (confirmationData) => apiRequest('/confirm-payment', {
    method: 'POST',
    body: JSON.stringify(confirmationData),
  }),

  createPayPalOrder: (orderData) => apiRequest('/paypal/orders/create', {
    method: 'POST',
    body: JSON.stringify(orderData),
  }),

  capturePayPalOrder: (captureData) => apiRequest('/paypal/orders/capture', {
    method: 'POST',
    body: JSON.stringify(captureData),
  }),

  getUserBookings: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/bookings?${queryString}`);
  },

  getAllBookings: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/admin/bookings?${queryString}`);
  },

  updateStatus: (id, statusData) => apiRequest(`/admin/bookings/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify(statusData),
  }),
};

// Review APIs
export const reviewAPI = {
  getCarReviews: (carId, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/cars/${carId}/reviews?${queryString}`);
  },

  create: (reviewData) => apiRequest('/reviews', {
    method: 'POST',
    body: JSON.stringify(reviewData),
  }),

  update: (id, reviewData) => apiRequest(`/reviews/${id}`, {
    method: 'PUT',
    body: JSON.stringify(reviewData),
  }),

  delete: (id) => apiRequest(`/reviews/${id}`, {
    method: 'DELETE',
  }),

  markHelpful: (id) => apiRequest(`/reviews/${id}/helpful`, {
    method: 'POST',
  }),
};

// Newsletter APIs
export const newsletterAPI = {
  subscribe: (subscriptionData) => apiRequest('/newsletter/subscribe', {
    method: 'POST',
    body: JSON.stringify(subscriptionData),
  }),

  unsubscribe: (emailData) => apiRequest('/newsletter/unsubscribe', {
    method: 'POST',
    body: JSON.stringify(emailData),
  }),
};

// Contact APIs
export const contactAPI = {
  submit: (contactData) => apiRequest('/contact', {
    method: 'POST',
    body: JSON.stringify(contactData),
  }),

  getUserContacts: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/contact?${queryString}`);
  },

  getAllContacts: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/admin/contacts?${queryString}`);
  },

  updateContact: (id, updateData) => apiRequest(`/admin/contacts/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updateData),
  }),
};

export { getAuthToken, setAuthToken };
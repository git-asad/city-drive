/**
 * Booking Storage Utility
 * Provides safe and reliable storage/retrieval of booking data
 * with automatic backup, validation, and error recovery
 */

const STORAGE_KEYS = {
  BOOKINGS: 'bookings',           // Single storage key for all bookings
  BACKUP: 'bookings_backup'       // Single backup key
};

/**
 * Validates booking data structure
 * @param {Object} booking - Booking object to validate
 * @returns {boolean} - True if valid, false otherwise
 */
const validateBooking = (booking) => {
  if (!booking || typeof booking !== 'object') return false;

  const requiredFields = ['_id', 'car', 'customerInfo', 'status'];
  const hasRequiredFields = requiredFields.every(field => booking.hasOwnProperty(field));

  if (!hasRequiredFields) return false;

  // Validate user identification (email or user ID)
  const hasUserId = booking.userEmail || booking.user || booking.userId;
  if (!hasUserId) return false;

  // Validate car data
  if (!booking.car || !booking.car._id) return false;

  // Validate dates
  if (!booking.pickupDate || !booking.returnDate) return false;

  return true;
};

/**
 * Safely loads bookings from localStorage with error recovery
 * @param {string} key - Storage key to load from
 * @returns {Array} - Array of valid bookings
 */
const loadBookingsSafe = (key) => {
  try {
    const data = localStorage.getItem(key);
    if (!data) return [];

    const bookings = JSON.parse(data);
    if (!Array.isArray(bookings)) {
      console.warn(`⚠️ Invalid data format in ${key}, expected array`);
      return [];
    }

    // Filter and validate bookings
    const validBookings = bookings.filter(validateBooking);

    if (validBookings.length !== bookings.length) {
      console.warn(`⚠️ Filtered ${bookings.length - validBookings.length} invalid bookings from ${key}`);
    }

    return validBookings;
  } catch (error) {
    console.error(`❌ Error loading from ${key}:`, error);

    // Try backup recovery
    try {
      const backupData = localStorage.getItem(STORAGE_KEYS.BACKUP);
      if (backupData) {
        const backupBookings = JSON.parse(backupData);
        console.log(`✅ Recovered ${backupBookings.length} bookings from backup`);
        // Restore backup to primary storage
        localStorage.setItem(key, backupData);
        return backupBookings.filter(validateBooking);
      }
    } catch (backupError) {
      console.error('❌ Backup recovery failed:', backupError);
    }

    return [];
  }
};

/**
 * Safely saves bookings to localStorage with backup
 * @param {string} key - Storage key to save to
 * @param {Array} bookings - Array of bookings to save
 * @returns {boolean} - True if successful, false otherwise
 */
const saveBookingsSafe = (key, bookings) => {
  try {
    // Validate all bookings before saving
    const validBookings = bookings.filter(validateBooking);

    if (validBookings.length !== bookings.length) {
      console.warn(`⚠️ Excluded ${bookings.length - validBookings.length} invalid bookings during save`);
    }

    const data = JSON.stringify(validBookings);
    localStorage.setItem(key, data);

    // Create backup
    localStorage.setItem(STORAGE_KEYS.BACKUP, data);

    console.log(`✅ Saved ${validBookings.length} bookings to ${key}`);
    return true;
  } catch (error) {
    console.error(`❌ Error saving to ${key}:`, error);
    return false;
  }
};

/**
 * Loads all bookings from the single "bookings" storage key
 * @returns {Array} - Array of all bookings
 */
export const loadAllBookings = () => {
  const allBookings = loadBookingsSafe(STORAGE_KEYS.BOOKINGS);

  console.log(`📊 Loaded ${allBookings.length} total bookings from single storage`);
  return allBookings;
};

/**
 * Loads bookings for a specific user from single storage
 * @param {Object} user - User object with email/id
 * @returns {Array} - Array of user's bookings
 */
export const loadUserBookings = (user) => {
  const allBookings = loadBookingsSafe(STORAGE_KEYS.BOOKINGS);

  // Filter by user email (primary) or user ID (fallback)
  const userBookings = allBookings.filter(booking =>
    booking.userEmail === user?.email ||
    booking.user === user?.id ||
    booking.userId === user?.id
  );

  // Sort by creation date (newest first)
  userBookings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  console.log(`👤 Loaded ${userBookings.length} bookings for user ${user?.email || user?.id}`);
  return userBookings;
};

/**
 * Saves a new booking with validation and duplicate prevention
 * @param {Object} newBooking - New booking to save
 * @returns {Object} - Result with success status and message
 */
export const saveNewBooking = (newBooking) => {
  try {
    // Validate new booking
    if (!validateBooking(newBooking)) {
      return { success: false, message: 'Invalid booking data' };
    }

    // Load existing bookings
    const existingBookings = loadBookingsSafe(STORAGE_KEYS.BOOKINGS);

    // Check for duplicates (same user, car, dates)
    const duplicate = existingBookings.find(booking =>
      booking.userEmail === newBooking.userEmail &&
      booking.car._id === newBooking.car._id &&
      booking.pickupDate === newBooking.pickupDate &&
      booking.returnDate === newBooking.returnDate &&
      booking.status !== 'cancelled'
    );

    if (duplicate) {
      return {
        success: false,
        message: 'You already have a similar booking for this car and dates'
      };
    }

    // Add new booking
    existingBookings.push(newBooking);

    // Save with backup
    const saved = saveBookingsSafe(STORAGE_KEYS.BOOKINGS, existingBookings);

    if (saved) {
      return { success: true, message: 'Booking saved successfully' };
    } else {
      return { success: false, message: 'Failed to save booking' };
    }

  } catch (error) {
    console.error('❌ Error saving new booking:', error);
    return { success: false, message: 'Failed to save booking' };
  }
};

/**
 * Updates booking status in single storage
 * @param {string} bookingId - ID of booking to update
 * @param {string} newStatus - New status to set
 * @param {Object} additionalData - Optional additional data to merge
 * @returns {Object} - Result with success status and message
 */
export const updateBookingStatus = (bookingId, newStatus, additionalData = {}) => {
  try {
    console.log(`🔄 Updating booking ${bookingId} to status: ${newStatus}`);

    const allBookings = loadBookingsSafe(STORAGE_KEYS.BOOKINGS);

    // Find and update the booking
    const updatedBookings = allBookings.map(booking =>
      booking._id === bookingId ? {
        ...booking,
        status: newStatus,
        updatedAt: new Date().toISOString(),
        ...additionalData // Merge additional data
      } : booking
    );

    // Save updated bookings
    const saved = saveBookingsSafe(STORAGE_KEYS.BOOKINGS, updatedBookings);

    if (saved) {
      console.log(`✅ Booking ${bookingId} status updated to ${newStatus}`);
      return { success: true, message: `Booking ${newStatus} successfully` };
    } else {
      return { success: false, message: 'Failed to save status update' };
    }

  } catch (error) {
    console.error('❌ Error updating booking status:', error);
    return { success: false, message: 'Failed to update booking status' };
  }
};

/**
 * Cancels a booking (sets status to cancelled)
 * @param {string} bookingId - ID of booking to cancel
 * @param {Object} user - User object for validation
 * @returns {Object} - Result with success status and message
 */
export const cancelBooking = (bookingId, user) => {
  try {
    const allBookings = loadBookingsSafe(STORAGE_KEYS.BOOKINGS);

    // Find the booking and verify ownership
    const booking = allBookings.find(b => b._id === bookingId);

    if (!booking) {
      return { success: false, message: 'Booking not found' };
    }

    // Verify ownership
    if (booking.userEmail !== user?.email && booking.user !== user?.id) {
      return { success: false, message: 'You can only cancel your own bookings' };
    }

    // Update status
    return updateBookingStatus(bookingId, 'cancelled');

  } catch (error) {
    console.error('❌ Error cancelling booking:', error);
    return { success: false, message: 'Failed to cancel booking' };
  }
};

/**
 * Gets storage statistics for debugging
 * @returns {Object} - Storage statistics
 */
export const getStorageStats = () => {
  try {
    const allBookings = loadBookingsSafe(STORAGE_KEYS.BOOKINGS);

    return {
      totalBookings: allBookings.length,
      backupAvailable: !!localStorage.getItem(STORAGE_KEYS.BACKUP)
    };
  } catch (error) {
    console.error('❌ Error getting storage stats:', error);
    return { error: 'Failed to get storage statistics' };
  }
};

/**
 * Calculates total revenue from confirmed bookings
 * @returns {number} - Total revenue from confirmed bookings
 */
export const calculateTotalRevenue = () => {
  try {
    const allBookings = loadBookingsSafe(STORAGE_KEYS.BOOKINGS);
    const confirmedBookings = allBookings.filter(booking => booking.status === 'confirmed');

    const totalRevenue = confirmedBookings.reduce((sum, booking) => {
      return sum + (parseFloat(booking.price) || 0);
    }, 0);

    console.log(`💰 Calculated total revenue: $${totalRevenue.toFixed(2)} from ${confirmedBookings.length} confirmed bookings`);
    return totalRevenue;
  } catch (error) {
    console.error('❌ Error calculating revenue:', error);
    return 0;
  }
};

/**
 * Gets dashboard statistics for owners
 * @returns {Object} - Dashboard statistics
 */
export const getDashboardStats = () => {
  try {
    const allBookings = loadBookingsSafe(STORAGE_KEYS.BOOKINGS);

    const confirmedBookings = allBookings.filter(booking => booking.status === 'confirmed');
    const pendingBookings = allBookings.filter(booking => booking.status === 'pending');
    const cancelledBookings = allBookings.filter(booking => booking.status === 'cancelled');

    const totalRevenue = calculateTotalRevenue();

    return {
      totalBookings: confirmedBookings.length,
      totalRevenue: totalRevenue,
      pendingBookings: pendingBookings.length,
      cancelledBookings: cancelledBookings.length,
      totalAllBookings: allBookings.length
    };
  } catch (error) {
    console.error('❌ Error getting dashboard stats:', error);
    return {
      totalBookings: 0,
      totalRevenue: 0,
      pendingBookings: 0,
      cancelledBookings: 0,
      totalAllBookings: 0
    };
  }
};

/**
 * Gets booking statistics for a specific client
 * @param {Object} user - User object with email/id
 * @returns {Object} - Client booking statistics
 */
export const getClientBookingStats = (user) => {
  try {
    const allBookings = loadBookingsSafe(STORAGE_KEYS.BOOKINGS);

    // Filter bookings for this specific user
    const userBookings = allBookings.filter(booking =>
      booking.userEmail === user?.email ||
      booking.user === user?.id ||
      booking.userId === user?.id
    );

    const confirmedBookings = userBookings.filter(booking => booking.status === 'confirmed');
    const pendingBookings = userBookings.filter(booking => booking.status === 'pending');
    const cancelledBookings = userBookings.filter(booking =>
      booking.status === 'cancelled' || booking.status === 'canceled_by_owner'
    );

    // Calculate total spent on confirmed bookings only (exclude canceled bookings)
    const totalSpent = confirmedBookings.reduce((sum, booking) => {
      return sum + (parseFloat(booking.price) || 0);
    }, 0);

    return {
      totalBookings: userBookings.length,
      confirmedBookings: confirmedBookings.length,
      pendingBookings: pendingBookings.length,
      cancelledBookings: cancelledBookings.length,
      totalSpent: totalSpent
    };
  } catch (error) {
    console.error('❌ Error getting client booking stats:', error);
    return {
      totalBookings: 0,
      confirmedBookings: 0,
      pendingBookings: 0,
      cancelledBookings: 0,
      totalSpent: 0
    };
  }
};

/**
 * Clears all booking data (use with caution)
 * @returns {boolean} - True if successful
 */
export const clearAllBookings = () => {
  try {
    localStorage.removeItem(STORAGE_KEYS.BOOKINGS);
    localStorage.removeItem(STORAGE_KEYS.BACKUP);
    console.log('🗑️ All booking data cleared');
    return true;
  } catch (error) {
    console.error('❌ Error clearing bookings:', error);
    return false;
  }
};

/**
 * Migrates bookings from old storage keys to new single key
 * @returns {boolean} - True if migration was performed
 */
export const migrateOldBookings = () => {
  try {
    const oldCustomerBookings = localStorage.getItem('customerBookings');
    const oldPendingRequests = localStorage.getItem('pendingBookingRequests');
    const newBookings = localStorage.getItem(STORAGE_KEYS.BOOKINGS);

    // If new storage already exists, no migration needed
    if (newBookings) {
      console.log('✅ New storage already exists, no migration needed');
      return false;
    }

    let migratedBookings = [];

    // Load from old customer bookings
    if (oldCustomerBookings) {
      try {
        const customerBookings = JSON.parse(oldCustomerBookings);
        if (Array.isArray(customerBookings)) {
          migratedBookings.push(...customerBookings);
          console.log(`📦 Migrated ${customerBookings.length} customer bookings`);
        }
      } catch (error) {
        console.warn('⚠️ Error parsing old customer bookings:', error);
      }
    }

    // Load from old pending requests
    if (oldPendingRequests) {
      try {
        const pendingRequests = JSON.parse(oldPendingRequests);
        if (Array.isArray(pendingRequests)) {
          migratedBookings.push(...pendingRequests);
          console.log(`📦 Migrated ${pendingRequests.length} pending requests`);
        }
      } catch (error) {
        console.warn('⚠️ Error parsing old pending requests:', error);
      }
    }

    // Validate and deduplicate migrated bookings
    const validBookings = migratedBookings.filter(validateBooking);
    const uniqueBookings = validBookings.filter((booking, index, self) =>
      index === self.findIndex(b => b._id === booking._id)
    );

    if (uniqueBookings.length > 0) {
      // Save to new storage
      const saved = saveBookingsSafe(STORAGE_KEYS.BOOKINGS, uniqueBookings);

      if (saved) {
        console.log(`✅ Successfully migrated ${uniqueBookings.length} bookings to new storage`);

        // Optionally clean up old storage (uncomment if desired)
        // localStorage.removeItem('customerBookings');
        // localStorage.removeItem('pendingBookingRequests');

        return true;
      }
    }

    return false;
  } catch (error) {
    console.error('❌ Error during migration:', error);
    return false;
  }
};

/**
 * Initializes the booking storage system
 * Should be called when the app starts
 */
export const initializeBookingStorage = () => {
  try {
    // Run migration if needed
    const migrated = migrateOldBookings();

    if (migrated) {
      console.log('🔄 Booking storage migration completed');
    }

    // Ensure backup exists
    const allBookings = loadBookingsSafe(STORAGE_KEYS.BOOKINGS);
    if (allBookings.length > 0 && !localStorage.getItem(STORAGE_KEYS.BACKUP)) {
      localStorage.setItem(STORAGE_KEYS.BACKUP, JSON.stringify(allBookings));
      console.log('✅ Backup created for existing bookings');
    }

    console.log('✅ Booking storage initialized successfully');
  } catch (error) {
    console.error('❌ Error initializing booking storage:', error);
  }
};

export { STORAGE_KEYS, validateBooking };
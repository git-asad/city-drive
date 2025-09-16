import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

// Create the Auth Context
const AuthContext = createContext();

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for existing authentication on app load
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Get user role from Firestore
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            const authenticatedUser = {
              id: firebaseUser.uid,
              email: firebaseUser.email,
              name: userData.name || firebaseUser.displayName || firebaseUser.email.split('@')[0],
              role: userData.role || 'customer'
            };
            setUser(authenticatedUser);
            localStorage.setItem('user', JSON.stringify(authenticatedUser));
          } else {
            // User exists in Auth but not in Firestore - create basic profile
            const basicUser = {
              id: firebaseUser.uid,
              email: firebaseUser.email,
              name: firebaseUser.displayName || firebaseUser.email.split('@')[0],
              role: 'customer'
            };
            await setDoc(doc(db, 'users', firebaseUser.uid), {
              email: firebaseUser.email,
              name: basicUser.name,
              role: 'customer',
              createdAt: new Date()
            });
            setUser(basicUser);
            localStorage.setItem('user', JSON.stringify(basicUser));
          }
        } catch (error) {
          console.error('Error loading user data:', error);
          // Fallback to basic user data
          const basicUser = {
            id: firebaseUser.uid,
            email: firebaseUser.email,
            name: firebaseUser.displayName || firebaseUser.email.split('@')[0],
            role: 'customer'
          };
          setUser(basicUser);
        }
      } else {
        setUser(null);
        localStorage.removeItem('user');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      // User data will be set by onAuthStateChanged
      console.log('✅ User signed in:', result.user.email);
      return { success: true, user: result.user };
    } catch (error) {
      console.error('❌ Login error:', error);
      let errorMessage = 'Login failed. Please try again.';
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email address.';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Incorrect password.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address.';
      }
      return { success: false, error: errorMessage };
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, userData.email, userData.password);

      // Create user profile in Firestore
      await setDoc(doc(db, 'users', result.user.uid), {
        email: userData.email,
        name: userData.name,
        role: 'customer', // Default role for new registrations
        createdAt: new Date()
      });

      console.log('✅ User registered:', result.user.email);
      return { success: true, user: result.user };
    } catch (error) {
      console.error('❌ Registration error:', error);
      let errorMessage = 'Registration failed. Please try again.';
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'An account with this email already exists.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password should be at least 6 characters.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address.';
      }
      return { success: false, error: errorMessage };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      localStorage.removeItem('user');
      console.log('✅ User signed out');
    } catch (error) {
      console.error('❌ Logout error:', error);
    }
  };

  // Update user profile
  const updateProfile = async (profileData) => {
    if (!user) return { success: false, error: 'No user logged in' };

    try {
      await updateDoc(doc(db, 'users', user.id), {
        ...profileData,
        updatedAt: new Date()
      });

      const updatedUser = { ...user, ...profileData };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));

      return { success: true };
    } catch (error) {
      console.error('Error updating profile:', error);
      return { success: false, error: 'Failed to update profile' };
    }
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    return !!user;
  };

  // Check if user has specific role
  const hasRole = (role) => {
    return user?.role === role;
  };

  // Check if user is owner
  const isOwner = () => {
    return user?.role === 'owner';
  };

  // Check if user is customer
  const isCustomer = () => {
    return user?.role === 'customer';
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
    isAuthenticated,
    hasRole,
    isOwner,
    isCustomer
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged
} from 'firebase/auth';
import {
  doc,
  setDoc,
  getDoc,
  collection,
  query,
  where,
  getDocs
} from 'firebase/firestore';
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
          // Load user role from Firestore
          const userRole = await loadUserRole(firebaseUser.uid);
          const userData = {
            id: firebaseUser.uid,
            email: firebaseUser.email,
            role: userRole,
            name: firebaseUser.displayName || firebaseUser.email.split('@')[0]
          };
          setUser(userData);
        } catch (error) {
          console.error('Error loading user data:', error);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Load user role from Firestore
  const loadUserRole = async (uid) => {
    try {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('uid', '==', uid));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0].data();
        return userDoc.role || 'customer';
      }
      return 'customer';
    } catch (error) {
      console.error('Error loading user role:', error);
      return 'customer';
    }
  };

  // Create user document in Firestore
  const createUserDocument = async (user, role = 'customer') => {
    try {
      const userDoc = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || user.email.split('@')[0],
        role: role,
        createdAt: new Date(),
        profileComplete: false
      };

      await setDoc(doc(db, 'users', user.uid), userDoc);
      console.log('✅ User document created in Firestore');
    } catch (error) {
      console.error('❌ Failed to create user document:', error);
      throw error;
    }
  };

  // Login function
  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // User data will be set by the onAuthStateChanged listener
      console.log('✅ User signed in:', user.email);
      return { success: true, user: user };
    } catch (error) {
      console.error('❌ Login error:', error);
      return { success: false, error: error.message };
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, userData.email, userData.password);
      const user = userCredential.user;

      // Create user document in Firestore
      await createUserDocument(user, userData.role || 'customer');

      console.log('✅ User registered successfully:', user.email);
      return { success: true, user: user };
    } catch (error) {
      console.error('❌ Registration error:', error);
      return { success: false, error: error.message };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await firebaseSignOut(auth);
      console.log('✅ User signed out');
    } catch (error) {
      console.error('❌ Logout error:', error);
    }
  };

  // Refresh user data function (useful after profile updates)
  const refreshUserData = async () => {
    if (!user) return;

    try {
      const userRole = await loadUserRole(user.id);
      const updatedUser = {
        ...user,
        role: userRole
      };
      setUser(updatedUser);
      console.log('🔄 User data refreshed in AuthContext');
    } catch (error) {
      console.error('Error refreshing user data:', error);
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
    refreshUserData,
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
import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../config/firebase';
import { doc, getDoc, setDoc, updateDoc, collection, query, where, getDocs, addDoc, deleteDoc } from 'firebase/firestore';
import { useAuth } from './AuthContext';

const UserDataContext = createContext();

export function UserDataProvider({ children }) {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [checkIns, setCheckIns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [glowType, setGlowType] = useState(null);
  const [glowScore, setGlowScore] = useState(0);

  // Load user profile and check-ins
  useEffect(() => {
    if (!user) {
      setProfile(null);
      setCheckIns([]);
      setLoading(false);
      return;
    }

    const loadUserData = async () => {
      try {
        // Load profile
        const profileDoc = await getDoc(doc(db, 'users', user.uid));
        if (profileDoc.exists()) {
          setProfile(profileDoc.data());
          setGlowType(profileDoc.data().glowType || null);
        } else {
          // Create new profile if doesn't exist
          const newProfile = {
            email: user.email,
            created_at: new Date(),
            wellness_priorities: [],
            glowType: null,
            glowScore: 0,
            notification_preferences: {
              email: true,
              push: true,
            },
            subscription_tier: 'free',
          };
          await setDoc(doc(db, 'users', user.uid), newProfile);
          setProfile(newProfile);
        }

        // Load today's check-ins and recent ones
        const today = new Date().toISOString().split('T')[0];
        const checkInsRef = collection(db, 'users', user.uid, 'dailyCheckIns');
        const q = query(checkInsRef);
        const querySnapshot = await getDocs(q);
        
        const checkInsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        
        setCheckIns(checkInsData);
        calculateGlowScore(checkInsData);
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [user]);

  // Calculate Glow Score based on recent check-ins
  const calculateGlowScore = (checkInData) => {
    if (checkInData.length === 0) {
      setGlowScore(0);
      return;
    }

    const recent = checkInData.slice(0, 7); // Last 7 days
    const avgEnergy = recent.reduce((sum, c) => sum + (c.energy || 0), 0) / recent.length;
    const avgSleep = (recent.reduce((sum, c) => sum + (c.sleep_hours || 0), 0) / recent.length) / 9 * 10;
    const avgStress = 10 - (recent.reduce((sum, c) => sum + (c.stress_level || 0), 0) / recent.length);
    const avgMood = recent.reduce((sum, c) => sum + (c.mood || 0), 0) / recent.length;

    const score = Math.round((avgEnergy + avgSleep + avgStress + avgMood) / 4 * 10);
    setGlowScore(Math.min(100, Math.max(0, score)));
  };

  // Save profile updates
  const updateProfile = async (updates) => {
    if (!user) return;
    try {
      await updateDoc(doc(db, 'users', user.uid), updates);
      setProfile(prev => ({ ...prev, ...updates }));
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  // Save daily check-in
  const addCheckIn = async (checkInData) => {
    if (!user) return;
    try {
      const today = new Date().toISOString().split('T')[0];
      const checkInRef = collection(db, 'users', user.uid, 'dailyCheckIns');
      
      // Check if today's check-in exists
      const q = query(checkInRef, where('date', '==', today));
      const existing = await getDocs(q);
      
      if (existing.docs.length > 0) {
        // Update existing
        await updateDoc(existing.docs[0].ref, {
          ...checkInData,
          updated_at: new Date(),
        });
      } else {
        // Create new
        await addDoc(checkInRef, {
          ...checkInData,
          date: today,
          created_at: new Date(),
        });
      }

      // Reload check-ins and recalculate score
      const allCheckIns = await getDocs(checkInRef);
      const checkInsData = allCheckIns.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCheckIns(checkInsData);
      calculateGlowScore(checkInsData);
    } catch (error) {
      console.error('Error adding check-in:', error);
      throw error;
    }
  };

  // Get today's check-in
  const getTodayCheckIn = () => {
    const today = new Date().toISOString().split('T')[0];
    return checkIns.find(c => c.date === today);
  };

  const value = {
    profile,
    checkIns,
    loading,
    glowType,
    glowScore,
    updateProfile,
    addCheckIn,
    getTodayCheckIn,
  };

  return <UserDataContext.Provider value={value}>{children}</UserDataContext.Provider>;
}

export function useUserData() {
  return useContext(UserDataContext);
}

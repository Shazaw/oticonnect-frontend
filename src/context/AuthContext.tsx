'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { GoogleLogin } from 'react-google-login';
import axios from 'axios';
import jwtDecode from 'jwt-decode';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  mainDivision?: {
    id: string;
    name: string;
  };
  managerialDivision?: {
    id: string;
    name: string;
  };
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  googleLogin: (googleData: any) => Promise<void>;
  logout: () => void;
  updateProfile: (profileData: any) => Promise<any>;
  hasRole: (roles: string[]) => boolean;
  isDivisionHead: (divisionId: string) => boolean;
  isEventHead: (eventId: string) => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode<User>(token);
        setUser(decoded);
      } catch (error) {
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
        email,
        password,
      });
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      setUser(user);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  };

  const googleLogin = async (googleData: any) => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/google`, {
        token: googleData.tokenId,
      });
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      setUser(user);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Google login failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    router.push('/login');
  };

  const updateProfile = async (profileData: any) => {
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/profile`,
        profileData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setUser(response.data.user);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Profile update failed');
    }
  };

  const hasRole = (roles: string[]) => {
    if (!user) return false;
    return roles.includes(user.role);
  };

  const isDivisionHead = (divisionId: string) => {
    if (!user) return false;
    return user.role === 'head' && user.mainDivision?.id === divisionId;
  };

  const isEventHead = (eventId: string) => {
    if (!user) return false;
    return user.role === 'head_coordinator' && user.events?.some(e => e.id === eventId);
  };

  const value = {
    user,
    loading,
    login,
    googleLogin,
    logout,
    updateProfile,
    hasRole,
    isDivisionHead,
    isEventHead,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 
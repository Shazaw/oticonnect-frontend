import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from 'react-google-login';
import axios from 'axios';
import jwtDecode from 'jwt-decode';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded);
      } catch (error) {
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/login`, {
        email,
        password,
      });
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      setUser(user);
      navigate('/dashboard');
    } catch (error) {
      throw error.response?.data?.message || 'Login failed';
    }
  };

  const googleLogin = async (googleData) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/google`, {
        token: googleData.tokenId,
      });
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      setUser(user);
      navigate('/profile/setup');
    } catch (error) {
      throw error.response?.data?.message || 'Google login failed';
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/users/profile`,
        profileData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setUser(response.data.user);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Profile update failed';
    }
  };

  const hasRole = (roles) => {
    if (!user) return false;
    return roles.includes(user.role);
  };

  const isDivisionHead = (divisionId) => {
    if (!user) return false;
    return user.role === 'head' && user.mainDivision?.id === divisionId;
  };

  const isEventHead = (eventId) => {
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
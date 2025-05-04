"use client"
// context/AuthContext.tsx
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import {
  register as apiRegister,
  login as apiLogin,
  getMe,
  updateDetails as apiUpdateDetails,
  updatePassword as apiUpdatePassword,
  logout as apiLogout
} from '../lib/api';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: {
    name: string;
    email: string;
    password: string;
    role?: string;
    phone?: string;
  }) => Promise<void>;
  logout: () => void;
  updateUserDetails: (details: {
    name?: string;
    email?: string;
    phone?: string;
  }) => Promise<void>;
  updateUserPassword: (currentPassword: string, newPassword: string) => Promise<void>;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('token');
      
      if (storedToken) {
        try {
          const userData = await getMe(storedToken);
          setUser(userData.data);
          setToken(storedToken);
        } catch (err) {
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      const { token } = await apiLogin({ email, password });

      localStorage.setItem('token', token);
      setToken(token);
      console.log(token)

      const userData = await getMe(token);
      if(userData?.role==="agent"){
        localStorage.setItem("adminToken",token)
      }
      console.log(userData)
      setUser(userData.data);

      router.push(userData.data.role === 'agent' ? '/agent/dashboard' : '/user');
    } catch (err:any) {
      setError(err?.response?.data?.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: {
    name: string;
    email: string;
    password: string;
    role?: string;
    phone?: string;
  }) => {
    setLoading(true);
    setError(null);

    try {
      const { token } = await apiRegister(userData);

      if (user?.role ==="agent"){
          localStorage.setItem("agentToken",token)
      }
      localStorage.setItem('token', token);

      setToken(token);

      const userDataResponse = await getMe(token);
      setUser(userDataResponse.data);

      router.push(userDataResponse.data.role === 'agent' ? '/agent/dashboard' : '/user');
    } catch (err:any) {
      setError(err.response?.data?.message || 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateUserDetails = async (details: {
    name?: string;
    email?: string;
    phone?: string;
  }) => {
    if (!token) throw new Error('Not authenticated');
    
    setLoading(true);
    setError(null);

    try {
      const updatedUser = await apiUpdateDetails(details, token);
      setUser(updatedUser.data);
    } catch (err:any) {
      setError(err.response?.data?.message || 'Update failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateUserPassword = async (currentPassword: string, newPassword: string) => {
    if (!token) throw new Error('Not authenticated');
    
    setLoading(true);
    setError(null);

    try {
      const response = await apiUpdatePassword({ currentPassword, newPassword }, token);
      if (response.token) {
        localStorage.setItem('token', response.token);
        setToken(response.token);
      }
    } catch (err:any) {
      setError(err.response?.data?.message || 'Password update failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    apiLogout();
    setToken(null);
    setUser(null);
    router.push('/login');
  };

  const value = {
    user,
    token,
    login,
    register,
    logout,
    updateUserDetails,
    updateUserPassword,
    isAuthenticated: !!token,
    loading,
    error
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
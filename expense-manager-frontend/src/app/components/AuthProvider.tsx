'use client';

import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
} from 'react';
import { jwtDecode } from 'jwt-decode';
import axiosInstance from '@/app/utils/axiosInstance';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  email: string;
  prenom: string;
  nom: string;
  role?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface LoginCredentials {
  email: string;
  password: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

type AuthAction =
  | { type: 'LOGIN_REQUEST' }
  | { type: 'LOGIN_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'LOGIN_FAILURE'; payload: string }
  | { type: 'LOGOUT' };

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_REQUEST':
      return { ...state, isLoading: true, error: null };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        isAuthenticated: true,
        isLoading: false,
        user: action.payload.user,
        token: action.payload.token,
        error: null,
      };
    case 'LOGIN_FAILURE':
      return {
        ...state,
        isAuthenticated: false,
        isLoading: false,
        user: null,
        token: null,
        error: action.payload,
      };
    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        token: null,
        error: null,
        isLoading: false,
      };
    default:
      return state;
  }
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined); // ✅ export ajouté

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const router = useRouter();

  useEffect(() => {
    const loadUser = () => {
      const token = localStorage.getItem('token');
      if (!token) {
        dispatch({ type: 'LOGIN_FAILURE', payload: '' });
        return;
      }

      try {
        const decoded = jwtDecode<{
          sub: string;
          email: string;
          roles: string[];
          nom?: string;
          prenom?: string;
          exp?: number;
        }>(token);

        if (decoded.exp && decoded.exp * 1000 < Date.now()) {
          console.warn(' Token expiré');
          localStorage.removeItem('token');
          dispatch({ type: 'LOGIN_FAILURE', payload: 'Token expiré' });
          return;
        }

        const role = decoded.roles?.[0] || 'EMPLOYEE';

        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        const user: User = {
          id: decoded.sub,
          email: decoded.email,
          nom: decoded.nom || '',
          prenom: decoded.prenom || '',
          role,
        };

        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: { user, token },
        });
      } catch (error) {
        console.error('Erreur de décodage du token :', error);
        localStorage.removeItem('token');
        dispatch({ type: 'LOGIN_FAILURE', payload: 'Token invalide' });
      }
    };

    loadUser();
  }, []);

  useEffect(() => {
    if (!state.isLoading && !state.isAuthenticated) {
      router.push('/login');
    }
  }, [state.isAuthenticated, state.isLoading, router]);

  const login = async (credentials: LoginCredentials) => {
    dispatch({ type: 'LOGIN_REQUEST' });

    try {
      const response = await axiosInstance.post(`${API_URL}/auth/login`, credentials);
      const { access_token, user } = response.data;

      if (!access_token) throw new Error('Token non reçu');

      const decoded = jwtDecode<{
        sub: string;
        email: string;
        roles: string[];
      }>(access_token);

      const role = decoded.roles?.[0] || 'EMPLOYEE';

      const finalUser: User = {
        id: decoded.sub,
        email: decoded.email,
        nom: user.nom || '',
        prenom: user.prenom || '',
        role,
      };

      localStorage.setItem('token', access_token);
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;

      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: { user: finalUser, token: access_token },
      });

      router.push('/dashboard');
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        'Erreur inconnue lors de la connexion';

      dispatch({ type: 'LOGIN_FAILURE', payload: errorMessage });
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axiosInstance.defaults.headers.common['Authorization'];
    dispatch({ type: 'LOGOUT' });
  };

  const value: AuthContextType = {
    ...state,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// ✅ Hook prêt à l'emploi
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

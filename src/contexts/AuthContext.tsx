import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import {
  User,
  FreelancerProfile,
  ClientProfile,
  AdminProfile
} from '@/types/models';
import {
  addUser,
  findUserByEmail,
  saveCurrentUser,
  getCurrentUser,
  initializeStorage
} from '@/lib/storage';
import { validateEmail, validatePassword, validateUsername } from '@/lib/validation';

interface AuthContextType {
  currentUser: (User | FreelancerProfile | ClientProfile | AdminProfile) | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (username: string, email: string, password: string, role: 'client' | 'freelancer') => Promise<boolean>;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isClient: boolean;
  isFreelancer: boolean;
  updateCurrentUser: (updatedUser: User | FreelancerProfile | ClientProfile) => void; // Add this line
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<(User | FreelancerProfile | ClientProfile | AdminProfile) | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Initialize storage with default data if needed
    initializeStorage();
    
    // Check if user is already logged in
    const user = getCurrentUser();
    if (user) {
      setCurrentUser(user);
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Validate input
    if (!email || !password) {
      toast.error('Por favor, forneça e-mail e senha');
      return false;
    }

    // Find user
    const user = findUserByEmail(email);
    if (!user) {
      toast.error('Usuário não encontrado');
      return false;
    }

    // Check password
    if (user.password !== password) {
      toast.error('Senha incorreta');
      return false;
    }

    // Set current user
    setCurrentUser(user);
    setIsAuthenticated(true);
    saveCurrentUser(user);
    toast.success(`Bem-vindo de volta, ${user.username}!`);
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    saveCurrentUser(null);
    navigate('/');
    toast.success('Você foi desconectado');
  };

  const register = async (username: string, email: string, password: string, role: 'client' | 'freelancer'): Promise<boolean> => {
    // Validate input
    if (!validateUsername(username)) {
      toast.error('O nome de usuário deve ter pelo menos 3 caracteres');
      return false;
    }

    if (!validateEmail(email)) {
      toast.error('Por favor, insira um endereço de e-mail válido');
      return false;
    }

    if (!validatePassword(password)) {
      toast.error('A senha deve ter pelo menos 8 caracteres');
      return false;
    }

    // Check if user already exists
    const existingUser = findUserByEmail(email);
    if (existingUser) {
      toast.error('Usuário com este e-mail já existe');
      return false;
    }

    // Create new user
    const userId = uuidv4();
    const newUser = role === 'freelancer' 
      ? {
          id: userId,
          username,
          email,
          password,
          role: 'freelancer' as const,
          description: '',
          skills: [],
          portfolio: [],
          ratings: [],
          averageRating: 0,
          createdAt: new Date().toISOString()
        } 
      : {
          id: userId,
          username,
          email,
          password,
          role: 'client' as const,
          createdAt: new Date().toISOString()
        };

    // Save user to storage
    addUser(newUser);
    
    // Set current user
    setCurrentUser(newUser);
    setIsAuthenticated(true);
    saveCurrentUser(newUser);
    
    toast.success(`Bem-vindo(a) ao ConectaJob, ${username}!`);
    return true;
  };

  // Add this new function to update the current user
  const updateCurrentUser = (updatedUser: User | FreelancerProfile | ClientProfile) => {
    setCurrentUser(updatedUser);
    
    // Also update in localStorage if you're storing the user there
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const value = {
    currentUser,
    login,
    logout,
    register,
    isAuthenticated,
    isAdmin: currentUser?.role === 'admin',
    isClient: currentUser?.role === 'client',
    isFreelancer: currentUser?.role === 'freelancer',
    updateCurrentUser, // Add this line
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

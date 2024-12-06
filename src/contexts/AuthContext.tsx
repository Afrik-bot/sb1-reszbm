import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from 'firebase/auth';

// Mock user for testing
const MOCK_USER = {
  uid: 'test-user-123',
  email: 'test@example.com',
  displayName: 'John Smith',
  userType: 'consultant'
};

interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<any>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  return useContext(AuthContext) as AuthContextType;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  async function login(email: string, password: string) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Accept any email/password combination for testing
    setCurrentUser(MOCK_USER as unknown as User);
    setIsAuthenticated(true);
  }

  async function register(email: string, password: string) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Create mock user credentials
    setCurrentUser(MOCK_USER as unknown as User);
    setIsAuthenticated(true);
    return { user: MOCK_USER };
  }

  async function logout() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    setCurrentUser(null);
    setIsAuthenticated(false);
  }

  // Remove loading state after initial render
  useEffect(() => {
    setLoading(false);
  }, []);

  const value = {
    currentUser,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
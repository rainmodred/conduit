import { createContext, useContext, useEffect, useState } from 'react';
import { User } from '../types';
import { saveCredentials, getCredentials, deleteCredentials } from '../utils';

interface AuthContextType {
  user: User | null | undefined;
  setUser: (value: User | null) => void;
  logout: () => void;
}
const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: React.ReactNode;
}

function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null | undefined>(null);

  useEffect(() => {
    const user = getCredentials();
    setUser(user);
  }, []);

  useEffect(() => {
    if (user) {
      saveCredentials(user);
    }
  }, [user]);

  function logout() {
    setUser(null);
    deleteCredentials();
  }

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

function useAuth(): AuthContextType {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within a AuthProvider');
  }

  return context;
}

export { AuthProvider, AuthContext, useAuth };

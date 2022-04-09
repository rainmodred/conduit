import { createContext, useContext, useEffect, useState } from 'react';
import { User } from '../types';
import { getFromStorage, setToStorage } from '../utils';

type AuthContextType = [User | null, (value: User | null) => void];
const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: React.ReactNode;
}

function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const user = getFromStorage('auth');
    if (user) {
      setUser(user as User);
    }
  }, []);

  useEffect(() => {
    if (user) {
      setToStorage('auth', user);
    }
  }, [user]);

  return (
    <AuthContext.Provider value={[user, setUser]}>
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

import { createContext, useState, ReactNode } from 'react';

interface User {
  name: string;
  email: string;
  // Outras propriedades do usuário
}

interface UserContextData {
  user: User | null;
  setUser: (userData: User | null) => void; // Renomeamos a função para setUser
}

export const UserContext = createContext<UserContextData>({} as UserContextData);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
  const [user, setUser] = useState<User | null>(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

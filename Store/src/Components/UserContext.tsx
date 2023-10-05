import { createContext, useContext, useState, ReactNode, FunctionComponent } from "react";

interface UserContextProps {
  userId: string | null;
  isLoggedIn: boolean;
  login: (id: string) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: FunctionComponent<UserProviderProps> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userId, setUserId] = useState<string | null>(null);

  const login = (id: string) => {
    setIsLoggedIn(true);
    setUserId(id);
    console.log("User ID set to:", id);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUserId(null);
  };

  return (
    <UserContext.Provider value={{ userId, isLoggedIn, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

import { useState, createContext, useContext, type ReactNode } from "react";

type AuthContextType = {
  accessToken: string | null;
  setAccessToken: (token: string) => void;
  user: {
    name: string;
    email: string;
    password: string;
  } | null;
  setUser: (user: AuthContextType["user"]) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthContextType["user"] | null>(null);

  return (
    <AuthContext.Provider
      value={{ accessToken, setAccessToken, user, setUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside a provider.");
  return context;
}

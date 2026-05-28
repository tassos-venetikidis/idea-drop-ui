import {
  useState,
  useEffect,
  createContext,
  useContext,
  type ReactNode,
} from "react";
import { refreshAccessToken } from "#/api/auth.tsx";

type AuthContextType = {
  accessToken: string | null;
  setAccessToken: (token: string | null) => void;
  user: {
    id: string;
    name: string;
    email: string;
  } | null;
  setUser: (user: AuthContextType["user"]) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthContextType["user"] | null>(null);

  useEffect(() => {
    async function loadAuth() {
      try {
        const { accessToken: newAccessToken, user } =
          await refreshAccessToken();
        setAccessToken(newAccessToken);
        setUser(user);
      } catch (err: any) {
        console.log("Failed to refresh token", err);
      }
    }
    loadAuth();
  }, []);

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

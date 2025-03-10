import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from "react";
import axios from "axios";

export interface IAuthContext {
  isAuthenticated: boolean | null;
  token: string | null;
  appStatus: () => Promise<string>;
  login: (username: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<IAuthContext | null>(null);

export function getUserToken() {
  return localStorage.getItem("token");
}

function setUserToken(token: string | null) {
  if (token) {
    localStorage.setItem("token", token);
  } else {
    localStorage.removeItem("token");
  }
}

export function AuthProvider({children}: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(getUserToken());
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(
    !!token
  );

  const logout = useCallback(async () => {
    setUserToken(null);
    setIsAuthenticated(false);
    setToken(null);
    localStorage.removeItem("id");
  }, []);

  const login = useCallback(async (token: string) => {
    setUserToken(token);
    setIsAuthenticated(true);
    setToken(token);
  }, []);

  const appStatus = useCallback(async () => {
    console.log("Checking profile status");
    return await axios.get("/UserProfile/status", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((res) => {
      return res.data;
    }).catch((err) => {
      if (err.status !== 200) {
        logout();
        return "Unauthorized";
      }
    });

  }, [token, logout]);

  return (
    <AuthContext.Provider
      value={{isAuthenticated, token, login, logout, appStatus}}
    >
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

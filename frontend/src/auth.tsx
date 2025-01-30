import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from "react";
import axios from "axios";
import { redirect } from "@tanstack/react-router";

export interface IAuthContext {
  isAuthenticated: boolean | null;
  token: string | null;
  appStatus: () => void;
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

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(getUserToken());
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(
    !!token
  );
  const [UserProfileStatus, setUserProfileStatus] = useState<string | null>(
    null
  );

  const logout = useCallback(async () => {
    setUserToken(null);
    setIsAuthenticated(false);
    setToken(null);
  }, []);

  const login = useCallback(async (token: string) => {
    setUserToken(token);
    setIsAuthenticated(true);
    setToken(token);
  }, []);

  const appStatus = useCallback(() => {
    console.log("Checking profile status");
    if (!UserProfileStatus) {
      axios
        .get("/UserProfile/status", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          console.log(res.data);
          setUserProfileStatus(res.data.status);
        })
        .catch((err) => {
          console.error(err);
        });
    }

    if (UserProfileStatus === "complete") {
      console.log("Profile is complete");
    } else {
      console.log("Profile is not complete");
      throw redirect({
        to: "/profile/edit-info",
      });
    }
  }, [token]);

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, token, login, logout, appStatus }}
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

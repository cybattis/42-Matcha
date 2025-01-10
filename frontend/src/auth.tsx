import {createContext, ReactNode, useCallback, useContext, useEffect, useState} from "react";

export interface IAuthContext {
  isAuthenticated: boolean
  token: string | null
  login: (username: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<IAuthContext | null>(null);

function getUserToken() {
  return localStorage.getItem('token')
}

function setUserToken(token: string | null) {
  if (token) {
    localStorage.setItem('token', token)
  } else {
    localStorage.removeItem('token')
  }
}

export function AuthProvider({children}: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(getUserToken());
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(!!token);

  const logout = useCallback(async () => {
    setUserToken(null);
    setToken(null);
    setIsAuthenticated(false);
  }, [])

  const login = useCallback(async (token: string) => {
    setUserToken(token);
    setToken(token);
    setIsAuthenticated(true);
  }, [])

  useEffect(() => {
    setToken(getUserToken());
  }, [])

  return (
    <AuthContext.Provider value={{isAuthenticated, token, login, logout}}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
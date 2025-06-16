import { createContext, useContext, useState, useEffect } from "react";
import { login as apiLogin, register as apiRegister } from "../services/auth";
import api from "../services/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(() => {
    const u = localStorage.getItem("user");
    return u ? JSON.parse(u) : null;
  });

  useEffect(() => {
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common["Authorization"];
    }
  }, [token]);

  const login = async (credentials) => {
    const { data } = await apiLogin(credentials);
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user)); // 👈 Ajout

    setToken(data.token);
    setUser(data.user);
  };

  const register = async (details) => {
    const { data } = await apiRegister(details);
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user)); // 👈 Ajout
    setToken(data.token);
    setUser(data.user);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

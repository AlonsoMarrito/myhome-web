import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [admin, setAdmin] = useState(() => localStorage.getItem("admin"));

  useEffect(() => {
    if (token) localStorage.setItem("token", token);
    else localStorage.removeItem("token");

    if (admin) localStorage.setItem("admin", admin);
    else localStorage.removeItem("admin");
  }, [token, admin]);

  const login = (newToken, isAdmin) => {
    setToken(newToken);
    setAdmin(isAdmin);
  };

  const logout = () => {
    setToken(null);
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ token, admin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
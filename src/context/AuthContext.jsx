import { createContext, useContext, useState, useEffect } from "react";
import api from "../utils/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on mount
  useEffect(() => {
    const checkUser = async () => {
      const token = localStorage.getItem("token");
      console.log(
        "AuthProvider: Checking token...",
        token ? "Token found" : "No token",
      );

      if (token) {
        try {
          const res = await api("/auth/me");
          console.log("AuthProvider: Verify response:", res);

          if (res.success) {
            setUser(res.data);
            console.log("AuthProvider: User verified:", res.data.email);
          } else {
            console.warn("AuthProvider: Invalid session");
            localStorage.removeItem("token");
            setUser(null);
          }
        } catch (err) {
          console.error("AuthProvider: Verification error:", err);
          localStorage.removeItem("token");
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    };
    checkUser();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await api("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      if (res.success) {
        localStorage.setItem("token", res.token);
        setUser(res.data);
        return res.data.role;
      }
    } catch (err) {
      throw err;
    }
  };

  const register = async (userData) => {
    try {
      // Ensure role is 'customer' for client registrations if not specified
      const res = await api("/auth/register", {
        method: "POST",
        body: JSON.stringify({
          ...userData,
          role: userData.role || "customer",
        }),
      });

      if (res.success) {
        localStorage.setItem("token", res.token);
        setUser(res.data);
        return res.data.role;
      }
    } catch (err) {
      throw err;
    }
  };

  const refreshUser = async () => {
    try {
      const res = await api("/auth/me");
      if (res.success) {
        setUser(res.data);
      }
    } catch (err) {
      console.error("Failed to refresh user", err);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, login, register, logout, loading, refreshUser }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

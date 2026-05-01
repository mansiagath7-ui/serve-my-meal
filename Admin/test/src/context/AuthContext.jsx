import { createContext, useContext, useState, useEffect } from "react";
import api from "../utils/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if admin is logged in on mount
  useEffect(() => {
    const checkUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // Log for debugging session persistence
          console.log("Verifying token for session persistence...");
          const res = await api('/auth/me');
          if (res.success && res.data.role === 'admin') {
            setUser(res.data);
            console.log("Session verified: Welcome Admin", res.data.name);
          } else {
            console.warn("Session verification failed or not an admin");
            localStorage.removeItem('token');
          }
        } catch (err) {
          console.error("Auth initialization error:", err.message);
          localStorage.removeItem('token');
        }
      } else {
        console.log("No token found, redirected to login");
      }
      setLoading(false);
    };
    checkUser();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await api('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });
      
      if (res.success) {
        if (res.data.role !== 'admin') {
          throw new Error('Unauthorized. Only admins can access this panel.');
        }
        localStorage.setItem('token', res.token);
        setUser(res.data);
        return res.data.role;
      }
    } catch (err) {
      throw err;
    }
  };

  const register = async (userData) => {
    try {
      const res = await api('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ ...userData, role: 'admin' })
      });
      
      if (res.success) {
        localStorage.setItem('token', res.token);
        setUser(res.data);
        return res.data.role;
      }
    } catch (err) {
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
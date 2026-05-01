import React, { useState } from "react";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Phone,
  Calendar,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

/* ================= INPUT FIELD ================= */
function InputField({ icon: Icon, type = "text", placeholder, value, onChange }) {
  const [show, setShow] = useState(false);
  const isPass = type === "password";

  return (
    <div className="relative">
      <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

      <input
        type={isPass && show ? "text" : type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full pl-10 pr-10 py-3 bg-gray-100 rounded-xl text-sm border border-transparent focus:outline-none focus:ring-2 focus:ring-orange-200"
      />

      {isPass && (
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-3.5 top-1/2 -translate-y-1/2"
        >
          {show ? (
            <EyeOff className="w-4 h-4 text-gray-400" />
          ) : (
            <Eye className="w-4 h-4 text-gray-400" />
          )}
        </button>
      )}
    </div>
  );
}

/* ================= MAIN COMPONENT ================= */
export default function Login() {
  const [tab, setTab] = useState("login");
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [regData, setRegData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    dob: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { login, register } = useAuth();

  /* ================= LOGIN ================= */
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!loginData.email || !loginData.password) {
      setError("Please enter both email and password.");
      return;
    }

    setLoading(true);

    try {
      const role = await login(loginData.email, loginData.password);
      setLoading(false);
      toast.success("Login successful! 🎉");
      
      // Redirect based on role (though this is the client app, role should be customer)
      if (role === "customer") {
        navigate("/payment");
      }
    } catch (err) {
      setLoading(false);
      setError(err.message || "Invalid email or password. Please try again.");
    }
  };

  /* ================= REGISTER ================= */
  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (!regData.name || !regData.email || !regData.password) {
      setError("Please fill all required fields.");
      return;
    }

    setLoading(true);

    try {
      await register({
        name: regData.name,
        email: regData.email,
        password: regData.password,
        phone: regData.phone,
        dob: regData.dob,
        role: "customer"
      });
      setLoading(false);
      toast.success("Account created successfully! 🎉");
      navigate("/payment");
    } catch (err) {
      setLoading(false);
      setError(err.message || "Registration failed. Please try again.");
    }
  };


  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      
      {/* CARD */}
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-6 transition hover:shadow-2xl">
        
        {/* HEADER */}
       <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-orange-500">
            ServeMyMeal
          </h1>
          <p className="text-xs text-gray-400 tracking-widest">
            FOOD TECH PLATFORM
          </p>
        </div>

        {/* TABS */}
        <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
          <button
            onClick={() => {
              setTab("login");
              setError("");
            }}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition ${
              tab === "login"
                ? "bg-white shadow text-orange-500"
                : "text-gray-500"
            }`}
          >
            Log In
          </button>

          <button
            onClick={() => {
              setTab("register");
              setError("");
            }}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition ${
              tab === "register"
                ? "bg-white shadow text-orange-500"
                : "text-gray-500"
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* ERROR */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600">
            ⚠️ {error}
          </div>
        )}

        {/* ================= LOGIN ================= */}
        {tab === "login" ? (
          <form onSubmit={handleLogin} className="space-y-4">

            <InputField
              icon={Mail}
              placeholder="Email address"
              value={loginData.email}
              onChange={(e) =>
                setLoginData({ ...loginData, email: e.target.value })
              }
            />

            <InputField
              icon={Lock}
              type="password"
              placeholder="Password"
              value={loginData.password}
              onChange={(e) =>
                setLoginData({ ...loginData, password: e.target.value })
              }
            />

            <div className="text-right">
              <button
  type="button"
  onClick={() => navigate("/reset-password")}
  className="text-orange-500 text-xs font-medium"
>
  Forgot Password?
</button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-xl shadow-md transition flex items-center justify-center"
            >
              {loading ? "Checking..." : "Log In"}
            </button>
          </form>
        ) : (
          /* ================= REGISTER ================= */
          <form onSubmit={handleRegister} className="space-y-4">

            <InputField
              icon={User}
              placeholder="Full Name"
              value={regData.name}
              onChange={(e) =>
                setRegData({ ...regData, name: e.target.value })
              }
            />

            <InputField
              icon={Mail}
              placeholder="Email address"
              value={regData.email}
              onChange={(e) =>
                setRegData({ ...regData, email: e.target.value })
              }
            />

            <InputField
              icon={Phone}
              placeholder="Phone"
              value={regData.phone}
              onChange={(e) =>
                setRegData({ ...regData, phone: e.target.value })
              }
            />

            <InputField
              icon={Calendar}
              type="date"
              value={regData.dob}
              onChange={(e) =>
                setRegData({ ...regData, dob: e.target.value })
              }
            />

            <InputField
              icon={Lock}
              type="password"
              placeholder="Create password"
              value={regData.password}
              onChange={(e) =>
                setRegData({ ...regData, password: e.target.value })
              }
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-xl shadow-md transition"
            >
              {loading ? "Creating..." : "Create Account"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
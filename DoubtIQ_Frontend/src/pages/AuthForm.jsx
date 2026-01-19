import { useState } from "react";
import { Mail, User, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Prefer env variable when deployed; fallback to local dev API
const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000/api";

export default function AuthForm() {
  const [mode, setMode] = useState("login"); 
  // login | signup | forgot | otp | reset

  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    otp: ""
  });

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      /* ================= LOGIN ================= */
      if (mode === "login") {
        try {
          const { data } = await axios.post(`${API_BASE}/auth/login`, {
            email: form.email,
            password: form.password,
          });

          if (data.token) {
            localStorage.setItem("token", data.token);
            toast.success("Login successful!");
            setTimeout(() => navigate("/dashboard"), 500);
            return;
          }
        } catch (err) {
          const errorMsg = err.response?.data?.message || err.message || "Login failed";
          toast.error(errorMsg);
        }
      }

      /* ================= SIGNUP ================= */
      else if (mode === "signup") {
        try {
          const { data } = await axios.post(`${API_BASE}/auth/register`, {
            name: form.name,
            email: form.email,
            password: form.password,
          });

          if (data.token) {
            localStorage.setItem("token", data.token);
            toast.success("Account created successfully!");
            setTimeout(() => navigate("/dashboard"), 1500);
            return;
          }
        } catch (err) {
          const errorMsg = err.response?.data?.message || err.message || "Registration failed";
          toast.error(errorMsg);
        }
      }

      /* ================= FORGOT PASSWORD ================= */
      else if (mode === "forgot") {
        try {
          await axios.post(`${API_BASE}/auth/forgot-password`, {
            email: form.email,
          });
          toast.success("OTP sent to your email!");
          setMode("otp");
        } catch (err) {
          const errorMsg = err.response?.data?.message || err.message || "Failed to send OTP";
          toast.error(errorMsg);
        }
      }

      /* ================= VERIFY OTP ================= */
      else if (mode === "otp") {
        try {
          await axios.post(`${API_BASE}/auth/verify-otp`, {
            email: form.email,
            otp: form.otp,
          });
          toast.success("OTP verified! Set your new password.");
          setMode("reset");
        } catch (err) {
          const errorMsg = err.response?.data?.message || err.message || "OTP verification failed";
          toast.error(errorMsg);
        }
      }

      /* ================= RESET PASSWORD ================= */
      else if (mode === "reset") {
        try {
          await axios.post(`${API_BASE}/auth/reset-password`, {
            email: form.email,
            password: form.password,
          });
          toast.success("Password reset successful! Logging in...");
          setTimeout(() => setMode("login"), 1500);
        } catch (err) {
          const errorMsg = err.response?.data?.message || err.message || "Password reset failed";
          toast.error(errorMsg);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-[#0f172a] via-[#020617] to-black px-4">
      <div className="absolute top-8 left-8">
        <button
          type="button"
          onClick={() => navigate("/")}
          aria-label="Go back"
          className="w-16 h-16 flex items-center justify-center rounded-full bg-white/6 text-white hover:bg-white/12 transition-shadow shadow-2xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </div>
      <div className="w-full max-w-md bg-[#020617]/80 backdrop-blur-xl rounded-2xl shadow-xl p-8 transition-all duration-500 animate-fade-in-up">
        <h2 className="text-2xl font-semibold text-white text-center mb-2">
          {mode === "login" && "Welcome Back"}
          {mode === "signup" && "Create Account"}
          {mode === "forgot" && "Forgot Password"}
          {mode === "otp" && "Verify OTP"}
          {mode === "reset" && "Reset Password"}
        </h2>

        <p className="text-sm text-gray-400 text-center mb-6">
          {mode === "login" && "Login to continue"}
          {mode === "signup" && "Sign up to get started"}
          {mode === "forgot" && "We will send an OTP to your email"}
          {mode === "otp" && "Enter the OTP sent to your email"}
          {mode === "reset" && "Set a new password"}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">

          {mode === "signup" && (
            <div className="relative group">
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 pr-12 rounded-lg bg-[#020617] text-white border border-gray-700 focus:border-indigo-500"
              />
              <User className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          )}

          {(mode !== "otp" && mode !== "reset") && (
            <div className="relative group">
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 pr-12 rounded-lg bg-[#020617] text-white border border-gray-700 focus:border-indigo-500"
              />
              <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          )}

          {(mode === "login" || mode === "signup" || mode === "reset") && (
            <div className="relative group">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder={mode === "reset" ? "New Password" : "Password"}
                value={form.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 pr-12 rounded-lg bg-[#020617] text-white border border-gray-700 focus:border-indigo-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-400 transition"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          )}

          {mode === "otp" && (
            <input
              type="text"
              name="otp"
              placeholder="Enter OTP"
              value={form.otp}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 text-center tracking-widest rounded-lg bg-[#020617] text-white border border-gray-700"
            />
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 transition disabled:opacity-60 cursor-pointer disabled:cursor-not-allowed"
          >
            {loading ? "Please wait..." :
              mode === "login" ? "Login" :
              mode === "signup" ? "Sign Up" :
              mode === "forgot" ? "Send OTP" :
              mode === "otp" ? "Verify OTP" :
              "Reset Password"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-400 space-y-2">
          {mode === "login" && (
            <>
              <button onClick={() => setMode("forgot")} className="hover:text-indigo-400 cursor-pointer">
                Forgot password?
              </button>
              <p>
                Don’t have an account?{" "}
                <button onClick={() => setMode("signup")} className="text-indigo-400 cursor-pointer">
                  Sign up
                </button>
              </p>
            </>
          )}

          {mode === "signup" && (
            <p>
              Already have an account?{" "}
              <button onClick={() => setMode("login")} className="text-indigo-400 cursor-pointer">
                Login
              </button>
            </p>
          )}

          {(mode === "forgot" || mode === "otp" || mode === "reset") && (
            <button onClick={() => setMode("login")} className="text-indigo-400 cursor-pointer">
              Back to Login
            </button>
          )}
        </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  );
}

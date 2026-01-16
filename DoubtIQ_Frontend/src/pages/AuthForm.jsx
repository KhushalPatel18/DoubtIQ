import { useState } from "react";
import { Mail, User, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";

const API_BASE = "http://localhost:5000/api/auth";

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
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);

      /* ================= LOGIN ================= */
      if (mode === "login") {
        const res = await fetch(`${API_BASE}/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: form.email,
            password: form.password,
          }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message);

        localStorage.setItem("token", data.token);
        navigate("/dashboard");
      }

      /* ================= SIGNUP ================= */
      if (mode === "signup") {
        const res = await fetch(`${API_BASE}/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: form.name,
            email: form.email,
            password: form.password,
          }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message);

        localStorage.setItem("token", data.token);
        navigate("/dashboard");
      }

      /* ================= FORGOT PASSWORD ================= */
      if (mode === "forgot") {
        const res = await fetch(`${API_BASE}/forgot-password`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: form.email }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message);

        setMode("otp");
      }

      /* ================= VERIFY OTP ================= */
      if (mode === "otp") {
        const res = await fetch(`${API_BASE}/verify-otp`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: form.email,
            otp: form.otp,
          }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message);

        setMode("reset");
      }

      /* ================= RESET PASSWORD ================= */
      if (mode === "reset") {
        const res = await fetch(`${API_BASE}/reset-password`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: form.email,
            password: form.password,
          }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message);

        setMode("login");
      }
    } catch (err) {
      setError(err.message || "Something went wrong");
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

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 transition disabled:opacity-60"
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
              <button onClick={() => setMode("forgot")} className="hover:text-indigo-400">
                Forgot password?
              </button>
              <p>
                Don’t have an account?{" "}
                <button onClick={() => setMode("signup")} className="text-indigo-400">
                  Sign up
                </button>
              </p>
            </>
          )}

          {mode === "signup" && (
            <p>
              Already have an account?{" "}
              <button onClick={() => setMode("login")} className="text-indigo-400">
                Login
              </button>
            </p>
          )}

          {(mode === "forgot" || mode === "otp" || mode === "reset") && (
            <button onClick={() => setMode("login")} className="text-indigo-400">
              Back to Login
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

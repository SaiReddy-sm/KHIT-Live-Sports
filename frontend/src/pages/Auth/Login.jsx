import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Invalid email or password credentials.");
      }

      // Store JWT token string safely on successful response
      if (data.token) {
        localStorage.setItem("adminAuth", data.token);
        navigate("/admin");
      } else {
        throw new Error("Authorization token missing from backend response.");
      }
    } catch (err) {
      setError(err.message || "Unable to connect to the backend server. Please ensure the service is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#F8FAFC] min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="bg-white rounded-2xl border-2 border-slate-100 shadow-xl max-w-md w-full overflow-hidden transition-all duration-300 hover:border-[#7A1E2D]/10">
        
        {/* Maroon and Gold Banner Header */}
        <div className="bg-gradient-to-r from-[#7A1E2D] to-[#8B1F2F] p-8 text-center text-white relative border-b-4 border-[#F2B84B]">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:16px_16px]" />
          <h2 className="text-2xl font-black relative z-10 tracking-wide text-white">
            KHIT Sports Portal
          </h2>
          <p className="text-xs text-gray-200 mt-2 relative z-10 font-semibold">
            Administrative Access Dashboard
          </p>
        </div>

        {/* Input Form */}
        <form onSubmit={handleLogin} className="p-8 space-y-6">
          {error && (
            <div className="bg-red-50 text-red-700 p-3.5 rounded-xl text-xs font-semibold border border-red-100 flex items-start gap-2">
              <span className="shrink-0">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* Email Input */}
          <div className="space-y-1">
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@khit.edu.in"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs md:text-sm font-semibold text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#7A1E2D] focus:border-transparent transition-all"
            />
          </div>

          {/* Password Input */}
          <div className="space-y-1">
            <div className="flex justify-between items-center mb-1">
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                Password
              </label>
              <Link to="/forgot-password" className="text-[11px] font-bold text-[#7A1E2D] hover:text-[#8B1F2F] hover:underline">
                Forgot Password?
              </Link>
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs md:text-sm font-semibold text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#7A1E2D] focus:border-transparent transition-all"
            />
          </div>

          {/* Submit Action Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#7A1E2D] hover:bg-[#8B1F2F] text-white font-extrabold text-xs md:text-sm rounded-xl transition-all shadow-md uppercase tracking-wider disabled:opacity-50"
          >
            {loading ? "Authenticating Account..." : "Sign In to Panel"}
          </button>

          {/* Footer Access Link */}
          <div className="pt-5 border-t border-slate-100 text-center text-xs text-slate-500 font-semibold flex items-center justify-center gap-1">
            <span>New portal user?</span>
            <Link to="/register" className="text-[#7A1E2D] hover:text-[#8B1F2F] hover:underline">
              Register Account
            </Link>
          </div>
        </form>

      </div>
    </div>
  );
}
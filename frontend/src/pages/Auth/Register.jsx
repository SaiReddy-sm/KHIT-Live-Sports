import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const DEPARTMENTS = ["CSE", "AIML", "AIDS", "IT", "ECE", "EEE", "MECH", "CIVIL", "MCA", "MBA", "Diploma"];
const ROLES = ["Student", "Team Captain", "Sports Coordinator", "Admin"];

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [dept, setDept] = useState("CSE");
  const [role, setRole] = useState("Student");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ 
          name, 
          email, 
          department: dept, 
          role, 
          password 
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration request failed.");
      }

      setSuccess("Account registered successfully in MongoDB! Redirecting to login...");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setError(err.message || "Unable to connect to the backend server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#F8FAFC] min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-xl max-w-lg w-full overflow-hidden">
        
        {/* Banner header */}
        <div className="bg-gradient-to-r from-[#7A1E2D] to-[#8B1F2F] p-8 text-center text-white relative">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:16px_16px]" />
          <h2 className="text-2xl font-extrabold relative z-10">Create Account</h2>
          <p className="text-xs text-gray-200 mt-1.5 relative z-10">Join the KHIT Sports management platform.</p>
        </div>

        {/* Input Form */}
        <form onSubmit={handleRegister} className="p-8 space-y-4">
          {error && (
            <div className="bg-red-50 text-red-700 p-3 rounded-xl text-xs font-semibold border border-red-100">
              ⚠️ {error}
            </div>
          )}

          {success && (
            <div className="bg-emerald-50 text-emerald-700 p-3 rounded-xl text-xs font-semibold border border-emerald-100">
              ✓ {success}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Rahul Kumar"
              className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#7A1E2D]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@khit.edu"
                className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#7A1E2D]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Department</label>
              <select
                value={dept}
                onChange={(e) => setDept(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm bg-white"
              >
                {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Role Type</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm bg-white"
            >
              {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#7A1E2D]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Confirm Password</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#7A1E2D] hover:bg-[#8B1F2F] text-white font-extrabold text-sm rounded-xl transition-all shadow-md mt-4 disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Submit Registration"}
          </button>

          <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-500 font-semibold">
            <span>Already have an account? </span>
            <Link to="/login" className="text-[#7A1E2D] hover:underline">
              Log In
            </Link>
          </div>
        </form>

      </div>
    </div>
  );
}
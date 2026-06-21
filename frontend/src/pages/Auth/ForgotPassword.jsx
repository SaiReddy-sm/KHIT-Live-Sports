import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage("");

    // Simulated email dispatch notification trigger
    setMessage(`Mock password reset instructions dispatched to: ${email}`);
  };

  return (
    <div className="bg-[#F8FAFC] min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-xl max-w-md w-full overflow-hidden">
        
        {/* Banner */}
        <div className="bg-gradient-to-r from-[#7A1E2D] to-[#8B1F2F] p-8 text-center text-white relative">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:16px_16px]" />
          <h2 className="text-2xl font-extrabold relative z-10">Reset Password</h2>
          <p className="text-xs text-gray-200 mt-1.5 relative z-10">Verify your details to restore portal access.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          {message && (
            <div className="bg-emerald-50 text-emerald-700 p-3 rounded-xl text-xs font-semibold border border-emerald-100">
              ✓ {message}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Registered Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#7A1E2D] transition-all"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-[#7A1E2D] hover:bg-[#8B1F2F] text-white font-extrabold text-sm rounded-xl transition-all shadow-md"
          >
            Request Reset Instructions
          </button>

          <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-500 font-semibold">
            <Link to="/login" className="text-[#7A1E2D] hover:underline">
              ← Return to Login Page
            </Link>
          </div>
        </form>

      </div>
    </div>
  );
}
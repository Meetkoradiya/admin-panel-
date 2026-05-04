import React, { useState } from "react";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { useNavigate } from "react-router-dom";
const Logo = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z" />
    <path d="M12.56 6.6A10.97 10.97 0 0 0 14 3.02c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a6.98 6.98 0 0 1-11.91 4.97" />
  </svg>
);

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  // Email validation regex (a-z, number, @ required)
  const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;

  const handleSendOtp = () => {
    if (!email) {
      alert("Please enter your email.");
      return;
    }

    if (!emailRegex.test(email.toLowerCase())) {
      alert("Please enter a valid email (a-z, number and @ required).");
      return;
    }

    alert(`OTP sent to ${email}`);
    navigate("/verify-otp");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f4f7fe] p-6 font-['Inter']">
      {/* Top Logo Section */}
      <div className="flex flex-col items-center mb-8 animate-fade-in">
        <div className="flex items-center gap-3 mb-2">
          <div className="relative">
            <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full" />
            <Logo
              className="w-12 h-12 relative z-10 text-gray-500"
            />
          </div>
          <span className="text-3xl font-bold text-slate-800 tracking-tight">Amrut Water</span>
        </div>
        <div className="flex items-center gap-1.5 mt-1">
          <div className="h-[2px] w-3 bg-blue-500 rounded-full" />
          <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-blue-600">Recovery Center</span>
        </div>
      </div>

      {/* Main Card */}
      <div className="w-full max-w-[480px] bg-white rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100 overflow-hidden">
        <div className="p-10 md:p-12">
          <div className="mb-10 text-center lg:text-left">
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Forgot Password?</h1>
            <p className="text-sm font-medium text-slate-400 leading-relaxed">
              No worries! Enter your registered email below and we&apos;ll send you an OTP to reset your password.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-slate-500 ml-1">Email Address</label>
              <div className="relative group">
                <i className="pi pi-envelope absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-blue-500" />
                <InputText
                  value={email}
                  onChange={(e) => setEmail(e.target.value.toLowerCase())}
                  placeholder="name@example.com"
                  className="w-full pl-12 p-4 rounded-xl bg-slate-50 border-slate-200 text-slate-700 font-bold focus:bg-white focus:ring-4 focus:ring-blue-50 transition-all"
                />
              </div>
            </div>

            <Button
              label="Send OTP"
              onClick={handleSendOtp}
              className="w-full py-4 text-base bg-blue-500 border-none rounded-xl font-bold text-white hover:bg-blue-600 shadow-lg shadow-blue-500/20 transition-all active:scale-[0.98] mt-2"
            />

            <div className="pt-4 text-center">
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="text-sm font-bold text-slate-400 hover:text-blue-600 flex items-center justify-center gap-2 transition-all mx-auto"
              >
                <i className="pi pi-arrow-left text-xs" />
                Back to Sign In
              </button>
            </div>
          </div>
        </div>

        {/* Card Bottom Footer */}
        <div className="bg-slate-50/80 p-5 flex items-center justify-center gap-2 border-t border-slate-100">
          <i className="pi pi-shield text-slate-400 text-xs" />
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Secure identity verification</span>
        </div>
      </div>

      {/* Page Bottom Footer Links */}
      <div className="mt-12 flex items-center gap-6">
        <button onClick={() => navigate("/privacy-policy")} className="text-xs font-bold text-slate-400 hover:text-slate-600 transition-all">Privacy policy</button>
        <div className="w-[1px] h-3 bg-slate-300" />
        <button onClick={() => navigate("/terms")} className="text-xs font-bold text-slate-400 hover:text-slate-600 transition-all">Terms &amp; condition</button>
      </div>
    </div>
  );
};

export default ForgotPassword;



import React, { useState } from "react";
import { InputOtp } from "primereact/inputotp";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";

const VerifyOtp = () => {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  const handleVerify = () => {
    if (otp.length !== 6) {
      alert("Please enter a valid 6-digit OTP.");
      return;
    }
    navigate("/create-new-password");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f4f7fe] p-6 font-['Inter']">
      {/* Top Logo Section */}
      <div className="flex flex-col items-center mb-8 animate-fade-in">
        <div className="flex items-center gap-3 mb-2">
          <div className="relative">
            <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full" />
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-12 h-12 relative z-10"
            >
              <defs>
                <linearGradient id="logo-grad-verify" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#1d4ed8" />
                </linearGradient>
              </defs>
              <circle cx="12" cy="13" r="9" stroke="url(#logo-grad-verify)" strokeWidth="0.5" strokeDasharray="4 2" opacity="0.4" />
              <path
                d="M12 3C12 3 6 10 6 14.5C6 18.0899 8.68629 21 12 21C15.3137 21 18 18.0899 18 14.5C18 10 12 3 12 3Z"
                fill="url(#logo-grad-verify)"
              />
              <path
                d="M12 6C12 6 8.5 10.5 8.5 14C8.5 15.933 10.067 17.5 12 17.5C13.933 17.5 15.5 15.933 15.5 14C15.5 10.5 12 6 12 6Z"
                fill="white"
                fillOpacity="0.25"
              />
              <circle cx="14" cy="10" r="1.5" fill="white" fillOpacity="0.4" />
            </svg>
          </div>
          <span className="text-3xl font-bold text-slate-800 tracking-tight">Amrut Water</span>
        </div>
        <div className="flex items-center gap-1.5 mt-1">
          <div className="h-[2px] w-3 bg-blue-500 rounded-full" />
          <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-blue-600">Verification</span>
        </div>
      </div>

      {/* Main Card */}
      <div className="w-full max-w-[480px] bg-white rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100 overflow-hidden">
        <div className="p-10 md:p-12">
          <div className="mb-10 text-center lg:text-left">
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Verify OTP</h1>
            <p className="text-sm font-medium text-slate-400 leading-relaxed">
              We&apos;ve sent a 6-digit verification code to your email. Please enter it below to safely reset your account.
            </p>
          </div>

          <div className="space-y-8">
            <div className="flex flex-col items-center">
              <InputOtp
                value={otp}
                onChange={(e) => setOtp(e.value)}
                length={6}
                style={{ gap: "10px" }}
                inputClassName="w-12 h-14 text-2xl border-2 rounded-xl border-slate-100 bg-slate-50 text-slate-800 font-bold transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50 shadow-inner"
              />
            </div>

            <Button
              label="Verify & Continue"
              onClick={handleVerify}
              className="w-full py-4 text-base bg-blue-500 border-none rounded-xl font-bold text-white hover:bg-blue-600 shadow-lg shadow-blue-500/20 transition-all active:scale-[0.98]"
            />

            <div className="space-y-4 pt-4">
              <p className="text-xs font-bold text-slate-400 text-center uppercase tracking-widest leading-loose">
                Didn&apos;t receive the code? <br />
                <button className="text-blue-600 font-bold hover:underline mt-1">Resend Code</button>
              </p>

              <button
                type="button"
                onClick={() => navigate("/login")}
                className="text-sm font-bold text-slate-400 hover:text-blue-600 flex items-center justify-center gap-2 transition-all mx-auto pt-2"
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
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Multi-factor security active</span>
        </div>
      </div>

      {/* Page Bottom Footer Links */}
      <div className="mt-12 flex items-center gap-6">
        <button onClick={() => navigate('/privacy-policy')} className="text-xs font-bold text-slate-400 hover:text-slate-600 transition-all">Privacy policy</button>
        <div className="w-[1px] h-3 bg-slate-300" />
        <button onClick={() => navigate('/terms')} className="text-xs font-bold text-slate-400 hover:text-slate-600 transition-all">Terms &amp; condition</button>
      </div>
    </div>
  );
};

export default VerifyOtp;



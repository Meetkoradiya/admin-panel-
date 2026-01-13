
import React, { useState } from "react";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSendOtp = () => {
    if (!email) {
      alert("Please enter your email.");
      return;
    }
    // TODO: Add API call to send OTP to the email
    alert(`OTP sent to ${email}`);
    navigate("/verify-otp"); // Navigate to OTP page
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="flex w-full max-w-6xl h-[85vh] bg-white overflow-hidden">

        {/* LEFT SECTION */}
        <div className="w-full lg:w-1/2 flex items-center justify-center px-12 md:px-20">
          <div className="w-full max-w-md">

            {/* Branding */}
            <div className="flex items-center gap-4 mb-10">
              <div className="w-12 h-12 rounded-xl bg-[#1e293b] flex items-center justify-center text-[#22bedb] text-xl">
                💧
              </div>
              <h2 className="text-2xl font-bold text-slate-800">Amrut Water</h2>
            </div>

            {/* Title & Description */}
            <div className="mb-8">
              <h1 className="text-3xl font-extrabold text-slate-900 mb-4">
                Forgot Password
              </h1>
              <p className="text-slate-500 text-base leading-relaxed">
                Enter your registered email below to receive a verification code.
              </p>
            </div>

            {/* Input Field */}
            <div className="mb-6">
              <InputText
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full p-3.5 border rounded-lg focus:border-cyan-500 border-slate-200 bg-white"
              />
            </div>

            {/* Buttons */}
            <div className="space-y-4">
              <Button
                label="Verify OTP"
                className="w-full py-4 text-lg bg-[#06b6d4] border-none rounded-lg font-bold text-white hover:bg-cyan-600 shadow-lg shadow-cyan-100 transition-all active:scale-[0.98]"
                onClick={handleSendOtp}
              />

              <button
                type="button"
                onClick={() => navigate("/login")}
                className="w-full text-center text-slate-400 font-semibold hover:text-slate-800 flex items-center justify-center gap-2 py-3 rounded-lg border border-slate-200 bg-transparent transition-colors"
              >
                <i className="pi pi-arrow-left text-sm" />
                Back to Sign In
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT IMAGE SECTION */}
        <div className="hidden lg:block lg:w-1/2 p-6">
          <div className="w-full h-full rounded-[3rem] overflow-hidden bg-[#22bedb] flex items-center justify-center shadow-2xl">
            <img
              src="/images/authImage.png"
              alt="Forgot Password Illustration"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

      </div>
    </div>
  );
};

export default ForgotPassword;

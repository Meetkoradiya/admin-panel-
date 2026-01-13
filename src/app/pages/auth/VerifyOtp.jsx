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
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="flex w-full max-w-6xl h-[85vh] bg-white overflow-hidden">

        {/* LEFT SECTION */}
        <div className="w-full lg:w-1/2 flex items-center justify-center px-12 md:px-20">
          <div className="w-full max-w-md">

            {/* Branding */}
            <div className="flex items-center gap-4 mb-10">
              <div className="w-14 h-14 rounded-2xl bg-slate-800 flex items-center justify-center text-white text-2xl">
                💧
              </div>
              <h2 className="text-2xl font-black text-slate-800">Amrut Water</h2>
            </div>

            {/* Title & Description */}
            <div className="mb-8">
              <h1 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
                Verify OTP
              </h1>
              <p className="text-slate-500 text-lg leading-relaxed">
                We&apos;ve sent a 6-digit verification code to your email.<br />
                Please enter it below to safely reset your account.
              </p>
            </div>

            {/* OTP Input */}
            <div className="space-y-6">
              <InputOtp
                value={otp}
                onChange={(e) => setOtp(e.value)}
                length={6}
                style={{ gap: "12px" }}
                inputClassName="w-12 h-14 text-2xl border-2 rounded-xl focus:border-cyan-500 border-slate-200 bg-gray-50 text-slate-800 font-bold"
              />

              {/* Verify Button */}
              <Button
                label="Verify & Continue"
                className="w-full py-4 text-lg bg-cyan-500 border-none rounded-xl font-bold text-white hover:bg-cyan-600 shadow-lg shadow-cyan-100 transition-all active:scale-[0.98]"
                onClick={handleVerify}
              />

              {/* Resend Code */}
              <p className="text-slate-500 font-medium text-center mt-2">
                Didn&apos;t receive the code?{" "}
                <button className="text-cyan-600 font-bold hover:text-cyan-700 transition-colors">
                  Resend Code
                </button>
              </p>

              {/* Back to Sign In */}
              <button
                className="text-slate-400 font-semibold hover:text-slate-800 flex items-center justify-center gap-2 mx-auto mt-6 transition-colors bg-transparent border-none cursor-pointer"
                onClick={() => navigate("/login")}
              >
                <i className="pi pi-arrow-left text-sm" />
                Back to Sign In
              </button>
            </div>

          </div>
        </div>

        {/* RIGHT IMAGE */}
        <div className="hidden lg:block lg:w-1/2 p-6">
          <div className="w-full h-full rounded-[2.5rem] overflow-hidden bg-[#22bedb] flex items-center justify-center shadow-2xl">
            <img
              src="/images/authImage.png"
              alt="Amrut Water Branding"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

      </div>
    </div>
  );
};

export default VerifyOtp;

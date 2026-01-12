import React, { useState } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-6">
      <div className="flex w-full max-w-6xl h-[85vh] bg-white rounded-[3rem] shadow-xl overflow-hidden">

        {/* LEFT SECTION */}
        <div className="w-full lg:w-1/2 flex items-center justify-center px-12 md:px-20">
          <div className="w-full max-w-md">

            {/* Branding */}
            <div className="flex items-center gap-4 mb-10">
              <div className="w-14 h-14 rounded-2xl bg-slate-800 flex items-center justify-center text-white text-2xl">
                💧
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-800 leading-none">
                  Amrut Water
                </h2>
                <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500 font-bold mt-1">
                  Smart Management
                </p>
              </div>
            </div>

            {/* Title */}
            <div className="mb-8">
              <h1 className="text-4xl font-extrabold text-slate-900 mb-4">
                Password Recovery
              </h1>
              <p className="text-slate-500 text-lg leading-relaxed">
                Enter your email below. We&apos;ll send you a 6-digit verification
                code to reset your account access safely.
              </p>
            </div>

            {/* FORM */}
            <div>
              {/* Email */}
              <InputText
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full p-4 rounded-2xl bg-gray-50 border border-slate-200 text-lg"
              />

              {/* SPACE BETWEEN INPUT & BUTTON */}
              <div className="mt-4"></div>

              {/* Button */}
              <Button
                label="Request Reset Password"
                className="w-full py-4 text-lg bg-slate-900 border-none rounded-2xl font-bold text-white hover:bg-slate-800 transition-all"
                onClick={() => navigate("/verify-otp")}
              />

              {/* Back to Login */}
              <div className="pt-6 text-center">
                <button
                  onClick={() => navigate("/login")}
                  className="text-slate-500 font-semibold hover:text-slate-800 flex items-center justify-center gap-2 mx-auto"
                >
                  <i className="pi pi-arrow-left text-sm" />
                  Back to Sign In
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* RIGHT IMAGE */}
        <div className="hidden lg:block lg:w-1/2 p-8">
          <div className="w-full h-full rounded-[2.5rem] overflow-hidden shadow-inner">
            <img
              src="/images/authImage.png"
              alt="Amrut Water Visual"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

      </div>
    </div>
  );
};

export default ForgotPassword;

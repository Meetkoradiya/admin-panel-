import React, { useState } from "react";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";

const CreateNewPassword = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&]).{6,}$/;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdatePassword = () => {
    const { newPassword, confirmPassword } = formData;

    if (!newPassword || !confirmPassword) {
      alert("Please fill both fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    if (!passwordRegex.test(newPassword)) {
      alert(
        "Password must be at least 6 characters long, include at least 1 letter, 1 number, and 1 special character."
      );
      return;
    }

    alert("Password updated successfully!");
    navigate("/login");
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

            {/* Title */}
            <div className="mb-8">
              <h1 className="text-3xl font-extrabold text-slate-900 mb-4">Create New Password</h1>
              <p className="text-slate-500 text-base leading-relaxed">
                Please create a strong password for your account to ensure security.
              </p>
            </div>

            {/* Password Form */}
            <div className="space-y-6">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-slate-700">New Password</label>
                <Password
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  toggleMask
                  feedback={false}
                  placeholder="Enter new password"
                  className="w-full"
                  inputClassName="w-full p-3.5 border rounded-lg focus:border-cyan-500 border-slate-200 bg-white"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-slate-700">Confirm Password</label>
                <Password
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  toggleMask
                  feedback={false}
                  placeholder="Confirm new password"
                  className="w-full"
                  inputClassName="w-full p-3.5 border rounded-lg focus:border-cyan-500 border-slate-200 bg-white"
                />
              </div>

              {/* ACTION BUTTONS WITH SPACING */}
              <div className="pt-6 space-y-6">
                <Button
                  label="Update Password"
                  className="w-full py-4 text-lg bg-[#06b6d4] border-none rounded-lg font-bold text-white hover:bg-cyan-600 shadow-lg shadow-cyan-100 transition-all active:scale-[0.98]"
                  onClick={handleUpdatePassword}
                />

                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="text-slate-400 font-semibold hover:text-slate-800 flex items-center justify-center gap-2 mx-auto mt-4 transition-colors bg-transparent border-none cursor-pointer"
                >
                  <i className="pi pi-arrow-left text-sm" />
                  Back to Sign In
                </button>
              </div>

            </div>
          </div>
        </div>

        {/* RIGHT IMAGE */}
        <div className="hidden lg:block lg:w-1/2 p-6">
          <div className="w-full h-full rounded-[3rem] overflow-hidden bg-[#22bedb] flex items-center justify-center relative shadow-sm">
            <img
              src="/images/authImage.png"
              alt="Security Illustration"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

      </div>
    </div>
  );
};

export default CreateNewPassword;

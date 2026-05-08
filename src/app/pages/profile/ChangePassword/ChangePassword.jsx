import Button from "@/components/ui/Button";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Toast } from "primereact/toast";
import { classNames } from "primereact/utils";
import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout, login } from "../../../../redux/slice/AuthSlice";
import axios from "axios";
import { showConfirmDialog } from "@/utils/confirmUtils";

const ChangePassword = () => {
  const toast = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const BASE_URL = import.meta.env.VITE_BACKEND_BASEURL;
  const [isLoading, setIsLoading] = useState(false);

  const token = useSelector((state) => state.auth.token);
  const auth = useSelector((state) => state.auth);

  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, value),
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    Object.entries(formData).forEach(([key, value]) => {
      const err = validateField(key, value);
      if (err) newErrors[key] = err;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateField = (name, value) => {
    if (name === "oldPassword" && !value.trim()) {
      return "Old Password is required";
    }

    if (name === "newPassword") {
      if (!value.trim()) {
        return "New Password is required";
      }
      if (value.length < 8) {
        return "New Password must be at least 8 characters long";
      }
    }

    if (name === "confirmPassword" && !value.trim()) {
      return "Confirm Password is required";
    }

    if (name === "confirmPassword" && value !== formData.newPassword) {
      return "Passwords do not match.";
    }

    return "";
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    showConfirmDialog({
      title: 'Update Password',
      message: 'Are you sure you want to change your login password?',
      acceptLabel: 'Update',
      type: 'edit',
      onAccept: () => performChange()
    });
  };

  const performChange = async () => {
    setIsLoading(true);

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      await axios.post(
        `${BASE_URL}/admin/change-password`,
        {
          oldPassword: formData.oldPassword,
          newPassword: formData.newPassword,
          confirmPassword: formData.confirmPassword,
        },
        config
      );

      // Auto login logic to prevent Session Expiry (401)
      try {
        const res = await axios.post(`${BASE_URL}/auth/login`, {
          mobileNumber: auth.userData?.mobileNumber,
          password: formData.newPassword,
        });
        const dataPayload = res.data?.data || res.data;
        if (dataPayload && dataPayload.accessToken) {
          const newToken = dataPayload.accessToken;
          const newRefreshToken = dataPayload.refreshToken;

          let newTime = 0;
          try {
            const decoded = JSON.parse(atob(newToken.split('.')[1]));
            newTime = decoded?.exp ? decoded.exp * 1000 : 0;
          } catch (decodeErr) {
            console.error("Token decode error:", decodeErr);
          }

          dispatch(
            login({
              token: newToken,
              refreshToken: newRefreshToken,
              time: newTime,
              userData: auth.userData,
            })
          );
        }
      } catch (autoErr) {
        console.error("Auto login failed", autoErr);
      }

      toast.current.show({
        severity: "success",
        detail: "Password Changed Successfully.",
        life: 2000,
      });

      setFormData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setTimeout(() => navigate("/"), 1500);

    } catch (error) {
      if (error?.response?.status === 401) {
        toast.current.show({
          severity: "warn",
          detail: "Session expired. Please log in again.",
          life: 1500,
        });

        setTimeout(() => {
          dispatch(logout());
          navigate("/login");
        }, 1500);
      } else if (error?.response?.status === 400) {
        toast.current.show({
          severity: "error",
          detail: error.response?.data?.message || "Invalid credentials !",
          life: 1500,
        });
      } else if (error?.response?.status === 500) {
        toast.current.show({
          severity: "warn",
          detail: "Internet connection lost. Check your network.",
          life: 2000,
        });
      } else {
        toast.current?.show({
          severity: "error",
          detail: "Something went wrong! Please try again.",
          life: 2000,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = () => {
    const hasErrors = Object.values(errors).some((e) => e);
    const hasEmptyRequired = [
      "oldPassword",
      "newPassword",
      "confirmPassword",
    ].some((key) => !formData[key]?.trim());
    return !hasErrors && !hasEmptyRequired;
  };

  return (
    <div className="p-4 md:p-8 bg-[#f8fafc] min-h-screen font-['Inter']">
      <Toast ref={toast} />
      
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <i className="pi pi-shield text-white text-base"></i>
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800 tracking-tight leading-none">Security</h1>
              <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-blue-500 mt-1">Protection</p>
            </div>
          </div>
          <button
            className="w-10 h-10 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center hover:bg-slate-50 transition-all active:scale-95 group"
            onClick={() => navigate("/")}
          >
            <i className="pi pi-home text-slate-400 group-hover:text-blue-500 text-sm transition-colors"></i>
          </button>
        </div>

        <div className="bg-white rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.02)] border border-slate-100 p-6 md:p-10 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-600" />
          
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Side */}
            <div className="lg:w-1/3">
              <h2 className="text-lg font-bold text-slate-800 mb-2 tracking-tight">Update Password</h2>
              <p className="text-slate-500 text-[12px] font-medium leading-relaxed mb-6">
                Keep your account secure with a strong password.
              </p>
              
              <div className="bg-blue-50/50 border border-blue-100 p-5 rounded-2xl">
                <h3 className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-3">Rules</h3>
                <ul className="space-y-2">
                  {["8+ characters", "Numbers/Symbols", "Unique"].map((req, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-[11px] font-bold text-slate-600">
                      <i className="pi pi-check text-blue-500 text-[8px]" />
                      {req}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right Side */}
            <div className="lg:w-2/3 p-fluid flex flex-col gap-4">
              <div className="field">
                <label className="text-[12px] font-bold text-slate-500 mb-1.5 block ml-1">Current Password</label>
                <Password
                  id="oldPassword"
                  name="oldPassword"
                  toggleMask
                  feedback={false}
                  value={formData.oldPassword}
                  onChange={handleInputChange}
                  inputClassName={`w-full p-3.5 bg-slate-50 border-slate-100 rounded-xl font-bold text-slate-700 focus:bg-white focus:ring-4 focus:ring-blue-500/5 transition-all text-sm ${errors.oldPassword ? "border-red-400" : ""}`}
                  className="w-full"
                />
                {errors.oldPassword && <small className="text-red-500 font-bold ml-1 mt-1 block text-[10px]">{errors.oldPassword}</small>}
              </div>

              <div className="field">
                <label className="text-[12px] font-bold text-slate-500 mb-1.5 block ml-1">New Password</label>
                <Password
                  id="newPassword"
                  name="newPassword"
                  toggleMask
                  feedback={true}
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  inputClassName={`w-full p-3.5 bg-slate-50 border-slate-100 rounded-xl font-bold text-slate-700 focus:bg-white focus:ring-4 focus:ring-blue-500/5 transition-all text-sm ${errors.newPassword ? "border-red-400" : ""}`}
                  className="w-full"
                />
                {errors.newPassword && <small className="text-red-500 font-bold ml-1 mt-1 block text-[10px]">{errors.newPassword}</small>}
              </div>

              <div className="field">
                <label className="text-[12px] font-bold text-slate-500 mb-1.5 block ml-1">Confirm New Password</label>
                <Password
                  id="confirmPassword"
                  name="confirmPassword"
                  toggleMask
                  feedback={false}
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  disabled={!formData.newPassword.trim()}
                  inputClassName={`w-full p-3.5 bg-slate-50 border-slate-100 rounded-xl font-bold text-slate-700 focus:bg-white focus:ring-4 focus:ring-blue-500/5 transition-all disabled:opacity-50 text-sm ${errors.confirmPassword ? "border-red-400" : ""}`}
                  className="w-full"
                />
                {errors.confirmPassword && <small className="text-red-500 font-bold ml-1 mt-1 block text-[10px]">{errors.confirmPassword}</small>}
              </div>

              <div className="flex justify-between items-center mt-4 pt-6 border-t border-slate-100">
                <button
                  type="button"
                  className="text-slate-400 font-bold text-[10px] uppercase tracking-widest hover:text-blue-600 transition-colors"
                  onClick={() => navigate("/forgot-password")}
                >
                  Forgot?
                </button>
                
                <Button
                  label="Update Password"
                  loading={isLoading}
                  onClick={handleSubmit}
                  disabled={!isFormValid() || isLoading}
                  variant="primary"
                  className="px-8 py-3 text-xs uppercase tracking-widest"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;




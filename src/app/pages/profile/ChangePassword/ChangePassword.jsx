import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Toast } from "primereact/toast";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { classNames } from "primereact/utils";
import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout, login } from "../../../../redux/slice/AuthSlice";
import axios from "axios";

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

    confirmDialog({
      message: 'Are you sure you want to change your password?',
      header: 'Confirm Password Change',
      icon: 'pi pi-exclamation-triangle',
      acceptClassName: 'p-button-danger',
      accept: () => performChange()
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
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <Toast ref={toast} />
      <ConfirmDialog className="rounded-2xl" />
      
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Security Settings</h1>
          <div
            className="bg-white rounded-xl shadow-sm p-3 border border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer text-gray-600 flex items-center"
            onClick={() => navigate("/")}
            title="Go to Dashboard"
          >
            <i className="pi pi-list font-bold"></i>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-10">
          <div className="flex flex-col lg:flex-row gap-12">
            
            {/* Left Description Side */}
            <div className="lg:w-1/3">
              <h2 className="text-xl font-bold text-gray-800 mb-3">Update your password</h2>
              <p className="text-gray-500 text-sm leading-relaxed mb-6">
                Ensure your account is using a long, random password to stay secure. We recommend using a password manager.
              </p>
              
              <div className="bg-cyan-50 border border-cyan-100 p-5 rounded-2xl">
                <h3 className="text-sm font-semibold text-cyan-800 mb-3">Password Requirements:</h3>
                <ul className="text-xs text-cyan-700 space-y-2 list-disc pl-4 font-medium">
                  <li>Minimum 8 characters long</li>
                  <li>At least one number or symbol</li>
                  <li>Do not use personal information</li>
                </ul>
              </div>
            </div>

            {/* Right Form Side */}
            <div className="lg:w-2/3 max-w-lg p-fluid flex flex-col gap-6 w-full">
              <div className="field">
                <label htmlFor="oldPassword" className="text-sm font-bold text-gray-700 mb-2 block">Current Password</label>
                <Password
                  id="oldPassword"
                  name="oldPassword"
                  type="text"
                  toggleMask
                  feedback={false}
                  value={formData.oldPassword}
                  onChange={handleInputChange}
                  inputClassName="p-4 bg-gray-50 border-none rounded-xl w-full font-medium focus:bg-white focus:ring-2 focus:ring-cyan-200 transition-all text-gray-800"
                  className={classNames("w-full rounded-xl shadow-sm", { "p-invalid": errors.oldPassword })}
                />
                {errors.oldPassword && (
                  <small className="p-error block mt-2 font-medium">{errors.oldPassword}</small>
                )}
              </div>

              <div className="field">
                <label htmlFor="newPassword" className="text-sm font-bold text-gray-700 mb-2 block">New Password</label>
                <Password
                  id="newPassword"
                  name="newPassword"
                  toggleMask
                  feedback={true}
                  type="text"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  inputClassName="p-4 bg-gray-50 border-none rounded-xl w-full font-medium focus:bg-white focus:ring-2 focus:ring-cyan-200 transition-all text-gray-800"
                  className={classNames("w-full rounded-xl shadow-sm", { "p-invalid": errors.newPassword })}
                />
                {errors.newPassword && (
                  <small className="p-error block mt-2 font-medium">{errors.newPassword}</small>
                )}
              </div>

              <div className="field">
                <label htmlFor="confirmPassword" className="text-sm font-bold text-gray-700 mb-2 block">Confirm New Password</label>
                <Password
                  id="confirmPassword"
                  name="confirmPassword"
                  toggleMask
                  feedback={false}
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  disabled={!formData.newPassword.trim()}
                  inputClassName="p-4 bg-gray-50 border-none rounded-xl w-full font-medium focus:bg-white focus:ring-2 focus:ring-cyan-200 transition-all disabled:opacity-50 text-gray-800"
                  className={classNames("w-full rounded-xl shadow-sm", { "p-invalid": errors.confirmPassword })}
                />
                {errors.confirmPassword && (
                  <small className="p-error block mt-2 font-medium">
                    {errors.confirmPassword}
                  </small>
                )}
              </div>

              <div className="flex justify-between items-center mt-6 pt-6 border-t border-gray-100">
                <div
                  className="text-cyan-600 text-sm font-bold hover:text-cyan-700 hover:underline cursor-pointer transition-colors"
                  onClick={() => navigate("/forgot-password")}
                >
                  Forgot password?
                </div>
                
                <Button
                  type="button"
                  label="Change Password"
                  className="bg-cyan-500 text-white border-none px-6 py-3 rounded-xl font-bold shadow-md shadow-cyan-100 hover:bg-cyan-600 transition-all flex items-center justify-center"
                  onClick={handleSubmit}
                  disabled={!isFormValid() || isLoading}
                  loading={isLoading}
                  icon={isLoading ? "pi pi-cog pi-spin" : "pi pi-check"}
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

import axios from "axios";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Toast } from "primereact/toast";
import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../../../redux/slice/AuthSlice";

const ChangePassword = () => {
  const toast = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const BASE_URL = import.meta.env.VITE_BACKEND_BASEURL;
  const [isLoading, setIsLoading] = useState(false);
  const superAdminToken = useSelector((state) => state.auth.token);
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

    setIsLoading(true);

    const config = {
      headers: {
        Authorization: `Bearer ${superAdminToken}`,
      },
    };

    axios
      .post(`${BASE_URL}/users/change-password`, formData, config)
      .then(() => {
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
      })
      .catch((error) => {
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
            detail: error.response.data.message || "Invalid credintials !",
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
            detail: "Something went wrong ! login again.",
            life: 2000,
          });
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
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
    <>
      <Toast ref={toast} />
      <div className="card flex justify-content-between align-items-center mb-3">
        <div className="font-bold text-lg">Change Password</div>
        <div
          className="hover:bg-gray-200 transition-colors p-1 border-round cursor-pointer"
          onClick={() => navigate("/")}
        >
          <i className="pi pi-list" style={{ fontSize: "1.3rem" }} />
        </div>
      </div>

      <div className="grid">
        <div className="col-12">
          <div className="card p-fluid">
            <div>
              <p className="font-bold text-sm text-[var(--primary-color)]">
                Password
              </p>
            </div>
            <hr />

            <div className="card-data md:flex justify-between">
              <div className="field grid md:col-4 col-12">
                <label htmlFor="oldPassword">Old Password</label>
                <Password
                  id="oldPassword"
                  name="oldPassword"
                  type="text"
                  toggleMask
                  feedback={false}
                  onChange={handleInputChange}
                />
                {errors.oldPassword && (
                  <small className="p-error block">{errors.oldPassword}</small>
                )}
              </div>

              <div className="field grid md:col-4 col-12">
                <label htmlFor="newPassword">New Password</label>
                <Password
                  id="newPassword"
                  name="newPassword"
                  toggleMask
                  feedback={false}
                  type="text"
                  onChange={handleInputChange}
                />
                {errors.newPassword && (
                  <small className="p-error block">{errors.newPassword}</small>
                )}
              </div>

              <div className="field grid md:col-4 col-12">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <Password
                  id="confirmPassword"
                  name="confirmPassword"
                  toggleMask
                  feedback={false}
                  onChange={handleInputChange}
                  disabled={!formData.newPassword.trim()}
                />
                {errors.confirmPassword && (
                  <small className="p-error block">
                    {errors.confirmPassword}
                  </small>
                )}
              </div>
            </div>

            <div className="flex col-12 justify-between align-items-center">
              <div
                className="text-[var(--primary-color)] text-sm font-bold hover:underline cursor-pointer"
                onClick={() => navigate("/forgot-password")}
              >
                Forgot password ?
              </div>
              <div className="submit-btn">
                <Button
                  type="submit"
                  className=" flex items-center justify-center text-xs font-bold"
                  onClick={handleSubmit}
                  disabled={!isFormValid() || isLoading}
                  loading={isLoading}
                  icon="pi pi-cog pi-spin"
                >
                  Change Password
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChangePassword;

import axios from "axios";
import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { Password } from "primereact/password";
import { classNames } from "primereact/utils";
import { logout } from "../../../../redux/slice/AuthSlice";

const ChangePassword = () => {
  const toast = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const BASE_URL = import.meta.env.VITE_BACKEND_BASEURL;
  const token = useSelector((state) => state.auth.token);

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};

    if (!form.currentPassword.trim())
      newErrors.currentPassword = "Current password is required";

    if (!form.newPassword.trim())
      newErrors.newPassword = "New password is required";
    else if (form.newPassword.length < 8)
      newErrors.newPassword = "Password must be at least 8 characters";

    if (!form.confirmPassword.trim())
      newErrors.confirmPassword = "Confirm password is required";
    else if (form.confirmPassword !== form.newPassword)
      newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      setLoading(true);

      await axios.post(
        `${BASE_URL}/users/change-password`,
        {
          oldPassword: form.currentPassword,
          newPassword: form.newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: "Password changed successfully",
        life: 2000,
      });

      setForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setTimeout(() => navigate("/master/profile"), 1500);
    } catch (error) {
      if (error?.response?.status === 401) {
        toast.current.show({
          severity: "warn",
          summary: "Session Expired",
          detail: "Please login again",
          life: 2000,
        });
        dispatch(logout());
        navigate("/login");
      } else {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail:
            error?.response?.data?.message || "Failed to change password",
          life: 2500,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-6">
      <Toast ref={toast} />

      <div className="card max-w-2xl mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-1">Password</h2>
          <p className="text-gray-500 text-sm">
            Keep your account safe with a strong password.
          </p>
        </div>

        <div className="p-fluid flex flex-col gap-5">
          {/* Current Password */}
          <div className="field">
            <label className="font-medium mb-2 block">Current password</label>
            <Password
              name="currentPassword"
              value={form.currentPassword}
              onChange={onChange}
              toggleMask
              feedback={false}
              className={classNames("w-full", {
                "p-invalid": errors.currentPassword,
              })}
            />
            {errors.currentPassword && (
              <small className="p-error">{errors.currentPassword}</small>
            )}
          </div>

          {/* New Password */}
          <div className="field">
            <label className="font-medium mb-2 block">New password</label>
            <Password
              name="newPassword"
              value={form.newPassword}
              onChange={onChange}
              toggleMask
              className={classNames("w-full", {
                "p-invalid": errors.newPassword,
              })}
            />
            {errors.newPassword && (
              <small className="p-error">{errors.newPassword}</small>
            )}
          </div>

          {/* Confirm Password */}
          <div className="field">
            <label className="font-medium mb-2 block">Confirm new password</label>
            <Password
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={onChange}
              toggleMask
              feedback={false}
              className={classNames("w-full", {
                "p-invalid": errors.confirmPassword,
              })}
            />
            {errors.confirmPassword && (
              <small className="p-error">{errors.confirmPassword}</small>
            )}
          </div>

          <div className="flex justify-end mt-4">
            <Button
              label="Save Changes"
              icon="pi pi-check"
              loading={loading}
              onClick={handleSubmit}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;

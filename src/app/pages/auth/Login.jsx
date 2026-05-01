import { useDispatch } from "react-redux";
import { useRef, useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { Password } from "primereact/password";
import { InputText } from "primereact/inputtext";
import { Checkbox } from "primereact/checkbox";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { login } from "../../../redux/slice/AuthSlice";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useRef(null);

  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    mobileNumber: localStorage.getItem("rememberedMobile") || "",
    password: "",
  });

  useEffect(() => {
    if (localStorage.getItem("rememberedMobile")) {
      setRememberMe(true);
    }
  }, []);

  const BASE_URL = import.meta.env.VITE_BACKEND_BASEURL;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
    setErrors((p) => ({ ...p, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.mobileNumber) newErrors.mobileNumber = "Mobile Number is required";
    else if (!/^\d{10}$/.test(formData.mobileNumber)) newErrors.mobileNumber = "Enter a valid 10-digit mobile number";

    if (!formData.password) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      const enteredMobile = formData.mobileNumber.trim();
      const password = formData.password.trim();

      // Step 1: Try /auth/master-admin-login first.
      // This endpoint is for master admin and returns a JWT with MASTER_ADMIN role.
      // Master admin credentials: 7600804920 / Admin@1234
      let res;
      let usedMasterEndpoint = false;
      try {
        // We attempt master login first. If it fails with 403/401, it's likely a regular admin.
        res = await axios.post(`${BASE_URL}/auth/master-admin-login`, {
          mobileNumber: enteredMobile,
          password,
        });
        usedMasterEndpoint = true;
      } catch (masterErr) {
        const status = masterErr.response?.status;
        if ([400, 401, 403, 404].includes(status)) {
          // Fallback to regular admin login silently
          res = await axios.post(`${BASE_URL}/auth/login`, {
            mobileNumber: enteredMobile,
            password,
          });
        } else {
          throw masterErr;
        }
      }

      const dataPayload = res.data?.data || res.data;

      // Master admin endpoint returns access_token; regular login returns accessToken
      const token = dataPayload?.access_token || dataPayload?.accessToken;
      if (!token) {
        throw new Error("Invalid response from server — no token received");
      }

      const refreshToken = dataPayload.refreshToken || dataPayload.refresh_token || null;
      const apiRoleFromResponse = dataPayload.role || null;

      const decoded = jwtDecode(token);
      const userId = decoded?.userId || decoded?.sub;

      let userData = dataPayload.user || dataPayload.admin || {};

      // Fallback: fetch user profile from /admin/users
      if (!userData || Object.keys(userData).length === 0) {
        try {
          const userRes = await axios.get(`${BASE_URL}/admin/users?id=${userId}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          const fetched = userRes.data?.data || userRes.data;
          userData = Array.isArray(fetched) && fetched.length > 0 ? fetched[0] : fetched || {};
        } catch (e) {
          console.warn("User fallback failed", e);
          userData = {};
        }
      }

      if (!userData || typeof userData !== "object") userData = {};

      // Role detection: master endpoint success OR role in response OR JWT/userData claim
      const apiRole = apiRoleFromResponse || decoded?.role || userData?.role || "";
      const isMaster =
        usedMasterEndpoint ||
        userData?.masterAdmin === true ||
        apiRole === "MASTER_ADMIN" ||
        apiRole?.toUpperCase() === "MASTER";

      userData.role = isMaster ? "MASTER_ADMIN" : "ADMIN";
      userData.masterAdmin = isMaster;

      if (rememberMe) {
        localStorage.setItem("rememberedMobile", enteredMobile);
      } else {
        localStorage.removeItem("rememberedMobile");
      }

      const time = decoded?.exp ? decoded.exp * 1000 : 0;

      dispatch(login({
        token,
        refreshToken,
        time,
        userData: {
          ...userData,
          userId,
          mobileNumber: userData.mobileNumber || enteredMobile,
        }
      }));

      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: "Login successful",
        life: 2000,
      });

      if (userData.role === "MASTER_ADMIN") {
        navigate("/master/dashboard", { replace: true });
      } else if (userData.role === "ADMIN") {
        navigate("/admin/dashboard", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Login Failed. Please check your credentials.";
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: errorMessage,
        life: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f4f7fe] p-6 font-['Inter']">
      <Toast ref={toast} />

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
                <linearGradient id="logo-grad-login" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#1d4ed8" />
                </linearGradient>
              </defs>
              <circle cx="12" cy="13" r="9" stroke="url(#logo-grad-login)" strokeWidth="0.5" strokeDasharray="4 2" opacity="0.4" />
              <path
                d="M12 3C12 3 6 10 6 14.5C6 18.0899 8.68629 21 12 21C15.3137 21 18 18.0899 18 14.5C18 10 12 3 12 3Z"
                fill="url(#logo-grad-login)"
              />
              <path
                d="M12 6C12 6 8.5 10.5 8.5 14C8.5 15.933 10.067 17.5 12 17.5C13.933 17.5 15.5 15.933 15.5 14C15.5 10.5 12 6 12 6Z"
                fill="white"
                fillOpacity="0.25"
              />
              <circle cx="14" cy="10" r="1.5" fill="white" fillOpacity="0.4" />
            </svg>
          </div>
          <span className="text-3xl font-black text-slate-800 tracking-tight">Amrut Water</span>
        </div>
        <div className="flex items-center gap-1.5 mt-1">
          <div className="h-[2px] w-3 bg-blue-500 rounded-full" />
          <span className="text-[10px] font-black uppercase tracking-[0.25em] text-blue-600">Premium Quality</span>
        </div>
      </div>

      {/* Main Login Card */}
      <div className="w-full max-w-[480px] bg-white rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100 overflow-hidden">
        <div className="p-10 md:p-12">
          <div className="mb-10">
            <h1 className="text-2xl font-black text-slate-900 mb-2">Welcome back</h1>
            <p className="text-sm font-medium text-slate-400">Enter your credentials to access your dashboard</p>
          </div>

          <div className="space-y-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-slate-500 ml-1">Phone Number</label>
              <InputText
                name="mobileNumber"
                value={formData.mobileNumber}
                onChange={(e) => {
                  const val = e.target.value;
                  if (/^\d*$/.test(val) && val.length <= 10) {
                    setFormData((p) => ({ ...p, mobileNumber: val }));
                    setErrors((p) => ({ ...p, mobileNumber: "" }));
                  }
                }}
                placeholder="9712705145"
                className={`w-full p-4 rounded-xl bg-slate-50 border-slate-200 text-slate-700 font-bold focus:bg-white focus:ring-4 focus:ring-blue-50 transition-all ${errors.mobileNumber ? "border-red-400" : ""}`}
              />
              {errors.mobileNumber && <small className="text-red-500 font-bold ml-1">{errors.mobileNumber}</small>}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-slate-500 ml-1">Password</label>
              <Password
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                toggleMask
                feedback={false}
                placeholder="••••••••"
                className="w-full"
                inputClassName={`w-full p-4 rounded-xl bg-slate-50 border-slate-200 text-slate-700 font-bold focus:bg-white focus:ring-4 focus:ring-blue-50 transition-all ${errors.password ? "border-red-400" : ""}`}
              />
              {errors.password && <small className="text-red-500 font-bold ml-1">{errors.password}</small>}
            </div>

            <div className="flex justify-between items-center py-2">
              <div className="flex items-center gap-2">
                <Checkbox inputId="rememberMe" checked={rememberMe} onChange={(e) => setRememberMe(e.checked)} className="scale-110" />
                <label htmlFor="rememberMe" className="text-sm text-slate-600 font-bold cursor-pointer">Remember me</label>
              </div>
              <Link to="/forgot-password" title="Recover Password" className="text-sm text-blue-600 font-black hover:underline tracking-tight">Forgot password?</Link>
            </div>

            <Button
              label="Sign In"
              loading={isLoading}
              onClick={handleLogin}
              className="w-full py-4 text-base bg-blue-500 border-none rounded-xl font-black text-white hover:bg-blue-600 shadow-lg shadow-blue-500/20 transition-all active:scale-[0.98] mt-2"
            />
          </div>
        </div>

        {/* Card Bottom Footer */}
        <div className="bg-slate-50/80 p-5 flex items-center justify-center gap-2 border-t border-slate-100">
          <i className="pi pi-lock text-slate-400 text-xs" />
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Your data is encrypted and secure</span>
        </div>
      </div>

      {/* Page Bottom Footer Links */}
      <div className="mt-12 flex items-center gap-6">
        <Link to="/privacy-policy" className="text-xs font-bold text-slate-400 hover:text-slate-600 transition-all">Privacy policy</Link>
        <div className="w-[1px] h-3 bg-slate-300" />
        <Link to="/terms" className="text-xs font-bold text-slate-400 hover:text-slate-600 transition-all">Terms &amp; condition</Link>
      </div>
    </div>
  );
};

export default Login;
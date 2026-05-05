import { useDispatch } from "react-redux";
import { useRef, useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Toast } from "primereact/toast";
import Button from "@/components/ui/Button";
import { Password } from "primereact/password";
import { InputText } from "primereact/inputtext";
import { Checkbox } from "primereact/checkbox";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { login } from "../../../redux/slice/AuthSlice";
const Logo = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z" />
    <path d="M12.56 6.6A10.97 10.97 0 0 0 14 3.02c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a6.98 6.98 0 0 1-11.91 4.97" />
  </svg>
);

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
        throw new Error("Invalid response from server â€” no token received");
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
            <Logo
              className="w-12 h-12 relative z-10 text-gray-500"
            />
          </div>
          <span className="text-3xl font-bold text-slate-800 tracking-tight">Amrut Water</span>
        </div>
        <div className="flex items-center gap-3 mt-2">
          <div className="h-[1.5px] w-6 bg-blue-500/40 rounded-full" />
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-blue-600/80">Trust in Every Drop</span>
          <div className="h-[1.5px] w-6 bg-blue-500/40 rounded-full" />
        </div>
      </div>

      {/* Main Login Card */}
      <div className="w-full max-w-110 bg-white rounded-4xl shadow-[0_20px_60px_rgba(0,0,0,0.05)] border border-slate-50 overflow-hidden">
        <div className="p-10 md:p-14">
          <div className="mb-12">
            <h1 className="text-3xl font-extrabold text-slate-900 mb-3 tracking-tight">Welcome back</h1>
            <p className="text-sm font-medium text-slate-400 leading-relaxed">Enter your credentials to access your dashboard</p>
          </div>

          <div className="space-y-8">
            <div className="flex flex-col gap-3">
              <label className="text-[13px] font-bold text-slate-500 ml-1">Phone Number</label>
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
                className={`w-full p-4 rounded-2xl bg-slate-50/50 border-slate-100 text-slate-700 font-bold focus:bg-white focus:ring-4 focus:ring-blue-50 transition-all ${errors.mobileNumber ? "border-red-400" : ""}`}
              />
              {errors.mobileNumber && <small className="text-red-500 font-bold ml-1 mt-1">{errors.mobileNumber}</small>}
            </div>

            <div className="flex flex-col gap-3">
              <label className="text-[13px] font-bold text-slate-500 ml-1">Password</label>
              <Password
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                toggleMask
                feedback={false}
                placeholder="••••••••"
                className="w-full"
                inputClassName={`w-full p-4 rounded-2xl bg-slate-50/50 border-slate-100 text-slate-700 font-bold focus:bg-white focus:ring-4 focus:ring-blue-50 transition-all ${errors.password ? "border-red-400" : ""}`}
              />
              {errors.password && <small className="text-red-500 font-bold ml-1 mt-1">{errors.password}</small>}
            </div>

            <div className="flex justify-between items-center py-1">
              <div className="flex items-center gap-3">
                <Checkbox inputId="rememberMe" checked={rememberMe} onChange={(e) => setRememberMe(e.checked)} className="scale-110" />
                <label htmlFor="rememberMe" className="text-sm text-slate-600 font-bold cursor-pointer">Remember me</label>
              </div>
              <Link to="/forgot-password" title="Recover Password" className="text-sm text-blue-600 font-bold hover:underline tracking-tight">Forgot password?</Link>
            </div>

            <div className="pt-4">
                <Button
                label="Sign In"
                loading={isLoading}
                onClick={handleLogin}
                variant="primary"
                size="lg"
                className="w-full h-14.5 text-lg font-bold bg-[#3b82f6] hover:bg-[#2563eb] rounded-full shadow-lg shadow-blue-500/20 transition-all border-none"
                />
            </div>
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
        <div className="w-px h-3 bg-slate-300" />
        <Link to="/terms" className="text-xs font-bold text-slate-400 hover:text-slate-600 transition-all">Terms &amp; condition</Link>
      </div>
    </div>
  );
};

export default Login;



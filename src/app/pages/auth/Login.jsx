import { useDispatch } from "react-redux";
import { useRef, useState } from "react";
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
    mobileNumber: "",
    password: "",
  });

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
        res = await axios.post(`${BASE_URL}/auth/master-admin-login`, {
          mobileNumber: enteredMobile,
          password,
        });
        usedMasterEndpoint = true;
      } catch (masterErr) {
        const status = masterErr.response?.status;
        // Credential mismatch (not master admin) → fallback to regular admin login
        if ([400, 401, 403, 404].includes(status)) {
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
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <Toast ref={toast} />

      <div className="flex w-full max-w-6xl h-[90vh] rounded-3xl shadow-2xl overflow-hidden bg-white">

        <div className="w-full lg:w-1/2 flex items-center justify-center px-10 bg-white">
          <div className="w-full max-w-md">

            <div className="flex items-center gap-4 mb-10">
              <div className="w-12 h-12 rounded-xl bg-[#1e293b] flex items-center justify-center text-[#22bedb] text-xl shadow-sm">
                💧
              </div>
              <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
                Amrut Water
              </h2>
            </div>

            <h1 className="text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">
              Welcome Back
            </h1>
            <p className="text-gray-400 mb-8 font-medium">
              Sign in to manage your water system
            </p>

            <div className="mb-5">
              <label className="text-sm font-bold text-gray-500">Mobile Number</label>
              <InputText
                name="mobileNumber"
                value={formData.mobileNumber}
                onChange={(e) => {
                  const val = e.target.value;
                 
                  if (/^\d{0,10}$/.test(val)) {
                    setFormData((p) => ({ ...p, mobileNumber: val }));
                    setErrors((p) => ({ ...p, mobileNumber: "" }));
                  }
                }}
                placeholder="Enter mobile number"
                className={`w-full mt-2 p-4 rounded-xl bg-gray-50 border-slate-200 focus:bg-white transition-all ${errors.mobileNumber ? "border-red-400" : ""}`}
              />
              {errors.mobileNumber && <small className="text-red-500 font-semibold">{errors.mobileNumber}</small>}
            </div>

            <div className="mb-5">
              <label className="text-sm font-bold text-gray-500">Password</label>
              <Password
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                toggleMask
                feedback={false}
                placeholder="••••••••"
                className="w-full mt-2"
                inputClassName={`w-full p-4 rounded-xl bg-gray-50 border-slate-200 focus:bg-white transition-all ${errors.password ? "border-red-400" : ""}`}
              />
              {errors.password && <small className="text-red-500 font-semibold">{errors.password}</small>}
            </div>

            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-2">
                <Checkbox checked={rememberMe} onChange={(e) => setRememberMe(e.checked)} />
                <span className="text-sm text-gray-600 font-medium">Remember me</span>
              </div>
              <Link
                to="/forgot-password"
                className="text-sm text-cyan-600 font-bold hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              label="Sign In"
              loading={isLoading}
              onClick={handleLogin}
              className="w-full py-4 text-lg bg-cyan-500 border-none rounded-xl font-bold text-white hover:bg-cyan-600 shadow-lg shadow-cyan-100 transition-all active:scale-[0.98]"
            />
          </div>
        </div>

        {/* RIGHT SECTION: IMAGE */}
        <div className="hidden lg:block lg:w-1/2 relative">
          <img
            src="/images/authImage.png"
            alt="Auth Background"
            className="w-full h-full object-cover"
          />
        </div>

      </div>
    </div>
  );
};

export default Login;
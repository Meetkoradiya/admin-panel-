import { useDispatch } from "react-redux";
import { useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { Password } from "primereact/password";
import { InputText } from "primereact/inputtext";
import { Checkbox } from "primereact/checkbox";
import { login } from "../../../redux/slice/AuthSlice";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useRef(null);

  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    username: "admin@gmail.com",
    password: "admin@123",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
    setErrors((p) => ({ ...p, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username) newErrors.username = "Username is required";
    if (!formData.password) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = () => {
    if (!validateForm()) return;
    setIsLoading(true);

    setTimeout(() => {
      const response = {
        data: {
          data: {
            masterAdmin: true,
            role: "MASTER_ADMIN",
            token: "token",
            refreshToken: "refresh",
            email: formData.username,
          },
        },
      };

      dispatch(
        login({
          token: response.data.data.token,
          refreshToken: response.data.data.refreshToken,
          userData: response.data.data,
        })
      );

      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: "Login successful",
        life: 2000,
      });

      setTimeout(() => navigate("/master/dashboard"), 1200);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <Toast ref={toast} />

      <div className="flex w-full max-w-6xl h-[90vh] rounded-3xl shadow-2xl overflow-hidden bg-white">
        
        {/* LEFT SECTION: FORM */}
        <div className="w-full lg:w-1/2 flex items-center justify-center px-10 bg-white">
          <div className="w-full max-w-md">
            
            {/* UPDATED BRANDING SECTION AS PER SCREENSHOT */}
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
              <label className="text-sm font-bold text-gray-500">Username</label>
              <InputText
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="Enter email or username"
                className={`w-full mt-2 p-4 rounded-xl bg-gray-50 border-slate-200 focus:bg-white transition-all ${errors.username ? "border-red-400" : ""}`}
              />
              {errors.username && <small className="text-red-500 font-semibold">{errors.username}</small>}
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
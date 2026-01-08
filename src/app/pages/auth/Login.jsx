import axios from "axios";
import { useDispatch } from "react-redux";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { Password } from "primereact/password";
import { Checkbox } from "primereact/checkbox";
import { InputText } from "primereact/inputtext";
import { login } from "../../../redux/slice/AuthSlice";
import AuthImage from "../../../assets/auth-side-bg.png";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useRef(null);

  const passwordRef = useRef(null);
  const signInButtonRef = useRef(null);

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [checked, setChecked] = useState(false);
  const [formData, setFormData] = useState({
    username: "admin@gmail.com",
    password: "admin@123",
  });

  const BASE_URL = import.meta.env.VITE_BACKEND_BASEURL;

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, value),
    }));
  };

  const handleKeyDown = (e, field) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (field === "username" && passwordRef.current) {
        passwordRef.current.focus();
      } else if (field === "password" && signInButtonRef.current) {
        signInButtonRef.current.click();
      }
    }
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
    if (name === "username" && !value.trim()) {
      return "Username is required.";
    }

    if (name === "password" && !value.trim()) {
      return "Password is required.";
    }

    return "";
  };

  const handleLogin = () => {
    if (!validateForm()) return;

    setIsLoading(true);

    // Simulate API call delay
    setTimeout(() => {
      // --- DUMMY API RESPONSE ---
      const dummyResponse = {
        data: {
          status: true,
          message: "Login successful",
          data: {
            admin: true,
            role: "MASTER_ADMIN",
            masterAdmin: true,
            token:
              "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI5NzEyNzA1MTQ0IiwiaWF0IjoxNzU5ODE1MzE2LCJleHAiOjE3NTk4MTg5MTZ9.v04hsqhU6j9eJirRj1SDhrR-zFjqA-92gLomadGketI",
            refreshToken:
              "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI5NzEyNzA1MTQ0IiwiaWF0IjoxNzU5ODE1MzE2LCJleHAiOjE3NjA0MjAxMTZ9.l3CdV3KK5BmZSKgtpA0ESvu9MPH3QWDZDuuffo1tTYo",
            userName: "Admin User",
            email: formData.username,
          },
        },
      };

      const response = dummyResponse;

      // --- Your existing logic reused ---
      if (
        response.data.data.masterAdmin === true &&
        response.data.data.role === "MASTER_ADMIN"
      ) {
        dispatch(
          login({
            token: response?.data?.data?.token || "",
            refreshToken: response?.data?.data?.refreshToken,
            userData: response?.data?.data || {},
          }),
        );

        sessionStorage.setItem("loginSuccess", "Logged in successfully");

        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "Logged in successfully!",
          life: 2000,
        });

        setTimeout(() => {
          navigate("/master/dashboard"); // navigate to Master Dashboard
        }, 1500);
      } else if (
        response.data.data?.masterAdmin === false &&
        response.data.data?.role === "MASTER_ADMIN"
      ) {
        toast.current.show({
          severity: "info",
          detail: "Support approval is required before login.",
          life: 2000,
        });
      } else if (response.data.data?.role === "ADMIN") {
        dispatch(
          login({
            token: response?.data?.data?.token || "",
            refreshToken: response?.data?.data?.refreshToken,
            userData: response?.data?.data || {},
          }),
        );

        sessionStorage.setItem("loginSuccess", "Logged in successfully");

        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "Logged in successfully!",
          life: 2000,
        });

        setTimeout(() => {
          navigate("/admin/dashboard"); // navigate to Admin Dashboard
        }, 1500);
      } else if (
        response.data.data?.admin === false &&
        response.data.data?.role !== "ADMIN"
      ) {
        toast.current.show({
          severity: "warn",
          summary: "Access Denied",
          detail: "You are not authorized to access the system.",
          life: 2000,
        });
      } else {
        toast.current.show({
          severity: "error",
          detail: "Server error, please try again later!",
          life: 2000,
        });
      }

      setIsLoading(false);
    }, 1200); // simulate ~1.2s API delay
  };

  return (
    <>
      <Toast ref={toast} />

      <div className="flex h-screen flex-auto flex-col">
        <div className="flex h-full bg-white p-6 dark:bg-gray-800">
          <div className="flex flex-1 flex-col items-center justify-center">
            <div className="w-full max-w-95 px-8 lg:max-w-112.5">
              <div className="mb-8">
                <div className="logo" style={{ width: "60px" }}>
                  <img
                    className="mx-auto"
                    alt="Water logo"
                    src="/img/logo/logo-light-streamline.png"
                  />
                </div>
              </div>
              <div className="mb-10">
                <h2 className="mb-2">Welcome back!</h2>
                <p className="heading-text font-semibold">
                  Please enter your credentials to sign in!
                </p>
              </div>
              <div>
                <form onSubmit={handleLogin}>
                  <div className="form-container vertical">
                    <div className="form-item vertical">
                      <label className="form-label mb-2">Username</label>
                      <div className="">
                        <InputText
                          placeholder="Username"
                          autoComplete="off"
                          value={formData.username}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              username: e.target.value,
                            })
                          }
                          name="username"
                        />
                      </div>
                    </div>
                    <div className="form-item vertical mb-0">
                      <label className="form-label mb-2">Password</label>
                      <div className="">
                        <span className="input-wrapper">
                          <Password
                            placeholder="Password"
                            autoComplete="off"
                            value={formData.password}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                password: e.target.value,
                              })
                            }
                            name="password"
                            toggleMask
                          />
                          {/* <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            autoComplete="off"
                            value={formData.password}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                password: e.target.value,
                              })
                            }
                            name="password"
                            style={{ paddingRight: "2.25rem" }}
                            className="p-inputtext p-component"
                          />
                          {showPassword ? (
                            <span
                              onClick={() => setShowPassword(false)}
                              role={"button"}
                              aria-label={"Hide password"}
                              tabIndex={0}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") setShowPassword(false);
                              }}
                              style={{
                                cursor: "pointer",
                                userSelect: "none",
                                fontSize: "1.5rem",
                              }}
                            >
                              Hide
                            </span>
                          ) : (
                            <span
                              onClick={() => setShowPassword(true)}
                              role={"button"}
                              aria-label={"Show password"}
                              tabIndex={0}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") setShowPassword(true);
                              }}
                              style={{
                                cursor: "pointer",
                                userSelect: "none",
                                fontSize: "1.5rem",
                              }}
                            >
                              Show
                            </span>
                          )} */}
                        </span>
                      </div>
                    </div>
                    <div className="mt-2 mb-7">
                      <a
                        href="/forgot-password"
                        data-discover={true}
                        className="heading-text mt-2 font-semibold underline"
                      >
                        Forgot password
                      </a>
                    </div>
                    {isLoading ? (
                      <>
                        {/* Loading spinner */}
                        {/* You can add a loading spinner here if needed */}
                      </>
                    ) : (
                      <>
                        {/* Submit button */}
                        <Button
                          type={"submit"}
                          disabled={isLoading}
                          onClick={handleLogin}
                          //   style={{
                          //     backgroundColor:
                          //       isLoading || !formData.email || !formData.password
                          //         ? "#ccc"
                          //         : "#3b82f6",
                          //     color:
                          //       isLoading || !formData.email || !formData.password
                          //         ? "#999"
                          //         : "#fff",
                          //     cursor:
                          //       isLoading || !formData.email || !formData.password
                          //         ? "not-allowed"
                          //         : "pointer",
                          //   }}
                          //   disabled={isLoading || !formData.email || !formData.password}
                          aria-disabled={isLoading}
                        >
                          Sign In
                        </Button>
                      </>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* Background image container */}

          <div className="relative hidden max-w-130 flex-1 flex-col items-end justify-between rounded-3xl px-10 py-6 lg:flex 2xl:max-w-180">
            <img
              className="absolute top-0 left-0 h-full w-full rounded-3xl"
              src={AuthImage}
              alt="auth"
            />
          </div>
          {/* Add background image container here if needed */}
        </div>
      </div>
    </>
  );
};

export default Login;

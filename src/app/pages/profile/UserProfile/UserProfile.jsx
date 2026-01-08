import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { Skeleton } from "primereact/skeleton";
import { InputText } from "primereact/inputtext";
import { FileUpload } from "primereact/fileupload";
import { login, logout } from "../../../../redux/slice/AuthSlice";

const UserProfile = () => {
  const toast = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const BASE_URL = import.meta.env.VITE_BACKEND_BASEURL;
  const AdminToken = useSelector((state) => state.auth.token);
  const userId = useSelector((state) => state.auth.userData.userId);
  const auth = useSelector((state) => state.auth);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState("");

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    mobileNumber: "",
    gender: "",
  });

  const genderType = [
    { name: "Male", code: "Male" },
    { name: "Female", code: "Female" },
    { name: "Other", code: "Other" },
  ];

  useEffect(() => {
    fetchUserData();
    fetchProfilePicture();
  }, []);

  const fetchUserData = () => {
    const config = {
      headers: {
        Authorization: `Bearer ${AdminToken}`,
      },
    };

    axios
      .get(`API_URL`, config)
      .then((response) => {
        const user = response.data.data || {};
        setFormData({
          username: user.username || "Admin user",
          email: user.email || "admin@gmail.com",
          mobileNumber: user.mobileNumber || "1234567890",
          gender: user.gender || "Male",
        });
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
      });
  };

  const fetchProfilePicture = () => {
    setIsLoading(true);

    axios
      .get(`API_URL`, {
        headers: {
          Authorization: `Bearer ${AdminToken}`,
        },
        responseType: "blob",
      })
      .then((response) => {
        setProfile("/images/User.webp");
      })
      .catch((error) => {
        setProfile("/images/User.webp");
      })
      .finally(() => {
        setIsLoading(false);
      });
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
    if (["username", "email", "gender"].includes(name) && !value?.trim()) {
      return `${name.charAt(0).toUpperCase() + name.slice(1)} is required.`;
    }

    if (name === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return "Invalid email format.";
    }

    if (name === "mobileNumber" && !value.trim()) {
      return "Mobile number is required.";
    }

    if (name === "mobileNumber" && !/^\d{10}$/.test(value)) {
      return "Mobile number must be 10 digits.";
    }

    return "";
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, value),
    }));
  };

  const handleFileSelect = (e) => {
    const file = e.files?.[0];
    if (file) {
      setImageFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const updateUserData = () => {
    if (!validateForm()) return;
    setIsLoading(true);
    const payload = {
      username: formData.username,
      email: formData.email,
      mobileNumber: formData.mobileNumber,
      gender: formData.gender,
    };

    const config = {
      headers: {
        Authorization: `Bearer ${AdminToken}`,
      },
    };

    axios
      .put(`API_URL`, payload, config)
      .then(() => {
        dispatch(
          login({
            token: AdminToken,
            refreshToken: auth.refreshToken,
            expires_at: auth.expires_at,
            time: auth.time,
            userData: {
              ...auth.userData,
              ...payload,
            },
          }),
        );

        toast.current.show({
          severity: "success",
          detail: "User Updated Successfully.",
          life: 1500,
        });

        setTimeout(() => {
          navigate("/");
        }, 1500);
      })
      .catch((error) => {
        if (error.response) {
          const status = error?.response?.status;

          if (status === 400) {
            toast.current.show({
              severity: "error",
              detail: error.response.data.message || "User not updated.",
              life: 2000,
            });
          } else if (status === 401) {
            toast.current.show({
              severity: "warn",
              detail: "Session expired. Please log in again.",
              life: 2000,
            });

            setTimeout(() => {
              dispatch(logout());
              navigate("/login");
            }, 1500);
          } else {
            toast.current?.show({
              severity: "error",
              detail: "Something went wrong ! login again.",
              life: 2500,
            });
          }
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleProfileImageUpload = async () => {
    if (!imageFile) return;

    const payload = new FormData();
    if (imageFile) {
      payload.append("image", imageFile);
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${AdminToken}`,
        },
      };

      await axios.put(`API_URL`, payload, config);

      toast.current.show({
        severity: "success",
        detail: "Profile image updated.",
        life: 1000,
      });

      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      toast.current.show({
        severity: "error",
        detail: "Upload failed. Try again.",
        life: 2000,
      });
    }
  };

  return (
    <>
      <Toast ref={toast} />
      <div className="card justify-content-between align-items-center mb-3 flex">
        <div className="text-lg font-bold">Acoount prefrences</div>
        <div
          className="border-round cursor-pointer p-1 transition-colors hover:bg-gray-200"
          onClick={() => navigate("/")}
        >
          <i className="pi pi-list" style={{ fontSize: "1.3rem" }} />
        </div>
      </div>

      <div className="grid">
        <div className="col-12">
          <div className="card p-fluid">
            <div>
              <p className="text-sm font-bold text-(--primary-color)">
                Admin Details
              </p>
            </div>
            <hr />

            <div className="align-items-center flex px-2 py-3">
              <div className="align-items-center flex gap-3">
                {isLoading ? (
                  <Skeleton shape="circle" size="5rem" />
                ) : (
                  <img
                    src={profile || "/images/User.webp"}
                    alt=""
                    className="mb-2 h-20 w-20 rounded-full border border-[#d1d1d1] object-cover select-none"
                  />
                )}
              </div>

              <div className="align-items-center flex w-full flex-wrap justify-between px-3">
                <div className="flex flex-col">
                  <span className="font-bold">Profile Picture</span>
                  <span className="text-xs text-[#a4a4a4]">
                    JPG, PNG under 3MB
                  </span>
                </div>
                <div>
                  <span
                    className="cursor-pointer text-sm font-bold text-(--primary-color) underline"
                    onClick={() => setShowDialog(true)}
                  >
                    Update Profile
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col">
              <p className="text-sm font-bold">Personal Details</p>
            </div>
            <hr />

            <div className="card-data flex-wrap justify-between md:flex">
              <div className="field col-12 md:col-6">
                <label htmlFor="username">Name</label>
                <InputText
                  id="username"
                  name="username"
                  type="text"
                  value={formData.username ?? ""}
                  onChange={handleInputChange}
                />
                {errors.name && (
                  <small className="p-error block">{errors.name}</small>
                )}
              </div>

              <div className="field col-12 md:col-6">
                <label htmlFor="email">Email</label>
                <InputText
                  id="email"
                  name="email"
                  type="text"
                  value={formData.email ?? ""}
                  onChange={handleInputChange}
                />
                {errors.email && (
                  <small className="p-error block">{errors.email}</small>
                )}
              </div>

              <div className="field col-12 md:col-6">
                <label htmlFor="mobileNumber">Mobile Number</label>
                <InputText
                  id="mobileNumber"
                  name="mobileNumber"
                  type="text"
                  maxLength={10}
                  value={formData.mobileNumber ?? ""}
                  onChange={handleInputChange}
                />
                {errors.mobileNumber && (
                  <small className="p-error block">{errors.mobileNumber}</small>
                )}
              </div>

              <div className="field col-12 md:col-6">
                <label>Gender</label>
                <Dropdown
                  value={
                    genderType.find((g) => g.code === formData.gender) ?? null
                  }
                  options={genderType}
                  onChange={(e) => {
                    const selectedGender = e.value?.code || "";
                    setFormData((prev) => ({
                      ...prev,
                      gender: selectedGender,
                    }));
                    setErrors((prev) => ({
                      ...prev,
                      gender: selectedGender ? "" : "Gender is required.",
                    }));
                  }}
                  optionLabel="name"
                  placeholder="Select Type"
                  showClear
                />
                {errors.gender && (
                  <small className="p-error block">{errors.gender}</small>
                )}
              </div>
            </div>

            <div className="submit-btn col-12 mt-3 flex justify-center md:justify-end">
              <Button
                type="submit"
                className="col-8 flex items-center justify-center text-sm md:col-3"
                onClick={updateUserData}
                disabled={isLoading}
                loading={isLoading}
                icon="pi pi-user"
              >
                Update Profile
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Dialog
        header="Update Profile Picture"
        visible={showDialog}
        style={{ width: "25rem" }}
        breakpoints={{
          "960px": "50vw",
          "640px": "95vw",
        }}
        onHide={() => {
          setShowDialog(false);
          setImageFile(null);
          setPreviewImage("");
        }}
      >
        <div className="flex flex-col gap-3">
          <FileUpload
            mode="basic"
            customUpload
            auto
            accept=".jpg,.jpeg,.png,.webp"
            maxFileSize={3 * 1024 * 1024}
            uploadHandler={handleFileSelect}
            chooseLabel="Choose Image"
          />

          {previewImage && (
            <img
              src={previewImage}
              alt="Preview"
              className="w-8rem h-8rem border-round mx-auto object-cover"
            />
          )}

          <div className="mt-3 flex justify-between gap-2">
            <Button
              label="Cancel"
              className="p-button-rounded h-6 p-3 text-sm"
              severity="secondary"
              onClick={() => {
                setShowDialog(false);
                setImageFile(null);
                setPreviewImage("");
              }}
            />
            <Button
              label="Update"
              className="p-button-rounded h-6 p-3 text-sm"
              icon="pi pi-check"
              disabled={!imageFile}
              onClick={handleProfileImageUpload}
            />
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default UserProfile;

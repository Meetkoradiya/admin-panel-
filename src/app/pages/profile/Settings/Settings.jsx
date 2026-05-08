import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { Toast } from "primereact/toast";
import Button from "@/components/ui/Button";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { FileUpload } from "primereact/fileupload";
import { InputSwitch } from "primereact/inputswitch";
import { Password } from "primereact/password";
import { classNames } from "primereact/utils";
import { login as loginAction } from "@/redux/slice/AuthSlice";
import { showConfirmDialog } from "@/utils/confirmUtils";

const Settings = () => {
  const toast = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  // States
  const [activeTab, setActiveTab] = useState("profile");
  const [isLoading, setIsLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [profile, setProfile] = useState(auth.userData?.profileImageUrl || "");
  const [imageFile, setImageFile] = useState(null);

  const [formData, setFormData] = useState({
    username: auth.userData?.username || "",
    mobileNumber: auth.userData?.mobileNumber || "",
    email: auth.userData?.email || "",
    gender: auth.userData?.gender || "",
  });

  const [securityData, setSecurityData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [notifConfig, setNotifConfig] = useState({
    emailNotif: true,
    orderUpdates: true,
    newsletters: false,
  });

  const genderType = [
    { name: "Male", code: "Male" },
    { name: "Female", code: "Female" },
    { name: "Other", code: "Other" },
  ];

  const sidebarItems = [
    { id: "profile", label: "Profile", icon: "pi pi-user" },
    { id: "security", label: "Security", icon: "pi pi-lock" },
    { id: "notification", label: "Notification", icon: "pi pi-bell" },
  ];

  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const handleSecurityChange = (e) => {
    const { name, value } = e.target;
    setSecurityData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const validateSecurity = () => {
    let tempErrors = {};
    if (!securityData.currentPassword) tempErrors.currentPassword = "Please enter your current password!";
    if (!securityData.newPassword) tempErrors.newPassword = "Please enter your new password!";
    if (!securityData.confirmPassword) tempErrors.confirmPassword = "Please confirm your new password!";

    if (securityData.newPassword && securityData.confirmPassword) {
      if (securityData.newPassword !== securityData.confirmPassword) {
        tempErrors.confirmPassword = "Passwords do not match!";
      }
      if (securityData.newPassword.length < 6) {
        tempErrors.newPassword = "Password must be at least 6 characters!";
      }
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const BASE_URL = import.meta.env.VITE_BACKEND_BASEURL;
  const token = auth.token;

  const handleRemoveProfile = () => {
    showConfirmDialog({
      title: 'Remove Image',
      message: 'Are you sure you want to remove your profile image?',
      acceptLabel: 'Remove',
      type: 'delete',
      onAccept: () => {
        setProfile("");
        setImageFile(null);
      }
    });
  };

  const validateProfile = () => {
    let tempErrors = {};
    if (!formData.username) tempErrors.username = "Full name is required!";
    if (!formData.mobileNumber) tempErrors.mobileNumber = "Mobile number is required!";
    else if (!/^\d{10}$/.test(formData.mobileNumber)) tempErrors.mobileNumber = "Mobile number must be 10 digits!";

    if (!formData.email) tempErrors.email = "Email address is required!";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) tempErrors.email = "Invalid email format!";

    if (!formData.gender) tempErrors.gender = "Gender is required!";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      if (activeTab === "profile") {
        if (!validateProfile()) {
          setIsLoading(false);
          return;
        }
        const payload = {
          username: formData.username,
          mobileNumber: formData.mobileNumber,
          email: formData.email,
          gender: formData.gender
        };

        // Only send if it's a valid remote URL. If they selected a local file (blob:http), we can't send it yet without uploading.
        if (profile && profile.startsWith('http')) {
          payload.profileImageUrl = profile;
        }

        await axios.put(`${BASE_URL}/admin/update-profile`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });

        // Update Redux state so the sidebar and header update immediately
        dispatch(
          loginAction({
            token: auth.token,
            refreshToken: auth.refreshToken,
            expires_at: auth.expires_at,
            time: auth.time,
            userData: {
              ...auth.userData,
              username: formData.username,
              mobileNumber: formData.mobileNumber,
              email: formData.email,
              gender: formData.gender,
              profileImageUrl: profile || auth.userData?.profileImageUrl,
            },
          })
        );

        toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Profile updated successfully' });
      } else if (activeTab === "security") {
        if (!validateSecurity()) {
          setIsLoading(false);
          return;
        }
        await axios.post(`${BASE_URL}/admin/change-password`, {
          oldPassword: securityData.currentPassword,
          newPassword: securityData.newPassword,
          confirmPassword: securityData.confirmPassword
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });

        // Auto-login logic to refresh token and prevent 401 redirection
        try {
          const res = await axios.post(`${BASE_URL}/auth/login`, {
            mobileNumber: auth.userData?.mobileNumber,
            password: securityData.newPassword,
          });
          const dataPayload = res.data?.data || res.data;
          if (dataPayload && dataPayload.accessToken) {
            const newToken = dataPayload.accessToken;
            const newRefreshToken = dataPayload.refreshToken;

            let newTime = 0;
            try {
              const decoded = JSON.parse(atob(newToken.split('.')[1]));
              newTime = decoded?.exp ? decoded.exp * 1000 : 0;
            } catch (e) {
              console.error("Failed to decode token", e);
            }

            dispatch(
              loginAction({
                token: newToken,
                refreshToken: newRefreshToken,
                time: newTime,
                userData: auth.userData,
              })
            );
          }
        } catch (autoErr) {
          console.error("Auto login failed after password change:", autoErr);
        }

        toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Password changed successfully' });
        setSecurityData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      } else if (activeTab === "notification") {
        toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Notification preferences saved local' });
      }
    } catch (error) {
      console.error("Update Profile Error Response:", error.response?.data);
      toast.current?.show({ severity: 'error', summary: 'Error', detail: error.response?.data?.message || 'Failed to save changes' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-8 bg-white min-h-screen">
      <Toast ref={toast} />

      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Settings</h1>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* SIDEBAR NAVIGATION */}
          <div className="col-span-12 lg:col-span-3">
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 sticky top-24">
              <nav className="flex flex-col gap-2">
                {sidebarItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={classNames(
                      "flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 text-left",
                      {
                        "bg-blue-50 text-blue-600 shadow-sm": activeTab === item.id,
                        "text-gray-500 hover:bg-gray-50": activeTab !== item.id,
                      }
                    )}
                  >
                    <i className={classNames(item.icon, "text-lg")}></i>
                    <span>{item.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* MAIN CONTENT AREA */}
          <div className="col-span-12 lg:col-span-9">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-10">

              {/* PROFILE TAB */}
              {activeTab === "profile" && (
                <div className="animate-fadein">
                  <h2 className="text-xl font-bold text-gray-800 mb-8 tracking-tight">Personal information</h2>

                  <div className="flex flex-col md:flex-row items-center gap-6 mb-10">
                    <div className="relative">
                      <img src={profile || "/images/User.webp"} alt="Profile" className="w-24 h-24 rounded-full object-cover border-4 border-gray-50 shadow-sm" />
                    </div>
                    <div className="flex gap-3">
                      <Button label="Upload New" variant="primary" size="sm" onClick={() => setShowDialog(true)} />
                      <Button label="Remove" variant="secondary" size="sm" onClick={handleRemoveProfile} />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-fluid">
                    <div className="field">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Full Name</label>
                      <InputText name="username" value={formData.username} onChange={handleInputChange} className={classNames("p-3 bg-white border border-slate-200 rounded-xl font-semibold", { "ring-1 ring-red-400": errors.username })} />
                      {errors.username && <small className="text-red-500 font-bold mt-1 block">{errors.username}</small>}
                    </div>
                    <div className="field">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Mobile Number</label>
                      <InputText name="mobileNumber" value={formData.mobileNumber} onChange={handleInputChange} className={classNames("p-3 bg-white border border-slate-200 rounded-xl font-semibold", { "ring-1 ring-red-400": errors.mobileNumber })} />
                      {errors.mobileNumber && <small className="text-red-500 font-bold mt-1 block">{errors.mobileNumber}</small>}
                    </div>
                    <div className="col-span-full field">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Email Address</label>
                      <InputText name="email" value={formData.email} onChange={handleInputChange} className={classNames("p-3 bg-white border border-slate-200 rounded-xl font-semibold", { "ring-1 ring-red-400": errors.email })} />
                      {errors.email && <small className="text-red-500 font-bold mt-1 block">{errors.email}</small>}
                    </div>

                    {/* Gender Dropdown Added Back */}
                    <div className="field">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Gender</label>
                      <Dropdown
                        value={genderType.find(g => g.code === formData.gender)}
                        options={genderType}
                        onChange={(e) => {
                          setFormData({ ...formData, gender: e.value.code });
                          if (errors.gender) setErrors(prev => ({ ...prev, gender: null }));
                        }}
                        optionLabel="name"
                        placeholder="Select Gender"
                        className={classNames("bg-white border border-slate-200 rounded-xl h-12 flex items-center font-semibold", { "ring-1 ring-red-400": errors.gender })}
                      />
                      {errors.gender && <small className="text-red-500 font-bold mt-1 block">{errors.gender}</small>}
                    </div>
                  </div>
                </div>
              )}

              {/* SECURITY TAB */}
              {activeTab === "security" && (
                <div className="animate-fadein">
                  <div className="mb-8">
                    <h2 className="text-xl font-bold text-gray-800 mb-1">Password</h2>
                    <p className="text-gray-500 text-sm">Keep your account safe with a strong password.</p>
                  </div>
                  <div className="flex flex-col gap-6 p-fluid">
                    <div className="field">
                      <label className="text-sm font-semibold text-gray-700 mb-2 block">Current password</label>
                      <Password name="currentPassword" value={securityData.currentPassword} onChange={handleSecurityChange} toggleMask feedback={false} inputClassName={classNames("p-4 bg-white border border-slate-200 rounded-2xl w-full", { "ring-1 ring-red-400": errors.currentPassword })} />
                      {errors.currentPassword && <small className="text-red-500 font-bold mt-1 ml-1 block">{errors.currentPassword}</small>}
                    </div>
                    <div className="field">
                      <label className="text-sm font-semibold text-gray-700 mb-2 block">New password</label>
                      <Password name="newPassword" value={securityData.newPassword} onChange={handleSecurityChange} toggleMask inputClassName={classNames("p-4 bg-gray-50 border-none rounded-2xl w-full", { "ring-1 ring-red-400": errors.newPassword })} />
                      {errors.newPassword && <small className="text-red-500 font-bold mt-1 ml-1 block">{errors.newPassword}</small>}
                    </div>
                    <div className="field">
                      <label className="text-sm font-semibold text-gray-700 mb-2 block">Confirm new password</label>
                      <Password name="confirmPassword" value={securityData.confirmPassword} onChange={handleSecurityChange} toggleMask feedback={false} inputClassName={classNames("p-4 bg-gray-50 border-none rounded-2xl w-full", { "ring-1 ring-red-400": errors.confirmPassword })} />
                      {errors.confirmPassword && <small className="text-red-500 font-bold mt-1 ml-1 block">{errors.confirmPassword}</small>}
                    </div>
                  </div>
                </div>
              )}

              {/* NOTIFICATION TAB */}
              {activeTab === "notification" && (
                <div className="animate-fadein">
                  <h2 className="text-xl font-bold text-gray-800 mb-8">Notification Preferences</h2>
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between p-5 bg-white border border-slate-100 rounded-2xl">
                      <div>
                        <p className="font-bold text-gray-800">Order Updates</p>
                        <p className="text-xs text-gray-500">Updates about your delivery status.</p>
                      </div>
                      <InputSwitch checked={notifConfig.orderUpdates} onChange={(e) => setNotifConfig({ ...notifConfig, orderUpdates: e.value })} />
                    </div>
                    <div className="flex items-center justify-between p-5 bg-white border border-slate-100 rounded-2xl">
                      <div>
                        <p className="font-bold text-gray-800">Email Alerts</p>
                        <p className="text-xs text-gray-500">Security and account alerts.</p>
                      </div>
                      <InputSwitch checked={notifConfig.emailNotif} onChange={(e) => setNotifConfig({ ...notifConfig, emailNotif: e.value })} />
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end mt-12 pt-6 border-t border-gray-100">
                <Button label="Save Changes" onClick={handleSave} loading={isLoading} variant="primary" className="px-10" />
              </div>

            </div>
          </div>
        </div>
      </div>

      <Dialog header="Update Avatar" visible={showDialog} style={{ width: "25rem" }} onHide={() => setShowDialog(false)} className="rounded-3xl">
        <div className="flex flex-col items-center gap-4 py-4">
          <FileUpload
            mode="basic"
            auto
            customUpload
            uploadHandler={(e) => {
              const file = e.files[0];
              if (file) {
                setImageFile(file);
                setProfile(URL.createObjectURL(file));
              }
              setShowDialog(false);
            }}
            accept="image/*"
            chooseLabel="Select Image"
            className="p-button-rounded bg-blue-50 text-blue-600 border-none"
          />
        </div>
      </Dialog>
    </div>
  );
};

export default Settings;


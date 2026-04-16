import axios from "axios";
import { OverlayPanel } from "primereact/overlaypanel";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState, useCallback } from "react";
import { logout } from "../../../redux/slice/AuthSlice";

export const User = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const op = useRef(null);

  const BASE_URL = import.meta.env.VITE_BACKEND_BASEURL;
  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.auth.userData);
  const userId = user?.userId;

  const [profile, setProfile] = useState("/images/avatar.jpg");

  const fetchProfilePicture = useCallback(() => {
  if (!userId) return;

  axios
    .get(`${BASE_URL}/users/profile-picture/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
      responseType: "blob",
    })
    .then((res) => {
      const imageUrl = URL.createObjectURL(res.data); // 👈 IMPORTANT
      setProfile(imageUrl);
    })
    .catch(() => setProfile("/images/User.webp"));
}, [BASE_URL, userId, token]);

  useEffect(() => {
    fetchProfilePicture();
  }, [fetchProfilePicture]);

  const handleLogout = async () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <>
      <button
        type="button"
        className="p-link layout-topbar-button"
        onClick={(e) => op.current.toggle(e)}
      >
        <div className="rounded-full bg-[#f1f1f1] size-8">
          <img
            src={profile || "/images/User.webp"}
            alt=""
            className="rounded-full object-cover"
          />
        </div>
      </button>

      <OverlayPanel ref={op} dismissable className="mt-4">
        <div className="w-72 space-y-3 rounded-md bg-white">
          <button
            type="button"
            onClick={() => {
              op.current.hide();
              const profilePath = user?.role === "MASTER_ADMIN" ? "/master/profile" : "/admin/profile";
              navigate(profilePath);
            }}
            className="cursor-pointer"
          >
            <div className="flex items-center gap-2 text-left">
              <div className="rounded-full bg-blue-100">
                <img
                  src={profile || "/images/User.webp"}
                  alt=""
                  className="h-12.5 w-12.5 rounded-full object-cover"
                />
              </div>
              <div className="flex flex-col">
                <div>
                  <p>{user?.username || "Admin user"}</p>
                </div>
                <div>
                  <p className="text-[12px]">
                    {user?.email || "admin@gmail.com"}
                  </p>
                </div>
              </div>
            </div>
          </button>

          <div className="border-b"></div>

          <div className="flex flex-col gap-2">
            <button
              type="button"
              className="p-link layout-topbar-button"
              onClick={() => {
                op.current.hide();
                const path = user?.role === "MASTER_ADMIN" ? "/master/profile" : "/admin/profile";
                navigate(path);
              }}
            >
              <i className="pi pi-user mr-2"></i>
              <span className="text-sm">User Profile</span>
            </button>

            <button
              type="button"
              className="p-link layout-topbar-button"
              onClick={() => {
                const path = user?.role === "MASTER_ADMIN" ? "/master/change-password" : "/admin/change-password";
                navigate(path);
                op.current.hide();
              }}
            >
              <i className="pi pi-cog mr-2"></i>
              <span className="text-sm">Change Password</span>
            </button>

            <button
              type="button"
              className="p-link layout-topbar-button"
              onClick={() => {
                op.current.hide();
                handleLogout();
              }}
            >
              <i className="pi pi-sign-out mr-2"></i>
              <span className="text-sm">Logout</span>
            </button>
          </div>
        </div>
      </OverlayPanel>
    </>
  );
};

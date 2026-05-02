import { OverlayPanel } from "primereact/overlaypanel";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState, useCallback } from "react";
import { logout } from "@/redux/slice/AuthSlice";
import useApi from "../../../hooks/useApi";
import { showConfirmDialog } from "@/utils/confirmUtils";

export const User = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const op = useRef(null);

    const user = useSelector((state) => state.auth.userData);
    const userId = user?.userId || user?.id;
    const token = useSelector((state) => state.auth.token);
    const { apiGet } = useApi();
    const BASE_URL = import.meta.env.VITE_BACKEND_BASEURL;

    const [profile, setProfile] = useState("/images/User.webp");

    const fetchProfilePicture = useCallback(() => {
        if (user?.profileImageUrl) {
            setProfile(user.profileImageUrl);
        }
    }, [user?.profileImageUrl]);

    useEffect(() => {
        fetchProfilePicture();
    }, [fetchProfilePicture]);

    const handleLogout = async () => {
        showConfirmDialog({
            title: 'Logout',
            message: 'Are you sure you want to logout from the system?',
            type: 'logout',
            acceptLabel: 'Logout',
            onAccept: () => {
                dispatch(logout());
                navigate("/login");
            }
        });
    };

    return (
        <>
            <button
                type="button"
                className="p-link w-12 h-12 flex items-center justify-center bg-slate-50/80 rounded-2xl hover:bg-slate-100 transition-all active:scale-95 ml-2 border border-slate-100"
                onClick={(e) => op.current.toggle(e)}
            >
                <div className="rounded-full bg-white shadow-sm size-9 overflow-hidden">
                    <img
                        src={profile || "/images/User.webp"}
                        alt="User"
                        className="object-cover w-full h-full"
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
                        className="cursor-pointer text-left w-full border-none bg-transparent p-0"
                    >
                        <div className="flex items-center gap-2">
                            <div className="rounded-full bg-blue-100 overflow-hidden size-12 ">
                                <img
                                    src={profile || "/images/User.webp"}

                                    alt=""
                                    className="h-full w-full object-cover"
                                />
                            </div>
                            <div className="flex flex-col">
                                <p className="font-bold text-slate-800 m-0">{user?.username || "Admin user"}</p>
                                <p className="text-[12px] text-slate-400 m-0 truncate w-40">
                                    {user?.email || "admin@gmail.com"}
                                </p>
                            </div>
                        </div>
                    </button>

                    <div className="border-b"></div>

                    <div className="flex flex-col gap-2">
                        <button
                            type="button"
                            className="p-link layout-topbar-button flex items-center p-2 hover:bg-slate-50 rounded-lg transition-colors"
                            onClick={() => {
                                op.current.hide();
                                const path = user?.role === "MASTER_ADMIN" ? "/master/profile" : "/admin/profile";
                                navigate(path);
                            }}
                        >
                            <i className="pi pi-user mr-2 text-blue-500"></i>
                            <span className="text-sm font-medium">User Profile</span>
                        </button>

                        <button
                            type="button"
                            className="p-link layout-topbar-button flex items-center p-2 hover:bg-slate-50 rounded-lg transition-colors"
                            onClick={() => {
                                const path = user?.role === "MASTER_ADMIN" ? "/master/settings" : "/admin/settings";
                                navigate(path);
                                op.current.hide();
                            }}
                        >
                            <i className="pi pi-cog mr-2 text-slate-400"></i>
                            <span className="text-sm font-medium">Settings</span>
                        </button>

                        <button
                            type="button"
                            className="p-link layout-topbar-button flex items-center p-2 hover:bg-rose-50 text-rose-600 rounded-lg transition-colors"
                            onClick={() => {
                                op.current.hide();
                                handleLogout();
                            }}
                        >
                            <i className="pi pi-sign-out mr-2"></i>
                            <span className="text-sm font-bold">Logout</span>
                        </button>
                    </div>
                </div>
            </OverlayPanel>
        </>
    );
};


import axios from "axios";
import {
  useContext,
  forwardRef,
  useImperativeHandle,
  useRef,
  useEffect,
  useState,
  useCallback,
} from "react";
import { useNavigate } from "react-router-dom";
import { classNames } from "primereact/utils";
import { useDispatch, useSelector } from "react-redux";
import { OverlayPanel } from "primereact/overlaypanel";
import { LayoutContext } from "../../context/layoutcontent";
import { logout } from "../../../redux/slice/AuthSlice";
import { Setting } from "./setting";
import { User } from "./user";
import { Notification } from "./notification";
import { Instruction } from "./instruction";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";

const AppTopbar = forwardRef((props, ref) => {
  const navigate = useNavigate();
  const {
    layoutConfig,
    layoutState,
    onMenuToggle,
    showProfileSidebar,
    setLayoutConfig,
  } = useContext(LayoutContext);
  const menubuttonRef = useRef(null);
  const topbarmenuRef = useRef(null);
  const topbarmenubuttonRef = useRef(null);
  const dispatch = useDispatch();
  const [profile, setProfile] = useState("");
  const BASE_URL = import.meta.env.VITE_BACKEND_BASEURL;
  const token = useSelector((state) => state.auth.token);

  const user = useSelector((state) => state.auth.userData);
  const op = useRef(null);

  useImperativeHandle(ref, () => ({
    menubutton: menubuttonRef.current,
    topbarmenu: topbarmenuRef.current,
    topbarmenubutton: topbarmenubuttonRef.current,
  }));

  const handleLogout = async () => {
    dispatch(logout());
    try {
      const response = await axios.get(`${BASE_URL}/auth/login`, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (response.data.success === 1) {
        dispatch(logout()); // Clear Redux auth state
        // Store logout message in sessionStorage
        sessionStorage.setItem("logoutSuccess", "Logged out successfully");

        navigate("/login"); // Redirect to login
      } else {
        throw new Error(
          response.data.msg || "Logout failed. Please try again.",
        );
      }
    } catch (error) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        dispatch(logout());
        navigate("/");
        return;
      }
    }
  };

  return (
    <div className="layout-topbar">
      <div className="layout-menus">
        <button
          ref={menubuttonRef}
          type="button"
          className="p-link layout-topbar-button"
          onClick={() => {
            onMenuToggle();
          }}
        >
          <i className="pi pi-align-left" />
        </button>

        <div className="hidden md:block lg:block">
          <div className="p-inputgroup h-8 flex-1">
            <InputText placeholder="Search ..." className="h-8 text-sm" />
            <Button icon="pi pi-search" className="p-button-primary" />
          </div>
        </div>
      </div>

      <div className="layout-menus">
        <Setting />
        <Instruction />
        <Notification />
        <User />
      </div>
    </div>
  );
});

AppTopbar.displayName = "AppTopbar";

export default AppTopbar;

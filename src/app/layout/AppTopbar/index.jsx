import axios from "axios";
import {
  useContext,
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
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
  const { onMenuToggle } = useContext(LayoutContext);
  const menubuttonRef = useRef(null);
  const topbarmenuRef = useRef(null);
  const topbarmenubuttonRef = useRef(null);
  const dispatch = useDispatch();

  const BASE_URL = import.meta.env.VITE_BACKEND_BASEURL;
  const token = useSelector((state) => state.auth.token);

  useImperativeHandle(ref, () => ({
    menubutton: menubuttonRef.current,
    topbarmenu: topbarmenuRef.current,
    topbarmenubutton: topbarmenubuttonRef.current,
  }));

  const handleLogout = async () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div className="layout-topbar">
      <div className="layout-menus">
        <button
          ref={menubuttonRef}
          type="button"
          className="p-link layout-topbar-button"
          onClick={onMenuToggle}
        >
          <i className="pi pi-align-left" />
        </button>

        <button type="button" className="p-link layout-topbar-button ml-2">
          <i className="pi pi-search" />
        </button>
      </div>

      <div className="layout-menus">
        <Notification />
        <User />
      </div>
    </div>
  );
});

AppTopbar.displayName = "AppTopbar";

export default AppTopbar;   // ✅ THIS IS IMPORTANT

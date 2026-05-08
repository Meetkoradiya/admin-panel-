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
import { Instruction } from "./instruction";
import { Notification } from "./notification";
import { User } from "./user";
import { QuickSearch } from "./QuickSearch";
import { Tooltip } from 'primereact/tooltip';
import QuickSearchInput from "../../../components/shared/QuickSearchInput";
import Button from "@/components/ui/Button";

const AppTopbar = forwardRef((props, ref) => {
  const navigate = useNavigate();
  const { onMenuToggle } = useContext(LayoutContext);
  const menubuttonRef = useRef(null);
  const topbarmenuRef = useRef(null);
  const topbarmenubuttonRef = useRef(null);
  const dispatch = useDispatch();
  const [searchVisible, setSearchVisible] = useState(false);

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
    <div className="layout-topbar bg-white border-b border-slate-50 flex items-center justify-between p-4 md:px-8 h-16 sticky top-0 z-[999]">
      <QuickSearch visible={searchVisible} onHide={() => setSearchVisible(false)} />

      <div className="flex items-center gap-4">
        {/* Menu Toggle Button */}
        <button
            ref={menubuttonRef}
            type="button"
            onClick={onMenuToggle}
            className="topbar-action w-10 h-10 flex items-center justify-center text-slate-600 hover:bg-slate-200 rounded-xl transition-all active:scale-95"
        >
          <i className="pi pi-bars text-lg" />
        </button>

        {/* Search Button */}
        <button
          type="button"
          onClick={() => setSearchVisible(true)}
          className="topbar-action w-10 h-10 flex items-center justify-center text-slate-600 hover:bg-slate-200 rounded-xl transition-all active:scale-95"
        >
          <i className="pi pi-search text-lg" />
        </button>
      </div>

      <div className="flex items-center gap-1.5">
        <div className="flex items-center gap-0.5">
          <Notification />
          <Instruction />
        </div>
        
        <div className="h-8 w-[1px] bg-slate-200 mx-0.5" />
        
        <User />
      </div>
    </div>
  );
});

AppTopbar.displayName = "AppTopbar";

export default AppTopbar;   // âœ… THIS IS IMPORTANT


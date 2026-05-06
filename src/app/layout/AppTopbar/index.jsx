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
    <div className="layout-topbar bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-6 py-4">
      <QuickSearch visible={searchVisible} onHide={() => setSearchVisible(false)} />
      
      <div className="flex items-center gap-2">
        {/* Menu Toggle Button */}
        <button
            type="button"
            onClick={onMenuToggle}
            className="p-link w-10 h-10 flex items-center justify-center rounded-xl hover:bg-slate-50 transition-all active:scale-95 text-slate-600"
        >
            <i className="pi pi-bars text-xl" />
        </button>

        {/* Search Button */}
        <button 
            type="button"
            onClick={() => setSearchVisible(true)}
            className="p-link w-10 h-10 flex items-center justify-center rounded-xl hover:bg-slate-50 transition-all active:scale-95 text-slate-600"
        >
            <i className="pi pi-search text-xl" />
        </button>
      </div>

      <div className="flex items-center gap-1">
        <Notification />
        <Instruction />
        <User />
      </div>
    </div>
  );
});

AppTopbar.displayName = "AppTopbar";

export default AppTopbar;   // âœ… THIS IS IMPORTANT


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
import { QuickSearch } from "./QuickSearch";
import QuickSearchInput from "../../../components/shared/QuickSearchInput";

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
    <div className="layout-topbar">
      <QuickSearch visible={searchVisible} onHide={() => setSearchVisible(false)} />
      <div className="layout-menus flex items-center gap-6">
        {/* Menu Toggle Button */}
        <button
          ref={menubuttonRef}
          type="button"
          className="p-link w-12 h-12 flex items-center justify-center bg-slate-50/80 rounded-2xl hover:bg-slate-100 transition-all active:scale-95 border border-slate-100"
          onClick={onMenuToggle}
        >
          <i className="pi pi-align-left text-[1.2rem] text-slate-800" />
        </button>

        {/* Search Button */}
        <button 
          type="button" 
          className="p-link w-12 h-12 flex items-center justify-center bg-slate-50/80 rounded-full hover:bg-slate-100 transition-all active:scale-95 border border-slate-100"
          onClick={() => setSearchVisible(true)}
        >
          <i className="pi pi-search text-[1.2rem] text-slate-800" />
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

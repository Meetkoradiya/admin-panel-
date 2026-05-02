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
    <div className="layout-topbar">
      <QuickSearch visible={searchVisible} onHide={() => setSearchVisible(false)} />
      <div className="layout-menus flex items-center gap-6">
        {/* Menu Toggle Button */}
        <Button
            variant="icon"
            icon="pi pi-align-left text-lg"
            onClick={onMenuToggle}
            className="w-12 h-12 bg-slate-50/80 border-slate-100 text-slate-800 rounded-2xl hover:bg-white hover:shadow-sm transition-all"
        />

        {/* Search Button */}
        <Button 
            variant="icon"
            icon="pi pi-search text-lg"
            onClick={() => setSearchVisible(true)}
            className="w-12 h-12 bg-slate-50/80 border-slate-100 text-slate-800 rounded-full hover:bg-white hover:shadow-sm transition-all"
        />
      </div>

      <div className="layout-menus">
        <Notification />
        <User />
      </div>
    </div>
  );
});

AppTopbar.displayName = "AppTopbar";

export default AppTopbar;   // âœ… THIS IS IMPORTANT


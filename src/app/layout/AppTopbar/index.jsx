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
      <div className="layout-menus flex items-center gap-4">
        {/* Menu Toggle Button */}
        <Button
            variant="icon"
            icon="pi pi-bars text-base"
            onClick={onMenuToggle}
            className="w-10 h-10 bg-[#06b6d4] border-[#06b6d4] text-white rounded-xl hover:bg-[#0891b2] transition-colors"
        />

        {/* Search Button */}
        <Button 
            variant="icon"
            text
            icon="pi pi-search text-base"
            onClick={() => setSearchVisible(true)}
            className="w-10 h-10 bg-[#06b6d4] border-[#06b6d4] text-white rounded-xl hover:bg-[#0891b2] transition-colors"
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


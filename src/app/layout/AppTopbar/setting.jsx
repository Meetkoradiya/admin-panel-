import { useRef } from "react";
import { OverlayPanel } from "primereact/overlaypanel";
import { useNavigate } from "react-router-dom";

export const Setting = () => {
  const op = useRef(null);
  const navigate = useNavigate();

  return (
    <>
      <button
        type="button"
        className="p-link layout-topbar-button"
        onClick={(e) => op.current.toggle(e)}
      >
        <i className="pi pi-cog"></i>
      </button>

      <OverlayPanel ref={op} dismissable className="mt-4">
        <div className="w-72 rounded-xl flex flex-col gap-2">
          <h4 className="font-semibold text-base mb-2">Settings</h4>

          <button
            className="flex items-center gap-3 p-2 rounded-lg border"
            onClick={() => {
              op.current.hide();
              navigate("/master/change-password");
            }}
          >
            <i className="pi pi-key"></i>
            <span className="text-sm">Change Password</span>
          </button>

          <button
            className="flex items-center gap-3 p-2 rounded-lg border"
            onClick={() => {
              op.current.hide();
              navigate("/master/profile");
            }}
          >
            <i className="pi pi-user"></i>
            <span className="text-sm">Profile Settings</span>
          </button>
        </div>
      </OverlayPanel>
    </>
  );
};

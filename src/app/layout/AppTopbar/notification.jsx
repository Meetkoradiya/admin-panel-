import { useRef } from "react";
import { OverlayPanel } from "primereact/overlaypanel";
import { Badge } from "primereact/badge";

export const Notification = () => {
  const op = useRef(null);

  const notifications = [
    { id: 1, text: "New order received", time: "2 min ago" },
    { id: 2, text: "Profile updated successfully", time: "1 hour ago" },
    { id: 3, text: "Password changed", time: "Yesterday" },
  ];

  return (
    <>
      <button
        type="button"
        className="p-link layout-topbar-button relative"
        onClick={(e) => op.current.toggle(e)}
      >
        <i className="pi pi-bell"></i>
        {notifications.length > 0 && (
          <Badge value={notifications.length} severity="danger" className="ml-1" />
        )}
      </button>

      <OverlayPanel ref={op} dismissable className="mt-4">
        <div className="w-80 rounded-xl">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-base">Notifications</h4>
            <span className="text-sm text-gray-500">Recent</span>
          </div>

          <div className="flex flex-col gap-2">
            {notifications.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">
                No notifications
              </p>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className="flex flex-col p-3 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                >
                  <span className="text-sm">{n.text}</span>
                  <span className="text-xs text-gray-500">{n.time}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </OverlayPanel>
    </>
  );
};

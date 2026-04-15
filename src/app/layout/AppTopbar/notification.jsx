import { useRef, useState, useEffect } from "react";
import { OverlayPanel } from "primereact/overlaypanel";
import { Badge } from "primereact/badge";
import { useSelector } from "react-redux";
import axios from "axios";
import { Toast } from "primereact/toast";

export const Notification = () => {
  const op = useRef(null);
  const toast = useRef(null);

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const token = useSelector((state) => state.auth.token);
  const userId = useSelector((state) => state.auth.userData?.id || state.auth.userData?.userId);
  const BASE_URL = import.meta.env.VITE_BACKEND_BASEURL;

  const fetchNotifications = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/notifications/list`, {
        params: { userId },
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data && response.data.data) {
        setNotifications(response.data.data);
      } else if (Array.isArray(response.data)) {
        setNotifications(response.data);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/notifications/unread-count`, {
        params: { userId },
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data && response.data.data !== undefined) {
        setUnreadCount(response.data.data);
      } else if (response.data !== undefined) {
        setUnreadCount(response.data);
      }
    } catch (error) {
      console.error("Error fetching unread count:", error);
    }
  };

  useEffect(() => {
    if (userId && token) {
      fetchNotifications();
      fetchUnreadCount();

      const interval = setInterval(() => {
        fetchNotifications();
        fetchUnreadCount();
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [userId, token]);

  const markAsRead = async (notificationId) => {
    try {
      await axios.put(`${BASE_URL}/notifications/read/${notificationId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchNotifications();
      fetchUnreadCount();
    } catch (error) {
      console.error("Error marking notification as read:", error);
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Could not mark as read' });
    }
  };

  const markAllAsRead = async () => {
    try {
      await axios.put(`${BASE_URL}/notifications/read-all`, null, {
        params: { userId },
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchNotifications();
      fetchUnreadCount();
      toast.current?.show({ severity: 'success', summary: 'Success', detail: 'All notifications marked as read', life: 2000 });
    } catch (error) {
      console.error("Error marking all as read:", error);
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Could not mark all as read' });
    }
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return "";
    try {
      const date = new Date(timeStr);
      return date.toLocaleString();
    } catch (e) {
      return timeStr;
    }
  };

  return (
    <>
      <Toast ref={toast} />
      <button
        type="button"
        className="p-link layout-topbar-button relative"
        onClick={(e) => op.current.toggle(e)}
      >
        <i className="pi pi-bell"></i>
        {unreadCount > 0 && (
          <Badge value={unreadCount > 99 ? '99+' : unreadCount} severity="danger" className="ml-1" />
        )}
      </button>

      <OverlayPanel ref={op} dismissable className="mt-4">
        <div className="w-80 rounded-xl">
          <div className="flex items-center justify-between mb-3 border-b pb-2 border-gray-100">
            <h4 className="font-semibold text-base">Notifications</h4>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-500">Recent</span>
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={markAllAsRead}
                  className="text-xs text-blue-600 hover:text-blue-800 transition"
                  style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  Mark all as read
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2 max-h-80 overflow-y-auto pr-1">
            {notifications.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">
                No notifications
              </p>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => !n.isRead && markAsRead(n.id)}
                  className={`flex flex-col p-3 rounded-lg border transition ${
                    n.isRead 
                      ? "bg-white border-gray-100 opacity-70 hover:bg-gray-50" 
                      : "bg-blue-50 border-blue-100 hover:bg-blue-100 cursor-pointer"
                  }`}
                >
                  <div className="flex justify-between items-start gap-2">
                    <span className="text-sm font-medium">{n.message || n.text}</span>
                    {!n.isRead && (
                      <span className="w-2 h-2 rounded-full bg-blue-600 mt-1 "></span>
                    )}
                  </div>
                  <span className="text-xs text-gray-500 mt-1">{formatTime(n.createdAt || n.timestamp || n.time)}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </OverlayPanel>
    </>
  );
};

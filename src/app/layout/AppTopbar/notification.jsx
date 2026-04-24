import { useRef, useState, useEffect, useCallback } from "react";
import { OverlayPanel } from "primereact/overlaypanel";
import { Badge } from "primereact/badge";
import { useSelector } from "react-redux";
import { Toast } from "primereact/toast";
import useApi from "@/hooks/useApi";

export const Notification = () => {
    const op = useRef(null);
    const toast = useRef(null);

    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    const user = useSelector((state) => state.auth.userData);
    const userId = user?.userId || user?.id;
    const { apiGet, apiPut } = useApi();

    const fetchNotifications = useCallback(async () => {
        if (!userId) return;
        try {
            const data = await apiGet('/notifications/list', { params: { userId } });
            const list = Array.isArray(data) ? data : (data?.data || data?.content || data?.notifications || []);
            setNotifications(list);
        } catch (error) {
            console.error("Error fetching notifications:", error);
        }
    }, [userId, apiGet]);

    const fetchUnreadCount = useCallback(async () => {
        if (!userId) return;
        try {
            const data = await apiGet('/notifications/unread-count', { params: { userId } });
            let count = 0;
            if (typeof data === 'number') count = data;
            else if (typeof data?.data === 'number') count = data.data;
            else if (typeof data?.data?.count === 'number') count = data.data.count;

            setUnreadCount(count);
        } catch (error) {
            console.error("Error fetching unread count:", error);
        }
    }, [userId, apiGet]);

    useEffect(() => {
        if (userId) {
            fetchNotifications();
            fetchUnreadCount();

            const interval = setInterval(() => {
                fetchNotifications();
                fetchUnreadCount();
            }, 30000);
            return () => clearInterval(interval);
        }
    }, [userId, fetchNotifications, fetchUnreadCount]);

    const markAsRead = async (notificationId) => {
        try {
            await apiPut(`/notifications/read/${notificationId}`, {});
            fetchNotifications();
            fetchUnreadCount();
        } catch (error) {
            console.error("Error marking notification as read:", error);
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Could not mark as read' });
        }
    };

    const markAllAsRead = async () => {
        if (!userId) return;
        try {
            await apiPut(`/notifications/read-all`, null, { params: { userId } });
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
            return date.toLocaleString('en-IN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short' });
        } catch (e) {
            return timeStr;
        }
    };

    return (
        <>
            <Toast ref={toast} />
            <button
                type="button"
                className="p-link layout-topbar-button relative rounded-xl hover:bg-slate-100 transition-all p-2"
                onClick={(e) => op.current.toggle(e)}
            >
                <i className="pi pi-bell text-slate-600"></i>
                <Badge 
                    value={unreadCount > 99 ? '99+' : unreadCount} 
                    severity={unreadCount > 0 ? "danger" : "info"} 
                    className={`absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 scale-75 ${unreadCount === 0 ? 'opacity-50' : ''}`} 
                />
            </button>

            <OverlayPanel ref={op} dismissable className="mt-4 shadow-2xl border-none overflow-hidden rounded-3xl">
                <div className="w-80 overflow-hidden">
                    <div className="flex items-center justify-between p-4 bg-slate-50 border-b border-gray-100">
                        <h4 className="font-bold text-slate-800 m-0">Notifications</h4>
                        {unreadCount > 0 && (
                            <button
                                type="button"
                                onClick={markAllAsRead}
                                className="text-xs font-bold text-blue-600 hover:text-blue-800 bg-transparent border-none cursor-pointer"
                            >
                                Mark all read
                            </button>
                        )}
                    </div>

                    <div className="flex flex-col max-h-96 overflow-y-auto bg-white">
                        {notifications.length === 0 ? (
                            <div className="text-center py-8 px-6">
                                <div className="w-48 h-48 mx-auto mb-4 overflow-hidden rounded-2xl">
                                    <img 
                                        src="/images/notification.jpg" 
                                        alt="No Notifications" 
                                        className="w-full h-full object-contain"
                                    />
                                </div>
                                <p className="text-slate-400 font-medium m-0">No notifications yet</p>
                                <p className="text-slate-300 text-xs mt-1 italic">Checked for User</p>
                            </div>
                        ) : (
                            notifications.map((n) => (
                                <div
                                    key={n.id}
                                    onClick={() => !(n.isRead || n.read) && markAsRead(n.id)}
                                    className={`flex flex-col p-4 border-b border-slate-50 transition-all ${
                                        (n.isRead || n.read) 
                                            ? "bg-white hover:bg-blue-50/30" 
                                            : "bg-red-50/30 hover:bg-red-50 cursor-pointer"
                                    }`}
                                >
                                    <div className="flex justify-between items-start gap-3">
                                        <span className={`text-sm ${
                                            (n.isRead || n.read) 
                                                ? "text-blue-600 font-medium" 
                                                : "text-red-600 font-extrabold"
                                        }`}>
                                            {n.message || n.text || n.title}
                                        </span>
                                        {!(n.isRead || n.read) && (
                                            <span className="w-2.5 h-2.5 rounded-full bg-red-600 flex-0 mt-1 shadow-sm shadow-red-200 animate-pulse"></span>
                                        )}
                                        {(n.isRead || n.read) && (
                                            <i className="pi pi-check text-[10px] text-blue-400 mt-1" />
                                        )}
                                    </div>
                                    <span className={`text-[10px] font-bold mt-2 uppercase tracking-tighter ${
                                        (n.isRead || n.read) ? "text-blue-300" : "text-red-300"
                                    }`}>
                                        {formatTime(n.createdAt || n.timestamp || n.time)}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </OverlayPanel>
        </>
    );
};

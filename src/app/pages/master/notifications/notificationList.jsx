import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Tag } from 'primereact/tag';
import { Page } from "@/components/shared/Page";
import { useSelector } from 'react-redux';
import { selectUserData } from '@/redux/slice/AuthSlice';
import useApi from '@/hooks/useApi';

const NotificationList = () => {
    const user = useSelector(selectUserData);
    const userId = user?.userId || user?.id;
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(false);
    const [markingAll, setMarkingAll] = useState(false);
    const toast = useRef(null);
    const { apiGet, apiPut } = useApi();

    const fetchNotifications = useCallback(async (isSilent = false) => {
        if (!userId) return;
        if (!isSilent) setLoading(true);
        try {
            const data = await apiGet('/notifications/list', { params: { userId } });
            const list = Array.isArray(data) ? data : (data?.data || []);
            setNotifications(list);
        } catch (error) {
            console.error("Error fetching notifications:", error);
            if (!isSilent) {
                toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Could not load notifications' });
            }
        } finally {
            if (!isSilent) setLoading(false);
        }
    }, [userId, apiGet]);

    useEffect(() => {
        fetchNotifications();
    }, [fetchNotifications]);

    const markAsRead = async (id) => {
        try {
            await apiPut(`/notifications/read/${id}`, {});
            // Optimistic update
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
        } catch (error) {
            console.error("Error marking notification as read:", error);
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Action failed' });
        }
    };

    const markAllAsRead = useCallback(async () => {
        if (!userId) return;
        setMarkingAll(true);
        try {
            await apiPut('/notifications/read-all', null, { params: { userId } });
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
            toast.current?.show({ severity: 'success', summary: 'Success', detail: 'All notifications marked as read' });
        } catch (error) {
            console.error("Error marking all as read:", error);
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Action failed' });
        } finally {
            setMarkingAll(false);
        }
    }, [userId, apiPut]);

    const formatTime = (timeStr) => {
        if (!timeStr) return "—";
        try {
            const date = new Date(timeStr);
            return date.toLocaleString('en-IN', {
                hour: '2-digit',
                minute: '2-digit',
                day: '2-digit',
                month: 'short',
                year: 'numeric'
            });
        } catch (e) {
            return timeStr;
        }
    };

    const unreadCount = notifications.filter(n => !(n.isRead || n.read)).length;

    return (
        <Page title="Notifications">
            <div className="p-4 md:p-8 bg-[#f8fafc] min-h-screen">
                <Toast ref={toast} />

                {/* Header Section */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h2 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-3">
                            <i className="pi pi-bell text-blue-600" />
                            Notifications
                        </h2>
                        <p className="text-slate-400 font-medium mt-1">
                            Stay updated with important system alerts and activities
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        {unreadCount > 0 && (
                            <Button
                                label="Mark all as read"
                                icon="pi pi-check-circle"
                                className="bg-white text-blue-600 border-blue-100 hover:bg-blue-50 px-6 py-2.5 rounded-2xl font-bold shadow-sm transition-all"
                                onClick={markAllAsRead}
                                loading={markingAll}
                            />
                        )}
                        <Button
                            icon="pi pi-refresh"
                            className="w-11 h-11 rounded-2xl bg-white border-slate-100 text-slate-600 hover:bg-slate-50 transition-all shadow-sm"
                            onClick={() => fetchNotifications()}
                            loading={loading}
                        />
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100/50">
                            <i className="pi pi-inbox text-xl" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total</p>
                            <p className="text-2xl font-black text-slate-800 tracking-tight">{notifications.length}</p>
                        </div>
                    </div>
                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-600 border border-rose-100/50">
                            <i className="pi pi-bell text-xl" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Unread</p>
                            <p className="text-2xl font-black text-rose-600 tracking-tight">{unreadCount}</p>
                        </div>
                    </div>
                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-100/50">
                            <i className="pi pi-check-circle text-xl" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Read</p>
                            <p className="text-2xl font-black text-emerald-600 tracking-tight">{notifications.length - unreadCount}</p>
                        </div>
                    </div>
                </div>

                {/* Notifications List */}
                <div className="space-y-4">
                    {loading ? (
                        Array(5).fill(0).map((_, i) => (
                            <div key={i} className="bg-white rounded-3xl p-6 border border-slate-100 animate-pulse flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-slate-100"></div>
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 bg-slate-100 rounded w-1/4"></div>
                                    <div className="h-3 bg-slate-100 rounded w-1/2"></div>
                                </div>
                            </div>
                        ))
                    ) : notifications.length === 0 ? (
                        <div className="bg-white rounded-4xl p-20 text-center border border-dashed border-slate-200">
                            <div className="w-20 h-20 rounded-3xl bg-slate-50 flex items-center justify-center text-slate-300 mx-auto mb-6">
                                <i className="pi pi-bell-slash text-3xl" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800">No Notifications</h3>
                            <p className="text-slate-400 mt-2">You&apos;re all caught up! Nothing new to show here.</p>
                        </div>
                    ) : (
                        notifications.map((n) => (
                            <div
                                key={n.id}
                                className={`group bg-white rounded-3xl p-6 border transition-all duration-300 flex flex-col md:flex-row md:items-center gap-4 md:gap-6 ${(n.isRead || n.read)
                                        ? "border-slate-100 opacity-80 hover:opacity-100"
                                        : "border-blue-100 shadow-md shadow-blue-500/5 hover:shadow-lg hover:shadow-blue-500/10 scale-[1.01]"
                                    }`}
                                onClick={() => !(n.isRead || n.read) && markAsRead(n.id)}
                            >
                                {/* Icon/Avatar */}
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 ${(n.isRead || n.read) ? "bg-slate-50 text-slate-400" : "bg-blue-600 text-white shadow-lg shadow-blue-200"
                                    }`}>
                                    <i className={`pi ${(n.isRead || n.read) ? 'pi-bell' : 'pi-bolt'} text-xl`} />
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-3 mb-1">
                                        <span className={`text-base font-bold truncate ${(n.isRead || n.read) ? "text-slate-600" : "text-slate-900"}`}>
                                            {n.message || n.text || n.title || "System Alert"}
                                        </span>
                                        {!(n.isRead || n.read) && (
                                            <Tag value="New" severity="info" className="text-[9px] px-2 font-black uppercase tracking-tighter" rounded />
                                        )}
                                    </div>
                                    <div className="flex items-center gap-4 mt-2">
                                        <span className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                                            <i className="pi pi-calendar text-[10px]" />
                                            {formatTime(n.createdAt || n.timestamp)}
                                        </span>
                                        <span className="w-1 h-1 rounded-full bg-slate-200"></span>
                                        <span className="text-xs font-black text-slate-300 uppercase tracking-widest">
                                            {n.type || "General"}
                                        </span>
                                    </div>
                                </div>

                                {/* Action */}
                                {!(n.isRead || n.read) && (
                                    <div className="md:ml-auto">
                                        <Button
                                            icon="pi pi-check"
                                            tooltip="Mark as read"
                                            className="p-button-rounded p-button-text p-button-sm text-blue-600 hover:bg-blue-50"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                markAsRead(n.id);
                                            }}
                                        />
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </Page>
    );
};

export default NotificationList;

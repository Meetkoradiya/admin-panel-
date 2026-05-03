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
            <div className="bg-[#f4f7fa] min-h-[calc(100vh-4rem)] p-4 md:p-6">
                <Toast ref={toast} />

                {/* Header Section */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-10">
                    <h2 className="text-xl font-bold text-slate-800">Notifications</h2>
                    <div className="flex items-center gap-4">
                        {unreadCount > 0 && (
                            <Button
                                label="Mark all as read"
                                icon="pi pi-check-circle"
                                className="bg-white text-[#3b82f6] border-[#3b82f6] hover:bg-blue-50 px-6 py-2.5 rounded-xl font-bold transition-all text-sm border"
                                onClick={markAllAsRead}
                                loading={markingAll}
                            />
                        )}
                        <Button
                            icon="pi pi-refresh"
                            className="w-10 h-10 rounded-xl bg-white border-slate-100 text-slate-600 hover:bg-slate-50 transition-all shadow-sm"
                            onClick={() => fetchNotifications()}
                            loading={loading}
                        />
                    </div>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                    {[
                        { label: 'Total Alerts', value: notifications.length, icon: 'pi pi-bell', bg: 'bg-blue-50', color: 'text-blue-600' },
                        { label: 'Unread', value: unreadCount, icon: 'pi pi-bolt', bg: 'bg-rose-50', color: 'text-rose-600' },
                        { label: 'Processed', value: notifications.length - unreadCount, icon: 'pi pi-check-circle', bg: 'bg-emerald-50', color: 'text-emerald-600' },
                    ].map((s) => (
                        <div key={s.label} className="bg-white rounded-2xl shadow-sm p-6 border border-slate-100 flex items-center gap-5">
                            <div className={`w-14 h-14 rounded-xl ${s.bg} flex items-center justify-center ${s.color}`}>
                                <i className={`${s.icon} text-xl`} />
                            </div>
                            <div>
                                <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">{s.label}</p>
                                <p className="text-2xl font-bold text-slate-800">{loading ? '—' : s.value}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Notifications List */}
                <div className="space-y-4 max-w-5xl mx-auto">
                    {loading ? (
                        Array(3).fill(0).map((_, i) => (
                            <div key={i} className="bg-white rounded-2xl p-6 border border-slate-100 animate-pulse flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-slate-50"></div>
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 bg-slate-50 rounded w-1/4"></div>
                                    <div className="h-3 bg-slate-50 rounded w-1/2"></div>
                                </div>
                            </div>
                        ))
                    ) : notifications.length === 0 ? (
                        <div className="bg-white rounded-2xl p-20 text-center border border-slate-100">
                            <i className="pi pi-bell-slash text-4xl text-slate-200 mb-4 block" />
                            <h3 className="text-lg font-bold text-slate-800">No Notifications</h3>
                            <p className="text-slate-400 mt-2">You&apos;re all caught up!</p>
                        </div>
                    ) : (
                        notifications.map((n) => (
                            <div
                                key={n.id}
                                className={`bg-white rounded-2xl p-6 border transition-all duration-300 flex items-center gap-6 border-slate-100 shadow-sm hover:shadow-md cursor-pointer ${!(n.isRead || n.read) ? "border-l-4 border-l-blue-500" : ""}`}
                                onClick={() => !(n.isRead || n.read) && markAsRead(n.id)}
                            >
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${(n.isRead || n.read) ? "bg-slate-50 text-slate-400" : "bg-blue-600 text-white shadow-lg shadow-blue-100"}`}>
                                    <i className={`pi ${(n.isRead || n.read) ? 'pi-bell' : 'pi-bolt'} text-lg`} />
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-3">
                                        <span className={`text-sm font-bold truncate ${(n.isRead || n.read) ? "text-slate-500" : "text-slate-800"}`}>
                                            {n.message || n.text || n.title || "System Alert"}
                                        </span>
                                        {!(n.isRead || n.read) && (
                                            <Tag value="New" className="text-[9px] bg-blue-600 text-white px-2 font-bold uppercase" rounded />
                                        )}
                                    </div>
                                    <div className="flex items-center gap-3 mt-1.5">
                                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                                            {n.type || "General"}
                                        </span>
                                        <span className="w-1 h-1 rounded-full bg-slate-200"></span>
                                        <span className="text-[11px] font-medium text-slate-400">
                                            {formatTime(n.createdAt || n.timestamp)}
                                        </span>
                                    </div>
                                </div>

                                {!(n.isRead || n.read) && (
                                    <Button
                                        icon="pi pi-check"
                                        className="p-button-rounded p-button-text text-blue-500 hover:bg-blue-50"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            markAsRead(n.id);
                                        }}
                                    />
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



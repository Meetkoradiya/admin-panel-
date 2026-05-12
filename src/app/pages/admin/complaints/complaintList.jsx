import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Menu } from 'primereact/menu';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import useApi from '@/hooks/useApi';
import ListLayout from '@/components/shared/ListLayout';
import StatusTag from '@/components/shared/StatusTag';
import ActionButtons from '@/components/shared/ActionButtons';
import { showConfirmDialog } from '@/utils/confirmUtils';

const ComplaintList = () => {
    const navigate = useNavigate();
    const user = useSelector((state) => state.auth.userData);
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(false);
    const [globalFilter, setGlobalFilter] = useState("");
    const toast = useRef(null);
    const menu = useRef(null);
    const [selectedComplaint, setSelectedComplaint] = useState(null);
    const { apiGet, apiDelete, apiPut } = useApi();

    const [stats, setStats] = useState({
        total: 0,
        resolved: 0,
        pending: 0,
        inProgress: 0
    });

    const fetchComplaints = useCallback(async () => {
        setLoading(true);
        try {
            const data = await apiGet('/customer/admin/complaints');
            const list = data?.data || data || [];
            const normalized = Array.isArray(list) ? list : [];
            setComplaints(normalized);

            setStats({
                total: normalized.length,
                resolved: normalized.filter(c => c.status === 'RESOLVED').length,
                pending: normalized.filter(c => (c.status || 'PENDING') === 'PENDING').length,
                inProgress: normalized.filter(c => c.status === 'IN_PROGRESS').length
            });
        } catch (error) {
            console.error("Fetch Complaints Error:", error);
            setComplaints([]);
        } finally {
            setLoading(false);
        }
    }, [apiGet]);

    useEffect(() => {
        fetchComplaints();
    }, [fetchComplaints]);

    const updateStatus = async (complaintId, status) => {
        try {
            await apiPut(`/customer/admin/complaints/${complaintId}/status`, { status });
            toast.current?.show({ severity: 'success', summary: 'Updated', detail: `Status changed to ${status}` });
            fetchComplaints();
        } catch (error) {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to update status' });
        }
    };

    const deleteComplaint = async (rowData) => {
        showConfirmDialog({
            title: 'Remove Complaint',
            message: `Permanently delete this complaint record?`,
            acceptLabel: 'Delete',
            onAccept: async () => {
                try {
                    await apiDelete(`/customer/admin/complaints/${rowData.id || rowData._id}`);
                    toast.current?.show({ severity: 'success', summary: 'Deleted', detail: 'Complaint removed successfully' });
                    fetchComplaints();
                } catch (error) {
                    toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to delete record' });
                }
            }
        });
    };

    const menuItems = [
        { label: 'Set Pending', icon: 'pi pi-clock', command: () => updateStatus(selectedComplaint.id || selectedComplaint._id, 'PENDING') },
        { label: 'Set In Progress', icon: 'pi pi-spinner', command: () => updateStatus(selectedComplaint.id || selectedComplaint._id, 'IN_PROGRESS') },
        { label: 'Set Resolved', icon: 'pi pi-check', command: () => updateStatus(selectedComplaint.id || selectedComplaint._id, 'RESOLVED') },
    ];

    const statsConfig = [
        { label: 'Total Complaints', value: stats.total, sub: 'All registered', icon: 'pi-file', iconColor: 'text-blue-500', bg: 'bg-blue-50', textColor: 'text-blue-500' },
        { label: 'Resolved', value: stats.resolved, sub: 'Successfully closed', icon: 'pi-check-circle', iconColor: 'text-emerald-500', bg: 'bg-emerald-50', textColor: 'text-emerald-500' },
        { label: 'Pending', value: stats.pending, sub: 'Awaiting action', icon: 'pi-clock', iconColor: 'text-rose-500', bg: 'bg-rose-50', textColor: 'text-rose-500' },
        { label: 'In-progress', value: stats.inProgress, sub: 'Currently handling', icon: 'pi-sync', iconColor: 'text-amber-500', bg: 'bg-amber-50', textColor: 'text-amber-500' },
    ];

    const renderComplaintCard = (complaint) => (
        <div key={complaint.adminId || complaint.id || complaint._id} className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 transition-all duration-500 relative flex flex-col min-h-[400px] overflow-hidden">
            {/* Background Glow */}
            <div className="absolute -right-20 -top-20 w-40 h-40 bg-blue-50/50 rounded-full blur-3xl transition-colors duration-700" />
            
            <div className="relative z-10 flex flex-col h-full flex-grow">
                <div className="flex justify-between items-start mb-8">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100 transition-all duration-500 shadow-sm">
                            <i className="pi pi-user text-xl" />
                        </div>
                        <div className="flex flex-col gap-1">
                            <h3 className="font-bold text-slate-800 text-base leading-tight transition-colors">
                                {complaint.complainerName || complaint.complainer || complaint.customerName || 'Customer'}
                            </h3>
                            <div className="flex items-center gap-2">
                                <i className="pi pi-phone text-[10px] text-slate-300"></i>
                                <span className="text-[10px] font-semibold text-slate-400 tracking-tight uppercase">
                                    {complaint.customerMobileNumber || complaint.mobileNumber || 'No Contact'}
                                </span>
                            </div>
                        </div>
                    </div>
                    <StatusTag status={complaint.status || 'PENDING'} className="text-[10px] font-bold h-8 px-4 rounded-xl shadow-sm" />
                </div>

                <div className="space-y-6 flex-grow">
                    <div className="bg-slate-50/50 rounded-3xl p-6 border border-slate-100/50 transition-all duration-500 shadow-inner">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                                <div className="w-1.5 h-4 bg-blue-500 rounded-full" />
                                <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-blue-500">{complaint.complaintType || complaint.type || 'SERVICE'}</span>
                            </div>
                        </div>
                        <p className="text-[13px] text-slate-600 font-semibold leading-relaxed italic line-clamp-4">
                            &quot;{complaint.description || complaint.complaint || 'No detailed description provided.'}&quot;
                        </p>
                    </div>
                </div>

                <div className="mt-8 flex items-center justify-between pt-6 border-t border-slate-50 relative z-10">
                    <div className="flex items-center gap-2 text-slate-400 text-[11px] font-semibold uppercase tracking-wider">
                        <i className="pi pi-calendar text-[12px] text-blue-400" />
                        {complaint.createdAt ? new Date(complaint.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                    </div>
                    <ActionButtons
                        onEdit={(e) => {
                            setSelectedComplaint(complaint);
                            menu.current.toggle(e);
                        }}
                        onDelete={() => deleteComplaint(complaint)}
                        editTooltip="Update Protocol"
                    />
                </div>
            </div>
        </div>
    );

    return (
        <div className="animate-fade-in">
            <Toast ref={toast} />
            <Menu model={menuItems} popup ref={menu} id="status_menu" className="rounded-2xl border-none shadow-xl" />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {statsConfig.map((s, i) => (
                    <div key={i} className="premium-card group relative overflow-hidden flex items-center justify-between min-h-[160px] p-6">
                        <div className="flex flex-col h-full justify-between z-10">
                            <div className="flex flex-col gap-1">
                                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-[0.2em]">{s.label}</span>
                                <h2 className="text-5xl font-semibold text-slate-900 tracking-tight leading-none">{s.value}</h2>
                            </div>
                            <div className={`text-[12px] font-semibold ${s.textColor || (s.iconColor?.includes('emerald') ? 'text-emerald-500' : s.iconColor?.includes('rose') ? 'text-rose-500' : s.iconColor?.includes('amber') ? 'text-amber-500' : 'text-blue-500')} flex items-start gap-2 mt-6 max-w-[110px] leading-tight`}>
                                <span className={`w-2 h-2 rounded-full bg-current opacity-40 mt-1 shrink-0`} />
                                {s.sub}
                            </div>
                        </div>
                        <div className={`w-24 h-24 rounded-[2rem] ${s.bg || 'bg-blue-50'} flex items-center justify-center ${s.iconColor || 'text-blue-500'} shadow-[inset_0_2px_10px_rgba(0,0,0,0.02)] transition-all duration-500`}>
                            <i className={`pi ${s.icon || 'pi-file'} text-4xl`} />
                        </div>
                        <div className={`absolute -right-8 -bottom-8 w-40 h-40 rounded-full ${s.bg || 'bg-blue-50'} opacity-10 blur-3xl transition-opacity duration-500`} />
                    </div>
                ))}
            </div>

            <ListLayout
                title="Complaints Management"
                subtitle="Track and resolve customer issues"
                data={complaints}
                loading={loading}
                globalFilter={globalFilter}
                setGlobalFilter={setGlobalFilter}
                onAdd={null}
                emptyMessage="No complaints recorded yet"
                renderItem={renderComplaintCard}
            />
        </div>
    );
};

export default ComplaintList;

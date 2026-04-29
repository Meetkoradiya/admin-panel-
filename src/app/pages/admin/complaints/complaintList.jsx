import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import useApi from '@/hooks/useApi';
import ListLayout from '@/components/shared/ListLayout';
import StatusTag from '@/components/shared/StatusTag';
import ActionButtons from '@/components/shared/ActionButtons';
import { showConfirmDialog } from '@/utils/confirmUtils';
import noComplaintsImg from '@/assets/illustrations/dashboard-meet.svg';

const ComplaintList = () => {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(false);
    const [globalFilter, setGlobalFilter] = useState("");
    const toast = useRef(null);
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
            const data = await apiGet('/admin/complaints');
            const list = data?.data || data || [];
            setComplaints(Array.isArray(list) ? list : []);

            // Calculate stats if not provided by API
            if (Array.isArray(list)) {
                setStats({
                    total: list.length,
                    resolved: list.filter(c => c.status === 'RESOLVED').length,
                    pending: list.filter(c => c.status === 'PENDING').length,
                    inProgress: list.filter(c => c.status === 'IN_PROGRESS').length
                });
            }
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

    const deleteComplaint = async (rowData) => {
        showConfirmDialog({
            title: 'Remove Complaint',
            message: `Permanently delete this complaint record?`,
            acceptLabel: 'Delete',
            onAccept: async () => {
                try {
                    await apiDelete(`/admin/complaints/${rowData.id || rowData._id}`);
                    toast.current?.show({ severity: 'success', summary: 'Deleted', detail: 'Complaint removed successfully' });
                    fetchComplaints();
                } catch (error) {
                    toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to delete record' });
                }
            }
        });
    };

    const emptyTemplate = () => (
        <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
            <img src={noComplaintsImg} alt="No Complaints" className="w-64 h-auto opacity-80" />
            <h3 className="text-xl font-black text-slate-800 mt-6 tracking-tight">No Complaints Available</h3>
            <p className="text-slate-400 font-medium text-sm mt-2 text-center max-w-xs">No complaints have been registered yet. New complaints will be displayed here once submitted.</p>
        </div>
    );

    const StatCard = ({ title, count, subtitle, icon, color, bgColor }) => (
        <div className="bg-white p-6 rounded-3xl border border-slate-50 shadow-sm flex flex-col gap-4 min-w-[240px]">
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{title}</span>
                    <span className="text-3xl font-black text-slate-800">{count}</span>
                </div>
                <div className={`w-12 h-12 rounded-2xl ${bgColor} flex items-center justify-center ${color} shadow-sm`}>
                    <i className={`pi ${icon} text-xl`} />
                </div>
            </div>
            <p className="text-xs font-bold text-slate-400 tracking-tight">{subtitle}</p>
        </div>
    );

    return (
        <div className="grid grid-cols-12 gap-6 animate-fade-in">
            <Toast ref={toast} />

            {/* Left: Complaints Table */}
            <div className="col-span-12 xl:col-span-9">
                <ListLayout
                    title="Complaints"
                    subtitle="Monitor and resolve customer service issues and feedback"
                    data={complaints}
                    loading={loading}
                    globalFilter={globalFilter}
                    setGlobalFilter={setGlobalFilter}
                    onAdd={null}
                    emptyTemplate={emptyTemplate}
                >
                    <Column field="no" header="No." body={(_, opts) => <span className="text-slate-400 font-bold text-xs">{opts.rowIndex + 1}</span>} style={{ width: '4rem', textAlign: 'center' }} />
                    <Column header="Status" body={(row) => <StatusTag status={row.status || 'PENDING'} />} sortable sortField="status" style={{ width: '10rem', textAlign: 'center' }} />
                    <Column field="complainer" header="Complainer" body={(row) => <span className="font-bold text-slate-700">{row.complainer || row.customerName || '—'}</span>} sortable />
                    <Column field="type" header="Type" body={(row) => <span className="text-xs font-black uppercase tracking-wider text-slate-400 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">{row.type || 'SERVICE'}</span>} sortable />
                    <Column field="complaint" header="Complaint" className="text-slate-600 text-sm max-w-xs truncate" />
                    <Column field="createdAt" header="Date" body={(row) => <span className="text-slate-400 text-xs font-bold">{row.createdAt ? new Date(row.createdAt).toLocaleDateString() : '—'}</span>} sortable />
                    <Column header="Actions" body={(rowData) => (
                        <ActionButtons
                            onEdit={() => toast.current?.show({ severity: 'info', summary: 'Details', detail: 'Complaint detail view coming soon' })}
                            onDelete={() => deleteComplaint(rowData)}
                        />
                    )} style={{ width: '10rem', textAlign: 'center' }} />
                </ListLayout>
            </div>

            {/* Right: Stats Panel */}
            <div className="col-span-12 xl:col-span-3 flex flex-col gap-4">
                <StatCard
                    title="Total Complaints"
                    count={stats.total}
                    subtitle="All registered complaints"
                    icon="pi-file"
                    color="text-blue-500"
                    bgColor="bg-blue-50"
                />
                <StatCard
                    title="Resolved Complaints"
                    count={stats.resolved}
                    subtitle="Successfully closed"
                    icon="pi-check-circle"
                    color="text-emerald-500"
                    bgColor="bg-emerald-50"
                />
                <StatCard
                    title="Pending Complaints"
                    count={stats.pending}
                    subtitle="Awaiting action"
                    icon="pi-clock"
                    color="text-rose-500"
                    bgColor="bg-rose-50"
                />
                <StatCard
                    title="In-progress Complaints"
                    count={stats.inProgress}
                    subtitle="Currently handling"
                    icon="pi-spinner pi-spin"
                    color="text-amber-500"
                    bgColor="bg-amber-50"
                />
            </div>
        </div>
    );
};

export default ComplaintList;

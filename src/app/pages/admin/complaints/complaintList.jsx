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
        { label: 'Total Complaints', value: stats.total, sub: 'All registered', icon: 'pi-file', iconColor: 'text-blue-500', bg: 'bg-blue-50' },
        { label: 'Resolved', value: stats.resolved, sub: 'Successfully closed', icon: 'pi-check-circle', iconColor: 'text-emerald-500', bg: 'bg-emerald-50' },
        { label: 'Pending', value: stats.pending, sub: 'Awaiting action', icon: 'pi-clock', iconColor: 'text-rose-500', bg: 'bg-rose-50' },
        { label: 'In-progress', value: stats.inProgress, sub: 'Currently handling', icon: 'pi-spinner pi-spin', iconColor: 'text-amber-500', bg: 'bg-amber-50' },
    ];

    return (
        <div className="animate-fade-in">
            <Toast ref={toast} />
            <Menu model={menuItems} popup ref={menu} id="status_menu" />

            <ListLayout
                title="Complaints"
                subtitle="Track and resolve customer issues"
                data={complaints}
                loading={loading}
                globalFilter={globalFilter}
                setGlobalFilter={setGlobalFilter}
                onAdd={null}
                emptyMessage="No complaints recorded yet"
                stats={statsConfig}
            >
                    <Column field="no" header="No." body={(_, opts) => <span className="text-slate-400 font-bold text-xs">{opts.rowIndex + 1}</span>} style={{ width: '4rem', textAlign: 'center' }} />
                    <Column header="Status" body={(row) => <StatusTag status={row.status || 'PENDING'} />} sortable sortField="status" style={{ width: '10rem', textAlign: 'center' }} />
                    <Column field="complainer" header="Complainer" body={(row) => <span className="font-bold text-slate-700">{row.complainer || row.customerName || '—'}</span>} />
                    <Column field="type" header="Type" body={(row) => <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">{row.type || 'SERVICE'}</span>} />
                    <Column field="complaint" header="Complaint" className="text-slate-600 text-sm max-w-xs truncate" />
                    <Column field="createdAt" header="Date" body={(row) => <span className="text-slate-400 text-xs font-bold">{row.createdAt ? new Date(row.createdAt).toLocaleDateString() : '—'}</span>} />
                    <Column header="Actions" body={(rowData) => (
                        <ActionButtons
                            onEdit={(e) => {
                                setSelectedComplaint(rowData);
                                menu.current.toggle(e);
                            }}
                            onDelete={() => deleteComplaint(rowData)}
                            editTooltip="Change Status"
                        />
                    )} style={{ width: '10rem', textAlign: 'center' }} />
                </ListLayout>
        </div>
    );
};

export default ComplaintList;

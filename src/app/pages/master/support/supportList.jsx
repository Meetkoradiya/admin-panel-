import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { Tag } from 'primereact/tag';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { Page } from "@/components/shared/Page";
import { useSelector } from 'react-redux';
import { selectUserData } from '@/redux/slice/AuthSlice';
import useApi from '@/hooks/useApi';

const SupportList = () => {
    const user = useSelector(selectUserData);
    const [complaints, setComplaints] = useState([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const [loading, setLoading] = useState(false);
    const [selectedComplaint, setSelectedComplaint] = useState(null);
    const [showDialog, setShowDialog] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [newStatus, setNewStatus] = useState(null);
    const toast = useRef(null);
    const { apiGet, apiPut } = useApi();


    const statusOptions = [
        { label: 'Pending', value: 'PENDING' },
        { label: 'In Progress', value: 'IN_PROGRESS' },
        { label: 'Resolved', value: 'RESOLVED' },
        { label: 'Rejected', value: 'REJECTED' }
    ];

    const fetchComplaints = async () => {
        setLoading(true);
        try {
            const data = await apiGet('/customer/admin/complaints');
            const complaintsList = Array.isArray(data) ? data : (data?.data || data?.content || []);
            setComplaints(Array.isArray(complaintsList) ? complaintsList : []);
        } catch (error) {
            console.error("Error fetching complaints:", error);
            setComplaints([]);
            toast.current?.show({ 
                severity: 'error', 
                summary: 'Error', 
                detail: 'Could not load complaints' 
            });
        }
        setLoading(false);
    };


    useEffect(() => {
        fetchComplaints();
    }, []);

    const handleStatusUpdate = async () => {
        if (!newStatus || !selectedComplaint) return;
        setUpdating(true);
        try {
            const complaintId = selectedComplaint.id || selectedComplaint._id;
            await apiPut(`/customer/admin/complaints/${complaintId}/status?status=${newStatus}`, {});
            toast.current?.show({ severity: 'success', summary: 'Updated', detail: 'Complaint status changed' });
            setShowDialog(false);
            fetchComplaints();
        } catch (error) {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: error?.response?.data?.message || 'Status update failed' });
        } finally {
            setUpdating(false);
        }
    };

    const openStatusUpdate = (complaint) => {
        setSelectedComplaint(complaint);
        setNewStatus(complaint.status);
        setShowDialog(true);
    };

    const statusTemplate = (row) => {
        const status = row.status || 'PENDING';
        const map = {
            PENDING: { severity: 'warning', label: 'Pending' },
            IN_PROGRESS: { severity: 'info', label: 'In Progress' },
            RESOLVED: { severity: 'success', label: 'Resolved' },
            REJECTED: { severity: 'danger', label: 'Rejected' }
        };
        const cfg = map[status] || map.PENDING;
        return (
            <Tag
                value={cfg.label}
                severity={cfg.severity}
                style={{ borderRadius: '8px', fontSize: '11px', fontWeight: '700', padding: '4px 10px' }}
            />
        );
    };

    const dateTemplate = (row) => {
        if (!row.createdAt) return '—';
        return (
            <span className="text-slate-600 text-sm">
                {new Date(row.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
            </span>
        );
    };

    const typeTemplate = (row) => {
        const type = row.complaintType || 'General';
        return (
            <span className="px-3 py-1 rounded-lg text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
                {type}
            </span>
        );
    };

    const complainerTemplate = (row) => (
        <div className="flex flex-col">
            <span className="font-bold text-slate-800 text-sm">{row.complainerName || 'Customer'}</span>
            <span className="text-xs text-slate-400 font-medium">{row.customerMobileNumber || '—'}</span>
        </div>
    );

    const actionTemplate = (row) => (
        <Button
            icon="pi pi-pencil"
            label="Update"
            className="text-xs py-2 px-4 rounded-xl font-bold bg-blue-600 border-none text-white hover:bg-blue-700 hover:-translate-y-0.5 shadow-sm shadow-blue-200 transition-all"
            onClick={() => openStatusUpdate(row)}
        />
    );

    const header = (
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-2">
            <div>
                <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">Contact Support</h2>
                <p className="text-slate-400 text-sm mt-0.5">View and manage customer complaint tickets</p>
            </div>
            <div className="flex items-center gap-3 w-full md:w-auto">
                <span className="p-input-icon-left flex-1 md:flex-none relative">
                    <i className="pi pi-search text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <InputText
                        type="search"
                        onInput={(e) => setGlobalFilter(e.target.value)}
                        placeholder="Search complaints..."
                        className="p-inputtext-sm pl-10 border-slate-200 rounded-xl w-full md:w-56 bg-slate-50 outline-none transition-all focus:bg-white focus:ring-4 focus:ring-blue-500/5"
                    />
                </span>
                <Button
                    icon="pi pi-refresh"
                    className="w-10 h-10 rounded-xl bg-slate-100 border-none text-slate-600 hover:bg-slate-200 transition-all"
                    onClick={fetchComplaints}
                    loading={loading}
                    tooltip="Refresh"
                />
            </div>
        </div>
    );

    const pendingCount = complaints.filter(c => c.status === 'PENDING').length;
    const inProgressCount = complaints.filter(c => c.status === 'IN_PROGRESS').length;
    const resolvedCount = complaints.filter(c => c.status === 'RESOLVED').length;

    const dialogFooter = (
        <div className="flex justify-end gap-3 pt-2">
            <Button label="Cancel" icon="pi pi-times" className="p-button-outlined border-slate-200 text-slate-600 px-6 py-2 rounded-xl font-bold transition-all" onClick={() => setShowDialog(false)} disabled={updating} />
            <Button label="Update Status" icon="pi pi-check" className="bg-blue-600 border-none text-white px-8 py-2 rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all" onClick={handleStatusUpdate} loading={updating} />
        </div>
    );

    return (
        <Page title="Contact Support">
            <div className="p-4 md:p-8 bg-[#f8fafc] min-h-screen">
                <Toast ref={toast} />



                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 mb-8">
                    {[
                        { label: 'Total Tickets', value: complaints.length, icon: 'pi pi-envelope', color: 'from-sky-500 to-sky-600', shadow: 'shadow-sky-200/60' },
                        { label: 'Pending', value: pendingCount, icon: 'pi pi-clock', color: 'from-amber-500 to-orange-500', shadow: 'shadow-amber-200/60' },
                        { label: 'In Progress', value: inProgressCount, icon: 'pi pi-spin pi-spinner', color: 'from-blue-500 to-blue-600', shadow: 'shadow-blue-200/60' },
                        { label: 'Resolved', value: resolvedCount, icon: 'pi pi-check-circle', color: 'from-emerald-500 to-emerald-600', shadow: 'shadow-emerald-200/60' },
                    ].map((s) => (
                        <div key={s.label} className={`bg-linear-to-br ${s.color} rounded-3xl p-6 text-white shadow-xl ${s.shadow} relative overflow-hidden group transition-all duration-300`}>
                             <div className="absolute -right-2 -bottom-2 opacity-10 group-hover:scale-110 transition-transform duration-500">
                                <i className={`${s.icon} text-7xl`} />
                            </div>
                            <div className="flex items-center justify-between relative z-10">
                                <div>
                                    <p className="text-white/70 text-[10px] font-black uppercase tracking-widest">{s.label}</p>
                                    <p className="text-3xl font-black mt-1 tracking-tight">{loading ? '—' : s.value}</p>
                                </div>
                                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center border border-white/20">
                                    <i className={`${s.icon} text-lg`} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Table */}
                <div className="bg-white rounded-4xl shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                    <DataTable
                        value={complaints}
                        header={header}
                        paginator rows={10}
                        rowsPerPageOptions={[10, 25, 50]}
                        loading={loading}
                        globalFilter={globalFilter}
                        className="p-datatable-sm"
                        stripedRows rowHover
                        dataKey="id"
                        emptyMessage={
                            <div className="text-center py-16">
                                <i className="pi pi-envelope text-4xl text-slate-200 mb-4 block" />
                                <p className="text-slate-400 font-bold">No support tickets found</p>
                                <p className="text-slate-300 text-xs mt-1">Everything is running smoothly</p>
                            </div>
                        }
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first}–{last} of {totalRecords} tickets"
                        paginatorClassName="border-t border-slate-50 px-4 py-3"
                    >
                        <Column header="#" body={(_, o) => <span className="text-slate-400 font-black text-[10px]">{o.rowIndex + 1}</span>} style={{ width: '3.5rem' }} />
                        <Column header="Complainer" body={complainerTemplate} sortField="complainerName" sortable />
                        <Column header="Type" body={typeTemplate} sortField="complaintType" sortable style={{ width: '8rem' }} />
                        <Column field="description" header="Description" className="text-slate-500 text-sm font-medium" style={{ maxWidth: '280px' }} body={(row) => <p className="truncate text-sm text-slate-500 font-medium">{row.description || '—'}</p>} />
                        <Column header="Date" body={dateTemplate} sortField="createdAt" sortable style={{ width: '10rem' }} />
                        <Column header="Status" body={statusTemplate} style={{ textAlign: 'center', width: '9rem' }} sortField="status" sortable />
                        <Column header="Actions" body={actionTemplate} style={{ width: '8rem', textAlign: 'center' }} />
                    </DataTable>
                </div>

                {/* Status Update Dialog */}
                <Dialog
                    visible={showDialog}
                    onHide={() => setShowDialog(false)}
                    header={
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 shadow-inner">
                                <i className="pi pi-pencil text-base" />
                            </div>
                            <span className="font-extrabold text-slate-800 tracking-tight">Resolution Manager</span>
                        </div>
                    }
                    footer={dialogFooter}
                    style={{ width: '450px' }}
                    modal draggable={false}
                    className="rounded-3xl overflow-hidden shadow-3xl"
                >
                    <div className="pt-4 space-y-6">
                        {selectedComplaint && (
                            <div className="bg-slate-50 rounded-3xl p-5 border border-slate-100">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Active Ticket Details</p>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center"><span className="text-xs text-slate-500">Name</span><span className="font-bold text-slate-800 text-sm">{selectedComplaint.complainerName}</span></div>
                                    <div className="flex justify-between items-center"><span className="text-xs text-slate-500">Contact</span><span className="font-bold text-slate-800 text-sm">{selectedComplaint.complainerMobile || '—'}</span></div>
                                    <div className="flex flex-col gap-1 mt-2 border-t border-slate-200 pt-3">
                                        <span className="text-xs text-slate-500">Description</span>
                                        <p className="text-sm text-slate-700 font-medium leading-relaxed">{selectedComplaint.description}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div className="flex flex-col gap-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Resolution Protocol</label>
                            <Dropdown
                                value={newStatus}
                                options={statusOptions}
                                onChange={(e) => setNewStatus(e.value)}
                                className="w-full border-slate-200 rounded-2xl bg-slate-50 focus:bg-white transition-all shadow-sm outline-none ring-offset-2 ring-blue-500/10 focus:ring-4"
                                placeholder="Select next status..."
                            />
                        </div>
                    </div>
                </Dialog>
            </div>
        </Page>
    );
};

export default SupportList;

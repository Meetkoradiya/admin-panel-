import React, { useState, useEffect, useRef, useCallback } from 'react';
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

    const fetchComplaints = useCallback(async () => {
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
    }, [apiGet]);


    useEffect(() => {
        fetchComplaints();
    }, [fetchComplaints]);

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
    );    return (
        <Page title="Support list">
            <div className="bg-[#f4f7fa] min-h-[calc(100vh-4rem)] p-4 md:p-6">
                <Toast ref={toast} />

                {/* Header Section */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-10">
                    <h2 className="text-xl font-bold text-slate-800">Support list</h2>
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <i className="pi pi-search text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 text-sm" />
                            <InputText
                                type="search"
                                onInput={(e) => setGlobalFilter(e.target.value)}
                                placeholder="Quick Search..."
                                className="pl-11 pr-4 py-2.5 border-slate-200 rounded-xl w-full md:w-80 bg-white text-sm font-medium focus:border-blue-400 focus:ring-0 transition-all outline-none"
                            />
                        </div>
                        <Button
                            icon="pi pi-refresh"
                            className="w-10 h-10 rounded-xl bg-white border-slate-100 text-slate-600 hover:bg-slate-50 transition-all shadow-sm"
                            onClick={fetchComplaints}
                            loading={loading}
                        />
                    </div>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {[
                        { label: 'Total Tickets', value: complaints.length, icon: 'pi pi-envelope', bg: 'bg-blue-50', color: 'text-blue-600' },
                        { label: 'Pending', value: pendingCount, icon: 'pi pi-clock', bg: 'bg-amber-50', color: 'text-amber-600' },
                        { label: 'In Progress', value: inProgressCount, icon: 'pi pi-spin pi-spinner', bg: 'bg-indigo-50', color: 'text-indigo-600' },
                        { label: 'Resolved', value: resolvedCount, icon: 'pi pi-check-circle', bg: 'bg-emerald-50', color: 'text-emerald-600' },
                    ].map((s) => (
                        <div key={s.label} className="bg-white rounded-2xl shadow-sm p-6 border border-slate-100 flex items-center gap-5">
                            <div className={`w-14 h-14 rounded-xl ${s.bg} flex items-center justify-center ${s.color}`}>
                                <i className={`${s.icon} text-xl`} />
                            </div>
                            <div>
                                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">{s.label}</p>
                                <p className="text-2xl font-bold text-slate-800">{loading ? '—' : s.value}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Table */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <DataTable
                        value={complaints}
                        paginator
                        rows={10}
                        loading={loading}
                        globalFilter={globalFilter}
                        className="p-datatable-minimal"
                        responsiveLayout="scroll"
                        emptyMessage={
                            <div className="text-center py-20 text-slate-400 font-medium">
                                No support tickets found
                            </div>
                        }
                        dataKey="id"
                        rowHover
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
                        rowsPerPageOptions={[10, 20, 50]}
                    >
                        <Column field="no" header="No." body={(_, opts) => <span className="text-slate-600 font-medium text-sm ml-2">{opts.rowIndex + 1}</span>} style={{ width: '4rem' }} />
                        <Column header="Complainer" body={complainerTemplate} sortField="complainerName" sortable headerClassName="text-slate-500 font-bold text-xs uppercase tracking-wider bg-slate-50/50 py-4" />
                        <Column header="Type" body={typeTemplate} sortField="complaintType" sortable headerClassName="text-slate-500 font-bold text-xs uppercase tracking-wider bg-slate-50/50 py-4" />
                        <Column field="description" header="Description" className="text-slate-600 font-medium text-sm" body={(row) => <p className="truncate max-w-280px">{row.description || '—'}</p>} headerClassName="text-slate-500 font-bold text-xs uppercase tracking-wider bg-slate-50/50 py-4" />
                        <Column header="Date" body={dateTemplate} sortField="createdAt" sortable headerClassName="text-slate-500 font-bold text-xs uppercase tracking-wider bg-slate-50/50 py-4" />
                        <Column header="Status" body={statusTemplate} sortField="status" sortable style={{ textAlign: 'center' }} headerClassName="text-slate-500 font-bold text-xs uppercase tracking-wider bg-slate-50/50 py-4" />
                        <Column header="Actions" body={actionTemplate} style={{ width: '8rem', textAlign: 'center' }} headerClassName="text-slate-500 font-bold text-xs uppercase tracking-wider bg-slate-50/50 py-4" />
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

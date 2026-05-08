import React, { useState, useEffect, useRef, useCallback } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import Button from '@/components/ui/Button';
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
        if (!row.createdAt) return 'â€”';
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
            <span className="text-xs text-slate-400 font-medium">{row.customerMobileNumber || 'â€”'}</span>
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
        <div className="flex justify-end gap-3 pt-4">
            <Button 
                label="Discard" 
                icon="pi pi-trash" 
                variant="outline-danger" 
                className="px-8 font-bold transition-all h-11" 
                onClick={() => setShowDialog(false)} 
                disabled={updating} 
            />
            <Button 
                label="Update Status" 
                variant="primary" 
                className="px-10 font-bold shadow-lg shadow-blue-200 transition-all h-11" 
                onClick={handleStatusUpdate} 
                loading={updating} 
            />
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
                                <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">{s.label}</p>
                                <p className="text-2xl font-bold text-slate-800">{loading ? 'â€”' : s.value}</p>
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
                        <Column field="description" header="Description" className="text-slate-600 font-medium text-sm" body={(row) => <p className="truncate max-w-280px">{row.description || 'â€”'}</p>} headerClassName="text-slate-500 font-bold text-xs uppercase tracking-wider bg-slate-50/50 py-4" />
                        <Column header="Date" body={dateTemplate} sortField="createdAt" sortable headerClassName="text-slate-500 font-bold text-xs uppercase tracking-wider bg-slate-50/50 py-4" />
                        <Column header="Status" body={statusTemplate} sortField="status" sortable style={{ textAlign: 'center' }} headerClassName="text-slate-500 font-bold text-xs uppercase tracking-wider bg-slate-50/50 py-4" />
                        <Column header="Actions" body={actionTemplate} style={{ width: '8rem', textAlign: 'center' }} headerClassName="text-slate-500 font-bold text-xs uppercase tracking-wider bg-slate-50/50 py-4" />
                    </DataTable>
                      {/* Status Update Dialog */}
                <Dialog
                    visible={showDialog}
                    onHide={() => setShowDialog(false)}
                    className="custom-dialog-premium"
                    content={({ hide }) => (
                        <div className="flex flex-col items-center bg-white rounded-[2rem] md:rounded-[3rem] p-8 md:p-14 shadow-2xl w-[90vw] md:w-auto md:min-w-[460px] md:max-w-[550px] mx-auto border border-slate-50 animate-zoom-in relative">
                            <button 
                                onClick={() => setShowDialog(false)} 
                                className="absolute top-6 right-6 size-10 flex items-center justify-center rounded-full bg-slate-50 text-slate-400 hover:bg-slate-100 transition-all active:scale-90"
                            >
                                <i className="pi pi-times"></i>
                            </button>

                            <div className="flex items-center justify-center size-20 md:size-24 rounded-3xl bg-blue-50 text-blue-500 mb-8 shadow-sm">
                                <i className="pi pi-shield text-3xl md:text-4xl"></i>
                            </div>

                            <div className="text-center mb-10 w-full">
                                <h3 className="text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tight mb-3 px-2 leading-none uppercase">Resolution Manager</h3>
                                <p className="text-slate-400 font-bold text-[12px] md:text-sm uppercase tracking-widest leading-none">Update Ticket Protocol</p>
                            </div>

                            <div className="w-full flex flex-col gap-8">
                                {selectedComplaint && (
                                    <div className="bg-slate-50 rounded-[2rem] p-6 md:p-8 border border-slate-100 shadow-inner">
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="w-1.5 h-6 bg-blue-500 rounded-full"></div>
                                            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-[0.2em]">Active Ticket Information</span>
                                        </div>
                                        <div className="space-y-5">
                                            <div className="flex justify-between items-center pb-3 border-b border-slate-200/50">
                                                <span className="text-xs font-bold text-slate-400 uppercase">Customer</span>
                                                <span className="font-bold text-slate-800 text-sm">{selectedComplaint.complainerName}</span>
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <span className="text-xs font-bold text-slate-400 uppercase">Description</span>
                                                <p className="text-sm text-slate-600 font-bold leading-relaxed bg-white/50 p-4 rounded-xl border border-slate-100">{selectedComplaint.description}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="flex flex-col gap-3">
                                    <label className="text-[11px] font-extrabold text-slate-400 uppercase tracking-[0.2em] ml-1 mb-2">Target Status</label>
                                    <Dropdown
                                        value={newStatus}
                                        options={statusOptions}
                                        onChange={(e) => setNewStatus(e.value)}
                                        className="w-full border-slate-100 rounded-2xl bg-slate-50 h-14 md:h-16 flex items-center px-4 font-bold text-slate-700 focus:bg-white focus:ring-4 focus:ring-blue-500/5 transition-all shadow-sm"
                                        placeholder="Select new status..."
                                    />
                                </div>

                                <div className="flex flex-col gap-3 mt-4">
                                    <Button 
                                        label="Update Ticket" 
                                        onClick={handleStatusUpdate} 
                                        variant="primary"
                                        loading={updating}
                                        className="w-full h-14 md:h-16 text-base shadow-xl shadow-blue-500/20" 
                                    />
                                    <Button 
                                        label="Discard" 
                                        icon="pi pi-trash" 
                                        onClick={() => setShowDialog(false)} 
                                        variant="outlineDanger"
                                        className="w-full h-14 md:h-16 text-base" 
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                />                </Dialog>
            </div>
        </Page>
    );
};

export default SupportList;




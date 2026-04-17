import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { Tag } from 'primereact/tag';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Page } from "@/components/shared/Page";
import useApi from '@/hooks/useApi';

const DeviceList = () => {
    const [devices, setDevices] = useState([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const [loading, setLoading] = useState(false);
    const [actionLoading, setActionLoading] = useState({});
    const toast = useRef(null);
    const { apiGet, apiPut, apiDelete } = useApi();

    const fetchDevices = async () => {
        setLoading(true);
        try {
            const data = await apiGet('/auth/master/device-approvals');
            setDevices(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Fetch Devices Error:', error);
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to fetch device approvals' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchDevices(); }, []);

    const handleApprove = async (device) => {
        const deviceId = device.deviceId || device.id;
        setActionLoading(prev => ({ ...prev, [deviceId]: 'approving' }));
        try {
            await apiPut(`/auth/master/approve-device/${deviceId}`, {});
            toast.current?.show({ severity: 'success', summary: 'Approved', detail: `Device "${device.deviceName || deviceId}" approved successfully` });
            fetchDevices();
        } catch (error) {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: error?.response?.data?.message || 'Approval failed' });
        } finally {
            setActionLoading(prev => ({ ...prev, [deviceId]: null }));
        }
    };

    const handleReject = (device) => {
        const deviceId = device.deviceId || device.id;
        confirmDialog({
            message: `Reject device "${device.deviceName || deviceId}"? The device owner will lose access.`,
            header: 'Reject Device',
            icon: 'pi pi-exclamation-triangle',
            acceptClassName: 'p-button-danger',
            acceptLabel: 'Reject',
            rejectLabel: 'Cancel',
            accept: async () => {
                setActionLoading(prev => ({ ...prev, [deviceId]: 'rejecting' }));
                try {
                    await apiDelete(`/auth/master/approve-device/${deviceId}`);
                    toast.current?.show({ severity: 'warn', summary: 'Rejected', detail: 'Device request rejected' });
                    fetchDevices();
                } catch (error) {
                    toast.current?.show({ severity: 'error', summary: 'Error', detail: error?.response?.data?.message || 'Rejection failed' });
                } finally {
                    setActionLoading(prev => ({ ...prev, [deviceId]: null }));
                }
            }
        });
    };

    const statusTemplate = (row) => {
        const status = row.status || row.approvalStatus || 'PENDING';
        const map = {
            PENDING: { severity: 'warning', icon: 'pi pi-clock' },
            APPROVED: { severity: 'success', icon: 'pi pi-check-circle' },
            REJECTED: { severity: 'danger', icon: 'pi pi-times-circle' },
        };
        const cfg = map[status] || map.PENDING;
        return (
            <Tag
                value={status}
                severity={cfg.severity}
                icon={cfg.icon}
                style={{ borderRadius: '8px', fontSize: '11px', fontWeight: '700', padding: '4px 10px' }}
            />
        );
    };

    const deviceTemplate = (row) => (
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-50 flex items-center justify-center text-cyan-600 border border-cyan-100">
                <i className="pi pi-mobile text-lg" />
            </div>
            <div>
                <p className="font-bold text-slate-800 text-sm">{row.deviceName || 'Unknown Device'}</p>
                <p className="text-xs text-slate-400 font-mono">{row.deviceId || row.id || '—'}</p>
            </div>
        </div>
    );

    const dateTemplate = (row) => {
        if (!row.createdAt) return <span className="text-slate-400">—</span>;
        return (
            <span className="text-slate-600 text-sm font-medium">
                {new Date(row.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
            </span>
        );
    };

    const actionTemplate = (row) => {
        const deviceId = row.deviceId || row.id;
        const isPending = (row.status || row.approvalStatus || 'PENDING') === 'PENDING';
        const isApproving = actionLoading[deviceId] === 'approving';
        const isRejecting = actionLoading[deviceId] === 'rejecting';

        if (!isPending) {
            return <span className="text-slate-400 text-xs font-medium">No action needed</span>;
        }

        return (
            <div className="flex gap-2 justify-center">
                <Button
                    icon="pi pi-check"
                    label="Approve"
                    loading={isApproving}
                    className="text-xs py-2 px-4 rounded-xl font-bold bg-emerald-500 border-none text-white hover:bg-emerald-600 shadow-sm shadow-emerald-200 hover:-translate-y-0.5 transition-all"
                    onClick={() => handleApprove(row)}
                    disabled={isRejecting}
                />
                <Button
                    icon="pi pi-times"
                    label="Reject"
                    loading={isRejecting}
                    className="text-xs py-2 px-4 rounded-xl font-bold bg-rose-500 border-none text-white hover:bg-rose-600 shadow-sm shadow-rose-200 hover:-translate-y-0.5 transition-all"
                    onClick={() => handleReject(row)}
                    disabled={isApproving}
                />
            </div>
        );
    };

    const pendingCount = devices.filter(d => (d.status || d.approvalStatus || 'PENDING') === 'PENDING').length;
    const approvedCount = devices.filter(d => (d.status || d.approvalStatus) === 'APPROVED').length;

    const header = (
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-2">
            <div>
                <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">Device Verification</h2>
                <p className="text-slate-400 text-sm mt-0.5">Review and approve device login requests from customers</p>
            </div>
            <div className="flex items-center gap-3 w-full md:w-auto">
                <span className="p-input-icon-left flex-1 md:flex-none">
                    <i className="pi pi-search text-slate-400" />
                    <InputText
                        type="search"
                        onInput={(e) => setGlobalFilter(e.target.value)}
                        placeholder="Search devices..."
                        className="p-inputtext-sm border-slate-200 rounded-xl w-full md:w-56 bg-slate-50"
                    />
                </span>
                <Button
                    icon="pi pi-refresh"
                    className="w-10 h-10 rounded-xl bg-slate-100 border-none text-slate-600 hover:bg-slate-200 transition-all"
                    onClick={fetchDevices}
                    loading={loading}
                    tooltip="Refresh"
                />
            </div>
        </div>
    );

    return (
        <Page title="Device Verification">
            <div className="bg-[#f8fafc] min-h-[calc(100vh-5rem)]">
                <Toast ref={toast} />
                <ConfirmDialog />

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                    {[
                        { label: 'Total Devices', value: devices.length, icon: 'pi pi-mobile', color: 'from-cyan-500 to-cyan-600', shadow: 'shadow-cyan-200' },
                        { label: 'Pending Approval', value: pendingCount, icon: 'pi pi-clock', color: 'from-amber-500 to-orange-500', shadow: 'shadow-amber-200' },
                        { label: 'Approved', value: approvedCount, icon: 'pi pi-check-circle', color: 'from-emerald-500 to-emerald-600', shadow: 'shadow-emerald-200' },
                    ].map((s) => (
                        <div key={s.label} className={`bg-linear-to-br ${s.color} rounded-2xl p-5 text-white shadow-lg ${s.shadow}`}>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-white/70 text-xs font-semibold uppercase tracking-widest">{s.label}</p>
                                    <p className="text-3xl font-black mt-1">{loading ? '—' : s.value}</p>
                                </div>
                                <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
                                    <i className={`${s.icon} text-xl`} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Alert for pending */}
                {pendingCount > 0 && !loading && (
                    <div className="mb-5 bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600">
                            <i className="pi pi-exclamation-triangle text-lg" />
                        </div>
                        <div>
                            <p className="font-bold text-amber-800 text-sm">{pendingCount} device{pendingCount > 1 ? 's' : ''} awaiting approval</p>
                            <p className="text-amber-600 text-xs">Review and approve or reject device access requests below</p>
                        </div>
                    </div>
                )}

                {/* Table */}
                <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                    <DataTable
                        value={devices}
                        header={header}
                        paginator rows={10}
                        rowsPerPageOptions={[10, 25, 50]}
                        loading={loading}
                        globalFilter={globalFilter}
                        className="p-datatable-sm"
                        stripedRows rowHover
                        dataKey="id"
                        emptyMessage={
                            <div className="text-center py-12">
                                <i className="pi pi-mobile text-4xl text-slate-300 mb-3 block" />
                                <p className="text-slate-400 font-medium">No device approvals pending</p>
                                <p className="text-slate-300 text-sm mt-1">All device requests have been processed</p>
                            </div>
                        }
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first}–{last} of {totalRecords} devices"
                    >
                        <Column header="#" body={(_, o) => <span className="text-slate-400 font-bold text-xs">{o.rowIndex + 1}</span>} style={{ width: '3rem' }} />
                        <Column header="Device" body={deviceTemplate} sortField="deviceName" sortable />
                        <Column field="mobileNumber" header="Mobile" className="text-slate-600 font-medium text-sm" />
                        <Column field="fcmToken" header="FCM Token" className="text-xs font-mono text-slate-400" style={{ maxWidth: '140px' }} body={(row) => <span className="truncate block" style={{maxWidth:'120px'}}>{row.fcmToken || '—'}</span>} />
                        <Column header="Requested" body={dateTemplate} sortField="createdAt" sortable />
                        <Column header="Status" body={statusTemplate} style={{ textAlign: 'center' }} />
                        <Column header="Actions" body={actionTemplate} style={{ width: '180px', textAlign: 'center' }} />
                    </DataTable>
                </div>
            </div>
        </Page>
    );
};

export default DeviceList;

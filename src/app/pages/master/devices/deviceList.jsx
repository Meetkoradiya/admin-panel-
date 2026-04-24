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
            const deviceList = Array.isArray(data) ? data : (Array.isArray(data?.data) ? data.data : []);
            setDevices(deviceList);
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
                    await apiDelete(`/auth/master/reject-device/${deviceId}`);
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

    return (
        <Page title="Device list">
            <div className="bg-[#f4f7fa] min-h-[calc(100vh-4rem)] p-4 md:p-6">
                <Toast ref={toast} />
                <ConfirmDialog />

                {/* Stats Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                    {[
                        { label: 'Total Devices', value: devices.length, icon: 'pi pi-mobile', bg: 'bg-blue-50', color: 'text-blue-600' },
                        { label: 'Pending Approval', value: pendingCount, icon: 'pi pi-clock', bg: 'bg-amber-50', color: 'text-amber-600' },
                        { label: 'Approved', value: approvedCount, icon: 'pi pi-check-circle', bg: 'bg-emerald-50', color: 'text-emerald-600' },
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

                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    {/* Table Header */}
                    <div className="px-8 py-6 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <h2 className="text-xl font-bold text-slate-800">Device Verification</h2>
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
                                label="Refresh"
                                className="bg-[#3b82f6] border-none px-6 py-2.5 rounded-xl font-bold text-white shadow-sm hover:bg-blue-600 transition-all text-sm"
                                onClick={fetchDevices}
                                loading={loading}
                            />
                        </div>
                    </div>

                    {/* Table */}
                    <DataTable
                        value={devices}
                        paginator
                        rows={10}
                        loading={loading}
                        globalFilter={globalFilter}
                        className="p-datatable-minimal"
                        responsiveLayout="scroll"
                        emptyMessage={
                            <div className="text-center py-20 text-slate-400 font-medium">
                                No device requests found
                            </div>
                        }
                        dataKey="id"
                        rowHover
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
                        rowsPerPageOptions={[10, 20, 50]}
                    >
                        <Column field="no" header="No." body={(_, opts) => <span className="text-slate-600 font-medium text-sm ml-2">{opts.rowIndex + 1}</span>} style={{ width: '4rem' }} />
                        <Column header="Device" body={deviceTemplate} sortField="deviceName" sortable headerClassName="text-slate-500 font-bold text-xs uppercase tracking-wider bg-slate-50/50 py-4" />
                        <Column field="mobileNumber" header="Mobile Number" className="text-slate-600 font-medium text-sm" headerClassName="text-slate-500 font-bold text-xs uppercase tracking-wider bg-slate-50/50 py-4" />
                        <Column header="Requested" body={dateTemplate} sortField="createdAt" sortable headerClassName="text-slate-500 font-bold text-xs uppercase tracking-wider bg-slate-50/50 py-4" />
                        <Column header="Status" body={statusTemplate} sortField="status" sortable style={{ textAlign: 'center' }} headerClassName="text-slate-500 font-bold text-xs uppercase tracking-wider bg-slate-50/50 py-4" />
                        <Column header="Actions" body={actionTemplate} style={{ width: '18rem', textAlign: 'center' }} headerClassName="text-slate-500 font-bold text-xs uppercase tracking-wider bg-slate-50/50 py-4" />
                    </DataTable>
                </div>
            </div>
        </Page>
    );
};

export default DeviceList;

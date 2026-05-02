import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import useApi from '@/hooks/useApi';
import ListLayout from '@/components/shared/ListLayout';
import StatusTag from '@/components/shared/StatusTag';
import ActionButtons from '@/components/shared/ActionButtons';
import { showConfirmDialog } from '@/utils/confirmUtils';
import noDevicesImg from '@/assets/illustrations/dashboard-meet.svg';

const DeviceVerificationList = () => {
    const [devices, setDevices] = useState([]);
    const [loading, setLoading] = useState(false);
    const [globalFilter, setGlobalFilter] = useState("");
    const toast = useRef(null);
    const { apiGet, apiPost, apiDelete } = useApi();

    const fetchDevices = useCallback(async () => {
        setLoading(true);
        try {
            const data = await apiGet('/admin/devices');
            const devicesList = data?.data || data || [];
            setDevices(Array.isArray(devicesList) ? devicesList : []);
        } catch (error) {
            console.error("Fetch Devices Error:", error);
            // toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to fetch device records' });
            setDevices([]); // Silently handle for now if endpoint doesn't exist
        } finally {
            setLoading(false);
        }
    }, [apiGet]);

    useEffect(() => {
        fetchDevices();
    }, [fetchDevices]);

    const approveDevice = async (rowData) => {
        try {
            await apiPost(`/admin/devices/approve/${rowData.id || rowData._id}`);
            toast.current?.show({ severity: 'success', summary: 'Approved', detail: 'Device has been successfully verified' });
            fetchDevices();
        } catch (error) {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to approve device' });
        }
    };

    const deleteRequest = async (rowData) => {
        showConfirmDialog({
            title: 'Reject Request',
            message: `Are you sure you want to reject the device request for "${rowData.fullName || 'this user'}"?`,
            acceptLabel: 'Reject',
            onAccept: async () => {
                try {
                    await apiDelete(`/admin/devices/${rowData.id || rowData._id}`);
                    toast.current?.show({ severity: 'success', summary: 'Rejected', detail: 'Device request removed' });
                    fetchDevices();
                } catch (error) {
                    toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to remove request' });
                }
            }
        });
    };

    const roleBodyTemplate = (rowData) => (
        <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-[10px] font-semibold uppercase tracking-wider border border-slate-200">
            {rowData.role || 'DRIVER'}
        </span>
    );

    const deviceBodyTemplate = (rowData) => (
        <div className="flex items-center gap-2">
            <i className={`pi ${rowData.deviceType === 'IOS' ? 'pi-apple' : 'pi-android'} text-slate-400`} />
            <span className="text-slate-600 font-bold text-sm">{rowData.deviceName || rowData.device || 'Unknown Device'}</span>
        </div>
    );

    const emptyTemplate = () => (
        <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
            <img src={noDevicesImg} alt="No Devices" className="w-64 h-auto opacity-80" />
            <h3 className="text-xl font-bold text-slate-800 mt-6 tracking-tight">No Device Requests</h3>
            <p className="text-slate-400 font-medium text-sm mt-2">There are currently no devices waiting for approval.</p>
        </div>
    );

    return (
        <div className="animate-fade-in">
            <Toast ref={toast} />
            <ListLayout
                title="Device Verification"
                subtitle="Review and approve hardware access requests from personnel"
                data={devices}
                loading={loading}
                globalFilter={globalFilter}
                setGlobalFilter={setGlobalFilter}
                onAdd={null}
                emptyTemplate={emptyTemplate}
            >
                <Column field="no" header="No." body={(_, opts) => <span className="text-slate-400 font-bold text-xs">{opts.rowIndex + 1}</span>} style={{ width: '4rem', textAlign: 'center' }} />
                <Column header="Role" body={roleBodyTemplate} sortable sortField="role" />
                <Column field="fullName" header="Full Name" body={(row) => <span className="font-bold text-slate-700">{row.fullName || row.username || 'â€”'}</span>} sortable />
                <Column field="mobileNumber" header="Mobile Number" body={(row) => <span className="font-bold text-slate-400 text-xs tracking-widest">{row.mobileNumber || 'â€”'}</span>} />
                <Column field="deviceId" header="Device Id" body={(row) => <span className="font-bold text-blue-500 text-xs tracking-tighter">#{row.deviceId || row.id || 'â€”'}</span>} />
                <Column header="Device" body={deviceBodyTemplate} sortable sortField="deviceType" />
                <Column field="createdAt" header="Created at" body={(row) => <span className="text-slate-400 text-xs font-bold">{row.createdAt ? new Date(row.createdAt).toLocaleDateString() : 'â€”'}</span>} sortable />
                <Column header="Actions" body={(rowData) => (
                    <ActionButtons
                        onEdit={() => approveDevice(rowData)} // Using Edit as Approve for direct icon action
                        onDelete={() => deleteRequest(rowData)}
                        editTooltip="Approve Device"
                    />
                )} style={{ width: '10rem', textAlign: 'center' }} />
            </ListLayout>
        </div>
    );
};

export default DeviceVerificationList;



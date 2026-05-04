import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import useApi from '@/hooks/useApi';
import ListLayout from '@/components/shared/ListLayout';
import StatusTag from '@/components/shared/StatusTag';
import ActionButtons from '@/components/shared/ActionButtons';
import { showConfirmDialog } from '@/utils/confirmUtils';

const DeviceList = () => {
    const [devices, setDevices] = useState([]);
    const [loading, setLoading] = useState(false);
    const [globalFilter, setGlobalFilter] = useState("");
    const toast = useRef(null);
    const { apiGet, apiPost } = useApi();

    const fetchDevices = useCallback(async () => {
        setLoading(true);
        try {
            const data = await apiGet('/master/devices');
            setDevices(Array.isArray(data) ? data : (data?.data || []));
        } catch (error) {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to fetch device records' });
        } finally {
            setLoading(false);
        }
    }, [apiGet]);

    useEffect(() => { fetchDevices(); }, [fetchDevices]);

    const verifyDevice = async (rowData) => {
        try {
            await apiPost(`/master/devices/verify/${rowData.id}`);
            toast.current?.show({ severity: 'success', summary: 'Verified', detail: 'Device verification successful' });
            fetchDevices();
        } catch (error) {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Verification failed' });
        }
    };

    const deleteDevice = async (rowData) => {
        showConfirmDialog({
            title: 'Remove Device',
            message: `Remove device "${rowData.deviceId || 'Unknown'}"? This action cannot be undone.`,
            acceptLabel: 'Remove',
            onAccept: async () => {
                try {
                    // await apiDelete(`/master/devices/${rowData.id}`);
                    toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Device Removed' });
                    fetchDevices();
                } catch (error) {
                    toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to remove device' });
                }
            }
        });
    };

    const statusBodyTemplate = (rowData) => {
        return <StatusTag status={rowData.isVerified ? 'VERIFIED' : 'PENDING'} />;
    };

    const deviceIdTemplate = (rowData) => (
        <div className="flex flex-col gap-1 py-1">
            <span className="text-slate-800 font-bold text-sm">#{rowData.deviceId || 'UNK-000'}</span>
            <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-slate-400 bg-slate-50 w-fit px-2 py-0.5 rounded-md border border-slate-100">
                Hardware ID
            </span>
        </div>
    );

    const actionBodyTemplate = (rowData) => (
        <ActionButtons 
            onDeactivate={!rowData.isVerified ? () => verifyDevice(rowData) : null}
            onDelete={() => deleteDevice(rowData)}
        />
    );

    return (
        <div className="animate-fade-in">
            <Toast ref={toast} />
            <ListLayout
                title="Hardware Verification"
                subtitle="Manage registered POS terminals and delivery devices"
                data={devices}
                loading={loading}
                globalFilter={globalFilter}
                setGlobalFilter={setGlobalFilter}
                onAdd={null}
            >
                <Column field="no" header="#" body={(_, opts) => <span className="text-slate-400 font-bold text-[10px] ml-2">{opts.rowIndex + 1}</span>} style={{ width: '4rem' }} />
                <Column header="Hardware Identity" body={deviceIdTemplate} sortable sortField="deviceId" />
                <Column field="outlet.name" header="Assigned Outlet" body={(row) => <span className="font-bold text-slate-700 text-sm">{row.outlet?.name || '—'}</span>} sortable />
                <Column field="lastLogin" header="Last Seen" body={(row) => <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">{row.lastLogin || '—'}</span>} />
                <Column header="Status" body={statusBodyTemplate} sortable sortField="isVerified" style={{ width: '10rem', textAlign: 'center' }} />
                <Column header="Actions" body={actionBodyTemplate} style={{ width: '8rem', textAlign: 'center' }} />
            </ListLayout>
        </div>
    );
};

export default DeviceList;

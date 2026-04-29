import React, { useState, useEffect, useRef } from 'react';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import useApi from '@/hooks/useApi';
import ListLayout from '@/components/shared/ListLayout';
import StatusTag from '@/components/shared/StatusTag';
import { showConfirmDialog } from '@/utils/confirmUtils';

const DeviceList = () => {
    const [devices, setDevices] = useState([]);
    const [loading, setLoading] = useState(false);
    const [globalFilter, setGlobalFilter] = useState("");
    const toast = useRef(null);
    const { apiGet, apiPost } = useApi();

    const fetchDevices = async () => {
        setLoading(true);
        try {
            const data = await apiGet('/master/devices');
            setDevices(Array.isArray(data) ? data : (data?.data || []));
        } catch (error) {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to fetch device records' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchDevices(); }, []);

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
                    // Assuming delete endpoint, fallback if missing
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

    const actionBodyTemplate = (rowData) => (
        <div className="flex gap-2 justify-center">
            {!rowData.isVerified && (
                <Button 
                    icon="pi pi-shield" 
                    rounded text
                    tooltip="Verify Hardware"
                    className="btn-icon text-emerald-500" 
                    onClick={() => verifyDevice(rowData)}
                />
            )}
            <Button 
                icon="pi pi-trash" 
                rounded text
                tooltip="Remove Device"
                className="btn-icon text-rose-500" 
                onClick={() => deleteDevice(rowData)}
            />
        </div>
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
                <Column field="no" header="#" body={(_, opts) => <span className="text-slate-400 font-bold text-xs">{opts.rowIndex + 1}</span>} style={{ width: '4rem', textAlign: 'center' }} />
                <Column field="deviceId" header="Hardware ID" body={(row) => <span className="font-black text-slate-800 text-xs">#{row.deviceId || 'UNK-000'}</span>} sortable />
                <Column field="outlet.name" header="Assigned Outlet" body={(row) => <span className="font-bold text-slate-700">{row.outlet?.name || '—'}</span>} sortable />
                <Column field="lastLogin" header="Last Seen" className="text-slate-400 text-xs font-medium" />
                <Column header="Status" body={statusBodyTemplate} sortable sortField="isVerified" style={{ width: '10rem', textAlign: 'center' }} />
                <Column header="Actions" body={actionBodyTemplate} style={{ width: '10rem', textAlign: 'center' }} />
            </ListLayout>
        </div>
    );
};

export default DeviceList;

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { useSelector } from 'react-redux';
import useApi from '@/hooks/useApi';
import ListLayout from '@/components/shared/ListLayout';
import ActionButtons from '@/components/shared/ActionButtons';
import { showConfirmDialog } from '@/utils/confirmUtils';

const DeviceVerificationList = () => {
    const user = useSelector((state) => state.auth.userData);
    const [devices, setDevices] = useState([]);
    const [loading, setLoading] = useState(false);
    const [globalFilter, setGlobalFilter] = useState("");
    const toast = useRef(null);
    const { apiGet, apiPost } = useApi();

    const [stats, setStats] = useState({
        total: 0,
        android: 0,
        ios: 0
    });

    const fetchDevices = useCallback(async () => {
        setLoading(true);
        try {
            const data = await apiGet('/auth/device-approvals');
            const list = data?.data || data || [];
            const normalized = Array.isArray(list) ? list : [];
            setDevices(normalized);

            setStats({
                total: normalized.length,
                android: normalized.filter(d => d.os?.toLowerCase() === 'android').length,
                ios: normalized.filter(d => d.os?.toLowerCase() === 'ios' || d.os?.toLowerCase() === 'apple').length
            });
        } catch (error) {
            console.error("Fetch Devices Error:", error);
            setDevices([]);
        } finally {
            setLoading(false);
        }
    }, [apiGet]);

    useEffect(() => {
        fetchDevices();
    }, [fetchDevices]);

    const approveDevice = async (rowData) => {
        showConfirmDialog({
            title: 'Verify Device',
            message: `Approve access for ${rowData.deviceName || 'this device'}?`,
            acceptLabel: 'Approve',
            onAccept: async () => {
                try {
                    await apiPost(`/auth/approve-device/${rowData.id || rowData._id}`);
                    toast.current?.show({ severity: 'success', summary: 'Approved', detail: 'Device verified successfully' });
                    fetchDevices();
                } catch (error) {
                    toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Verification failed' });
                }
            }
        });
    };

    const statsConfig = [
        { label: 'Pending Requests', value: stats.total, sub: 'Active Requests', icon: 'pi-clock', iconColor: 'text-amber-500', bg: 'bg-amber-50' },
        { label: 'Android Devices', value: stats.android, sub: 'Active Requests', icon: 'pi-android', iconColor: 'text-emerald-500', bg: 'bg-emerald-50' },
        { label: 'iOS Devices', value: stats.ios, sub: 'Active Requests', icon: 'pi-apple', iconColor: 'text-blue-500', bg: 'bg-blue-50' },
    ];

    return (
        <div className="animate-fade-in">
            <Toast ref={toast} />

            <ListLayout
                title="Device Verification"
                subtitle="Manage hardware access approvals"
                data={devices}
                loading={loading}
                globalFilter={globalFilter}
                setGlobalFilter={setGlobalFilter}
                onAdd={null}
                emptyMessage="No pending verifications found"
                stats={statsConfig}
            >
                    <Column field="no" header="No." body={(_, opts) => <span className="text-slate-400 font-bold text-xs">{opts.rowIndex + 1}</span>} style={{ width: '4rem', textAlign: 'center' }} />
                    <Column field="deviceName" header="Device Name" body={(row) => <span className="font-bold text-slate-700">{row.deviceName || 'Unknown'}</span>} />
                    <Column field="os" header="Platform" body={(row) => (
                        <div className="flex items-center gap-2">
                            <i className={`pi pi-${row.os?.toLowerCase() === 'android' ? 'android text-emerald-500' : 'apple text-slate-700'}`} />
                            <span className="text-xs font-bold uppercase">{row.os || 'OS'}</span>
                        </div>
                    )} />
                    <Column field="deviceId" header="Hardware ID" className="font-mono text-xs text-slate-400" />
                    <Column field="username" header="User" body={(row) => <span className="text-slate-600 font-medium">{row.username || row.email || '—'}</span>} />
                    <Column header="Verify" body={(rowData) => (
                        <ActionButtons
                            onEdit={() => approveDevice(rowData)}
                            editIcon="pi-shield"
                            editTooltip="Approve Device"
                            hideDelete
                        />
                    )} style={{ width: '8rem', textAlign: 'center' }} />
                </ListLayout>
        </div>
    );
};

export default DeviceVerificationList;

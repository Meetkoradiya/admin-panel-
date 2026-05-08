import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import useApi from '@/hooks/useApi';
import ListLayout from '@/components/shared/ListLayout';
import ActionButtons from '@/components/shared/ActionButtons';
import { showConfirmDialog } from '@/utils/confirmUtils';

const DeviceList = () => {
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
            const data = await apiGet('/auth/master/device-approvals');
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

    const verifyDevice = async (rowData) => {
        showConfirmDialog({
            title: 'Approve Device',
            message: `Verify hardware ID for ${rowData.deviceName || 'device'}?`,
            acceptLabel: 'Approve',
            onAccept: async () => {
                try {
                    await apiPost(`/auth/master/approve-device/${rowData.id || rowData._id}`);
                    toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Device approved' });
                    fetchDevices();
                } catch (error) {
                    toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Approval failed' });
                }
            }
        });
    };

    const statsConfig = [
        { label: 'Total Pending', value: stats.total, sub: 'Waiting for approval', icon: 'pi-clock', iconColor: 'text-amber-500', bg: 'bg-amber-50' },
        { label: 'Android', value: stats.android, sub: 'Google ecosystem', icon: 'pi-android', iconColor: 'text-emerald-500', bg: 'bg-emerald-50' },
        { label: 'iOS / Apple', value: stats.ios, sub: 'Apple ecosystem', icon: 'pi-apple', iconColor: 'text-blue-500', bg: 'bg-blue-50' },
    ];

    return (
        <div className="flex flex-col gap-6 animate-fade-in">
            <Toast ref={toast} />

            <div className="w-full">
                <ListLayout
                    title="Master Device Verification"
                    subtitle="Security check for new hardware access"
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
                    <Column header="Verify" body={(rowData) => (
                        <ActionButtons
                            onEdit={() => verifyDevice(rowData)}
                            editIcon="pi-shield"
                            editTooltip="Verify Device"
                            hideDelete
                        />
                    )} style={{ width: '8rem', textAlign: 'center' }} />
                </ListLayout>
            </div>
        </div>
    );
};

export default DeviceList;

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

    const StatCard = ({ title, count, icon, color, bgColor }) => (
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs flex items-center justify-between flex-1">
            <div className="flex flex-col gap-1">
                <span className="text-[11px] font-medium text-slate-400">{title}</span>
                <span className="text-3xl font-bold text-slate-900 leading-none my-1">{count}</span>
                <span className={`text-[10px] font-semibold ${color}`}>Pending</span>
            </div>
            <div className={`w-10 h-10 rounded-full ${bgColor} flex items-center justify-center`}>
                <i className={`pi ${icon} text-lg ${color}`} />
            </div>
        </div>
    );

    return (
        <div className="flex flex-col gap-6 animate-fade-in">
            <Toast ref={toast} />

            {/* Top: Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard title="Total Pending" count={stats.total} icon="pi-clock" color="text-amber-500" bgColor="bg-amber-50" />
                <StatCard title="Android" count={stats.android} icon="pi-android" color="text-emerald-500" bgColor="bg-emerald-50" />
                <StatCard title="iOS / Apple" count={stats.ios} icon="pi-apple" color="text-blue-500" bgColor="bg-blue-50" />
            </div>

            {/* Bottom: Device Table (Full Width) */}
            <div className="w-full">
                <ListLayout
                    title="Master Device Verification"
                    subtitle=""
                    data={devices}
                    loading={loading}
                    globalFilter={globalFilter}
                    setGlobalFilter={setGlobalFilter}
                    onAdd={null}
                    emptyMessage="No pending verifications found"
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

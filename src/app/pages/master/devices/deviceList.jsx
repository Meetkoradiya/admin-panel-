import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Avatar } from 'primereact/avatar';
import dayjs from 'dayjs';
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
        pending: 0
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
                pending: normalized.length // Currently all in this list are pending
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
            message: `Verify hardware ID for ${rowData.deviceName || 'device'}? This will grant access to the system.`,
            acceptLabel: 'Approve',
            onAccept: async () => {
                try {
                    await apiPost(`/auth/master/approve-device/${rowData.deviceId || rowData.id || rowData._id}`);
                    toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Device approved successfully' });
                    fetchDevices();
                } catch (error) {
                    toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Approval failed' });
                }
            }
        });
    };

    const deviceBodyTemplate = (rowData) => (
        <div className="flex items-center gap-3 py-1">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500 border border-blue-100 shadow-sm">
                <i className="pi pi-mobile text-lg" />
            </div>
            <div className="flex flex-col">
                <span className="font-bold text-slate-800 text-sm leading-tight">{rowData.deviceName || 'Unknown Device'}</span>
                <span className="text-[10px] font-mono text-slate-400 mt-1 uppercase tracking-wider">{rowData.deviceId || 'NO-ID'}</span>
            </div>
        </div>
    );

    const userBodyTemplate = (rowData) => {
        const name = rowData.username || rowData.email || 'System User';
        return (
            <div className="flex items-center gap-3 py-1">
                <Avatar
                    label={name.charAt(0).toUpperCase()}
                    style={{ backgroundColor: '#f8fafc', color: '#64748b', width: '32px', height: '32px', fontSize: '12px', fontWeight: '700', borderRadius: '10px', border: '1px solid #e2e8f0' }}
                />
                <div className="flex flex-col">
                    <p className="font-semibold text-slate-700 text-xs leading-tight">{name}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{rowData.mobileNumber || 'No mobile'}</p>
                </div>
            </div>
        );
    };

    const statsConfig = [
        { label: 'Pending Requests', value: stats.pending, sub: 'Awaiting verification', icon: 'pi-shield', iconColor: 'text-blue-500', bg: 'bg-blue-50' },
        { label: 'Total Requests', value: stats.total, sub: 'Lifetime history', icon: 'pi-history', iconColor: 'text-slate-500', bg: 'bg-slate-50' },
    ];

    return (
        <div className="animate-fade-in">
            <Toast ref={toast} />

            <ListLayout
                title="Device Verification"
                subtitle="Review and authorize hardware access for system users"
                data={devices}
                loading={loading}
                globalFilter={globalFilter}
                setGlobalFilter={setGlobalFilter}
                onAdd={null}
                emptyMessage="No pending device verifications found"
                stats={statsConfig}
            >
                <Column field="no" header="No." body={(_, opts) => <span className="text-slate-400 font-bold text-[10px] ml-2">{opts.rowIndex + 1}</span>} style={{ width: '4rem' }} />
                
                <Column header="Device Information" body={deviceBodyTemplate} sortField="deviceName" />
                
                <Column header="Requested By" body={userBodyTemplate} sortField="username" />
                
                <Column header="Role" body={(row) => (
                    <span className="bg-slate-50 text-slate-600 px-2 py-1 rounded-md text-[10px] font-bold border border-slate-100 uppercase">
                        {row.role || 'USER'}
                    </span>
                )} style={{ width: '8rem', textAlign: 'center' }} />
                
                <Column header="Request Date" body={(row) => (
                    <span className="text-slate-400 text-[11px] font-medium">
                        {row.createdAt ? dayjs(row.createdAt).format('DD MMM YYYY, hh:mm A') : '—'}
                    </span>
                )} sortField="createdAt" style={{ width: '12rem' }} />
                
                <Column header="Actions" body={(rowData) => (
                    <ActionButtons
                        onEdit={() => verifyDevice(rowData)}
                        editIcon="pi-check-circle"
                        editTooltip="Approve Device"
                        hideDelete
                    />
                )} style={{ width: '8rem', textAlign: 'center' }} />
            </ListLayout>
        </div>
    );
};

export default DeviceList;


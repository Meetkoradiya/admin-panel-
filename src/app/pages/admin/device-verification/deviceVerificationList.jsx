import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { useSelector } from 'react-redux';
import useApi from '@/hooks/useApi';
import ListLayout from '@/components/shared/ListLayout';
import ActionButtons from '@/components/shared/ActionButtons';
import { showConfirmDialog } from '@/utils/confirmUtils';
import dayjs from 'dayjs';

const DeviceVerificationList = () => {
    const user = useSelector((state) => state.auth.userData);
    const [devices, setDevices] = useState([]);
    const [loading, setLoading] = useState(false);
    const [globalFilter, setGlobalFilter] = useState("");
    const toast = useRef(null);
    const { apiGet, apiPost } = useApi();

    const [stats, setStats] = useState({
        total: 0
    });

    const fetchDevices = useCallback(async () => {
        setLoading(true);
        try {
            const data = await apiGet('/auth/device-approvals');
            const list = data?.data || data || [];
            const normalized = Array.isArray(list) ? list : [];
            setDevices(normalized);

            setStats({
                total: normalized.length
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
                    await apiPost(`/auth/approve-device/${rowData.deviceId || rowData.id || rowData._id}`);
                    toast.current?.show({ severity: 'success', summary: 'Approved', detail: 'Device verified successfully' });
                    fetchDevices();
                } catch (error) {
                    toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Verification failed' });
                }
            }
        });
    };

    const roleBodyTemplate = (rowData) => {
        const role = rowData.role || 'USER';
        return (
            <span className={`rounded-lg px-2 py-1 text-[10px] font-bold uppercase tracking-wider ${
                role === 'ADMIN' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-blue-50 text-blue-600 border border-blue-100'
            }`}>
                {role}
            </span>
        );
    };

    const deviceBodyTemplate = (rowData) => (
        <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-500 border border-amber-100">
                <i className="pi pi-mobile text-sm" />
            </div>
            <span className="font-bold text-slate-700 text-sm">{rowData.deviceName || 'Unknown Device'}</span>
        </div>
    );

    const userBodyTemplate = (rowData) => {
        const name = rowData.username || rowData.email || 'Unknown User';
        const initial = name.charAt(0).toUpperCase();
        return (
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-xs">
                    {initial}
                </div>
                <span className="text-slate-600 font-medium text-sm">{name}</span>
            </div>
        );
    };

    return (
        <div className="animate-fade-in">
            <Toast ref={toast} />

            <ListLayout
                title="Device Verifications"
                subtitle="Review and authorize hardware access requests"
                data={devices}
                loading={loading}
                globalFilter={globalFilter}
                setGlobalFilter={setGlobalFilter}
                onAdd={null}
                emptyMessage="No pending device verifications"
            >
                <Column field="no" header="No." body={(_, opts) => <span className="text-slate-400 font-bold text-xs">{opts.rowIndex + 1}</span>} style={{ width: '4rem', textAlign: 'center' }} />
                
                <Column header="Role" body={roleBodyTemplate} sortField="role" style={{ width: '6rem' }} />
                
                <Column header="Full Name" body={userBodyTemplate} sortField="username" />
                
                <Column field="mobileNumber" header="Mobile Number" body={(row) => <span className="text-slate-500 font-medium text-sm">{row.mobileNumber || '—'}</span>} />
                
                <Column field="deviceId" header="Device Id" body={(row) => <span className="font-mono text-[11px] text-slate-400">{row.deviceId || '—'}</span>} />
                
                <Column header="Device" body={deviceBodyTemplate} sortField="deviceName" />
                
                <Column header="Created at" body={(row) => <span className="text-slate-400 text-xs font-medium">{row.createdAt ? dayjs(row.createdAt).format('DD MMM YYYY, hh:mm A') : '—'}</span>} sortField="createdAt" />
                
                <Column header="Actions" body={(rowData) => (
                    <div className="flex justify-center">
                        <ActionButtons
                            onEdit={() => approveDevice(rowData)}
                            editIcon="pi-shield"
                            editTooltip="Approve Device"
                            hideDelete
                        />
                    </div>
                )} style={{ width: '8rem', textAlign: 'center' }} />
            </ListLayout>
        </div>
    );
};

export default DeviceVerificationList;

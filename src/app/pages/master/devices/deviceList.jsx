import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
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
        pending: 0,
        authorized: 0
    });

    const fetchDevices = useCallback(async () => {
        setLoading(true);
        try {
            // Using a more robust endpoint if available, otherwise fallback
            const data = await apiGet('/auth/master/device-approvals');
            const list = data?.data || data || [];
            const normalized = Array.isArray(list) ? list : [];
            setDevices(normalized);

            setStats({
                total: normalized.length,
                pending: normalized.filter(d => d.status === 'PENDING' || !d.status).length,
                authorized: normalized.filter(d => d.status === 'APPROVED' || d.status === 'ACTIVE').length
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
            title: 'Approve Access',
            message: `Authorize hardware fingerprint for ${rowData.deviceName || 'this device'}? This grants system-wide permissions.`,
            type: 'primary',
            acceptLabel: 'Authorize',
            onAccept: async () => {
                try {
                    const id = rowData.deviceId || rowData.id || rowData._id;
                    await apiPost(`/auth/master/approve-device/${id}`);
                    toast.current?.show({ 
                        severity: 'success', 
                        summary: 'Access Granted', 
                        detail: 'Device successfully whitelisted in the system.',
                        life: 3000
                    });
                    fetchDevices();
                } catch (error) {
                    toast.current?.show({ 
                        severity: 'error', 
                        summary: 'Authorization Failed', 
                        detail: error?.response?.data?.message || 'System was unable to whitelist this hardware.',
                        life: 5000
                    });
                }
            }
        });
    };

    const deviceBodyTemplate = (rowData) => (
        <div className="flex items-center gap-4 py-1">
            <div className="w-11 h-11 rounded-2xl bg-blue-50/50 flex items-center justify-center text-blue-600 border border-blue-100 shadow-sm">
                <i className="pi pi-mobile text-xl" />
            </div>
            <div className="flex flex-col gap-0.5">
                <span className="font-medium text-slate-800 text-sm tracking-tight">{rowData.deviceName || 'Standard Terminal'}</span>
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100 w-fit">{rowData.deviceId || 'NO-FINGERPRINT'}</span>
            </div>
        </div>
    );

    const userBodyTemplate = (rowData) => {
        const name = rowData.username || rowData.email || 'System Personnel';
        return (
            <div className="flex items-center gap-3 py-1">
                <div className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center text-slate-500 font-medium text-xs border border-slate-100 shadow-sm">
                    {name.charAt(0).toUpperCase()}
                </div>
                <div className="flex flex-col">
                    <p className="font-medium text-slate-700 text-[13px] leading-none">{name}</p>
                    <p className="text-[10px] text-slate-400 mt-1.5 tracking-wider font-medium">{rowData.mobileNumber || 'No Contact'}</p>
                </div>
            </div>
        );
    };

    const statsConfig = [
        { label: 'Awaiting Review', value: stats.pending, sub: 'Hardware verification', icon: 'pi-shield', iconColor: 'text-blue-500', bg: 'bg-blue-50' },
        { label: 'Authorized Hubs', value: stats.authorized, sub: 'Active terminals', icon: 'pi-check-circle', iconColor: 'text-emerald-500', bg: 'bg-emerald-50' },
        { label: 'Global Registry', value: stats.total, sub: 'Historical records', icon: 'pi-database', iconColor: 'text-indigo-500', bg: 'bg-indigo-50' },
    ];

    return (
        <div className="animate-fade-in">
            <Toast ref={toast} />

            {/* Premium Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                {statsConfig.map((s, i) => (
                    <div key={i} className="premium-card group relative overflow-hidden flex items-center justify-between min-h-[160px] p-6">
                        <div className="flex flex-col h-full justify-between z-10">
                            <div className="flex flex-col gap-1">
                                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-[0.2em]">{s.label}</span>
                                <h2 className="text-5xl font-semibold text-slate-900 tracking-tight leading-none">{s.value}</h2>
                            </div>
                            <div className={`text-[12px] font-semibold ${s.iconColor} flex items-start gap-2 mt-6 max-w-[110px] leading-tight`}>
                                <span className={`w-2 h-2 rounded-full bg-current opacity-40 mt-1 shrink-0`} />
                                {s.sub}
                            </div>
                        </div>
                        <div className={`w-24 h-24 rounded-[2rem] ${s.bg} flex items-center justify-center ${s.iconColor} shadow-[inset_0_2px_10px_rgba(0,0,0,0.02)] transition-all duration-500`}>
                            <i className={`pi ${s.icon} text-4xl`} />
                        </div>
                        <div className={`absolute -right-8 -bottom-8 w-40 h-40 rounded-full ${s.bg} opacity-10 blur-3xl`} />
                    </div>
                ))}
            </div>

            <ListLayout
                title="Hardware Verification"
                subtitle="Review and authorize secure hardware access for administrative personnel"
                data={devices}
                loading={loading}
                globalFilter={globalFilter}
                setGlobalFilter={setGlobalFilter}
                onAdd={null}
                emptyMessage="No pending hardware verifications identified"
            >
                <Column field="no" header="No." body={(_, opts) => <span className="text-slate-400 font-medium text-[10px] ml-2">{opts.rowIndex + 1}</span>} style={{ width: '4rem' }} />
                
                <Column header="Hardware Identity" body={deviceBodyTemplate} sortField="deviceName" />
                
                <Column header="Personnel" body={userBodyTemplate} sortField="username" />
                
                <Column header="Access Role" body={(row) => (
                    <span className="bg-slate-50 text-slate-500 px-2.5 py-1 rounded-lg text-[10px] font-medium border border-slate-100 uppercase tracking-widest">
                        {row.role || 'Personnel'}
                    </span>
                )} style={{ width: '10rem', textAlign: 'center' }} />
                
                <Column header="Request Timeline" body={(row) => (
                    <span className="text-slate-500 text-[11px] font-medium tracking-tight">
                        {row.createdAt ? dayjs(row.createdAt).format('DD MMM YYYY, hh:mm A') : 'System Origin'}
                    </span>
                )} sortField="createdAt" style={{ width: '12rem' }} />
                
                <Column header="Security Actions" body={(rowData) => (
                    <ActionButtons
                        onEdit={() => verifyDevice(rowData)}
                        editIcon="pi-verified"
                        editTooltip="Authorize Access"
                        hideDelete
                    />
                )} style={{ width: '8rem', textAlign: 'center' }} />
            </ListLayout>
        </div>
    );
};

export default DeviceList;



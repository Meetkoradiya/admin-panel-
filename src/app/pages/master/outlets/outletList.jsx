import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { useNavigate } from 'react-router-dom';
import useApi from '@/hooks/useApi';
import ListLayout from '@/components/shared/ListLayout';
import StatusTag from '@/components/shared/StatusTag';
import ActionButtons from '@/components/shared/ActionButtons';
import { showConfirmDialog } from '@/utils/confirmUtils';

const OutletList = () => {
    const [outlets, setOutlets] = useState([]);
    const [loading, setLoading] = useState(false);
    const [globalFilter, setGlobalFilter] = useState("");
    
    const [stats, setStats] = useState({ 
        total: 0, 
        active: 0, 
        inactive: 0 
    });

    const toast = useRef(null);
    const navigate = useNavigate();
    const { apiGet, apiDelete } = useApi();

    const fetchOutlets = useCallback(async () => {
        setLoading(true);
        try {
            const res = await apiGet('/master/outlets');
            // Robust data extraction
            const list = Array.isArray(res) ? res : (res?.data?.outlets || res?.outlets || res?.data || []);
            const normalized = Array.isArray(list) ? list : [];
            setOutlets(normalized);
            
            setStats({
                total: normalized.length,
                active: normalized.filter(o => (o.status === 'ACTIVE' || o.status === true)).length,
                inactive: normalized.filter(o => (o.status === 'INACTIVE' || o.status === false)).length
            });
        } catch (error) {
            console.error("Fetch Outlets Error:", error);
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to fetch outlets' });
        } finally {
            setLoading(false);
        }
    }, [apiGet]);

    useEffect(() => { fetchOutlets(); }, [fetchOutlets]);

    const deleteOutlet = async (rowData) => {
        showConfirmDialog({
            title: 'Delete Outlet',
            message: `Remove outlet "${rowData.name}" from the system? This action cannot be undone.`,
            type: 'delete',
            acceptLabel: 'Delete',
            onAccept: async () => {
                try {
                    const id = rowData.id || rowData._id;
                    await apiDelete(`/master/outlets/${id}`);
                    toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Outlet successfully removed' });
                    fetchOutlets();
                } catch (error) {
                    toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to delete outlet. It might be linked to active accounts.' });
                }
            }
        });
    };

    const nameBodyTemplate = (rowData) => (
        <div className="flex items-center gap-3 py-1">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-500 font-bold text-sm border border-indigo-100 shadow-sm">
                {rowData.name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex flex-col">
                <span className="font-medium text-slate-800 text-sm tracking-tight">{rowData.name}</span>
                <div className="flex items-center gap-2 mt-1">
                    <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-slate-400 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">
                        {rowData.location || rowData.address || 'Standard Hub'}
                    </span>
                </div>
            </div>
        </div>
    );

    const actionBodyTemplate = (rowData) => (
        <ActionButtons 
            onEdit={() => navigate(`/master/outlets/edit/${rowData.id || rowData._id}`, { state: { outlet: rowData } })}
            onDelete={() => deleteOutlet(rowData)}
        />
    );

    const statsConfig = [
        { label: 'Total Outlets', value: stats.total, sub: 'Global network', icon: 'pi-map-marker', iconColor: 'text-indigo-500', bg: 'bg-indigo-50' },
        { label: 'Active Status', value: stats.active, sub: 'Operating hubs', icon: 'pi-check-circle', iconColor: 'text-emerald-500', bg: 'bg-emerald-50' },
        { label: 'Inactive Hubs', value: stats.inactive, sub: 'Service paused', icon: 'pi-times-circle', iconColor: 'text-rose-500', bg: 'bg-rose-50' },
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
                title="Outlet Management"
                subtitle="Oversee franchise distribution and regional logistics"
                data={outlets}
                loading={loading}
                globalFilter={globalFilter}
                setGlobalFilter={setGlobalFilter}
                onAdd={() => navigate('/master/outlets/add')}
                addLabel="New Outlet"
            >
                <Column field="no" header="No." body={(_, opts) => <span className="text-slate-400 font-medium text-[10px] ml-2">{opts.rowIndex + 1}</span>} style={{ width: '4rem' }} />
                <Column header="Outlet Identity" body={nameBodyTemplate} sortField="name" />
                <Column field="mobileNumber" header="Contact Protocol" body={(row) => <span className="text-slate-600 font-medium text-xs tracking-widest">{row.mobileNumber || row.contact || '—'}</span>} />
                <Column field="status" header="Status" body={(row) => <StatusTag status={row.status || 'ACTIVE'} />} sortable sortField="status" style={{ width: '10rem', textAlign: 'center' }} />
                <Column header="Actions" body={actionBodyTemplate} style={{ width: '8rem', textAlign: 'center' }} />
            </ListLayout>
        </div>
    );
};

export default OutletList;


import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { Tag } from 'primereact/tag';
import { Avatar } from 'primereact/avatar';
import { Page } from "@/components/shared/Page";
import useApi from '@/hooks/useApi';

const SubscriptionList = () => {
    const [admins, setAdmins] = useState([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const [loading, setLoading] = useState(false);
    const toast = useRef(null);
    const { apiGet } = useApi();

    // Fetch all admins - Master Admin's subscription view shows
    // all registered admins and their outlet/plan association
    const fetchAdmins = async () => {
        setLoading(true);
        try {
            const data = await apiGet('/admin/admins');
            // /admin/admins returns ApiResponse { data: UserDTO[] }
            const list = Array.isArray(data)
                ? data
                : (Array.isArray(data?.data) ? data.data : []);
            setAdmins(list);
        } catch (error) {
            console.error('Fetch Admins Error:', error);
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to fetch admin subscriptions' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchAdmins(); }, []);

    // UserDTO fields: id, mobileNumber, username, email, role, status, createdAt, address, profileImageUrl, outletName
    const nameTemplate = (row) => {
        const name = row.username || 'Admin';
        const initials = name.charAt(0).toUpperCase();
        const colors = ['#6366f1', '#0ea5e9', '#10b981', '#f59e0b', '#ef4444'];
        const bg = colors[row.id % colors.length] || '#6366f1';
        return (
            <div className="flex items-center gap-3">
                <Avatar
                    label={initials}
                    style={{
                        backgroundColor: bg, color: '#fff',
                        width: '38px', height: '38px',
                        fontSize: '15px', fontWeight: '800',
                        borderRadius: '12px',
                        boxShadow: `0 4px 14px ${bg}40`
                    }}
                />
                <div className="flex flex-col">
                    <p className="font-bold text-slate-800 text-sm leading-tight">{name}</p>
                    <p className="text-xs text-slate-400 font-medium">{row.email || row.mobileNumber || '—'}</p>
                </div>
            </div>
        );
    };

    const outletTemplate = (row) => {
        if (!row.outletName) {
            return <span className="text-slate-300 text-xs font-medium italic">No outlet assigned</span>;
        }
        return (
            <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center">
                    <i className="pi pi-building text-indigo-500 text-xs" />
                </div>
                <span className="font-semibold text-slate-700 text-sm">{row.outletName}</span>
            </div>
        );
    };

    const roleTemplate = (row) => {
        const isMaster = row.role === 'MASTER_ADMIN';
        return (
            <Tag
                value={isMaster ? 'Master Admin' : 'Admin'}
                icon={isMaster ? 'pi pi-crown' : 'pi pi-user'}
                className={isMaster
                    ? 'bg-violet-50 text-violet-700 border border-violet-100'
                    : 'bg-blue-50 text-blue-700 border border-blue-100'}
                style={{ borderRadius: '8px', fontSize: '11px', fontWeight: '700', padding: '4px 10px' }}
            />
        );
    };

    const statusTemplate = (row) => {
        const status = row.status || 'ACTIVE';
        const cfg = {
            ACTIVE: { severity: 'success', label: 'Active' },
            INACTIVE: { severity: 'warning', label: 'Inactive' },
            DELETE: { severity: 'danger', label: 'Deleted' },
        };
        const { severity, label } = cfg[status] || cfg.ACTIVE;
        return (
            <Tag
                value={label}
                severity={severity}
                style={{ borderRadius: '8px', fontSize: '11px', fontWeight: '700', padding: '4px 10px' }}
            />
        );
    };

    const joinedTemplate = (row) => {
        if (!row.createdAt) return <span className="text-slate-400 text-xs">—</span>;
        return (
            <span className="text-slate-600 text-sm font-medium">
                {new Date(row.createdAt).toLocaleDateString('en-IN', {
                    day: '2-digit', month: 'short', year: 'numeric'
                })}
            </span>
        );
    };

    const mobileTemplate = (row) => (
        <span className="text-slate-700 font-medium text-sm font-mono">
            {row.mobileNumber || '—'}
        </span>
    );

    const header = (
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-2">
            <div>
                <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">Admin Subscriptions</h2>
                <p className="text-slate-400 text-sm mt-0.5">All registered admins and their outlet assignments</p>
            </div>
            <div className="flex items-center gap-3 w-full md:w-auto">
                <span className="p-input-icon-left flex-1 md:flex-none relative">
                    <i className="pi pi-search text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <InputText
                        type="search"
                        onInput={(e) => setGlobalFilter(e.target.value)}
                        placeholder="Search admins..."
                        className="p-inputtext-sm pl-10 border-slate-200 rounded-xl w-full md:w-64 bg-slate-50 outline-none"
                    />
                </span>
                <Button
                    icon="pi pi-refresh"
                    className="w-10 h-10 rounded-xl bg-slate-100 border-none text-slate-600 hover:bg-slate-200 transition-all"
                    onClick={fetchAdmins}
                    loading={loading}
                    tooltip="Refresh"
                />
            </div>
        </div>
    );

    const totalAdmins = admins.length;
    const activeAdmins = admins.filter(a => a.status === 'ACTIVE').length;
    const withOutlet = admins.filter(a => a.outletName).length;

    return (
        <Page title="Admin Subscriptions">
            <div className="bg-[#f8fafc] min-h-[calc(100vh-5rem)]">
                <Toast ref={toast} />

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                    {[
                        { label: 'Total Admins', value: totalAdmins, icon: 'pi pi-users', color: 'from-blue-500 to-blue-600', shadow: 'shadow-blue-200' },
                        { label: 'Active Admins', value: activeAdmins, icon: 'pi pi-check-circle', color: 'from-emerald-500 to-emerald-600', shadow: 'shadow-emerald-200' },
                        { label: 'Outlet Assigned', value: withOutlet, icon: 'pi pi-building', color: 'from-violet-500 to-violet-600', shadow: 'shadow-violet-200' },
                    ].map((s) => (
                        <div key={s.label} className={`bg-gradient-to-br ${s.color} rounded-2xl p-5 text-white shadow-lg ${s.shadow}`}>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-white/70 text-xs font-semibold uppercase tracking-widest">{s.label}</p>
                                    <p className="text-3xl font-black mt-1">{loading ? '—' : s.value}</p>
                                </div>
                                <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
                                    <i className={`${s.icon} text-xl`} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Table */}
                <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                    <DataTable
                        value={admins}
                        header={header}
                        paginator rows={10}
                        rowsPerPageOptions={[10, 25, 50]}
                        loading={loading}
                        globalFilter={globalFilter}
                        className="p-datatable-sm"
                        stripedRows rowHover
                        dataKey="id"
                        emptyMessage={
                            <div className="text-center py-12">
                                <i className="pi pi-users text-4xl text-slate-300 mb-3 block" />
                                <p className="text-slate-400 font-medium">No admins registered yet</p>
                                <p className="text-slate-300 text-sm mt-1">Add an admin from the Admin Management page</p>
                            </div>
                        }
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first}–{last} of {totalRecords} admins"
                    >
                        <Column header="#" body={(_, opts) => <span className="text-slate-400 font-bold text-xs">{opts.rowIndex + 1}</span>} style={{ width: '3rem' }} />
                        <Column header="Administrator" body={nameTemplate} sortField="username" sortable />
                        <Column header="Mobile" body={mobileTemplate} sortField="mobileNumber" sortable style={{ width: '10rem' }} />
                        <Column header="Outlet" body={outletTemplate} sortField="outletName" sortable />
                        <Column header="Role" body={roleTemplate} sortField="role" sortable style={{ textAlign: 'center', width: '9rem' }} />
                        <Column header="Joined" body={joinedTemplate} sortField="createdAt" sortable style={{ width: '9rem' }} />
                        <Column header="Status" body={statusTemplate} sortField="status" sortable style={{ textAlign: 'center', width: '8rem' }} />
                    </DataTable>
                </div>
            </div>
        </Page>
    );
};

export default SubscriptionList;

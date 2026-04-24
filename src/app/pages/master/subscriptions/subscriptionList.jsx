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


    return (
        <Page title="Subscription list">
            <div className="bg-[#f4f7fa] min-h-[calc(100vh-4rem)] p-4 md:p-6">
                <Toast ref={toast} />

                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    {/* Table Header */}
                    <div className="px-8 py-6 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <h2 className="text-xl font-bold text-slate-800">Subscription list</h2>
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <i className="pi pi-search text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 text-sm" />
                                <InputText
                                    type="search"
                                    onInput={(e) => setGlobalFilter(e.target.value)}
                                    placeholder="Quick Search..."
                                    className="pl-11 pr-4 py-2.5 border-slate-200 rounded-xl w-full md:w-80 bg-white text-sm font-medium focus:border-blue-400 focus:ring-0 transition-all outline-none"
                                />
                            </div>
                            <Button
                                label="Refresh"
                                className="bg-[#3b82f6] border-none px-6 py-2.5 rounded-xl font-bold text-white shadow-sm hover:bg-blue-600 transition-all text-sm"
                                onClick={fetchAdmins}
                                loading={loading}
                            />
                        </div>
                    </div>

                    {/* Table */}
                    <DataTable
                        value={admins}
                        paginator
                        rows={10}
                        loading={loading}
                        globalFilter={globalFilter}
                        className="p-datatable-minimal"
                        responsiveLayout="scroll"
                        emptyMessage={
                            <div className="text-center py-20 text-slate-400 font-medium">
                                No admin subscriptions found
                            </div>
                        }
                        dataKey="id"
                        rowHover
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
                        rowsPerPageOptions={[10, 20, 50]}
                    >
                        <Column field="no" header="No." body={(_, opts) => <span className="text-slate-600 font-medium text-sm ml-2">{opts.rowIndex + 1}</span>} style={{ width: '4rem' }} />
                        <Column header="Administrator" body={nameTemplate} sortField="username" sortable headerClassName="text-slate-500 font-bold text-xs uppercase tracking-wider bg-slate-50/50 py-4" />
                        <Column header="Mobile" body={mobileTemplate} sortField="mobileNumber" sortable headerClassName="text-slate-500 font-bold text-xs uppercase tracking-wider bg-slate-50/50 py-4" />
                        <Column header="Outlet" body={outletTemplate} sortField="outletName" sortable headerClassName="text-slate-500 font-bold text-xs uppercase tracking-wider bg-slate-50/50 py-4" />
                        <Column header="Role" body={roleTemplate} sortField="role" sortable style={{ textAlign: 'center' }} headerClassName="text-slate-500 font-bold text-xs uppercase tracking-wider bg-slate-50/50 py-4" />
                        <Column header="Joined" body={joinedTemplate} sortField="createdAt" sortable headerClassName="text-slate-500 font-bold text-xs uppercase tracking-wider bg-slate-50/50 py-4" />
                        <Column header="Status" body={statusTemplate} sortField="status" sortable style={{ textAlign: 'center' }} headerClassName="text-slate-500 font-bold text-xs uppercase tracking-wider bg-slate-50/50 py-4" />
                    </DataTable>
                </div>
            </div>
        </Page>
    );
};

export default SubscriptionList;

import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Tag } from 'primereact/tag';
import { Avatar } from 'primereact/avatar';
import { Page } from "@/components/shared/Page";
import { useNavigate } from 'react-router-dom';
import useApi from '@/hooks/useApi';
const AdminList = () => {
    const [admins, setAdmins] = useState([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const [loading, setLoading] = useState(false);
    const toast = useRef(null);
    const navigate = useNavigate();
    const { apiGet, apiDelete } = useApi();

    const fetchAdmins = async () => {
        setLoading(true);
        try {
            const data = await apiGet('/admin/admins');
            const adminList = Array.isArray(data) ? data : (Array.isArray(data?.data) ? data.data : []);
            setAdmins(adminList);
        } catch (error) {
            console.error('Fetch Admins Error:', error);
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to fetch administrators' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchAdmins(); }, []);

    const handleDelete = (rowData) => {
        confirmDialog({
            message: `Remove "${rowData.username}" from the system? This action cannot be undone.`,
            header: 'Confirm Deletion',
            icon: 'pi pi-exclamation-triangle',
            acceptClassName: 'p-button-danger',
            acceptLabel: 'Yes, Delete',
            rejectLabel: 'Cancel',
            accept: async () => {
                try {
                    const deleteId = rowData.id || rowData._id;
                    // Swagger: DELETE /admin/users/{id} for soft delete
                    await apiDelete(`/admin/users/${deleteId}`);
                    toast.current?.show({ severity: 'success', summary: 'Success', detail: `${rowData.username} removed successfully` });
                    fetchAdmins();
                } catch (error) {
                    toast.current?.show({ severity: 'error', summary: 'Error', detail: error?.response?.data?.message || 'Failed to delete admin' });
                }
            }
        });
    };

    const nameBodyTemplate = (rowData) => (
        <div className="flex items-center gap-3">
            <Avatar
                label={rowData.username?.charAt(0)?.toUpperCase() || 'A'}
                style={{ backgroundColor: '#3b82f6', color: '#fff', width: '36px', height: '36px', fontSize: '14px', fontWeight: '700', borderRadius: '10px', boxShadow: '0 4px 12px rgba(59, 130, 246, 0.2)' }}
            />
            <div className="flex flex-col">
                <p className="font-bold text-slate-800 text-sm leading-tight">{rowData.username || '—'}</p>
                <p className="text-xs text-slate-400 font-medium">{rowData.email || '—'}</p>
            </div>
        </div>
    );

    const statusBodyTemplate = (rowData) => {
        const isActive = rowData.status === 'ACTIVE' || rowData.status === true;
        return (
            <Tag
                value={isActive ? 'Active' : 'Inactive'}
                className={isActive ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'}
                style={{ borderRadius: '10px', fontSize: '11px', fontWeight: '800', padding: '5px 12px', border: '1px solid' }}
            />
        );
    };

    const roleBodyTemplate = (rowData) => {
        const isMaster = rowData.role === 'MASTER_ADMIN' || rowData.masterAdmin;
        return (
            <Tag
                value={isMaster ? 'Master' : 'Admin'}
                className={isMaster ? 'bg-violet-50 text-violet-600 border-violet-100' : 'bg-blue-50 text-blue-600 border-blue-100'}
                icon={isMaster ? 'pi pi-crown' : 'pi pi-user'}
                style={{ borderRadius: '10px', fontSize: '11px', fontWeight: '800', padding: '5px 12px', border: '1px solid' }}
            />
        );
    };

    const actionBodyTemplate = (rowData) => (
        <div className="flex gap-2 justify-center">
            <Button
                icon="pi pi-pencil"
                rounded text
                tooltip="Edit Account"
                tooltipOptions={{ position: 'top' }}
                className="w-10 h-10 text-blue-500 hover:bg-blue-50 border border-slate-100 hover:border-blue-200 transition-all rounded-xl bg-white shadow-sm"
                onClick={() => navigate(`/master/admins/edit/${rowData.id || rowData._id}`, { state: { admin: rowData } })}
            />
            <Button
                icon="pi pi-trash"
                rounded text
                tooltip="Delete Account"
                tooltipOptions={{ position: 'top' }}
                className="w-10 h-10 text-rose-500 hover:bg-rose-50 border border-slate-100 hover:border-rose-200 transition-all rounded-xl bg-white shadow-sm"
                onClick={() => handleDelete(rowData)}
            />
        </div>
    );

    const header = (
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 p-2">
            <div className="flex flex-col gap-1">
                <h2 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-3">
                    <span className="w-1.5 h-8 bg-blue-600 rounded-full block"></span>
                    Administrators
                </h2>
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest ml-4">System Access Directory</p>
            </div>
            <div className="flex items-center gap-4 w-full lg:w-auto">
                <span className="p-input-icon-left flex-1 lg:flex-none relative">
                    <i className="pi pi-search text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    <InputText
                        type="search"
                        onInput={(e) => setGlobalFilter(e.target.value)}
                        placeholder="Search administrators..."
                        className="p-inputtext-sm pl-11 border-slate-200 rounded-xl w-full lg:w-80 bg-slate-50/50 focus:bg-white transition-all outline-none text-sm font-medium"
                    />
                </span>
                <Button
                    label="Add Admin"
                    icon="pi pi-plus"
                    className="bg-blue-600 border-none px-6 py-3 rounded-xl font-black shadow-xl shadow-blue-100 hover:bg-blue-700 hover:-translate-y-0.5 transition-all text-white whitespace-nowrap text-xs uppercase tracking-widest"
                    onClick={() => navigate('/master/admins/add')}
                />
            </div>
        </div>
    );

    const totalAdmins = admins.length;
    const activeAdmins = admins.filter(a => a.status === 'ACTIVE' || a.status === true).length;
    const masterAdmins = admins.filter(a => a.role === 'MASTER_ADMIN' || a.masterAdmin).length;

    return (
        <Page title="Admin List">
            <div className="bg-[#f8fafc] min-h-[calc(100vh-5rem)] p-2 md:p-4">
                <Toast ref={toast} />
                <ConfirmDialog />

                {/* Stats Row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
                    {[
                        { label: 'Total Accounts', value: totalAdmins, icon: 'pi pi-users', color: 'from-blue-600 to-indigo-600', shadow: 'shadow-blue-200/60' },
                        { label: 'Active Sessions', value: activeAdmins, icon: 'pi pi-shield', color: 'from-emerald-600 to-teal-600', shadow: 'shadow-emerald-200/60' },
                        { label: 'Master Privileges', value: masterAdmins, icon: 'pi pi-crown', color: 'from-violet-600 to-purple-600', shadow: 'shadow-violet-200/60' },
                    ].map((stat) => (
                        <div key={stat.label} className={`bg-linear-to-br ${stat.color} rounded-4xl p-7 text-white shadow-2xl ${stat.shadow} relative overflow-hidden group hover:-translate-y-1 transition-all duration-300`}>
                            <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
                                <i className={`${stat.icon} text-9xl`} />
                            </div>
                            <div className="flex items-center gap-6 relative z-10">
                                <div className="w-16 h-16 rounded-[1.25rem] bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-inner">
                                    <i className={`${stat.icon} text-2xl text-white`} />
                                </div>
                                <div>
                                    <p className="text-white/80 text-[10px] font-black uppercase tracking-[0.2em] mb-1">{stat.label}</p>
                                    <p className="text-4xl font-black tracking-tight">{loading ? '—' : (stat.value < 10 ? `0${stat.value}` : stat.value)}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Data Table */}
                <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                    <DataTable
                        value={admins}
                        header={header}
                        paginator
                        rows={10}
                        rowsPerPageOptions={[10, 25, 50]}
                        loading={loading}
                        globalFilter={globalFilter}
                        className="p-datatable-sm"
                        stripedRows
                        responsiveLayout="stack"
                        breakpoint="960px"
                        emptyMessage={
                            <div className="text-center py-12">
                                <i className="pi pi-users text-4xl text-slate-300 mb-3 block" />
                                <p className="text-slate-400 font-medium">No administrators found</p>
                                <Button label="Add First Admin" icon="pi pi-plus" className="mt-4 bg-blue-600 border-none text-white px-4 py-2 rounded-xl text-sm font-bold" onClick={() => navigate('/master/admins/add')} />
                            </div>
                        }
                        dataKey="id"
                        rowHover
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first}–{last} of {totalRecords} administrators"
                        paginatorClassName="border-t border-slate-100 px-4 py-3"
                    >
                        <Column header="#" body={(_, opts) => <span className="text-slate-400 font-bold text-xs">{opts.rowIndex + 1}</span>} style={{ width: '3rem' }} />
                        <Column header="Administrator" body={nameBodyTemplate} sortField="username" sortable />
                        <Column field="mobileNumber" header="Mobile" className="text-slate-600 font-medium text-sm" />
                        <Column header="Role" body={roleBodyTemplate} sortField="role" sortable style={{ textAlign: 'center' }} />
                        <Column header="Status" body={statusBodyTemplate} sortField="status" sortable style={{ textAlign: 'center' }} />
                        <Column header="Actions" body={actionBodyTemplate} style={{ width: '8rem', textAlign: 'center' }} />
                    </DataTable>
                </div>
            </div>
        </Page>
    );
};

export default AdminList;

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


    return (
        <Page title="Admin list">
            <div className="bg-[#f4f7fa] min-h-[calc(100vh-4rem)] p-4 md:p-6">
                <Toast ref={toast} />
                <ConfirmDialog />

                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    {/* Table Header */}
                    <div className="px-8 py-6 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <h2 className="text-xl font-bold text-slate-800">Admin list</h2>
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
                                label="New Admin"
                                className="bg-[#3b82f6] border-none px-6 py-2.5 rounded-xl font-bold text-white shadow-sm hover:bg-blue-600 transition-all text-sm"
                                onClick={() => navigate('/master/admins/add')}
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
                                No administrators found
                            </div>
                        }
                        dataKey="id"
                        rowHover
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
                        rowsPerPageOptions={[10, 20, 50]}
                    >
                        <Column field="no" header="No." body={(_, opts) => <span className="text-slate-600 font-medium text-sm ml-2">{opts.rowIndex + 1}</span>} style={{ width: '4rem' }} />
                        <Column header="Full Name" body={nameBodyTemplate} sortField="username" sortable headerClassName="text-slate-500 font-bold text-xs uppercase tracking-wider bg-slate-50/50 py-4" />
                        <Column field="mobileNumber" header="Mobile Number" className="text-slate-600 font-medium text-sm" headerClassName="text-slate-500 font-bold text-xs uppercase tracking-wider bg-slate-50/50 py-4" />
                        <Column field="createdAt" header="Created at" body={(row) => <span className="text-slate-600 font-medium text-sm">{new Date(row.createdAt).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>} headerClassName="text-slate-500 font-bold text-xs uppercase tracking-wider bg-slate-50/50 py-4" />
                        <Column header="Status" body={statusBodyTemplate} sortField="status" sortable style={{ textAlign: 'center' }} headerClassName="text-slate-500 font-bold text-xs uppercase tracking-wider bg-slate-50/50 py-4" />
                        <Column header="Actions" body={actionBodyTemplate} style={{ width: '8rem', textAlign: 'center' }} headerClassName="text-slate-500 font-bold text-xs uppercase tracking-wider bg-slate-50/50 py-4" />
                    </DataTable>
                </div>
            </div>
        </Page>
    );
};

export default AdminList;

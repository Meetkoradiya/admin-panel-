import React, { useState, useEffect, useRef } from 'react';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Tag } from 'primereact/tag';
import { Avatar } from 'primereact/avatar';
import { useNavigate } from 'react-router-dom';
import useApi from '@/hooks/useApi';
import ListLayout from '@/components/shared/ListLayout';

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
            acceptClassName: 'p-button-danger rounded-xl',
            acceptLabel: 'Yes, Delete',
            rejectLabel: 'Cancel',
            rejectClassName: 'p-button-text text-slate-500 rounded-xl',
            accept: async () => {
                try {
                    const deleteId = rowData.id || rowData._id;
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
                style={{ backgroundColor: '#eff6ff', color: '#3b82f6', width: '36px', height: '36px', fontSize: '14px', fontWeight: '800', borderRadius: '12px' }}
            />
            <div className="flex flex-col">
                <p className="font-bold text-slate-800 text-sm leading-tight">{rowData.username || '—'}</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{rowData.email || '—'}</p>
            </div>
        </div>
    );

    const statusBodyTemplate = (rowData) => {
        const isActive = rowData.status === 'ACTIVE' || rowData.status === true;
        return (
            <span className={`px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest border ${isActive ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'}`}>
                {isActive ? 'Active' : 'Inactive'}
            </span>
        );
    };

    const roleBodyTemplate = (rowData) => {
        const isMaster = rowData.role === 'MASTER_ADMIN' || rowData.masterAdmin;
        return (
            <span className={`px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest border ${isMaster ? 'bg-violet-50 text-violet-600 border-violet-100' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>
                {isMaster ? 'Master' : 'Admin'}
            </span>
        );
    };

    const actionBodyTemplate = (rowData) => (
        <div className="flex gap-2 justify-center">
            <Button
                icon="pi pi-pencil"
                rounded text
                tooltip="Edit Account"
                tooltipOptions={{ position: 'top' }}
                className="btn-icon text-blue-500"
                onClick={() => navigate(`/master/admins/edit/${rowData.id || rowData._id}`, { state: { admin: rowData } })}
            />
            <Button
                icon="pi pi-trash"
                rounded text
                tooltip="Delete Account"
                tooltipOptions={{ position: 'top' }}
                className="btn-icon text-rose-500"
                onClick={() => handleDelete(rowData)}
            />
        </div>
    );

    return (
        <div className="animate-fade-in">
            <Toast ref={toast} />
            <ConfirmDialog />
            <ListLayout
                title="Admin Management"
                subtitle="System administrators and role management"
                data={admins}
                loading={loading}
                globalFilter={globalFilter}
                setGlobalFilter={setGlobalFilter}
                onAdd={() => navigate('/master/admins/add')}
                addLabel="New Admin"
            >
                <Column field="no" header="No." body={(_, opts) => <span className="text-slate-400 font-bold text-xs ml-2">{opts.rowIndex + 1}</span>} style={{ width: '4rem' }} />
                <Column header="Administrator" body={nameBodyTemplate} sortField="username" sortable />
                <Column field="mobileNumber" header="Mobile Number" className="text-slate-600 font-medium text-sm" />
                <Column header="Role" body={roleBodyTemplate} style={{ width: '8rem', textAlign: 'center' }} />
                <Column header="Status" body={statusBodyTemplate} sortField="status" sortable style={{ width: '8rem', textAlign: 'center' }} />
                <Column header="Actions" body={actionBodyTemplate} style={{ width: '10rem', textAlign: 'center' }} />
            </ListLayout>
        </div>
    );
};

export default AdminList;

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { showConfirmDialog } from '@/utils/confirmUtils';
import { Avatar } from 'primereact/avatar';
import { useNavigate } from 'react-router-dom';
import useApi from '@/hooks/useApi';
import ListLayout from '@/components/shared/ListLayout';
import StatusTag from '@/components/shared/StatusTag';
import ActionButtons from '@/components/shared/ActionButtons';

const AdminList = () => {
    const [admins, setAdmins] = useState([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const [loading, setLoading] = useState(false);
    const toast = useRef(null);
    const navigate = useNavigate();
    const { apiGet, apiDelete } = useApi();

    const fetchAdmins = useCallback(async () => {
        setLoading(true);
        try {
            const data = await apiGet('/admin/admins');
            const adminList = Array.isArray(data) ? data : (Array.isArray(data?.data) ? data.data : []);
            
            // Filter out Master Admins to show only regular admins
            const regularAdmins = adminList.filter(a => !(a.role === 'MASTER_ADMIN' || a.masterAdmin));
            setAdmins(regularAdmins);
        } catch (error) {
            console.error('Fetch Admins Error:', error);
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to fetch administrators' });
        } finally {
            setLoading(false);
        }
    }, [apiGet]);

    useEffect(() => { fetchAdmins(); }, [fetchAdmins]);

    const handleDelete = (rowData) => {
        showConfirmDialog({
            title: 'Delete Admin',
            message: `Remove "${rowData.username}" from the system? This action cannot be undone.`,
            type: 'delete',
            acceptLabel: 'Delete',
            onAccept: async () => {
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
        <div className="flex items-center gap-3 py-1">
            <Avatar
                label={rowData.username?.charAt(0)?.toUpperCase() || 'A'}
                style={{ backgroundColor: '#eff6ff', color: '#3b82f6', width: '38px', height: '38px', fontSize: '14px', fontWeight: '700', borderRadius: '12px', border: '1px solid #dbeafe' }}
            />
            <div className="flex flex-col">
                <p className="font-bold text-slate-800 text-sm leading-tight">{rowData.username || '—'}</p>
                <div className="flex items-center gap-2 mt-1">
                    <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-slate-400 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">
                        {rowData.email || '—'}
                    </span>
                </div>
            </div>
        </div>
    );

    const statusBodyTemplate = (rowData) => {
        const statusValue = (rowData.status === 'ACTIVE' || rowData.status === true) ? 'ACTIVE' : 'INACTIVE';
        return <StatusTag status={statusValue} />;
    };

    const actionBodyTemplate = (rowData) => (
        <ActionButtons 
            onEdit={() => navigate(`/master/admins/edit/${rowData.id || rowData._id}`, { state: { admin: rowData } })}
            onDelete={() => handleDelete(rowData)}
        />
    );

    return (
        <div className="animate-fade-in">
            <Toast ref={toast} />
            <ListLayout
                title="Admin Management"
                subtitle="Manage system administrators and outlet assignments"
                data={admins}
                loading={loading}
                globalFilter={globalFilter}
                setGlobalFilter={setGlobalFilter}
                onAdd={() => navigate('/master/admins/add')}
                addLabel="New Admin"
            >
                <Column field="no" header="No." body={(_, opts) => <span className="text-slate-400 font-bold text-[10px] ml-2">{opts.rowIndex + 1}</span>} style={{ width: '4rem' }} />
                <Column header="Administrator" body={nameBodyTemplate} sortField="username" sortable />
                <Column field="mobileNumber" header="Mobile Number" body={(row) => <span className="text-slate-600 font-bold text-xs tracking-wider">{row.mobileNumber || '—'}</span>} />
                <Column header="Status" body={statusBodyTemplate} sortField="status" sortable style={{ width: '8rem', textAlign: 'center' }} />
                <Column header="Actions" body={actionBodyTemplate} style={{ width: '8rem', textAlign: 'center' }} />
            </ListLayout>
        </div>
    );
};

export default AdminList;

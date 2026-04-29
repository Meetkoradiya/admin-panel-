import React, { useState, useEffect, useRef } from 'react';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { classNames } from 'primereact/utils';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ListLayout from '@/components/shared/ListLayout';
import StatusTag from '@/components/shared/StatusTag';
import { showConfirmDialog } from '@/utils/confirmUtils';

const CustomerManagement = () => {
    const [customers, setCustomers] = useState([]);
    const [globalFilter, setGlobalFilter] = useState("");
    const [loading, setLoading] = useState(false);
    const toast = useRef(null);
    const navigate = useNavigate();

    const token = useSelector((state) => state.auth.token);
    const BASE_URL = import.meta.env.VITE_BACKEND_BASEURL;

    const fetchCustomers = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${BASE_URL}/admin/customers`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = response.data?.data || response.data || [];
            setCustomers(Array.isArray(data) ? data : []);
        } catch (error) {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to fetch customers' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) fetchCustomers();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token]);

    const deleteCustomer = async (rowData) => {
        showConfirmDialog({
            title: 'Delete Customer',
            message: `Are you sure you want to delete ${rowData.username}? This action cannot be undone.`,
            type: 'delete',
            acceptLabel: 'Delete',
            onAccept: async () => {
                try {
                    const deleteId = rowData.id || rowData.userId;
                    await axios.delete(`${BASE_URL}/admin/users/${deleteId}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Customer Deleted Successfully', life: 3000 });
                    fetchCustomers();
                } catch (error) {
                    toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to delete customer' });
                }
            }
        });
    };

    const statusBodyTemplate = (rowData) => {
        const isActive = rowData.status === 'ACTIVE' || !rowData.status;
        return <StatusTag status={isActive ? 'ACTIVE' : 'INACTIVE'} />;
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <div className="flex gap-2 justify-center">
                <Button
                    icon="pi pi-pencil"
                    rounded text
                    tooltip="Edit Customer"
                    tooltipOptions={{ position: 'top' }}
                    className="btn-icon text-sky-500"
                    onClick={() => {
                    showConfirmDialog({
                        title: 'Edit Customer',
                        message: `Modify information for ${rowData.username}?`,
                        type: 'edit',
                        acceptLabel: 'Edit',
                        onAccept: () => navigate(`/admin/customers/edit/${rowData.id || rowData.userId}`, { state: { customer: rowData } })
                    });
                }}
                />
                <Button
                    icon="pi pi-trash"
                    rounded text
                    tooltip="Delete Customer"
                    tooltipOptions={{ position: 'top' }}
                    className="btn-icon text-rose-500"
                    onClick={() => deleteCustomer(rowData)}
                />
            </div>
        );
    };

    const customerBodyTemplate = (rowData) => (
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500 font-black text-xs border border-blue-100">
                {rowData.username?.charAt(0).toUpperCase()}
            </div>
            <div className="flex flex-col">
                <span className="font-bold text-slate-800 text-sm">{rowData.username}</span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{rowData.mobileNumber}</span>
            </div>
        </div>
    );

    return (
        <div className="animate-fade-in">
            <Toast ref={toast} />
            <ListLayout
                title="Customer Management"
                subtitle="Manage and oversee your customer database"
                data={customers}
                loading={loading}
                globalFilter={globalFilter}
                setGlobalFilter={setGlobalFilter}
                onAdd={() => navigate('/admin/customers/add')}
                addLabel="New Customer"
            >
                <Column field="no" header="#" body={(_, opts) => <span className="text-slate-500 font-bold text-xs">{opts.rowIndex + 1}</span>} style={{ width: '4rem', textAlign: 'center' }} />
                <Column header="Customer Info" body={customerBodyTemplate} sortable sortField="username" />
                <Column field="address" header="Location" className="text-slate-500 font-medium text-sm" />
                <Column field="status" header="Status" body={statusBodyTemplate} sortable style={{ width: '10rem', textAlign: 'center' }} />
                <Column header="Actions" body={actionBodyTemplate} style={{ width: '10rem', textAlign: 'center' }} />
            </ListLayout>
        </div>
    );
};

export default CustomerManagement;

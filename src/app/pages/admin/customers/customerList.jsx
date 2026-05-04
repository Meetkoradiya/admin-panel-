import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { classNames } from 'primereact/utils';
import { useNavigate } from 'react-router-dom';
import ListLayout from '@/components/shared/ListLayout';
import StatusTag from '@/components/shared/StatusTag';
import ActionButtons from '@/components/shared/ActionButtons';
import useApi from '@/hooks/useApi';
import useUrlFilters from '@/hooks/useUrlFilters';
import { showConfirmDialog } from '@/utils/confirmUtils';

const CustomerManagement = () => {
    const [customers, setCustomers] = useState([]);
    const [globalFilter, setGlobalFilter] = useState("");
    
    // Sync filter with URL
    useUrlFilters(globalFilter, setGlobalFilter);

    const [loading, setLoading] = useState(false);
    const toast = useRef(null);
    const navigate = useNavigate();
    const { apiGet, apiPut, apiDelete } = useApi();

    const fetchCustomers = useCallback(async () => {
        setLoading(true);
        try {
            const data = await apiGet('/admin/customers');
            const customerList = data?.data || data || [];
            setCustomers(Array.isArray(customerList) ? customerList : []);
        } catch (error) {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to fetch customers' });
        } finally {
            setLoading(false);
        }
    }, [apiGet]);

    useEffect(() => {
        fetchCustomers();
    }, [fetchCustomers]);

    const deleteCustomer = async (rowData) => {
        showConfirmDialog({
            title: 'Delete Customer',
            message: `Are you sure you want to delete ${rowData.username}? This action cannot be undone.`,
            type: 'delete',
            acceptLabel: 'Delete',
            onAccept: async () => {
                try {
                    const deleteId = rowData.id || rowData.userId;
                    await apiDelete(`/admin/users/${deleteId}`);
                    toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Customer Deleted Successfully', life: 3000 });
                    fetchCustomers();
                } catch (error) {
                    toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to delete customer' });
                }
            }
        });
    };
    
    const toggleStatus = async (rowData) => {
        const currentStatus = rowData.status || 'ACTIVE';
        const newStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
        
        try {
            const id = rowData.id || rowData.userId;
            const payload = {
                username: rowData.username,
                mobileNumber: rowData.mobileNumber,
                address: rowData.address,
                deliveryType: rowData.deliveryType,
                status: newStatus
            };
            
            console.log("Customer Toggle Diagnostic:", { id, payload, originalRow: rowData });
            await apiPut(`/admin/customers/${id}`, payload);
            
            toast.current?.show({ 
                severity: 'success', 
                summary: 'Status Updated', 
                detail: `Customer status changed to ${newStatus}.`,
                life: 3000 
            });
            fetchCustomers();
        } catch (error) {
            toast.current?.show({ 
                severity: 'error', 
                summary: 'Update Failed', 
                detail: 'Could not change customer status.',
                life: 5000 
            });
        }
    };

    const statusBodyTemplate = (rowData) => {
        const isActive = rowData.status === 'ACTIVE' || !rowData.status;
        return <StatusTag status={isActive ? 'ACTIVE' : 'INACTIVE'} />;
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <ActionButtons 
                onEdit={() => navigate(`/admin/customers/edit/${rowData.id || rowData.userId}`, { state: { customer: rowData } })}
                onDelete={() => deleteCustomer(rowData)}
                onDeactivate={() => toggleStatus(rowData)}
                isDeactivated={rowData.status === 'INACTIVE'}
            />
        );
    };

    const customerBodyTemplate = (rowData) => (
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500 font-bold text-xs border border-blue-100">
                {rowData.username?.charAt(0).toUpperCase()}
            </div>
            <div className="flex flex-col">
                <span className="font-bold text-slate-800 text-sm">{rowData.username}</span>
                <span className="text-xs text-slate-400 font-semibold uppercase tracking-widest mt-1">{rowData.mobileNumber}</span>
            </div>
        </div>
    );

    return (
        <div className="animate-fade-in">
            <Toast ref={toast} />
            <ListLayout
                title="Customer List"
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



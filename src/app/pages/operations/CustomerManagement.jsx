import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import { Tag } from 'primereact/tag';
import { Page } from "@/components/shared/Page";
import axios from 'axios';
import { useSelector } from 'react-redux';

const CustomerManagement = () => {
    let emptyCustomer = {
        id: null,
        userId: null,
        username: '',
        mobileNumber: '',
        address: '',
        deposit: 0,
        deliveryType: 'DAILY',
        status: 'ACTIVE'
    };

    const [customers, setCustomers] = useState([]);
    const [customerDialog, setCustomerDialog] = useState(false);
    const [customer, setCustomer] = useState(emptyCustomer);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [loading, setLoading] = useState(false);
    const toast = useRef(null);

    const token = useSelector((state) => state.auth.token);
    const BASE_URL = import.meta.env.VITE_BACKEND_BASEURL;

    const statusOptions = [
        { label: 'Active', value: 'ACTIVE' },
        { label: 'Inactive', value: 'INACTIVE' },
        { label: 'Deleted', value: 'DELETE' }
    ];

    const fetchCustomers = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${BASE_URL}/admin/customers`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (Array.isArray(response.data)) {
                setCustomers(response.data);
            } else if (response.data && Array.isArray(response.data.data)) {
                setCustomers(response.data.data);
            } else {
                setCustomers([]);
            }
        } catch (error) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to fetch customers' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchCustomers();
        }
    }, [token]);

    const openNew = () => {
        setCustomer(emptyCustomer);
        setSubmitted(false);
        setCustomerDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setCustomerDialog(false);
    };

    const saveCustomer = async () => {
        setSubmitted(true);
        if (customer.username.trim() && customer.mobileNumber.trim() && customer.mobileNumber.length === 10) {
            try {
                const payload = {
                    username: customer.username,
                    mobileNumber: customer.mobileNumber,
                    address: customer.address || '',
                    deposit: Number(customer.deposit) || 0,
                    deliveryType: customer.deliveryType || 'DAILY',
                    status: customer.status || 'ACTIVE',
                };

                const updateId = customer.id || customer.userId;

                if (updateId) {
                    await axios.put(`${BASE_URL}/admin/customers/${updateId}`, payload, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    toast.current.show({ severity: 'success', summary: 'Success', detail: 'Customer Updated Successfully', life: 3000 });
                } else {
                    await axios.post(`${BASE_URL}/admin/register-customer`, payload, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    toast.current.show({ severity: 'success', summary: 'Success', detail: 'Customer Added Successfully', life: 3000 });
                }
                setCustomerDialog(false);
                setCustomer(emptyCustomer);
                fetchCustomers();
            } catch (error) {
                toast.current.show({ severity: 'error', summary: 'Error', detail: error?.response?.data?.message || 'Failed to save customer', life: 3000 });
            }
        }
    };

    const deleteCustomer = async (rowData) => {
        try {
            const deleteId = rowData.id || rowData.userId;
            await axios.delete(`${BASE_URL}/admin/users/${deleteId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.current.show({ severity: 'success', summary: 'Success', detail: 'Customer Deleted Successfully', life: 3000 });
            fetchCustomers();
        } catch (error) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to delete customer' });
        }
    };

    const statusBodyTemplate = (rowData) => {
        const severityMap = { ACTIVE: 'success', INACTIVE: 'danger', DELETE: 'danger' };
        return <Tag value={rowData.status || 'ACTIVE'} severity={severityMap[rowData.status || 'ACTIVE']} className="px-3 py-1 text-xs uppercase" rounded />;
    };

    const actionBodyTemplate = (rowData) => (
        <div className="flex justify-center gap-2">
            <Button icon="pi pi-pencil" rounded text tooltip="Edit" tooltipOptions={{position:'top'}} className="text-cyan-600 hover:bg-cyan-50" onClick={() => { setCustomer({ ...rowData }); setCustomerDialog(true); }} />
            <Button icon="pi pi-trash" rounded text tooltip="Delete" tooltipOptions={{position:'top'}} className="text-rose-500 hover:bg-rose-50" onClick={() => deleteCustomer(rowData)} />
        </div>
    );

    const header = (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 bg-white border-b border-slate-100">
            <div>
                <h2 className="text-xl font-bold text-slate-800 m-0">Customer Management</h2>
                <p className="text-sm text-slate-500 mt-1">Total {Array.isArray(customers) ? customers.length : 0} customers registered</p>
            </div>
            <div className="flex items-center gap-3">
                <span className="p-input-icon-left w-full md:w-auto">
                    <i className="pi pi-search text-slate-400" />
                    <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." className="p-inputtext-sm border-slate-200 rounded-lg w-full" />
                </span>
                <Button label="New Customer" icon="pi pi-plus" className="bg-cyan-600 border-none shadow-sm hover:bg-cyan-700 px-4 rounded-lg" onClick={openNew} />
            </div>
        </div>
    );

    const dialogFooter = (
        <div className="flex gap-2 p-3 bg-slate-50 rounded-b-2xl border-t border-slate-100">
            <Button label="Cancel" icon="pi pi-times" text onClick={hideDialog} className="text-slate-500" />
            <Button label="Save Details" icon="pi pi-check" className="bg-cyan-600 border-none px-6" onClick={saveCustomer} />
        </div>
    );

    return (
        <Page title="Customers">
            <div className="p-4 bg-slate-50/50 min-h-screen">
                <Toast ref={toast} />
                <div className="max-w-7xl mx-auto">
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                        <DataTable 
                            value={Array.isArray(customers) ? customers : []} 
                            header={header} 
                            paginator 
                            rows={8} 
                            loading={loading}
                            globalFilter={globalFilter}
                            className="p-datatable-sm"
                            emptyMessage="No customers found."
                        >
                            <Column field="username" header="Full Name" sortable className="font-semibold text-slate-700 py-4 px-4"></Column>
                            <Column field="mobileNumber" header="Mobile No" className="text-slate-600"></Column>
                            <Column field="address" header="Address" className="text-slate-600"></Column>
                            <Column field="status" header="Status" body={statusBodyTemplate} sortable></Column>
                            <Column header="Actions" body={actionBodyTemplate} className="w-32"></Column>
                        </DataTable>
                    </div>
                </div>

                <Dialog 
                    visible={customerDialog} 
                    style={{ width: '400px' }} 
                    header={<div className="text-lg font-bold text-slate-800">{(customer.id || customer.userId) ? 'Edit Customer' : 'Add New Customer'}</div>} 
                    modal 
                    className="p-fluid rounded-2xl" 
                    footer={dialogFooter} 
                    onHide={hideDialog}
                >
                    <div className="flex flex-col gap-5 pt-2">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-slate-700">Full Name</label>
                            <InputText value={customer.username || ''} onChange={(e) => setCustomer({...customer, username: e.target.value})} className={`p-3 border-slate-200 rounded-lg ${submitted && !customer.username ? 'p-invalid' : ''}`} placeholder="Enter customer's name" />
                            {submitted && !customer.username && <small className="p-error">Name is required.</small>}
                        </div>
                        
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-slate-700">Mobile Number</label>
                            <InputText value={customer.mobileNumber || ''} onChange={(e) => setCustomer({...customer, mobileNumber: e.target.value})} maxLength={10} className={`p-3 border-slate-200 rounded-lg ${submitted && (!customer.mobileNumber || customer.mobileNumber.length !== 10) ? 'p-invalid' : ''}`} placeholder="10-digit number" />
                            {submitted && (!customer.mobileNumber || customer.mobileNumber.length !== 10) && <small className="p-error">Valid 10-digit mobile is required.</small>}
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-slate-700">Address</label>
                            <InputText value={customer.address || ''} onChange={(e) => setCustomer({...customer, address: e.target.value})} className="p-3 border-slate-200 rounded-lg" placeholder="Address..." />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-slate-700">Status</label>
                            <Dropdown value={customer.status || 'ACTIVE'} options={statusOptions} onChange={(e) => setCustomer({...customer, status: e.value})} className="border-slate-200 rounded-lg h-12 flex items-center" />
                        </div>
                    </div>
                </Dialog>
            </div>
        </Page>
    );
};

export default CustomerManagement;

import React, { useState, useRef, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { Page } from "@/components/shared/Page";

const CustomerManagement = () => {
    const toast = useRef(null);

    // 1. Initialize state from LocalStorage so data persists after refresh
    const [customers, setCustomers] = useState(() => {
        const savedCustomers = localStorage.getItem('customer_list');
        return savedCustomers ? JSON.parse(savedCustomers) : [
            { id: 1, name: 'John Doe', email: 'john@example.com', phone: '9876543210', address: '123 Street, NY' },
            { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '8877665544', address: '456 Avenue, CA' }
        ];
    });

    const [customerDialog, setCustomerDialog] = useState(false);
    const [customer, setCustomer] = useState({ name: '', email: '', phone: '', address: '' });

    // 2. Use useEffect to save data to localStorage whenever the 'customers' array changes
    useEffect(() => {
        localStorage.setItem('customer_list', JSON.stringify(customers));
    }, [customers]);

    const openNew = () => {
        setCustomer({ name: '', email: '', phone: '', address: '' });
        setCustomerDialog(true);
    };

    const saveCustomer = () => {
        if (customer.name.trim()) {
            let _customers = [...customers];

            if (customer.id) {
                // Edit existing customer
                const index = _customers.findIndex(c => c.id === customer.id);
                _customers[index] = customer;
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Customer Updated', life: 3000 });
            } else {
                // Add new customer with a random ID
                const newCustomer = { ...customer, id: Math.floor(Math.random() * 10000) };
                _customers.push(newCustomer);
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Customer Created', life: 3000 });
            }

            setCustomers(_customers);
            setCustomerDialog(false);
        }
    };

    const deleteCustomer = (id) => {
        const _customers = customers.filter(c => c.id !== id);
        setCustomers(_customers);
        toast.current.show({ severity: 'warn', summary: 'Deleted', detail: 'Customer Removed', life: 3000 });
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <div className="flex gap-2">
                <Button icon="pi pi-pencil" rounded outlined onClick={() => { setCustomer({...rowData}); setCustomerDialog(true); }} />
                <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => deleteCustomer(rowData.id)} />
            </div>
        );
    };

    return (
        <Page title="Customer Management">
            <Toast ref={toast} />
            <div className="card p-4">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Manage Customers</h2>
                    <Button label="Add Customer" icon="pi pi-plus" className="p-button-success" onClick={openNew} />
                </div>

                <DataTable value={customers} paginator rows={10} responsiveLayout="scroll">
                    <Column field="name" header="Name" sortable />
                    <Column field="email" header="Email" sortable />
                    <Column field="phone" header="Phone" />
                    <Column field="address" header="Address" />
                    <Column body={actionBodyTemplate} header="Actions" />
                </DataTable>

                <Dialog visible={customerDialog} style={{ width: '450px' }} header="Customer Details" modal onHide={() => setCustomerDialog(false)}>
                    <div className="p-fluid">
                        <div className="field mb-3">
                            <label htmlFor="name" className="font-bold">Name</label>
                            <InputText id="name" value={customer.name} onChange={(e) => setCustomer({ ...customer, name: e.target.value })} required />
                        </div>
                        <div className="field mb-3">
                            <label htmlFor="email" className="font-bold">Email</label>
                            <InputText id="email" value={customer.email} onChange={(e) => setCustomer({ ...customer, email: e.target.value })} />
                        </div>
                        <div className="field mb-3">
                            <label htmlFor="phone" className="font-bold">Phone</label>
                            <InputText id="phone" value={customer.phone} onChange={(e) => setCustomer({ ...customer, phone: e.target.value })} />
                        </div>
                        <div className="field mb-3">
                            <label htmlFor="address" className="font-bold">Address</label>
                            <InputText id="address" value={customer.address} onChange={(e) => setCustomer({ ...customer, address: e.target.value })} />
                        </div>
                        <div className="flex justify-end gap-2 mt-4">
                            <Button label="Cancel" icon="pi pi-times" text onClick={() => setCustomerDialog(false)} />
                            <Button label="Save" icon="pi pi-check" onClick={saveCustomer} />
                        </div>
                    </div>
                </Dialog>
            </div>
        </Page>
    );
};

export default CustomerManagement;
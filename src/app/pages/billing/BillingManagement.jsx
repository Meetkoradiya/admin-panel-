import React, { useState, useEffect, useRef } from 'react';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Tag } from 'primereact/tag';
import axios from 'axios';
import { useSelector } from 'react-redux';
import ListLayout from '@/components/shared/ListLayout';

const BillingManagement = () => {
    const [billings, setBillings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [globalFilter, setGlobalFilter] = useState("");
    const toast = useRef(null);

    const token = useSelector((state) => state.auth.token);
    const BASE_URL = import.meta.env.VITE_BACKEND_BASEURL;

    const fetchBillings = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${BASE_URL}/admin/billings`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = response.data?.data || response.data || [];
            setBillings(Array.isArray(data) ? data : []);
        } catch (error) {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to fetch billing records' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) fetchBillings();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token]);

    const statusBodyTemplate = (rowData) => {
        const status = rowData.status || 'UNPAID';
        const severity = status === 'PAID' ? 'success' : 'danger';
        return <Tag value={status} severity={severity} rounded className="px-3 py-1 font-bold text-[10px] uppercase tracking-widest" />;
    };

    const amountBodyTemplate = (rowData) => (
        <span className="font-black text-slate-800">₹{(rowData.amount || 0).toLocaleString()}</span>
    );

    const customerBodyTemplate = (rowData) => (
        <div className="flex flex-col">
            <span className="font-bold text-slate-700 text-sm">{rowData.customer?.username || '—'}</span>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{rowData.customer?.mobileNumber || '—'}</span>
        </div>
    );

    const actionBodyTemplate = (rowData) => (
        <div className="flex gap-2 justify-center">
            <Button
                icon="pi pi-print"
                rounded text
                tooltip="Print Invoice"
                className="w-10 h-10 border border-slate-100 text-slate-500 hover:bg-slate-50 hover:border-slate-100 transition-all bg-white shadow-sm"
            />
            {rowData.status !== 'PAID' && (
                <Button
                    icon="pi pi-check-circle"
                    rounded text
                    tooltip="Mark as Paid"
                    className="w-10 h-10 border border-slate-100 text-emerald-500 hover:bg-emerald-50 hover:border-emerald-100 transition-all bg-white shadow-sm"
                />
            )}
        </div>
    );

    return (
        <div className="animate-fade-in">
            <Toast ref={toast} />
            <ListLayout
                title="Billing & Invoices"
                subtitle="Monitor customer balances, payments, and generated invoices"
                data={billings}
                loading={loading}
                globalFilter={globalFilter}
                setGlobalFilter={setGlobalFilter}
                onAdd={null}
            >
                <Column field="no" header="#" body={(_, opts) => <span className="text-slate-400 font-bold text-xs">{opts.rowIndex + 1}</span>} style={{ width: '4rem', textAlign: 'center' }} />
                <Column header="Customer" body={customerBodyTemplate} sortable sortField="customer.username" />
                <Column field="month" header="Billing Period" body={(row) => <span className="text-slate-600 font-medium text-sm">{row.month || 'Current'}</span>} />
                <Column header="Total Amount" body={amountBodyTemplate} sortable sortField="amount" />
                <Column header="Payment Status" body={statusBodyTemplate} sortable sortField="status" style={{ width: '10rem', textAlign: 'center' }} />
                <Column header="Actions" body={actionBodyTemplate} style={{ width: '10rem', textAlign: 'center' }} />
            </ListLayout>
        </div>
    );
};

export default BillingManagement;

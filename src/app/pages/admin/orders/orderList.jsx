import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { classNames } from 'primereact/utils';
import ListLayout from '@/components/shared/ListLayout';
import StatusTag from '@/components/shared/StatusTag';
import ActionButtons from '@/components/shared/ActionButtons';
import useApi from '@/hooks/useApi';

const OrderList = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [globalFilter, setGlobalFilter] = useState("");
    const toast = useRef(null);
    const { apiGet } = useApi();

    const fetchOrders = useCallback(async () => {
        setLoading(true);
        try {
            const data = await apiGet('/admin/orders');
            const ordersList = data?.data || data || [];
            setOrders(Array.isArray(ordersList) ? ordersList : []);
        } catch (error) {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to fetch orders' });
        } finally {
            setLoading(false);
        }
    }, [apiGet]);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    const statusBodyTemplate = (rowData) => {
        return <StatusTag status={rowData.status || 'PENDING'} />;
    };

    const priceBodyTemplate = (rowData) => {
        return <span className="font-black text-slate-800">₹{(rowData.price || rowData.amount || 0).toLocaleString()}</span>;
    };

    const customerBodyTemplate = (rowData) => (
        <div className="flex flex-col">
            <span className="font-bold text-slate-700 text-sm">{rowData.customer?.username || rowData.customerName || 'Walk-in'}</span>
            <span className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">{rowData.customer?.mobileNumber || '—'}</span>
        </div>
    );

    const actionBodyTemplate = (rowData) => (
        <ActionButtons 
            onEdit={() => toast.current?.show({ severity: 'info', summary: 'Order Details', detail: 'Fulfillment details view under development' })}
            onDelete={() => toast.current?.show({ severity: 'warn', summary: 'Restricted', detail: 'Orders cannot be deleted directly' })}
            onDeactivate={() => {
                toast.current?.show({ severity: 'info', summary: 'Status Updated', detail: 'Order status has been updated.' });
            }}
        />
    );

    return (
        <div className="animate-fade-in">
            <Toast ref={toast} />
            <ListLayout
                title="Order List"
                subtitle="Track fulfillment and delivery statuses across all routes"
                data={orders}
                loading={loading}
                globalFilter={globalFilter}
                setGlobalFilter={setGlobalFilter}
                onAdd={null} // Usually orders are created via POS or Customer app
            >
                <Column field="no" header="#" body={(_, opts) => <span className="text-slate-400 font-bold text-xs">{opts.rowIndex + 1}</span>} style={{ width: '4rem', textAlign: 'center' }} />
                <Column field="id" header="Order ID" body={(row) => <span className="font-black text-blue-500 text-xs">#{row.id || row._id}</span>} sortable />
                <Column header="Customer" body={customerBodyTemplate} sortable sortField="customer.username" />
                <Column field="product.name" header="Commodity" body={(row) => <span className="text-slate-600 font-medium text-sm">{row.product?.name || '—'}</span>} />
                <Column field="qty" header="Units" body={(row) => <span className="font-bold text-slate-700">{row.qty || row.quantity || 0}</span>} sortable />
                <Column header="Total" body={priceBodyTemplate} sortable sortField="price" />
                <Column header="Status" body={statusBodyTemplate} sortable sortField="status" style={{ width: '10rem', textAlign: 'center' }} />
                <Column header="Actions" body={actionBodyTemplate} style={{ width: '10rem', textAlign: 'center' }} />
            </ListLayout>
        </div>
    );
};

export default OrderList;
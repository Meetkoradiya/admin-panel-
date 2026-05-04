import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { classNames } from 'primereact/utils';
import ListLayout from '@/components/shared/ListLayout';
import StatusTag from '@/components/shared/StatusTag';
import ActionButtons from '@/components/shared/ActionButtons';
import useApi from '@/hooks/useApi';
import { Dialog } from 'primereact/dialog';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';

const OrderList = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [globalFilter, setGlobalFilter] = useState("");
    const [showCustomOrderDialog, setShowCustomOrderDialog] = useState(false);
    const [customOrder, setCustomOrder] = useState({
        customerId: '',
        productId: '',
        qty: 1,
        price: 0,
        status: 'PENDING'
    });
    const [customers, setCustomers] = useState([]);
    const [products, setProducts] = useState([]);
    const toast = useRef(null);
    const { apiGet, apiPost } = useApi();

    const fetchOrders = useCallback(async () => {
        setLoading(true);
        try {
            const data = await apiGet('/orders/all');
            const ordersList = data?.data || data || [];
            setOrders(Array.isArray(ordersList) ? ordersList : []);
        } catch (error) {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to fetch orders' });
        } finally {
            setLoading(false);
        }
    }, [apiGet]);

    const fetchInitialData = useCallback(async () => {
        try {
            const [custRes, prodRes] = await Promise.all([
                apiGet('/admin/customers'),
                apiGet('/admin/products')
            ]);
            const rawCustomers = custRes?.data || custRes || [];
            const rawProducts = prodRes?.data || prodRes || [];
            
            // Normalize data to ensure 'id' property exists
            setCustomers(Array.isArray(rawCustomers) ? rawCustomers.map(c => ({...c, id: c.id || c._id || c.userId})) : []);
            setProducts(Array.isArray(rawProducts) ? rawProducts.map(p => ({...p, id: p.id || p._id})) : []);
        } catch (error) {
            console.error("Failed to fetch support data");
        }
    }, [apiGet]);

    useEffect(() => {
        fetchOrders();
        fetchInitialData();
    }, [fetchOrders, fetchInitialData]);

    const handleGenerateOrders = async () => {
        setLoading(true);
        try {
            await apiPost('/orders/generate');
            toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Orders generated successfully' });
            fetchOrders();
        } catch (error) {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to generate orders' });
        } finally {
            setLoading(false);
        }
    };

    const handleCustomOrderSubmit = async () => {
        if (!customOrder.customerId || !customOrder.productId) {
            toast.current?.show({ severity: 'warn', summary: 'Validation', detail: 'Please select customer and product' });
            return;
        }
        setLoading(true);
        try {
            await apiPost('/orders/custom-order', customOrder);
            toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Custom order created successfully' });
            setShowCustomOrderDialog(false);
            fetchOrders();
        } catch (error) {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to create custom order' });
        } finally {
            setLoading(false);
        }
    };

    const statusBodyTemplate = (rowData) => {
        return <StatusTag status={rowData.status || 'PENDING'} />;
    };

    const priceBodyTemplate = (rowData) => {
        return <span className="font-bold text-slate-800">â‚¹{(rowData.price || rowData.amount || 0).toLocaleString()}</span>;
    };

    const customerBodyTemplate = (rowData) => (
        <div className="flex flex-col">
            <span className="font-bold text-slate-700 text-sm">{rowData.customer?.username || rowData.customerName || 'Walk-in'}</span>
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-widest mt-1">{rowData.customer?.mobileNumber || 'â€”'}</span>
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
                onAdd={() => setShowCustomOrderDialog(true)}
                addLabel="Custom Order"
                extraActions={
                    <Button 
                        label="Generate Today's Orders" 
                        icon="pi pi-refresh" 
                        className="p-button-outlined p-button-info"
                        onClick={handleGenerateOrders}
                        loading={loading}
                    />
                }
            >
                <Column field="no" header="#" body={(_, opts) => <span className="text-slate-400 font-bold text-xs">{opts.rowIndex + 1}</span>} style={{ width: '4rem', textAlign: 'center' }} />
                <Column field="id" header="Order ID" body={(row) => <span className="font-bold text-blue-500 text-xs">#{row.id || row._id}</span>} sortable />
                <Column header="Customer" body={customerBodyTemplate} sortable sortField="customer.username" />
                <Column field="product.name" header="Commodity" body={(row) => <span className="text-slate-600 font-medium text-sm">{row.product?.name || 'â€”'}</span>} />
                <Column field="qty" header="Units" body={(row) => <span className="font-bold text-slate-700">{row.qty || row.quantity || 0}</span>} sortable />
                <Column header="Total" body={priceBodyTemplate} sortable sortField="price" />
                <Column header="Status" body={statusBodyTemplate} sortable sortField="status" style={{ width: '10rem', textAlign: 'center' }} />
                <Column header="Actions" body={actionBodyTemplate} style={{ width: '10rem', textAlign: 'center' }} />
            </ListLayout>

            <Dialog 
                header="Create Custom Order" 
                visible={showCustomOrderDialog} 
                style={{ width: '450px' }} 
                modal 
                onHide={() => setShowCustomOrderDialog(false)}
                footer={
                    <div>
                        <Button label="Cancel" icon="pi pi-times" onClick={() => setShowCustomOrderDialog(false)} className="p-button-text" />
                        <Button label="Create Order" icon="pi pi-check" onClick={handleCustomOrderSubmit} autoFocus />
                    </div>
                }
            >
                <div className="flex flex-col gap-4 mt-2">
                    <div className="flex flex-col gap-2">
                        <label htmlFor="customer" className="text-sm font-bold text-slate-600">Select Customer</label>
                        <Dropdown 
                            id="customer"
                            value={customOrder.customerId} 
                            options={customers} 
                            onChange={(e) => setCustomOrder({...customOrder, customerId: e.value})} 
                            optionLabel="username" 
                            optionValue="id"
                            placeholder="Select a Customer" 
                            filter 
                            className="w-full"
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="product" className="text-sm font-bold text-slate-600">Select Product</label>
                        <Dropdown 
                            id="product"
                            value={customOrder.productId} 
                            options={products} 
                            onChange={(e) => setCustomOrder({...customOrder, productId: e.value})} 
                            optionLabel="name" 
                            optionValue="id"
                            placeholder="Select a Product" 
                            className="w-full"
                        />
                    </div>
                    <div className="flex gap-4">
                        <div className="flex flex-col gap-2 flex-1">
                            <label htmlFor="qty" className="text-sm font-bold text-slate-600">Quantity</label>
                            <InputNumber 
                                id="qty"
                                value={customOrder.qty} 
                                onValueChange={(e) => setCustomOrder({...customOrder, qty: e.value})} 
                                min={1} 
                                showButtons
                                className="w-full"
                            />
                        </div>
                        <div className="flex flex-col gap-2 flex-1">
                            <label htmlFor="price" className="text-sm font-bold text-slate-600">Price (â‚¹)</label>
                            <InputNumber 
                                id="price"
                                value={customOrder.price} 
                                onValueChange={(e) => setCustomOrder({...customOrder, price: e.value})} 
                                mode="currency" 
                                currency="INR" 
                                locale="en-IN"
                                className="w-full"
                            />
                        </div>
                    </div>
                </div>
            </Dialog>
        </div>
    );
};

export default OrderList;


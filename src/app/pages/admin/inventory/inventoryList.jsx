import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Tag } from 'primereact/tag';
import { classNames } from 'primereact/utils';
import axios from 'axios';
import { useSelector } from 'react-redux';
import ListLayout from '@/components/shared/ListLayout';

const InventoryList = () => {
    const [stocks, setStocks] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [globalFilter, setGlobalFilter] = useState("");
    const toast = useRef(null);

    const [stockDialog, setStockDialog] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [editStock, setEditStock] = useState({
        productId: null,
        quantity: '',
        type: 'CREDIT'
    });

    const token = useSelector((state) => state.auth.token);
    const BASE_URL = import.meta.env.VITE_BACKEND_BASEURL;

    const fetchStocks = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${BASE_URL}/admin/inventory`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = response.data?.data || response.data || [];
            setStocks(Array.isArray(data) ? data : []);
        } catch (error) {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to fetch inventory' });
        } finally {
            setLoading(false);
        }
    };

    const fetchProducts = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/admin/products`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProducts(response.data?.data || response.data || []);
        } catch (error) {
            console.error("Failed to fetch products:", error);
        }
    };

    useEffect(() => {
        if (token) {
            fetchStocks();
            fetchProducts();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token]);

    const enrichedStocks = useMemo(() => {
        return stocks.map(s => {
            const prod = products.find(p => p.id === s.productId);
            return {
                ...s,
                resolvedProductName: prod ? prod.name : (s.productName || s.product?.name || 'Unknown Product')
            };
        });
    }, [stocks, products]);

    const openAdjustment = (rowData = null) => {
        setEditStock({
            productId: rowData ? rowData.productId : null,
            quantity: '',
            type: 'CREDIT'
        });
        setSubmitted(false);
        setStockDialog(true);
    };

    const saveAdjustment = async () => {
        setSubmitted(true);
        if (editStock.productId && editStock.quantity && Number(editStock.quantity) > 0) {
            try {
                const payload = {
                    productId: editStock.productId,
                    quantity: Number(editStock.quantity),
                    type: editStock.type
                };
                await axios.post(`${BASE_URL}/admin/inventory`, payload, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Stock adjusted successfully' });
                setStockDialog(false);
                fetchStocks();
            } catch (error) {
                toast.current?.show({ severity: 'error', summary: 'Error', detail: error?.response?.data?.message || 'Failed to adjust stock' });
            }
        }
    };

    const stockStatusTemplate = (rowData) => {
        const qty = rowData.quantity || rowData.qty || 0;
        let severity = 'success';
        let label = 'In Stock';

        if (qty <= 0) { severity = 'danger'; label = 'Out of Stock'; }
        else if (qty < 10) { severity = 'warning'; label = 'Low Stock'; }

        return <Tag value={label} severity={severity} rounded className="px-3 py-1 font-bold text-[10px] uppercase tracking-widest" />;
    };

    const actionBodyTemplate = (rowData) => (
        <div className="flex gap-2 justify-center">
            <Button
                icon="pi pi-plus-circle"
                rounded text
                tooltip="Adjust Inventory"
                tooltipOptions={{ position: 'top' }}
                className="btn-icon text-emerald-500"
                onClick={() => openAdjustment(rowData)}
            />
        </div>
    );

    return (
        <div className="animate-fade-in">
            <Toast ref={toast} />
            <ListLayout
                title="Stock Management"
                subtitle="Track and adjust real-time product availability"
                data={enrichedStocks}
                loading={loading}
                globalFilter={globalFilter}
                setGlobalFilter={setGlobalFilter}
                onAdd={() => openAdjustment()}
                addLabel="Adjust Stock"
            >
                <Column field="no" header="#" body={(_, opts) => <span className="text-slate-400 font-bold text-xs">{opts.rowIndex + 1}</span>} style={{ width: '4rem', textAlign: 'center' }} />
                <Column field="resolvedProductName" header="Product Definition" body={(row) => <span className="font-bold text-slate-700">{row.resolvedProductName}</span>} sortable />
                <Column field="quantity" header="Current Units" body={(row) => <span className="font-black text-slate-900">{row.quantity || row.qty || 0}</span>} sortable />
                <Column header="Status" body={stockStatusTemplate} style={{ width: '10rem', textAlign: 'center' }} />
                <Column header="Quick Actions" body={actionBodyTemplate} style={{ width: '10rem', textAlign: 'center' }} />
            </ListLayout>

            <Dialog
                visible={stockDialog}
                style={{ width: '450px' }}
                header={<div className="text-xl font-black text-slate-800 tracking-tight">Adjust Inventory Level</div>}
                modal
                className="p-fluid rounded-3xl overflow-hidden shadow-2xl"
                onHide={() => setStockDialog(false)}
            >
                <div className="flex flex-col gap-6 pt-4">
                    <div className="field">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Select Product</label>
                        <Dropdown
                            value={editStock.productId}
                            options={products.map(p => ({ label: p.name, value: p.id }))}
                            onChange={(e) => setEditStock({ ...editStock, productId: e.value })}
                            placeholder="Pick a commodity"
                            className={classNames('w-full bg-slate-50 border border-slate-200 rounded-2xl h-[52px] flex items-center px-2 shadow-inner', { 'border-rose-400': submitted && !editStock.productId })}
                        />
                    </div>

                    <div className="field">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Adjustment Type</label>
                        <Dropdown
                            value={editStock.type}
                            options={[
                                { label: 'Add Stock (Credit)', value: 'CREDIT' },
                                { label: 'Remove Stock (Debit)', value: 'DEBIT' }
                            ]}
                            onChange={(e) => setEditStock({ ...editStock, type: e.value })}
                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl h-[52px] flex items-center px-2 shadow-inner"
                        />
                    </div>

                    <div className="field">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Quantity Change</label>
                        <InputText
                            type="number"
                            value={editStock.quantity}
                            onChange={(e) => setEditStock({ ...editStock, quantity: e.target.value })}
                            placeholder="Enter units"
                            className={classNames('w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-50 transition-all font-bold text-slate-700 shadow-inner', { 'border-rose-400': submitted && (!editStock.quantity || Number(editStock.quantity) <= 0) })}
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-3 mt-10 pt-6 border-t border-slate-50">
                    <Button label="Cancel" icon="pi pi-times" onClick={() => setStockDialog(false)} className="p-button-text text-slate-400 hover:bg-slate-50 rounded-xl px-5 font-bold transition-all text-sm" />
                    <Button label="Execute Adjustment" icon="pi pi-check" onClick={saveAdjustment} className="bg-[#3b82f6] border-none text-white rounded-xl px-8 py-3 font-black shadow-lg hover:shadow-xl transition-all text-sm" />
                </div>
            </Dialog>
        </div>
    );
};

export default InventoryList;
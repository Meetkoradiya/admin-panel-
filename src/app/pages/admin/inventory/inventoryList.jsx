import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { classNames } from 'primereact/utils';
import ListLayout from '@/components/shared/ListLayout';
import ActionButtons from '@/components/shared/ActionButtons';
import useApi from '@/hooks/useApi';
import useUrlFilters from '@/hooks/useUrlFilters';
import { showConfirmDialog } from '@/utils/confirmUtils';

const InventoryList = () => {
    const [stocks, setStocks] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [globalFilter, setGlobalFilter] = useState("");

    // Sync filter with URL
    useUrlFilters(globalFilter, setGlobalFilter);

    const toast = useRef(null);

    const [stockDialog, setStockDialog] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [editStock, setEditStock] = useState({
        id: null,
        productId: null,
        available: 0,
        damaged: 0,
        empty: 0
    });

    const { apiGet, apiPost, apiPut, apiPatch, apiDelete } = useApi();

    const fetchStocks = useCallback(async () => {
        setLoading(true);
        try {
            // Added cache busting parameter
            const response = await apiGet(`/admin/inventory?t=${Date.now()}`);
            console.log("📥 Raw Inventory Data from backend:", response);
            // Robustly extract and normalize the array
            const data = response?.data || response?.stocks || response?.inventory || (Array.isArray(response) ? response : []);
            const normalized = Array.isArray(data) ? data.map(s => ({ 
                ...s, 
                id: s.id || s._id || s.productId || s.product_id || (typeof s.product === 'string' ? s.product : s.product?.id || s.product?._id)
            })) : [];

            setStocks(normalized);
        } catch (error) {
            console.error("Fetch Stocks Error:", error);
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to fetch inventory' });
            setStocks([]);
        } finally {
            setLoading(false);
        }
    }, [apiGet]);

    const fetchProducts = useCallback(async () => {
        try {
            const response = await apiGet('/admin/products');
            const data = response?.data || response?.products || (Array.isArray(response) ? response : []);
            // Ensure every product has an 'id' for lookup
            const normalized = Array.isArray(data) ? data.map(p => ({ ...p, id: p.id || p._id })) : [];
            setProducts(normalized);
        } catch (error) {
            console.error("Failed to fetch products:", error);
        }
    }, [apiGet]);

    useEffect(() => {
        fetchStocks();
        fetchProducts();
    }, [fetchStocks, fetchProducts]);

    const enrichedStocks = useMemo(() => {
        return stocks.map(s => {
            // Use string comparison for robust matching
            const prod = products.find(p => String(p.id) === String(s.productId));
            return {
                ...s,
                resolvedProductName: prod ? prod.name : (s.productName || s.product?.name || 'Unknown Product')
            };
        });
    }, [stocks, products]);

    const openEdit = (rowData = null) => {
        // Try multiple field names that backend might use for productId
        const resolvedProductId = rowData
            ? (rowData.productId || rowData.product_id || rowData.productID
                || (typeof rowData.product === 'string' ? rowData.product : null)
                || (typeof rowData.product === 'object' ? rowData.product?.id || rowData.product?._id : null)
                || null)
            : null;

        setEditStock({
            id: rowData ? (rowData.id || rowData._id) : null,
            productId: resolvedProductId,
            available: rowData ? (rowData.availableStock ?? rowData.available ?? rowData.quantity ?? rowData.qty ?? 0) : 0,
            damaged: rowData ? (rowData.damagedStock ?? rowData.damaged ?? 0) : 0,
            empty: rowData ? (rowData.emptyStock ?? rowData.empty ?? 0) : 0
        });
        setSubmitted(false);
        setStockDialog(true);
    };

    const saveStock = async () => {
        setSubmitted(true);
        // For new records, require productId. For existing records (id exists), allow update without productId.
        if (!editStock.id && !editStock.productId) return;

        try {
            const valAvailable = Number(editStock.available || 0);
            const valDamaged = Number(editStock.damaged || 0);
            const valEmpty = Number(editStock.empty || 0);
            
            // Payload according to Swagger InventoryRequestDTO
            const payload = {
                productId: editStock.productId,
                availableStock: valAvailable,
                damagedStock: valDamaged,
                emptyStock: valEmpty
            };

            let response;
            if (editStock.id) {
                response = await apiPut(`/admin/inventory/${editStock.id}`, payload);
            } else {
                response = await apiPost(`/admin/inventory`, payload);
            }

            if (response?.success === false || response?.status === false) {
                throw new Error(response?.message || 'Save failed');
            }

            // Update local state IMMEDIATELY
            if (editStock.id) {
                const editIdStr = String(editStock.id);
                setStocks(prev => prev.map(s => {
                    if (String(s.id || s._id || '') === editIdStr) {
                        return {
                            ...s,
                            availableStock: valAvailable,
                            available: valAvailable, // Keep for UI compatibility
                            damagedStock: valDamaged,
                            damaged: valDamaged,
                            emptyStock: valEmpty,
                            empty: valEmpty,
                        };
                    }
                    return s;
                }));
            } else {
                await fetchStocks();
            }

            toast.current?.show({
                severity: 'success',
                summary: editStock.id ? 'Updated' : 'Created',
                detail: editStock.id ? 'Inventory updated successfully' : 'Inventory record created'
            });

            setStockDialog(false);
        } catch (error) {
            console.error("Save stock error:", error);
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: error?.response?.data?.message || error?.message || 'Failed to save inventory'
            });
        }
    };

    const productBodyTemplate = (rowData) => (
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center text-violet-500 font-bold text-xs border border-violet-100 shadow-sm shadow-violet-100/50">
                <i className="pi pi-box text-lg" />
            </div>
            <div className="flex flex-col">
                <span className="font-bold text-slate-800 text-sm">{rowData.resolvedProductName}</span>
                <span className="text-xs text-slate-400 font-semibold uppercase tracking-widest mt-1">PID: {rowData.productId || 'â€”'}</span>
            </div>
        </div>
    );


    const actionBodyTemplate = (rowData) => (
        <ActionButtons
            onEdit={() => openEdit(rowData)}
            onDelete={() => {
                toast.current?.show({ severity: 'warn', summary: 'Restricted', detail: 'Stock records must be adjusted, not deleted.' });
            }}
            onDeactivate={() => {
                toast.current?.show({ severity: 'info', summary: 'Status Updated', detail: 'Inventory monitoring status has been updated.' });
            }}
        />
    );

    return (
        <div className="animate-fade-in">
            <Toast ref={toast} />
            <ListLayout
                title="Inventory"
                subtitle="Check stock & water levels"
                data={enrichedStocks}
                loading={loading}
                globalFilter={globalFilter}
                setGlobalFilter={setGlobalFilter}
                onAdd={() => openEdit()}
                addLabel="Add Stock"
            >
                <Column field="no" header="#" body={(_, opts) => <span className="text-slate-500 font-bold text-xs">{opts.rowIndex + 1}</span>} style={{ width: '4rem', textAlign: 'center' }} />
                <Column header="Product Details" body={productBodyTemplate} sortField="resolvedProductName" />
                <Column field="availableStock" header="Available" body={(row) => <span className="font-bold text-emerald-600">{row.availableStock || row.available || row.quantity || row.qty || 0}</span>} />
                <Column field="damagedStock" header="Damaged" body={(row) => <span className="font-bold text-rose-600">{row.damagedStock || row.damaged || 0}</span>} />
                <Column field="emptyStock" header="Empty" body={(row) => <span className="font-bold text-slate-500">{row.emptyStock || row.empty || 0}</span>} />
                <Column header="Total" body={(row) => {
                    const avail = Number(row.availableStock || row.available || row.quantity || row.qty || 0);
                    const dam = Number(row.damagedStock || row.damaged || 0);
                    const emp = Number(row.emptyStock || row.empty || 0);
                    return <span className="font-bold text-slate-900">{avail + dam + emp}</span>;
                }} />
                <Column header="Actions" body={actionBodyTemplate} style={{ width: '10rem', textAlign: 'center' }} />
            </ListLayout>

            <Dialog
                visible={stockDialog}
                style={{ width: '450px' }}
                header={<div className="text-xl font-bold text-slate-800 tracking-tight">{editStock.id ? "Edit Inventory" : "Create Inventory"}</div>}
                modal
                className="p-fluid rounded-3xl overflow-hidden shadow-2xl"
                onHide={() => setStockDialog(false)}
            >
                <div className="flex flex-col gap-5 pt-4">
                    <div className="field">
                        <label className="text-[13px] font-bold text-slate-500 ml-1 mb-2 block">Product</label>
                        <Dropdown
                            value={editStock.productId || null}
                            options={products.map(p => ({ label: p.name, value: p.id }))}
                            onChange={(e) => setEditStock({ ...editStock, productId: e.value })}
                            placeholder="Select product"
                            disabled={!!editStock.id}
                            className={classNames('w-full rounded-2xl bg-slate-50 border border-slate-200 font-bold text-slate-700 text-[15px] h-13 flex items-center px-2 focus:ring-4 focus:ring-blue-50 transition-all shadow-inner', { 'border-rose-400 bg-rose-50/50': submitted && !editStock.productId })}
                        />
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        <div className="field">
                            <label className="text-[13px] font-bold text-slate-500 ml-1 mb-2 block">Available Units</label>
                            <InputNumber
                                value={editStock.available || 0}
                                onValueChange={(e) => setEditStock({ ...editStock, available: e.value })}
                                inputClassName="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-50 transition-all font-bold text-slate-700 text-[15px] shadow-inner"
                                className="w-full"
                                placeholder="0"
                            />
                        </div>

                        <div className="field">
                            <label className="text-[13px] font-bold text-slate-500 ml-1 mb-2 block">Damaged Units</label>
                            <InputNumber
                                value={editStock.damaged || 0}
                                onValueChange={(e) => setEditStock({ ...editStock, damaged: e.value })}
                                inputClassName="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-50 transition-all font-bold text-slate-700 text-[15px] shadow-inner"
                                className="w-full"
                                placeholder="0"
                            />
                        </div>

                        <div className="field">
                            <label className="text-[13px] font-bold text-slate-500 ml-1 mb-2 block">Empty Bottles</label>
                            <InputNumber
                                value={editStock.empty || 0}
                                onValueChange={(e) => setEditStock({ ...editStock, empty: e.value })}
                                inputClassName="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-50 transition-all font-bold text-slate-700 text-[15px] shadow-inner"
                                className="w-full"
                                placeholder="0"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-3 mt-10 pt-6 border-t border-slate-50">
                    <Button 
                        label="Cancel" 
                        icon="pi pi-times" 
                        onClick={() => setStockDialog(false)} 
                        variant="ghost"
                        size="md"
                        className="text-slate-400"
                    />
                    <Button 
                        label={editStock.id ? "Update" : "Create"} 
                        icon="pi pi-check" 
                        onClick={saveStock} 
                        variant="primary"
                        size="md"
                        className="px-10"
                    />
                </div>
            </Dialog>
        </div>
    );
};

export default InventoryList;


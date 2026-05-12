import React, { useState, useEffect, useRef, useCallback } from "react";
import { Column } from "primereact/column";
import Button from "@/components/ui/Button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { classNames } from 'primereact/utils';
import { Page } from "@/components/shared/Page";
import ListLayout from "@/components/shared/ListLayout";
import ActionButtons from "@/components/shared/ActionButtons";
import useApi from "@/hooks/useApi";
import { showConfirmDialog } from "@/utils/confirmUtils";

const ProductList = () => {
    const toast = useRef(null);

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [globalFilter, setGlobalFilter] = useState("");

    const [productDialog, setProductDialog] = useState(false);
    const [productId, setProductId] = useState(null);
    const [productName, setProductName] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const { apiGet, apiPost, apiPut, apiDelete } = useApi();

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        try {
            const response = await apiGet('/admin/products');
            const data = response?.data || response;
            console.log("Fetched Products:", data);
            setProducts(Array.isArray(data) ? data : []);
        } catch (error) {
            toast.current?.show({ severity: "error", summary: "Error", detail: "Failed to fetch products" });
        } finally {
            setLoading(false);
        }
    }, [apiGet]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const saveProduct = async () => {
        setSubmitted(true);
        if (productName.trim()) {
            try {
                if (productId) {
                    await apiPut(`/admin/products/${productId}`, { name: productName });
                    toast.current?.show({ severity: "success", summary: "Successful", detail: "Product Updated", life: 3000 });
                } else {
                    await apiPost(`/admin/products`, { name: productName });
                    toast.current?.show({ severity: "success", summary: "Successful", detail: "Product Created", life: 3000 });
                }
                setProductDialog(false);
                fetchProducts();
            } catch (error) {
                toast.current?.show({ severity: "error", summary: "Error", detail: error?.response?.data?.message || "Failed to save product" });
            }
        }
    };

    const deleteProduct = async (rowData) => {
        const id = rowData.id || rowData._id;
        showConfirmDialog({
            title: 'Delete Product',
            message: `Delete ${rowData.name}? This action cannot be undone.`,
            type: 'delete',
            acceptLabel: 'Delete',
            onAccept: async () => {
                try {
                    await apiDelete(`/admin/products/${id}`);
                    toast.current?.show({ severity: "success", summary: "Successful", detail: "Product Deleted", life: 3000 });
                    fetchProducts();
                } catch (error) {
                    toast.current?.show({ severity: "error", summary: "Error", detail: "Failed to delete product" });
                }
            }
        });
    };

    const toggleStatus = async (rowData) => {
        const id = rowData.id || rowData._id;
        const currentStatus = rowData.status || 'ACTIVE';
        const newStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';

        try {
            await apiPut(`/admin/products/${id}`, {
                name: rowData.name || rowData.productName,
                status: newStatus
            });

            toast.current?.show({
                severity: 'success',
                summary: 'Status Updated',
                detail: `Product is now ${newStatus.toLowerCase()}.`,
                life: 3000
            });
            fetchProducts();
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: 'Update Failed',
                detail: 'Could not update product status.',
                life: 5000
            });
        }
    };

    const actionBodyTemplate = (rowData) => (
        <ActionButtons
            onDelete={() => deleteProduct(rowData)}
        />
    );

    return (
        <div className="animate-fade-in">
            <Toast ref={toast} />
            <ListLayout
                title="Product List"
                subtitle="Configure foundational commodities and water units"
                data={products}
                loading={loading}
                globalFilter={globalFilter}
                setGlobalFilter={setGlobalFilter}
                onAdd={() => {
                    setProductId(null);
                    setProductName("");
                    setSubmitted(false);
                    setProductDialog(true);
                }}
                addLabel="New Product"
            >
                <Column field="no" header="#" body={(_, opts) => <span className="text-slate-400 font-semibold text-xs">{opts.rowIndex + 1}</span>} style={{ width: '4rem', textAlign: 'center' }} />
                <Column field="name" header="Product Title" sortable className="font-semibold text-slate-700 text-sm" />
                <Column header="Actions" body={actionBodyTemplate} style={{ width: '6rem', textAlign: 'center' }} />
            </ListLayout>

            <Dialog
                visible={productDialog}
                onHide={() => setProductDialog(false)}
                header={<div className="text-2xl font-medium text-slate-900 px-2 tracking-tight">{productId ? "Edit Product" : "Create Product"}</div>}
                modal
                className="p-fluid rounded-3xl overflow-hidden shadow-2xl"
                style={{ width: '450px' }}
            >
                <div className="flex flex-col gap-8 pt-6">
                    <div className="w-full text-left px-2">
                        <h4 className="text-xl font-medium text-slate-800 mb-6 tracking-tight">Overview</h4>
                        
                        <div className="field">
                            <label className="text-[14px] font-medium text-[#475569] ml-1 mb-2 block tracking-wide">Product Identity</label>
                            <InputText
                                value={productName || ""}
                                onChange={(e) => setProductName(e.target.value)}
                                placeholder="Enter product title"
                                className={classNames('w-full h-13 px-4 rounded-xl bg-white border border-slate-200 font-medium text-slate-700 text-[15px] focus:border-blue-500 transition-all outline-none', { 'border-red-400 bg-red-50/50': submitted && !productName })}
                            />
                            {submitted && !productName && <small className="text-red-500 font-medium mt-2 block ml-1 text-xs">Product name is required!</small>}
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 px-2 mt-4 pt-6 border-t border-slate-50">
                        <Button 
                            label="Discard" 
                            icon="pi pi-trash" 
                            onClick={() => setProductDialog(false)} 
                            variant="outlineDanger"
                            className="px-6 h-12 text-sm font-medium rounded-xl" 
                        />
                        <Button 
                            label={productId ? "Update" : "Create"} 
                            icon="pi pi-check"
                            onClick={saveProduct} 
                            variant="primary"
                            className="px-10 h-12 text-sm font-medium rounded-xl shadow-lg shadow-blue-500/10" 
                        />
                    </div>
                </div>
            </Dialog>
        </div>
    );
};

export default ProductList;


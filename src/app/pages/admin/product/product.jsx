import React, { useState, useEffect, useRef, useCallback } from "react";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
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
                style={{ width: "450px" }}
                header={<div className="text-xl font-bold text-slate-800 tracking-tight">{productId ? "Edit Product" : "Create Product"}</div>}
                modal
                className="p-fluid rounded-3xl overflow-hidden shadow-2xl"
                onHide={() => setProductDialog(false)}
            >
                <div className="flex flex-col gap-5 pt-6 pb-2">
                    <div className="field">
                        <label className="text-[13px] font-bold text-slate-500 ml-1 mb-2 block">Product Name</label>
                        <InputText
                            value={productName || ""}
                            onChange={(e) => setProductName(e.target.value)}
                            placeholder="Enter product name"
                            className={classNames('w-full p-4 rounded-2xl bg-slate-50 border border-slate-200 font-bold text-slate-700 text-[15px] focus:ring-4 focus:ring-blue-50 transition-all', { 'border-rose-400 bg-rose-50/50': submitted && !productName })}
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-slate-50">
                    <Button label="Cancel" icon="pi pi-times" onClick={() => setProductDialog(false)} className="p-button-text text-slate-400 hover:bg-slate-50 rounded-xl px-5 font-bold transition-all text-sm" />
                    <Button label={productId ? "Update" : "Create"} icon="pi pi-check" onClick={saveProduct} className="bg-blue-600 hover:bg-blue-700 border-none text-white rounded-xl px-8 py-3 font-bold shadow-lg shadow-blue-500/20 transition-all text-sm" />
                </div>
            </Dialog>
        </div>
    );
};

export default ProductList;


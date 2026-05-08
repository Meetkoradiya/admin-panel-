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
                className="custom-dialog-premium"
                content={({ hide }) => (
                    <div className="flex flex-col items-center bg-white rounded-[2rem] md:rounded-[3rem] p-8 md:p-14 shadow-2xl w-[90vw] md:w-auto md:min-w-[440px] md:max-w-[500px] mx-auto border border-slate-50 animate-zoom-in relative">
                        <button 
                            onClick={() => setProductDialog(false)} 
                            className="absolute top-6 right-6 size-10 flex items-center justify-center rounded-full bg-slate-50 text-slate-400 hover:bg-slate-100 transition-all active:scale-90"
                        >
                            <i className="pi pi-times"></i>
                        </button>

                        <div className="flex items-center justify-center size-20 md:size-24 rounded-3xl bg-blue-50 text-blue-500 mb-8 shadow-sm">
                            <i className="pi pi-box text-3xl md:text-4xl"></i>
                        </div>

                        <div className="text-center mb-10 w-full">
                            <h3 className="text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tight mb-3 px-2 leading-none uppercase">
                                {productId ? "Edit Product" : "Create Product"}
                            </h3>
                            <p className="text-slate-400 font-bold text-[12px] md:text-sm uppercase tracking-widest leading-none">Foundational Water Units</p>
                        </div>

                        <div className="w-full flex flex-col gap-6">
                            <div className="field">
                                <label className="text-[11px] font-extrabold text-slate-400 uppercase tracking-[0.2em] ml-1 mb-2.5 block">Product Identity</label>
                                <InputText
                                    value={productName || ""}
                                    onChange={(e) => setProductName(e.target.value)}
                                    placeholder="Enter unique product title"
                                    className={classNames('w-full p-4 md:p-5 rounded-2xl bg-slate-50 border border-slate-100 font-bold text-slate-700 text-[15px] focus:bg-white focus:ring-4 focus:ring-blue-500/5 transition-all outline-none', { 'border-red-400 bg-red-50/50': submitted && !productName })}
                                />
                                {submitted && !productName && <small className="text-red-500 font-bold mt-2 block ml-1">Product name is required!</small>}
                            </div>

                            <div className="flex flex-col gap-3 mt-4">
                                <Button 
                                    label={productId ? "Update Product" : "Create Product"} 
                                    onClick={saveProduct} 
                                    variant="primary"
                                    className="w-full h-14 md:h-16 text-base shadow-xl shadow-blue-500/20" 
                                />
                                <Button 
                                    label="Discard" 
                                    icon="pi pi-trash" 
                                    onClick={() => setProductDialog(false)} 
                                    variant="outlineDanger"
                                    className="w-full h-14 md:h-16 text-base" 
                                />
                            </div>
                        </div>
                    </div>
                )}
            />
        </div>
    );
};

export default ProductList;


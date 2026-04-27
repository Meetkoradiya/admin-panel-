import React, { useState, useEffect, useRef } from "react";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { classNames } from 'primereact/utils';
import axios from "axios";
import { useSelector } from "react-redux";
import ListLayout from "@/components/shared/ListLayout";

const ProductList = () => {
    const toast = useRef(null);
    const token = useSelector((state) => state.auth.token);
    const BASE_URL = import.meta.env.VITE_BACKEND_BASEURL;

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [globalFilter, setGlobalFilter] = useState("");

    const [productDialog, setProductDialog] = useState(false);
    const [productId, setProductId] = useState(null);
    const [productName, setProductName] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${BASE_URL}/admin/products`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = response.data?.data || response.data;
            setProducts(Array.isArray(data) ? data : []);
        } catch (error) {
            toast.current?.show({ severity: "error", summary: "Error", detail: "Failed to fetch products" });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) fetchProducts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token]);

    const saveProduct = async () => {
        setSubmitted(true);
        if (productName.trim()) {
            try {
                if (productId) {
                    await axios.put(`${BASE_URL}/admin/products/${productId}`, { name: productName }, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    toast.current?.show({ severity: "success", summary: "Successful", detail: "Product Updated", life: 3000 });
                } else {
                    await axios.post(`${BASE_URL}/admin/products`, { name: productName }, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
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
        if (!window.confirm(`Delete ${rowData.name}?`)) return;
        try {
            await axios.delete(`${BASE_URL}/admin/products/${rowData.id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.current?.show({ severity: "success", summary: "Successful", detail: "Product Deleted", life: 3000 });
            fetchProducts();
        } catch (error) {
            toast.current?.show({ severity: "error", summary: "Error", detail: "Failed to delete product" });
        }
    };

    const actionBodyTemplate = (rowData) => (
        <div className="flex gap-2 justify-center">
            <Button
                icon="pi pi-pencil"
                rounded text
                tooltip="Edit Commodity"
                tooltipOptions={{ position: 'top' }}
                className="btn-icon text-sky-500"
                onClick={() => {
                    setProductId(rowData.id);
                    setProductName(rowData.name);
                    setSubmitted(false);
                    setProductDialog(true);
                }}
            />
            <Button
                icon="pi pi-trash"
                rounded text
                tooltip="Delete Commodity"
                tooltipOptions={{ position: 'top' }}
                className="btn-icon text-rose-500"
                onClick={() => deleteProduct(rowData)}
            />
        </div>
    );

    return (
        <div className="animate-fade-in">
            <Toast ref={toast} />
            <ListLayout
                title="Product Base"
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
                <Column field="no" header="#" body={(_, opts) => <span className="text-slate-400 font-bold text-xs">{opts.rowIndex + 1}</span>} style={{ width: '4rem', textAlign: 'center' }} />
                <Column field="name" header="Product Title" sortable className="font-bold text-slate-700 text-sm" />
                <Column header="Actions" body={actionBodyTemplate} style={{ width: '10rem', textAlign: 'center' }} />
            </ListLayout>

            <Dialog
                visible={productDialog}
                style={{ width: "450px" }}
                header={<div className="text-xl font-black text-slate-800 tracking-tight">{productId ? "Edit Definition" : "Create Commodity"}</div>}
                modal
                className="p-fluid rounded-3xl overflow-hidden shadow-2xl"
                onHide={() => setProductDialog(false)}
            >
                <div className="flex flex-col gap-5 pt-6 pb-2">
                    <div className="field">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Commodity Title</label>
                        <InputText
                            value={productName}
                            onChange={(e) => setProductName(e.target.value)}
                            placeholder="e.g. 20L Premium Can"
                            className={classNames('w-full p-4 rounded-2xl bg-slate-50 border border-slate-200 font-bold text-slate-700 focus:ring-4 focus:ring-blue-50 transition-all', { 'border-rose-400 bg-rose-50/50': submitted && !productName })}
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-slate-50">
                    <Button label="Cancel" icon="pi pi-times" onClick={() => setProductDialog(false)} className="p-button-text text-slate-400 hover:bg-slate-50 rounded-xl px-5 font-bold transition-all text-sm" />
                    <Button label="Save Changes" icon="pi pi-check" onClick={saveProduct} className="bg-[#3b82f6] border-none text-white rounded-xl px-8 py-3 font-black shadow-lg hover:shadow-xl transition-all text-sm" />
                </div>
            </Dialog>
        </div>
    );
};

export default ProductList;

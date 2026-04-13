import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { Skeleton } from "primereact/skeleton";
import { Page } from "@/components/shared/Page";
import axios from "axios";
import { useSelector } from "react-redux";

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

    const blankRows = Array.from({ length: 10 }, (_, i) => ({ id: `skeleton-${i}` }));

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${BASE_URL}/admin/products`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = response.data?.data || response.data;
            if (Array.isArray(data)) {
                setProducts(data);
            } else {
                setProducts([]);
            }
        } catch (error) {
            toast.current?.show({ severity: "error", summary: "Error", detail: "Failed to fetch products" });
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchProducts();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token]);

    const openNew = () => {
        setProductId(null);
        setProductName("");
        setSubmitted(false);
        setProductDialog(true);
    };

    const editProduct = (rowData) => {
        setProductId(rowData.id);
        setProductName(rowData.name);
        setSubmitted(false);
        setProductDialog(true);
    };

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
                setProductName("");
                setProductId(null);
                fetchProducts();
            } catch (error) {
                toast.current?.show({ severity: "error", summary: "Error", detail: error?.response?.data?.message || "Failed to save product" });
            }
        }
    };

    const deleteProduct = async (rowData) => {
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

    const actionBodyTemplate = (rowData) => {
        return loading ? (
             <div className="flex justify-center gap-3">
                 <Skeleton width="2rem" height="2rem" shape="circle" />
                 <Skeleton width="2rem" height="2rem" shape="circle" />
             </div>
        ) : (
             <div className="flex justify-center gap-3 opacity-80 hover:opacity-100 transition-opacity">
                 <Button icon="pi pi-pencil" rounded outlined tooltip="Edit" tooltipOptions={{position:'top'}} className="w-8 h-8 !rounded-full border-blue-400 text-blue-500 hover:bg-blue-500 hover:text-white transition-all duration-300 shadow-sm" onClick={(e) => { e.stopPropagation(); editProduct(rowData); }} />
                 <Button icon="pi pi-trash" rounded outlined tooltip="Delete" tooltipOptions={{position:'top'}} className="w-8 h-8 !rounded-full border-red-400 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300 shadow-sm" onClick={(e) => { e.stopPropagation(); deleteProduct(rowData); }} />
             </div>
        );
    };

    const nameBodyWrapper = (rowData) => loading ? <Skeleton width="100%" height="1.2rem" /> : <span className="font-extrabold text-slate-800 tracking-tight text-sm">{rowData.name}</span>;
    const noBodyWrapper = (data, options) => loading ? <Skeleton width="2rem" /> : <span className="font-bold text-slate-400">{options.rowIndex + 1}</span>;

    const tableHeader = (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 bg-white/50 backdrop-blur-md border-b border-slate-100/60 rounded-t-[30px]">
            <div>
                <h2 className="text-2xl font-extrabold text-slate-800 m-0 tracking-tight">Master Products</h2>
                <p className="text-sm font-semibold text-slate-400 mt-1">Configure your foundational base commodities</p>
            </div>
            <div className="flex items-center gap-3 w-full md:w-auto">
                <span className="p-input-icon-left w-full shadow-sm rounded-xl">
                    <i className="pi pi-search text-indigo-400" />
                    <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search commodities..." className="bg-white/80 border-slate-200 rounded-xl w-full focus:ring-4 focus:ring-indigo-100 transition-all font-semibold" />
                </span>
                <Button label="New Product" icon="pi pi-plus" className="bg-gradient-to-tr from-purple-500 to-fuchsia-500 hover:from-purple-600 hover:to-fuchsia-600 border-none px-6 py-3 rounded-xl font-extrabold shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 whitespace-nowrap text-white" onClick={openNew} />
            </div>
        </div>
    );

    return (
        <Page title="Product Base Management">
            <div className="min-h-full bg-slate-50 relative overflow-hidden font-sans p-4 md:p-6 lg:p-8">
                <Toast ref={toast} />

                {/* Abstract Background Blobs tailored to match dashboard */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                    <div className="absolute top-10 left-10 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-[100px] opacity-40 animate-blob"></div>
                    <div className="absolute -bottom-20 right-20 w-96 h-96 bg-fuchsia-200 rounded-full mix-blend-multiply filter blur-[100px] opacity-40 animate-blob animation-delay-4000"></div>
                </div>

                <div className="relative z-10 w-full">
                    <div className="backdrop-blur-xl bg-white/80 border border-white/60 shadow-2xl rounded-[32px] hover:shadow-xl transition-all duration-500 flex flex-col">
                        <div className="flex-1 rounded-[32px]">
                            <DataTable 
                                value={loading ? blankRows : products} 
                                header={tableHeader} 
                                paginator 
                                rows={10} 
                                loading={loading}
                                globalFilter={globalFilter}
                                rowHover
                                className="p-datatable-sm bg-transparent"
                                emptyMessage={<div className="p-6 text-center text-slate-500 font-bold">No product definitions found.</div>}
                            >
                                <Column field="no" header="No." body={noBodyWrapper} headerClassName="bg-slate-50/50 border-b border-slate-100 text-slate-500 font-extrabold text-xs uppercase tracking-wider py-4" style={{ width: '80px' }}></Column>
                                <Column field="name" header="Product Title" body={nameBodyWrapper} sortable headerClassName="bg-slate-50/50 border-b border-slate-100 text-slate-500 font-extrabold text-xs uppercase tracking-wider py-4"></Column>
                                <Column header="Actions" body={actionBodyTemplate} align="center" headerClassName="bg-slate-50/50 border-b border-slate-100 text-slate-500 font-extrabold text-xs uppercase tracking-wider py-4" style={{ width: "120px" }}></Column>
                            </DataTable>
                        </div>
                    </div>
                </div>

                <Dialog
                    visible={productDialog}
                    style={{ width: "450px" }}
                    header={<div className="text-2xl font-black text-slate-800 tracking-tight">{productId ? "Edit Definition" : "Create Commodity"}</div>}
                    modal
                    className="p-fluid rounded-3xl overflow-hidden backdrop-blur-xl bg-white/90 border border-white" 
                    onHide={() => setProductDialog(false)}
                >
                    <div className="flex flex-col gap-5 pt-6 pb-2">
                        <div className="field">
                            <label className="text-xs font-extrabold text-slate-500 uppercase tracking-wider ml-1">Commodity Titling</label>
                            <InputText 
                                value={productName} 
                                onChange={(e) => setProductName(e.target.value)} 
                                placeholder="e.g., 20L Premium Can"
                                className={`w-full p-4 rounded-2xl bg-white/50 border-2 font-black text-lg focus:ring-4 focus:ring-indigo-100 ${submitted && !productName ? 'border-rose-400' : 'border-slate-200'}`}
                            />
                            {submitted && !productName && <small className="text-rose-500 font-bold ml-1 relative top-1">Naming structure is absolutely required.</small>}
                        </div>
                    </div>
                    
                    <div className="flex justify-end gap-3 mt-6 border-t pt-6 border-slate-100">
                        <Button label="Cancel" icon="pi pi-times" onClick={() => setProductDialog(false)} className="p-button-text text-slate-500 hover:bg-slate-50 rounded-xl px-5 font-bold transition-all" />
                        <Button label="Commit Registry" icon="pi pi-check" onClick={saveProduct} className="bg-gradient-to-tr from-purple-500 to-fuchsia-500 hover:from-purple-600 hover:to-fuchsia-600 border-none text-white rounded-xl px-6 font-extrabold shadow-lg hover:shadow-xl transition-all" />
                    </div>
                </Dialog>
            </div>

            <style dangerouslySetInnerHTML={{__html: `
                @keyframes blob {
                0% { transform: translate(0px, 0px) scale(1); }
                33% { transform: translate(30px, -50px) scale(1.1); }
                66% { transform: translate(-20px, 20px) scale(0.9); }
                100% { transform: translate(0px, 0px) scale(1); }
                }
                .animate-blob { animation: blob 7s infinite; }
                .animation-delay-4000 { animation-delay: 4s; }
            `}} />
        </Page>
    );
};

export default ProductList;

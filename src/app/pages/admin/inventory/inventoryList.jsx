import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputNumber } from "primereact/inputnumber";
import { Dropdown } from "primereact/dropdown";
import { Toast } from "primereact/toast";
import { Tag } from "primereact/tag";
import { Skeleton } from "primereact/skeleton";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
import { Page } from "@/components/shared/Page";
import EmptyMessage from "@/components/shared/EmptyMessage";
import axios from "axios";
import { useSelector } from "react-redux";

const Stock = () => {
    const toast = useRef(null);
    const token = useSelector((state) => state.auth.token);
    const BASE_URL = import.meta.env.VITE_BACKEND_BASEURL;

    const emptyStock = { id: null, productId: null, availableStock: 0, damagedStock: 0, emptyStock: 0 };

    const [stocks, setStocks] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [globalFilter, setGlobalFilter] = useState("");

    
    const [stockDialog, setStockDialog] = useState(false);
    const [stock, setStock] = useState(emptyStock);
    const [submitted, setSubmitted] = useState(false);

    const fetchInventories = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${BASE_URL}/admin/inventory`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = response.data?.data || response.data;
            if (Array.isArray(data)) {
                setStocks(data);
            } else if (data && typeof data === 'object') {
                // In case it returns an object that has a list inside
                const arr = Object.values(data).find(Array.isArray);
                setStocks(arr || [data]);
            } else {
                setStocks([]);
            }
        } catch (error) {
            toast.current?.show({ severity: "error", summary: "Error", detail: "Failed to fetch inventory" });
            setStocks([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchProducts = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/admin/products`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = response.data?.data || response.data;
            if (Array.isArray(data)) {
                setProducts(data);
            }
        } catch (error) {
            console.error("Failed to fetch products for inventory", error);
        }
    };

    useEffect(() => {
        if (token) {
            fetchInventories();
            fetchProducts();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token]);

    const getStatusLabel = (qty) => {
        if (qty <= 0) return { label: "OUT OF STOCK", severity: "danger" };
        if (qty > 0 && qty <= 20) return { label: "LOW STOCK", severity: "warning" };
        return { label: "IN STOCK", severity: "success" };
    };

    const statusBodyTemplate = (rowData) => {
        const qty = rowData.availableStock || 0;
        const status = getStatusLabel(qty);
        return <Tag value={status.label} severity={status.severity} className="rounded-md px-3 text-[10px]" />;
    };

    const productNameTemplate = (rowData) => {
        // Fallbacks based on typical backend DTO strategies
        if (rowData.productName) return rowData.productName;
        if (rowData.product?.name) return rowData.product.name;
        
        // Manual mapping from products list
        const prod = products.find(p => p.id === rowData.productId || p.id === rowData.product?.id);
        return prod ? prod.name : `Product ID: ${rowData.productId || 'Unknown'}`;
    };

    const totalItems = stocks.length;
    const lowStockCount = stocks.filter(s => (s.availableStock || 0) > 0 && (s.availableStock || 0) <= 20).length;
    const outOfStockCount = stocks.filter(s => (s.availableStock || 0) <= 0).length;

    const openNew = () => {
        setStock(emptyStock);
        setSubmitted(false);
        setStockDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setStockDialog(false);
    };

    const saveStock = async () => {
        setSubmitted(true);
        if (stock.productId) {
            try {
                const payload = {
                    productId: stock.productId,
                    availableStock: stock.availableStock || 0,
                    damagedStock: stock.damagedStock || 0,
                    emptyStock: stock.emptyStock || 0
                };

                if (stock.id) {
                    await axios.put(`${BASE_URL}/admin/inventory/${stock.id}`, payload, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    toast.current?.show({ severity: "success", summary: "Successful", detail: "Inventory Updated", life: 3000 });
                } else {
                    await axios.post(`${BASE_URL}/admin/inventory`, payload, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    toast.current?.show({ severity: "success", summary: "Successful", detail: "Inventory Added", life: 3000 });
                }
                
                setStockDialog(false);
                setStock(emptyStock);
                fetchInventories();
            } catch (error) {
                toast.current?.show({ severity: "error", summary: "Error", detail: error?.response?.data?.message || "Failed to save inventory" });
            }
        }
    };

    const deleteStock = async (rowData) => {
        try {
            await axios.delete(`${BASE_URL}/admin/inventory/${rowData.id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.current?.show({ severity: "success", summary: "Successful", detail: "Inventory Deleted", life: 3000 });
            fetchInventories();
        } catch (error) {
            toast.current?.show({ severity: "error", summary: "Error", detail: "Failed to delete inventory" });
        }
    };

    const editStock = (rowData) => {
        // Find correct productId from nested object if necessary
        const pId = rowData.productId || rowData.product?.id || null;
        setStock({ ...rowData, productId: pId });
        setStockDialog(true);
    };

    const blankRows = Array.from({ length: 10 }, (_, i) => ({ id: `skeleton-${i}`, productId: null }));

    const hasData = stocks.length > 0;

    const emptyMessage = !hasData ? (
      <EmptyMessage
        title="No Inventory Found"
        subtitle="There are currently no items in your inventory. Add new inventory to get started."
      />
    ) : (
      <EmptyMessage
        title="No Matching Inventory"
        subtitle="No inventory match your search criteria. Try adjusting the filters."
      />
    );

    const tableHeader = (
        <div className="flex items-center justify-between gap-4">
          <div>
            <IconField iconPosition="left">
              <InputIcon className="pi pi-search"> </InputIcon>
              <InputText
                value={globalFilter}
                onChange={(e) => setGlobalFilter(e.target.value)}
                placeholder="Quick Search..."
              />
            </IconField>
          </div>
          <div>
             <Button
                label="Add Inventory"
                className="p-button-sm h-8.5 bg-indigo-600 border-none font-semibold shadow-sm"
                icon="pi pi-plus"
                onClick={openNew}
            />
          </div>
        </div>
    );

    const actionBodyTemplate = (rowData) => {
        return loading ? (
            <div className="flex justify-center gap-3">
                 <Skeleton width="2rem" height="2rem" shape="circle" />
                 <Skeleton width="2rem" height="2rem" shape="circle" />
             </div>
        ) : (
             <div className="flex justify-center gap-2">
                 <Button icon="pi pi-pencil" rounded outlined tooltip="Edit" tooltipOptions={{position:'top'}} className="w-8 h-8 border-sky-400 text-sky-500 hover:bg-sky-50" onClick={(e) => { e.stopPropagation(); editStock(rowData); }} />
                 <Button icon="pi pi-trash" rounded outlined tooltip="Delete" tooltipOptions={{position:'top'}} className="w-8 h-8 border-rose-400 text-rose-500 hover:bg-rose-50" onClick={(e) => { e.stopPropagation(); deleteStock(rowData); }} />
             </div>
        );
    };

    const statusBodyWrapper = (rowData) => {
        if (loading) return <Skeleton width="100%" height="1.2rem" />;
        return statusBodyTemplate(rowData);
    };

    const productBodyWrapper = (rowData) => {
        if (loading) return <Skeleton width="100%" height="1.2rem" />;
        return <span className="font-semibold text-slate-700">{productNameTemplate(rowData)}</span>;
    };

    const availableBodyWrapper = (rowData) => {
        if (loading) return <Skeleton width="100%" height="1.2rem" />;
        return <b className="text-emerald-600">{rowData.availableStock || 0}</b>;
    }

    const emptyBodyWrapper = (rowData) => {
        if (loading) return <Skeleton width="100%" height="1.2rem" />;
        return <b className="text-slate-500">{rowData.emptyStock || 0}</b>;
    }

    const damagedBodyWrapper = (rowData) => {
        if (loading) return <Skeleton width="100%" height="1.2rem" />;
        return <b className="text-rose-500">{rowData.damagedStock || 0}</b>;
    }

    return (
        <Page title="Inventory Management">
            <main className="h-full">
                <Toast ref={toast} />
                <div className="w-full h-full pb-0">
                    <div className="flex h-full w-full">
                        <div className="form-container vertical flex w-full flex-col justify-between">
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                                <div className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-indigo-500">
                                    <p className="text-slate-500 text-sm font-bold uppercase tracking-wider">Total Inventory Records</p>
                                    <h3 className="text-3xl font-black text-slate-800">{totalItems}</h3>
                                </div>
                                <div className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-amber-500">
                                    <p className="text-slate-500 text-sm font-bold uppercase tracking-wider">Low Stock Items</p>
                                    <h3 className="text-3xl font-black text-amber-600">{lowStockCount}</h3>
                                </div>
                                <div className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-rose-500">
                                    <p className="text-slate-500 text-sm font-bold uppercase tracking-wider">Out of Stock</p>
                                    <h3 className="text-3xl font-black text-rose-600">{outOfStockCount}</h3>
                                </div>
                            </div>

                            <div className="w-full">
                                <div className="card">
                                    <div className="w-full mb-4 flex items-center justify-between">
                                        <h3 className="ml-1 text-xl font-bold">Inventory list</h3>
                                        <div></div>
                                    </div>
                                    <DataTable
                                        header={tableHeader}
                                        rowHover
                                        rowClassName={() => "cursor-pointer"}
                                        value={loading ? blankRows : stocks}
                                        paginator
                                        rows={20}
                                        rowsPerPageOptions={[10, 20, 50]}
                                        paginatorTemplate=" FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
                                        className="mt-4"
                                        globalFilter={globalFilter}
                                        emptyMessage={emptyMessage}
                                        dataKey="id"
                                    >
                                        <Column header="Product Name" body={productBodyWrapper} sortable></Column>
                                        <Column field="availableStock" header="Available Stock" body={availableBodyWrapper} sortable></Column>
                                        <Column field="emptyStock" header="Empty Stock" body={emptyBodyWrapper} sortable></Column>
                                        <Column field="damagedStock" header="Damaged Stock" body={damagedBodyWrapper} sortable></Column>
                                        <Column header="Status" body={statusBodyWrapper} style={{ width: "12rem" }}></Column>
                                        <Column header="Actions" body={actionBodyTemplate} align="center" style={{ width: "120px" }}></Column>
                                    </DataTable>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

                <Dialog
                    visible={stockDialog}
                    style={{ width: "450px" }}
                    header="Stock Management"
                    modal
                    className="p-fluid rounded-2xl"
                    onHide={hideDialog}
                    footer={
                        <div className="flex gap-2 justify-end p-3 bg-slate-50 rounded-b-2xl border-t border-slate-100">
                            <Button label="Cancel" className="p-button-text text-slate-500 font-bold" onClick={hideDialog} />
                            <Button label="Save Details" className="bg-indigo-600 border-none px-6 rounded-lg font-bold" onClick={saveStock} />
                        </div>
                    }
                >
                    <div className="flex flex-col gap-4 pt-4">
                        <div className="field">
                            <label className="text-xs font-bold text-slate-500 mb-1 block uppercase">Select Product</label>
                            <Dropdown 
                                value={stock.productId} 
                                options={products} 
                                optionLabel="name" 
                                optionValue="id" 
                                onChange={(e) => setStock({ ...stock, productId: e.value })} 
                                placeholder="Select a Product" 
                                className={`border-slate-200 rounded-xl h-12 flex items-center ${submitted && !stock.productId ? 'p-invalid' : ''}`}
                            />
                            {submitted && !stock.productId && <small className="p-error">Product is required.</small>}
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div className="field">
                                <label className="text-xs font-bold text-slate-500 mb-1 block uppercase">Available Stock</label>
                                <InputNumber 
                                    value={stock.availableStock} 
                                    onValueChange={(e) => setStock({ ...stock, availableStock: e.value })} 
                                    className="bg-white border border-slate-200 rounded-xl" 
                                    inputClassName="p-3" 
                                />
                            </div>
                            <div className="field">
                                <label className="text-xs font-bold text-slate-500 mb-1 block uppercase">Empty Stock</label>
                                <InputNumber 
                                    value={stock.emptyStock} 
                                    onValueChange={(e) => setStock({ ...stock, emptyStock: e.value })} 
                                    className="bg-white border border-slate-200 rounded-xl" 
                                    inputClassName="p-3" 
                                />
                            </div>
                        </div>

                        <div className="field">
                            <label className="text-xs font-bold text-slate-500 mb-1 block uppercase">Damaged Stock</label>
                            <InputNumber 
                                value={stock.damagedStock} 
                                onValueChange={(e) => setStock({ ...stock, damagedStock: e.value })} 
                                className="bg-white border border-slate-200 rounded-xl w-full" 
                                inputClassName="p-3" 
                            />
                        </div>
                    </div>
                </Dialog>
            </main>
        </Page>
    );
};

export default Stock;
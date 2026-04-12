import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { Skeleton } from "primereact/skeleton";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { Page } from "@/components/shared/Page";
import EmptyMessage from "@/components/shared/EmptyMessage";
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

    const blankRows = Array.from({ length: 10 }, (_, i) => ({ id: `skeleton-${i}` }));

    const hasData = products.length > 0;

    const emptyMessage = !hasData ? (
      <EmptyMessage
        title="No Products Found"
        subtitle="There are currently no products in the system. Create a new product base to get started."
      />
    ) : (
      <EmptyMessage
        title="No Matching Products"
        subtitle="No products match your search criteria. Try adjusting the filters."
      />
    );

    const tableHeader = (
        <div className="flex items-center justify-between gap-4 p-2">
          <div>
            <IconField iconPosition="left">
              <InputIcon className="pi pi-search text-slate-400"> </InputIcon>
              <InputText
                value={globalFilter}
                onChange={(e) => setGlobalFilter(e.target.value)}
                placeholder="Quick Search..."
                className="w-full sm:w-64 border-slate-200 rounded-lg text-sm"
              />
            </IconField>
          </div>
          <div>
             <Button
                label="New Product"
                className="bg-blue-500 hover:bg-blue-600 border-none text-white font-medium rounded-lg px-5 py-2.5 shadow-sm text-sm"
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
             <div className="flex justify-center gap-3">
                 <Button icon="pi pi-pencil" rounded outlined tooltip="Edit" tooltipOptions={{position:'top'}} className="w-8 h-8 !rounded-full border-blue-400 text-blue-500 hover:bg-blue-50 hover:border-blue-500" onClick={(e) => { e.stopPropagation(); editProduct(rowData); }} />
                 <Button icon="pi pi-trash" rounded outlined tooltip="Delete" tooltipOptions={{position:'top'}} className="w-8 h-8 !rounded-full border-red-400 text-red-500 hover:bg-red-50 hover:border-red-500" onClick={(e) => { e.stopPropagation(); deleteProduct(rowData); }} />
             </div>
        );
    };

    const nameBodyWrapper = (rowData) => {
        if (loading) return <Skeleton width="100%" height="1.2rem" />;
        return <span className="font-semibold text-slate-700">{rowData.name}</span>;
    };

    return (
        <Page title="Product Base Management">
            <main className="h-full">
                <Toast ref={toast} />
                <div className="w-full h-full pb-0">
                    <div className="flex h-full w-full">
                        <div className="form-container vertical flex w-full flex-col justify-between">
                            
                            <div className="w-full">
                                <div className="card bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                                    <div className="mb-6 flex items-center justify-between">
                                        <h3 className="text-xl font-bold text-slate-800 tracking-tight">All Products</h3>
                                    </div>
                                    <DataTable
                                        header={tableHeader}
                                        rowHover
                                        rowClassName={() => "cursor-pointer"}
                                        value={loading ? blankRows : products}
                                        paginator
                                        rows={20}
                                        rowsPerPageOptions={[10, 20, 50]}
                                        paginatorTemplate=" FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
                                        className="mt-2"
                                        globalFilter={globalFilter}
                                        emptyMessage={emptyMessage}
                                        dataKey="id"
                                    >
                                        <Column field="no" header="No." body={(data, options) => loading ? <Skeleton width="2rem" /> : options.rowIndex + 1} style={{ width: '80px', color: '#64748b' }}></Column>
                                        <Column field="name" header="Product Name" body={nameBodyWrapper} sortable></Column>
                                        <Column header="Actions" body={actionBodyTemplate} align="center" style={{ width: "120px" }}></Column>
                                    </DataTable>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <Dialog
                    visible={productDialog}
                    style={{ width: "450px" }}
                    header={productId ? "Edit Product" : "Create New Product"}
                    modal
                    className="p-fluid rounded-2xl"
                    onHide={() => setProductDialog(false)}
                    footer={
                        <div className="flex gap-2 justify-end p-3 bg-slate-50 rounded-b-2xl border-t border-slate-100">
                            <Button label="Cancel" className="p-button-text text-slate-500 font-bold" onClick={() => setProductDialog(false)} />
                            <Button label="Save Product" className="bg-indigo-600 border-none px-6 rounded-lg font-bold shadow-sm" onClick={saveProduct} />
                        </div>
                    }
                >
                    <div className="flex flex-col gap-4 pt-4 pb-2">
                        <div className="field">
                            <label className="text-xs font-bold text-slate-500 mb-2 block uppercase">Product Name</label>
                            <InputText 
                                value={productName} 
                                onChange={(e) => setProductName(e.target.value)} 
                                placeholder="e.g., 20L Water Can, 500ml Bottle"
                                className={`w-full bg-white border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-indigo-100 ${submitted && !productName ? 'p-invalid border-red-400' : ''}`}
                            />
                            {submitted && !productName && <small className="p-error block mt-1">Product name is required.</small>}
                        </div>
                    </div>
                </Dialog>
            </main>
        </Page>
    );
};

export default ProductList;

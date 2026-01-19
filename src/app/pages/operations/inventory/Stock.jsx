import React, { useState, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Toast } from "primereact/toast";
import { Tag } from "primereact/tag";
import { Page } from "@/components/shared/Page";

const Stock = () => {
    const toast = useRef(null);
    const emptyStock = { id: null, itemName: "", quantity: 0, unit: "" };

    const [stocks, setStocks] = useState([
        { id: 1, itemName: "Mineral Water Bottle 1L", quantity: 550, unit: "Bottle" },
        { id: 2, itemName: "Plastic Crate (Blue)", quantity: 15, unit: "Crate" },
        { id: 3, itemName: "Water Can 20L", quantity: 0, unit: "Can" }
    ]);

    const [stockDialog, setStockDialog] = useState(false);
    const [stock, setStock] = useState(emptyStock);
    const [submitted, setSubmitted] = useState(false);

    // Status logic matching the route design style
    const getStatusLabel = (qty) => {
        if (qty <= 0) return { label: "OUT OF STOCK", severity: "danger" };
        if (qty > 0 && qty <= 20) return { label: "LOW STOCK", severity: "warning" };
        return { label: "IN STOCK", severity: "success" };
    };

    const statusBodyTemplate = (rowData) => {
        const status = getStatusLabel(rowData.quantity);
        return <Tag value={status.label} severity={status.severity} className="rounded-md px-3 text-[10px]" />;
    };

    // Summary Calculations
    const totalItems = stocks.length;
    const lowStockCount = stocks.filter(s => s.quantity > 0 && s.quantity <= 20).length;

    const openNew = () => {
        setStock(emptyStock);
        setSubmitted(false);
        setStockDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setStockDialog(false);
    };

    const saveStock = () => {
        setSubmitted(true);
        if (stock.itemName.trim() && stock.unit.trim()) {
            let _stocks = [...stocks];
            if (stock.id) {
                const index = _stocks.findIndex(s => s.id === stock.id);
                _stocks[index] = stock;
                toast.current.show({ severity: "success", summary: "Successful", detail: "Stock Updated", life: 3000 });
            } else {
                stock.id = Math.floor(Math.random() * 1000);
                _stocks.push(stock);
                toast.current.show({ severity: "success", summary: "Successful", detail: "Stock Added", life: 3000 });
            }
            setStocks(_stocks);
            setStockDialog(false);
            setStock(emptyStock);
        }
    };

    const header = (
        <div className="flex flex-wrap items-center justify-between gap-4 p-4">
            <h2 className="m-0 text-xl font-bold text-slate-700">Stock Inventory</h2>
            <Button
                label="Add New Item"
                icon="pi pi-plus"
                className="bg-indigo-600 border-none px-4 py-2.5 rounded-xl font-bold shadow-md hover:bg-indigo-700 transition-all"
                onClick={openNew}
            />
        </div>
    );

    const actionBodyTemplate = (rowData) => (
        <div className="flex gap-2 justify-center">
            <Button icon="pi pi-pencil" className="p-button-rounded p-button-text text-sky-600 hover:bg-sky-50" onClick={() => { setStock(rowData); setStockDialog(true); }} />
            <Button icon="pi pi-trash" className="p-button-rounded p-button-text text-rose-500 hover:bg-rose-50" onClick={() => setStocks(stocks.filter(s => s.id !== rowData.id))} />
        </div>
    );

    return (
        <Page title="Stock Management">
            <div className="bg-slate-50 min-h-screen p-4 md:p-6">
                <Toast ref={toast} />

                {/* Top Cards - Same size as Route Page */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-indigo-500">
                        <p className="text-slate-500 text-sm font-bold uppercase tracking-wider">Total Products</p>
                        <h3 className="text-3xl font-black text-slate-800">{totalItems}</h3>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-amber-500">
                        <p className="text-slate-500 text-sm font-bold uppercase tracking-wider">Alert: Low Stock</p>
                        <h3 className="text-3xl font-black text-amber-600">{lowStockCount}</h3>
                    </div>
                </div>

                {/* Table - Same layout and size as Route Page */}
                <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                    <DataTable
                        value={stocks}
                        header={header}
                        paginator
                        rows={10}
                        className="p-datatable-sm"
                        responsiveLayout="stack"
                        dataKey="id"
                    >
                        <Column field="itemName" header="Item Name" sortable className="font-semibold text-slate-700 pl-4" />
                        <Column field="quantity" header="Quantity" sortable body={(row) => <Tag value={`${row.quantity} ${row.unit}`} severity="info" className="bg-slate-100 text-slate-700 font-bold" />} />
                        <Column header="Status" body={statusBodyTemplate} style={{ width: "12rem" }} />
                        <Column header="Actions" body={actionBodyTemplate} style={{ width: "8rem" }} />
                    </DataTable>
                </div>

                {/* Dialog - Same size as Route Configuration */}
                <Dialog
                    visible={stockDialog}
                    style={{ width: "400px" }}
                    header="Stock Details"
                    modal
                    className="p-fluid rounded-2xl"
                    onHide={hideDialog}
                    footer={
                        <div className="flex gap-2 justify-end p-3">
                            <Button label="Cancel" className="p-button-text text-slate-400 font-bold" onClick={hideDialog} />
                            <Button label="Save Stock" className="bg-indigo-600 border-none px-6 rounded-lg font-bold" onClick={saveStock} />
                        </div>
                    }
                >
                    <div className="flex flex-col gap-4 pt-2">
                        <div className="field">
                            <label className="text-xs font-bold text-slate-500 mb-1 block uppercase">Item Name</label>
                            <InputText value={stock.itemName} onChange={(e) => setStock({ ...stock, itemName: e.target.value })} className="p-3 bg-slate-50 border-none rounded-xl" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="field">
                                <label className="text-xs font-bold text-slate-500 mb-1 block uppercase">Qty</label>
                                <InputNumber value={stock.quantity} onValueChange={(e) => setStock({ ...stock, quantity: e.value })} className="bg-slate-50 border-none rounded-xl" inputClassName="p-3" />
                            </div>
                            <div className="field">
                                <label className="text-xs font-bold text-slate-500 mb-1 block uppercase">Unit</label>
                                <InputText value={stock.unit} onChange={(e) => setStock({ ...stock, unit: e.target.value })} className="p-3 bg-slate-50 border-none rounded-xl" />
                            </div>
                        </div>
                    </div>
                </Dialog>
            </div>
        </Page>
    );
};

export default Stock;
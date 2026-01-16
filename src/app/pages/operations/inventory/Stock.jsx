import React, { useState, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Toast } from "primereact/toast";
import { Page } from "@/components/shared/Page";

const Stock = () => {
    const toast = useRef(null);
    const [visible, setVisible] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    
    const [stocks, setStocks] = useState([
        { id: 1, itemName: "Mineral Water Bottle 1L", quantity: 550, unit: "Bottle" },
        { id: 2, itemName: "Plastic Crate (Blue)", quantity: 15, unit: "Crate" },
        { id: 3, itemName: "Water Can 20L", quantity: 0, unit: "Can" },
    ]);

    const [form, setForm] = useState({ id: null, itemName: "", quantity: 0, unit: "" });

    const openNew = () => {
        setForm({ id: null, itemName: "", quantity: 0, unit: "" });
        setIsEdit(false);
        setVisible(true);
    };

    const editStock = (rowData) => {
        setForm({ ...rowData });
        setIsEdit(true);
        setVisible(true);
    };

    const saveStock = () => {
        if (!form.itemName || !form.unit) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Please fill all fields', life: 3000 });
            return;
        }

        let _stocks = [...stocks];
        if (isEdit) {
            const index = _stocks.findIndex(s => s.id === form.id);
            _stocks[index] = form;
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Stock Updated', life: 3000 });
        } else {
            const newEntry = {
                ...form,
                id: stocks.length > 0 ? Math.max(...stocks.map(s => s.id)) + 1 : 1
            };
            _stocks.push(newEntry);
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Stock Created', life: 3000 });
        }
        setStocks(_stocks);
        setVisible(false);
    };

    // ટેબલ હેડર - Route Management જેવું
    const header = (
        <div className="flex flex-wrap items-center justify-between gap-4 py-2">
            <h2 className="m-0 text-2xl font-bold text-slate-800">Stock Inventory</h2>
            <Button 
                label="Add New Stock" 
                icon="pi pi-plus" 
                className="bg-cyan-500 border-none px-4 py-2.5 rounded-lg font-bold shadow-md hover:bg-cyan-600 transition-all" 
                onClick={openNew} 
            />
        </div>
    );

    // એક્શન બટન્સ - તમારી ઈમેજ મુજબ ગોળ અને બોર્ડરવાળા
    const actionBodyTemplate = (rowData) => {
        return (
            <div className="flex gap-3 justify-center">
                <Button 
                    icon="pi pi-pencil" 
                    rounded 
                    outlined 
                    className="w-10 h-10 border-sky-500 text-sky-500 hover:bg-sky-50 transition-colors" 
                    onClick={() => editStock(rowData)} 
                />
                <Button 
                    icon="pi pi-trash" 
                    rounded 
                    outlined 
                    className="w-10 h-10 border-rose-500 text-rose-500 hover:bg-rose-50 transition-colors" 
                    onClick={() => setStocks(stocks.filter(s => s.id !== rowData.id))}
                />
            </div>
        );
    };

    return (
        <Page title="Stock Management">
            <div className="p-2 bg-slate-50 min-h-screen">
                <Toast ref={toast} />
                
                {/* ટેબલ લેઆઉટ */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <DataTable 
                        value={stocks} 
                        header={header} 
                        paginator 
                        rows={10} 
                        className="p-datatable-sm" 
                        stripedRows
                        responsiveLayout="stack"
                        breakpoint="960px"
                    >
                        <Column field="id" header="#" style={{ width: '4rem', textAlign: 'center' }} className="font-semibold text-slate-500"></Column>
                        <Column field="itemName" header="Product Name" sortable className="font-medium text-slate-700"></Column>
                        <Column field="quantity" header="Qty" sortable className="font-medium text-slate-700"></Column>
                        <Column field="unit" header="Unit" className="font-medium text-slate-700"></Column>
                        <Column header="Actions" body={actionBodyTemplate} style={{ width: '10rem' }}></Column>
                    </DataTable>
                </div>

                {/* ડાયલોગ લેઆઉટ - Route Details જેવું */}
                <Dialog 
                    header={isEdit ? "Edit Stock Details" : "Stock Details"} 
                    visible={visible} 
                    style={{ width: '450px' }} 
                    modal 
                    className="p-fluid rounded-2xl" 
                    onHide={() => setVisible(false)}
                    footer={
                        <div className="flex gap-3 justify-end mt-4">
                            <Button label="Cancel" icon="pi pi-times" outlined className="p-button-secondary border-none" onClick={() => setVisible(false)} />
                            <Button label={isEdit ? "Update Stock" : "Save Stock"} icon="pi pi-check" className="bg-cyan-500 border-none px-6" onClick={saveStock} />
                        </div>
                    }
                >
                    <div className="flex flex-column gap-4 pt-2">
                        <div className="field">
                            <label className="text-sm font-bold text-slate-600 mb-1 block">Item Name</label>
                            <InputText 
                                value={form.itemName} 
                                onChange={(e) => setForm({...form, itemName: e.target.value})} 
                                className="p-3 bg-slate-50 border-slate-200 rounded-xl focus:bg-white" 
                            />
                        </div>
                        <div className="field">
                            <label className="text-sm font-bold text-slate-600 mb-1 block">Quantity</label>
                            <InputNumber 
                                value={form.quantity} 
                                onValueChange={(e) => setForm({...form, quantity: e.value})} 
                                className="bg-slate-50 border-slate-200 rounded-xl" 
                            />
                        </div>
                        <div className="field">
                            <label className="text-sm font-bold text-slate-600 mb-1 block">Unit</label>
                            <InputText 
                                value={form.unit} 
                                onChange={(e) => setForm({...form, unit: e.target.value})} 
                                placeholder="e.g. Bottle, Can, Box" 
                                className="p-3 bg-slate-50 border-slate-200 rounded-xl focus:bg-white" 
                            />
                        </div>
                    </div>
                </Dialog>
            </div>
        </Page>
    );
};

export default Stock;
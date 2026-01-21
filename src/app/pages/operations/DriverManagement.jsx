import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import { Tag } from 'primereact/tag';
import { Page } from "@/components/shared/Page";

const DriverManagement = () => {
    let emptyDriver = {
        id: null,
        name: '',
        mobile: '',
        licenseNo: '',
        status: 'ACTIVE'
    };

    const [drivers, setDrivers] = useState([]);
    const [driverDialog, setDriverDialog] = useState(false);
    const [driver, setDriver] = useState(emptyDriver);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);

    const statusOptions = [
        { label: 'Active', value: 'ACTIVE' },
        { label: 'On Leave', value: 'ON_LEAVE' },
        { label: 'Inactive', value: 'INACTIVE' }
    ];

    useEffect(() => {
        // Sample Data
        setDrivers([
            { id: 1, name: 'Jay bhai', mobile: '9876543210', licenseNo: 'GJ03-2022001', status: 'ACTIVE' },
            { id: 2, name: 'heet bhai ', mobile: '9123456780', licenseNo: 'GJ10-2021055', status: 'ON_LEAVE' },
            { id: 3, name: 'Meet', mobile: '9988776655', licenseNo: 'GJ10-2020112', status: 'INACTIVE' }
        ]);
    }, []);

    const openNew = () => {
        setDriver(emptyDriver);
        setSubmitted(false);
        setDriverDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setDriverDialog(false);
    };

    const saveDriver = () => {
        setSubmitted(true);
        if (driver.name.trim() && driver.mobile.trim()) {
            let _drivers = [...drivers];
            if (driver.id) {
                const index = _drivers.findIndex(d => d.id === driver.id);
                _drivers[index] = driver;
                toast.current.show({ severity: 'success', summary: 'Success', detail: 'Driver Updated Successfully', life: 3000 });
            } else {
                driver.id = Math.floor(Math.random() * 1000);
                _drivers.push(driver);
                toast.current.show({ severity: 'success', summary: 'Success', detail: 'Driver Added Successfully', life: 3000 });
            }
            setDrivers(_drivers);
            setDriverDialog(false);
            setDriver(emptyDriver);
        }
    };

    const statusBodyTemplate = (rowData) => {
        const severityMap = { ACTIVE: 'success', ON_LEAVE: 'warning', INACTIVE: 'danger' };
        return <Tag value={rowData.status} severity={severityMap[rowData.status]} className="px-3 py-1 text-xs uppercase" rounded />;
    };

    const actionBodyTemplate = (rowData) => (
        <div className="flex justify-center gap-2">
            <Button icon="pi pi-pencil" rounded text className="text-cyan-600 hover:bg-cyan-50" onClick={() => { setDriver({ ...rowData }); setDriverDialog(true); }} />
            <Button icon="pi pi-trash" rounded text className="text-rose-500 hover:bg-rose-50" />
        </div>
    );

    const header = (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 bg-white border-b border-slate-100">
            <div>
                <h2 className="text-xl font-bold text-slate-800 m-0">Driver Management</h2>
                <p className="text-sm text-slate-500 mt-1">Total {drivers.length} drivers registered</p>
            </div>
            <div className="flex items-center gap-3">
                <span className="p-input-icon-left w-full md:w-auto">
                    <i className="pi pi-search text-slate-400" />
                    <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." className="p-inputtext-sm border-slate-200 rounded-lg w-full" />
                </span>
                <Button label="New Driver" icon="pi pi-plus" className="bg-cyan-600 border-none shadow-sm hover:bg-cyan-700 px-4 rounded-lg" onClick={openNew} />
            </div>
        </div>
    );

    const dialogFooter = (
        <div className="flex gap-2 p-3 bg-slate-50 rounded-b-2xl border-t border-slate-100">
            <Button label="Cancel" icon="pi pi-times" text onClick={hideDialog} className="text-slate-500" />
            <Button label="Save Details" icon="pi pi-check" className="bg-cyan-600 border-none px-6" onClick={saveDriver} />
        </div>
    );

    return (
        <Page title="Drivers">
            <div className="p-4 bg-slate-50/50 min-h-screen">
                <Toast ref={toast} />
                <div className="max-w-7xl mx-auto">
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                        <DataTable 
                            value={drivers} 
                            header={header} 
                            paginator 
                            rows={8} 
                            globalFilter={globalFilter}
                            className="p-datatable-sm"
                            emptyMessage="No drivers found."
                        >
                            <Column field="name" header="Full Name" sortable className="font-semibold text-slate-700 py-4 px-4"></Column>
                            <Column field="mobile" header="Mobile No" className="text-slate-600"></Column>
                            <Column field="licenseNo" header="License No" className="text-slate-600"></Column>
                            <Column field="status" header="Status" body={statusBodyTemplate} sortable></Column>
                            <Column header="Actions" body={actionBodyTemplate} className="w-32"></Column>
                        </DataTable>
                    </div>
                </div>

                <Dialog 
                    visible={driverDialog} 
                    style={{ width: '400px' }} 
                    header={<div className="text-lg font-bold text-slate-800">{driver.id ? 'Edit Driver' : 'Add New Driver'}</div>} 
                    modal 
                    className="p-fluid rounded-2xl" 
                    footer={dialogFooter} 
                    onHide={hideDialog}
                >
                    <div className="flex flex-col gap-5 pt-2">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-slate-700">Full Name</label>
                            <InputText value={driver.name} onChange={(e) => setDriver({...driver, name: e.target.value})} className={`p-3 border-slate-200 rounded-lg ${submitted && !driver.name ? 'p-invalid' : ''}`} placeholder="Enter driver's name" />
                            {submitted && !driver.name && <small className="p-error">Name is required.</small>}
                        </div>
                        
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-slate-700">Mobile Number</label>
                            <InputText value={driver.mobile} onChange={(e) => setDriver({...driver, mobile: e.target.value})} className={`p-3 border-slate-200 rounded-lg ${submitted && !driver.mobile ? 'p-invalid' : ''}`} placeholder="10-digit number" />
                            {submitted && !driver.mobile && <small className="p-error">Mobile is required.</small>}
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-slate-700">License Number</label>
                            <InputText value={driver.licenseNo} onChange={(e) => setDriver({...driver, licenseNo: e.target.value})} className="p-3 border-slate-200 rounded-lg" placeholder="License plate or ID" />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-slate-700">Status</label>
                            <Dropdown value={driver.status} options={statusOptions} onChange={(e) => setDriver({...driver, status: e.value})} className="border-slate-200 rounded-lg h-12 flex items-center" />
                        </div>
                    </div>
                </Dialog>
            </div>
        </Page>
    );
};

export default DriverManagement;
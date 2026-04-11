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
import axios from 'axios';
import { useSelector } from 'react-redux';

const DriverManagement = () => {
    let emptyDriver = {
        id: null,
        username: '',
        mobileNumber: '',
        vehicleNumber: '',
        vehicleName: '',
        status: 'ACTIVE'
    };

    const [drivers, setDrivers] = useState([]);
    const [driverDialog, setDriverDialog] = useState(false);
    const [driver, setDriver] = useState(emptyDriver);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [loading, setLoading] = useState(false);
    const toast = useRef(null);

    const token = useSelector((state) => state.auth.token);
    const BASE_URL = import.meta.env.VITE_BACKEND_BASEURL;

    const statusOptions = [
        { label: 'Active', value: 'ACTIVE' },
        { label: 'Inactive', value: 'INACTIVE' },
        { label: 'Deleted', value: 'DELETE' } // Some users use ON_LEAVE also, mapping it down
    ];

    const fetchDrivers = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${BASE_URL}/admin/drivers`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (Array.isArray(response.data)) {
                setDrivers(response.data);
            } else if (response.data && Array.isArray(response.data.data)) {
                setDrivers(response.data.data);
            } else {
                setDrivers([]);
            }
        } catch (error) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to fetch drivers' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchDrivers();
        }
    }, [token]);

    const openNew = () => {
        setDriver(emptyDriver);
        setSubmitted(false);
        setDriverDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setDriverDialog(false);
    };

    const saveDriver = async () => {
        setSubmitted(true);
        if (driver.username.trim() && driver.mobileNumber.trim() && driver.mobileNumber.length === 10) {
            try {
                const payload = {
                    username: driver.username,
                    mobileNumber: driver.mobileNumber,
                    vehicleNumber: driver.vehicleNumber || 'N/A',
                    vehicleName: driver.vehicleName || 'N/A'
                };

                if (driver.id) {
                    await axios.put(`${BASE_URL}/admin/drivers/${driver.id}`, payload, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    toast.current.show({ severity: 'success', summary: 'Success', detail: 'Driver Updated Successfully', life: 3000 });
                } else {
                    await axios.post(`${BASE_URL}/admin/register-driver`, payload, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    toast.current.show({ severity: 'success', summary: 'Success', detail: 'Driver Added Successfully', life: 3000 });
                }
                setDriverDialog(false);
                setDriver(emptyDriver);
                fetchDrivers();
            } catch (error) {
                toast.current.show({ severity: 'error', summary: 'Error', detail: error?.response?.data?.message || 'Failed to save driver', life: 3000 });
            }
        }
    };

    const deleteDriver = async (rowData) => {
        try {
            await axios.delete(`${BASE_URL}/admin/users/${rowData.id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.current.show({ severity: 'success', summary: 'Success', detail: 'Driver Deleted Successfully', life: 3000 });
            fetchDrivers();
        } catch (error) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to delete driver' });
        }
    };

    const statusBodyTemplate = (rowData) => {
        const severityMap = { ACTIVE: 'success', ON_LEAVE: 'warning', INACTIVE: 'danger', DELETE: 'danger' };
        return <Tag value={rowData.status || 'ACTIVE'} severity={severityMap[rowData.status || 'ACTIVE']} className="px-3 py-1 text-xs uppercase" rounded />;
    };

    const actionBodyTemplate = (rowData) => (
        <div className="flex justify-center gap-2">
            <Button icon="pi pi-pencil" rounded text tooltip="Edit" tooltipOptions={{position:'top'}} className="text-cyan-600 hover:bg-cyan-50" onClick={() => { setDriver({ ...rowData }); setDriverDialog(true); }} />
            <Button icon="pi pi-trash" rounded text tooltip="Delete" tooltipOptions={{position:'top'}} className="text-rose-500 hover:bg-rose-50" onClick={() => deleteDriver(rowData)} />
        </div>
    );

    const header = (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 bg-white border-b border-slate-100">
            <div>
                <h2 className="text-2xlfont-bold text-slate-800 m-0">Driver Management</h2>
                <p className="text-sm text-slate-500 mt-1">Total {Array.isArray(drivers) ? drivers.length : 0} drivers registered</p>
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
                            value={Array.isArray(drivers) ? drivers : []} 
                            header={header} 
                            paginator 
                            rows={8} 
                            loading={loading}
                            globalFilter={globalFilter}
                            className="p-datatable-sm"
                            emptyMessage="No drivers found."
                        >
                            <Column field="username" header="Full Name" sortable className="font-semibold text-slate-700 py-4 px-4"></Column>
                            <Column field="mobileNumber" header="Mobile No" className="text-slate-600"></Column>
                            <Column field="vehicleName" header="Vehicle Name" className="text-slate-600"></Column>
                            <Column field="vehicleNumber" header="Vehicle Number" className="text-slate-600"></Column>
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
                            <InputText value={driver.username || ''} onChange={(e) => setDriver({...driver, username: e.target.value})} className={`p-3 border-slate-200 rounded-lg ${submitted && !driver.username ? 'p-invalid' : ''}`} placeholder="Enter driver's name" />
                            {submitted && !driver.username && <small className="p-error">Name is required.</small>}
                        </div>
                        
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-slate-700">Mobile Number</label>
                            <InputText value={driver.mobileNumber || ''} onChange={(e) => setDriver({...driver, mobileNumber: e.target.value})} maxLength={10} className={`p-3 border-slate-200 rounded-lg ${submitted && (!driver.mobileNumber || driver.mobileNumber.length !== 10) ? 'p-invalid' : ''}`} placeholder="10-digit number" />
                            {submitted && (!driver.mobileNumber || driver.mobileNumber.length !== 10) && <small className="p-error">Valid 10-digit mobile is required.</small>}
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-slate-700">Vehicle Name</label>
                            <InputText value={driver.vehicleName || ''} onChange={(e) => setDriver({...driver, vehicleName: e.target.value})} className="p-3 border-slate-200 rounded-lg" placeholder="e.g. Tata Ace" />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-slate-700">Vehicle Number</label>
                            <InputText value={driver.vehicleNumber || ''} onChange={(e) => setDriver({...driver, vehicleNumber: e.target.value})} className="p-3 border-slate-200 rounded-lg" placeholder="e.g. GJ 01 XX 1234" />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-slate-700">Status</label>
                            <Dropdown value={driver.status || 'ACTIVE'} options={statusOptions} onChange={(e) => setDriver({...driver, status: e.value})} className="border-slate-200 rounded-lg h-12 flex items-center" />
                        </div>
                    </div>
                </Dialog>
            </div>
        </Page>
    );
};

export default DriverManagement;
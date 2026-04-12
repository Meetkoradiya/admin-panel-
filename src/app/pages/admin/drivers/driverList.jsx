import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { Tag } from 'primereact/tag';
import { Page } from "@/components/shared/Page";
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const DriverManagement = () => {
    const [drivers, setDrivers] = useState([]);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [loading, setLoading] = useState(false);
    const toast = useRef(null);
    const navigate = useNavigate();

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
        navigate('/admin/drivers/add');
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
            <Button icon="pi pi-pencil" rounded text tooltip="Edit" tooltipOptions={{position:'top'}} className="text-cyan-600 hover:bg-cyan-50" onClick={() => navigate(`/admin/drivers/edit/${rowData.id}`, { state: { driver: rowData } })} />
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
                <Button label="New Driver" className="bg-blue-600 border-none px-4 py-2.5 rounded-lg font-bold shadow-md hover:bg-blue-700 transition-all text-white" onClick={openNew} />
            </div>
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
            </div>
        </Page>
    );
};

export default DriverManagement;
import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { classNames } from 'primereact/utils';
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

    // Helper to calculate index based on row data
    const rowIndexTemplate = (rowData, props) => {
        return <span>{props.rowIndex + 1}</span>;
    };

    const statusBodyTemplate = (rowData) => {
        const isActive = rowData.status === 'ACTIVE' || !rowData.status;
        return (
            <span className={classNames('px-3 py-1 rounded-full text-xs font-bold uppercase', {
                'bg-emerald-100 text-emerald-700': isActive,
                'bg-rose-100 text-rose-700': !isActive
            })}>
                {rowData.status || 'ACTIVE'}
            </span>
        );
    };

    const header = (
        <div className="flex flex-wrap items-center justify-between gap-4 py-2">
            <h2 className="m-0 text-2xl font-bold text-slate-800">Manage Drivers</h2>
            <div className="flex items-center gap-3">
                <span className="p-input-icon-left">
                    <i className="pi pi-search text-slate-400" />
                    <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." className="p-inputtext-sm border-slate-200 rounded-lg" />
                </span>
                <Button 
                    label="New Driver" 
                    className="bg-blue-600 border-none px-4 py-2.5 rounded-lg font-bold shadow-md hover:bg-blue-700 transition-all text-white" 
                    onClick={openNew} 
                />
            </div>
        </div>
    );

    const actionBodyTemplate = (rowData) => {
        return (
            <div className="flex gap-3 justify-center">
                <Button 
                    icon="pi pi-pencil" 
                    rounded 
                    outlined 
                    tooltip="Edit Driver"
                    tooltipOptions={{ position: 'top' }}
                    className="w-10 h-10 border-sky-500 text-sky-500 hover:bg-sky-50 transition-colors" 
                    onClick={() => navigate(`/admin/drivers/edit/${rowData.id}`, { state: { driver: rowData } })} 
                />
                <Button 
                    icon="pi pi-trash" 
                    rounded 
                    outlined 
                    tooltip="Delete Driver"
                    tooltipOptions={{ position: 'top' }}
                    className="w-10 h-10 border-rose-500 text-rose-500 hover:bg-rose-50 transition-colors" 
                    onClick={() => deleteDriver(rowData)}
                />
            </div>
        );
    };

    return (
        <Page title="Drivers">
            <div className="bg-slate-50 min-h-screen">
                <Toast ref={toast} />
                
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <DataTable 
                        value={Array.isArray(drivers) ? drivers : []} 
                        header={header} 
                        paginator 
                        rows={10} 
                        loading={loading}
                        globalFilter={globalFilter}
                        className="p-datatable-sm"
                        stripedRows
                        responsiveLayout="stack" 
                        breakpoint="960px"
                        emptyMessage="No drivers found."
                        dataKey="id"
                    >
                        <Column header="#" body={rowIndexTemplate} style={{ width: '4rem', textAlign: 'center' }} className="font-semibold text-slate-500"></Column>
                        <Column field="username" header="Full Name" sortable className="font-medium text-slate-700"></Column>
                        <Column field="mobileNumber" header="Mobile No" className="font-medium text-slate-700"></Column>
                        <Column field="vehicleName" header="Vehicle Name" className="font-medium text-slate-700"></Column>
                        <Column field="vehicleNumber" header="Vehicle Number" className="font-medium text-slate-700"></Column>
                        <Column field="status" header="Status" body={statusBodyTemplate} sortable className="font-medium text-slate-700"></Column>
                        <Column header="Actions" body={actionBodyTemplate} style={{ width: '10rem' }}></Column>
                    </DataTable>
                </div>
            </div>
        </Page>
    );
};

export default DriverManagement;
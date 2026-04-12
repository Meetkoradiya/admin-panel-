
import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { classNames } from 'primereact/utils';
import { Page } from "@/components/shared/Page";
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';


const RouteManagement = () => {
    const [routes, setRoutes] = useState([]);
    const [loading, setLoading] = useState(false);
    const toast = useRef(null);
    const navigate = useNavigate();

    const token = useSelector((state) => state.auth.token);
    const BASE_URL = import.meta.env.VITE_BACKEND_BASEURL;

    const fetchRoutes = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${BASE_URL}/admin/routes`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (Array.isArray(response.data)) {
                setRoutes(response.data);
            } else if (response.data && Array.isArray(response.data.data)) {
                setRoutes(response.data.data);
            } else {
                setRoutes([]);
            }
        } catch (error) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to fetch routes' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchRoutes();
        }
    }, [token]);

    const statusBodyTemplate = (rowData) => {
        return (
            <span className={classNames('px-3 py-1 rounded-full text-xs font-bold', {
                'bg-emerald-100 text-emerald-700': rowData.active,
                'bg-rose-100 text-rose-700': !rowData.active
            })}>
                {rowData.active ? 'Active' : 'Inactive'}
            </span>
        );
    };

    // Helper to calculate index based on row data
    const rowIndexTemplate = (rowData, props) => {
        return <span>{props.rowIndex + 1}</span>;
    };

    const openNew = () => {
        navigate('/admin/routes/add');
    };

    const toggleRouteStatus = async (rowData) => {
        try {
            await axios.put(`${BASE_URL}/admin/routes/${rowData.id}/status?active=${!rowData.active}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.current.show({ severity: 'success', summary: 'Successful', detail: `Route ${!rowData.active ? 'Activated' : 'Deactivated'}`, life: 3000 });
            fetchRoutes();
        } catch (error) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to update route status' });
        }
    };

    const header = (
        <div className="flex flex-wrap items-center justify-between gap-4 py-2">
            <h2 className="m-0 text-2xl font-bold text-slate-800">Manage Routes</h2>
            <Button 
                label="New Route" 
                className="bg-blue-600 border-none px-4 py-2.5 rounded-lg font-bold shadow-md hover:bg-blue-700 transition-all text-white" 
                onClick={openNew} 
            />
        </div>
    );

    const actionBodyTemplate = (rowData) => {
        return (
            <div className="flex gap-3 justify-center">
                <Button 
                    icon="pi pi-pencil" 
                    rounded 
                    outlined 
                    tooltip="Edit Route"
                    tooltipOptions={{ position: 'top' }}
                    className="w-10 h-10 border-sky-500 text-sky-500 hover:bg-sky-50 transition-colors" 
                    onClick={() => navigate(`/admin/routes/edit/${rowData.id}`, { state: { route: rowData } })} 
                />
                <Button 
                    icon={rowData.active ? "pi pi-power-off" : "pi pi-check"} 
                    rounded 
                    outlined 
                    tooltip={rowData.active ? "Deactivate Route" : "Activate Route"}
                    tooltipOptions={{ position: 'top' }}
                    className={`w-10 h-10 transition-colors ${rowData.active ? 'border-rose-500 text-rose-500 hover:bg-rose-50' : 'border-emerald-500 text-emerald-500 hover:bg-emerald-50'}`} 
                    onClick={() => toggleRouteStatus(rowData)}
                />
            </div>
        );
    };

    return (
        <Page title="Route Management">
            <div className=" bg-slate-50 min-h-screen">
                <Toast ref={toast} />
                
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <DataTable 
                        value={Array.isArray(routes) ? routes : []} 
                        header={header} 
                        paginator 
                        rows={10} 
                        loading={loading}
                        className="p-datatable-sm"
                        stripedRows
                        responsiveLayout="stack" 
                        breakpoint="960px"
                        emptyMessage="No routes found."
                        dataKey="id"
                    >
                        <Column header="#" body={rowIndexTemplate} style={{ width: '4rem', textAlign: 'center' }} className="font-semibold text-slate-500"></Column>
                        <Column field="routeName" header="Route Name" sortable className="font-medium text-slate-700"></Column>
                        <Column field="startPoint" header="Start Point" sortable className="font-medium text-slate-700"></Column>
                        <Column field="endPoint" header="End Point" sortable className="font-medium text-slate-700"></Column>
                        <Column body={(rowData) => rowData?.driverName?.trim() || "N/A"} header="Driver" sortable className="font-medium text-slate-700"></Column>
                        <Column field="qty" header="Qty" sortable className="font-medium text-slate-700"></Column>
                        <Column header="Status" body={statusBodyTemplate} sortable field="active" className="font-medium text-slate-700"></Column>
                        <Column header="Actions" body={actionBodyTemplate} style={{ width: '10rem' }}></Column>
                    </DataTable>
                </div>
            </div>
        </Page>
    );
};

export default RouteManagement;

import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { classNames } from 'primereact/utils';
import { Page } from "@/components/shared/Page";
import axios from 'axios';
import { useSelector } from 'react-redux';


const RouteManagement = () => {
    let emptyRoute = {
        id: null,
        routeName: '',
        startPoint: '',
        endPoint: '',
        active: true
    };

    const [routes, setRoutes] = useState([]);
    const [routeDialog, setRouteDialog] = useState(false);
    const [route, setRoute] = useState(emptyRoute);
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const toast = useRef(null);

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
        setRoute(emptyRoute);
        setSubmitted(false);
        setRouteDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setRouteDialog(false);
    };

    const saveRoute = async () => {
        setSubmitted(true);
        if (route.routeName.trim() && route.startPoint.trim() && route.endPoint.trim()) {
            try {
                if (route.id) {
                    await axios.put(`${BASE_URL}/admin/routes/${route.id}`, {
                        routeName: route.routeName,
                        startPoint: route.startPoint,
                        endPoint: route.endPoint,
                        driverId: route.driverId || null
                    }, { headers: { Authorization: `Bearer ${token}` } });
                    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Route Updated', life: 3000 });
                } else {
                    await axios.post(`${BASE_URL}/admin/routes`, {
                        routeName: route.routeName,
                        startPoint: route.startPoint,
                        endPoint: route.endPoint
                    }, { headers: { Authorization: `Bearer ${token}` } });
                    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Route Created', life: 3000 });
                }
                setRouteDialog(false);
                setRoute(emptyRoute);
                fetchRoutes();
            } catch (error) {
                toast.current.show({ severity: 'error', summary: 'Error', detail: error?.response?.data?.message || 'Failed to save route', life: 3000 });
            }
        }
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
                label="Add New" 
                icon="pi pi-plus" 
                className="bg-emerald-500 border-none px-4 py-2.5 rounded-lg font-bold shadow-md hover:bg-emerald-600 transition-all" 
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
                    onClick={() => { setRoute(rowData); setRouteDialog(true); }} 
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

                <Dialog 
                    visible={routeDialog} 
                    style={{ width: '450px' }} 
                    header="Route Details" 
                    modal 
                    className="p-fluid rounded-2xl" 
                    onHide={hideDialog}
                    footer={
                        <div className="flex gap-3 justify-end mt-4">
                            <Button label="Cancel" icon="pi pi-times" outlined className="p-button-secondary border-none" onClick={hideDialog} />
                            <Button label="Save Route" icon="pi pi-check" className="bg-cyan-500 border-none px-6" onClick={saveRoute} />
                        </div>
                    }
                >
                    <div className="flex flex-col gap-4 pt-2">
                        <div className="field">
                            <label htmlFor="routeName" className="text-sm font-bold text-slate-600 mb-1 block">Route Name</label>
                            <InputText id="routeName" value={route.routeName} onChange={(e) => setRoute({...route, routeName: e.target.value})} className={classNames('p-3 bg-slate-50 border-slate-200 rounded-xl focus:bg-white', { 'p-invalid': submitted && !route.routeName })} />
                            {submitted && !route.routeName && <small className="p-error">Route Name is required.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="startPoint" className="text-sm font-bold text-slate-600 mb-1 block">Start Point</label>
                            <InputText id="startPoint" value={route.startPoint} onChange={(e) => setRoute({...route, startPoint: e.target.value})} className={classNames('p-3 bg-slate-50 border-slate-200 rounded-xl focus:bg-white', { 'p-invalid': submitted && !route.startPoint })} />
                            {submitted && !route.startPoint && <small className="p-error">Start Point is required.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="endPoint" className="text-sm font-bold text-slate-600 mb-1 block">End Point</label>
                            <InputText id="endPoint" value={route.endPoint} placeholder="e.g. Navrangpura" onChange={(e) => setRoute({...route, endPoint: e.target.value})} className={classNames('p-3 bg-slate-50 border-slate-200 rounded-xl focus:bg-white', { 'p-invalid': submitted && !route.endPoint })} />
                            {submitted && !route.endPoint && <small className="p-error">End Point is required.</small>}
                        </div>
                    </div>
                </Dialog>
            </div>
        </Page>
    );
};

export default RouteManagement;
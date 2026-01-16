import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { classNames } from 'primereact/utils';
import { Page } from "@/components/shared/Page";

const RouteManagement = () => {
    let emptyRoute = {
        id: null,
        routeFrom: '',
        routeTo: '',
        distance: ''
    };

    const [routes, setRoutes] = useState([]);
    const [routeDialog, setRouteDialog] = useState(false);
    const [route, setRoute] = useState(emptyRoute);
    const [submitted, setSubmitted] = useState(false);
    const toast = useRef(null);

    useEffect(() => {
        // Initial Sample Data
        setRoutes([
            { id: 1, routeFrom: 'Ahmedabad', routeTo: 'Rajkot', distance: '215 km' },
            { id: 2, routeFrom: 'Surat', routeTo: 'Baroda', distance: '150 km' }
        ]);
    }, []);

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

    const saveRoute = () => {
        setSubmitted(true);
        if (route.routeFrom.trim() && route.routeTo.trim() && route.distance) {
            let _routes = [...routes];
            if (route.id) {
                const index = _routes.findIndex(r => r.id === route.id);
                _routes[index] = route;
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Route Updated', life: 3000 });
            } else {
                route.id = Math.floor(Math.random() * 1000);
                _routes.push(route);
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Route Created', life: 3000 });
            }
            setRoutes(_routes);
            setRouteDialog(false);
            setRoute(emptyRoute);
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
                    className="w-10 h-10 border-sky-500 text-sky-500 hover:bg-sky-50 transition-colors" 
                    onClick={() => { setRoute(rowData); setRouteDialog(true); }} 
                />
                <Button 
                    icon="pi pi-trash" 
                    rounded 
                    outlined 
                    className="w-10 h-10 border-rose-500 text-rose-500 hover:bg-rose-50 transition-colors" 
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
                        value={routes} 
                        header={header} 
                        paginator 
                        rows={10} 
                        className="p-datatable-sm"
                        stripedRows
                        responsiveLayout="stack" 
                        breakpoint="960px"
                        emptyMessage="No routes found."
                        dataKey="id"
                    >
                        <Column header="#" body={rowIndexTemplate} style={{ width: '4rem', textAlign: 'center' }} className="font-semibold text-slate-500"></Column>
                        <Column field="routeFrom" header="From" sortable className="font-medium text-slate-700"></Column>
                        <Column field="routeTo" header="To" sortable className="font-medium text-slate-700"></Column>
                        <Column field="distance" header="Distance" sortable className="font-medium text-slate-700"></Column>
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
                            <label htmlFor="routeFrom" className="text-sm font-bold text-slate-600 mb-1 block">Route From</label>
                            <InputText id="routeFrom" value={route.routeFrom} onChange={(e) => setRoute({...route, routeFrom: e.target.value})} className="p-3 bg-slate-50 border-slate-200 rounded-xl focus:bg-white" />
                        </div>
                        <div className="field">
                            <label htmlFor="routeTo" className="text-sm font-bold text-slate-600 mb-1 block">Route To</label>
                            <InputText id="routeTo" value={route.routeTo} onChange={(e) => setRoute({...route, routeTo: e.target.value})} className="p-3 bg-slate-50 border-slate-200 rounded-xl focus:bg-white" />
                        </div>
                        <div className="field">
                            <label htmlFor="distance" className="text-sm font-bold text-slate-600 mb-1 block">Distance</label>
                            <InputText id="distance" value={route.distance} placeholder="e.g. 50 km" onChange={(e) => setRoute({...route, distance: e.target.value})} className="p-3 bg-slate-50 border-slate-200 rounded-xl focus:bg-white" />
                        </div>
                    </div>
                </Dialog>
            </div>
        </Page>
    );
};

export default RouteManagement;
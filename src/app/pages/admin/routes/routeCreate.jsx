import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { classNames } from 'primereact/utils';
import { Page } from "@/components/shared/Page";
import axios from 'axios';
import { useSelector } from 'react-redux';

const AddRoute = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const location = useLocation();
    
    // We can try to use passed state if we came from list page
    const passedRoute = location.state?.route;

    const [route, setRoute] = useState({
        routeName: '',
        startPoint: '',
        endPoint: '',
        active: true
    });
    
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const toast = useRef(null);

    const token = useSelector((state) => state.auth.token);
    const BASE_URL = import.meta.env.VITE_BACKEND_BASEURL;

    useEffect(() => {
        if (id) {
            if (passedRoute) {
                setRoute(passedRoute);
            } else {
                fetchRouteDetails(id);
            }
        }
    }, [id, passedRoute]);

    const fetchRouteDetails = async (routeId) => {
        try {
            const response = await axios.get(`${BASE_URL}/admin/routes`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const routes = Array.isArray(response.data) ? response.data : (response.data?.data || []);
            const found = routes.find(r => r.id === parseInt(routeId) || r.id === routeId);
            if (found) {
                setRoute(found);
            }
        } catch (error) {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to fetch route details' });
        }
    };

    const handleDiscard = () => {
        navigate(-1); // Go back to list
    };

    const handleSave = async () => {
        setSubmitted(true);
        if (route.routeName.trim() && route.startPoint.trim() && route.endPoint.trim()) {
            setLoading(true);
            try {
                if (id) {
                    await axios.put(`${BASE_URL}/admin/routes/${id}`, {
                        routeName: route.routeName,
                        startPoint: route.startPoint,
                        endPoint: route.endPoint,
                        driverId: route.driverId || null
                    }, { headers: { Authorization: `Bearer ${token}` } });
                    toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Route Updated', life: 3000 });
                } else {
                    await axios.post(`${BASE_URL}/admin/routes`, {
                        routeName: route.routeName,
                        startPoint: route.startPoint,
                        endPoint: route.endPoint
                    }, { headers: { Authorization: `Bearer ${token}` } });
                    toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Route Created', life: 3000 });
                }
                
                // Navigate back after short delay to show toast
                setTimeout(() => navigate('/admin/routes'), 1000);
            } catch (error) {
                toast.current?.show({ severity: 'error', summary: 'Error', detail: error?.response?.data?.message || 'Failed to save route', life: 3000 });
                setLoading(false);
            }
        }
    };

    return (
        <Page title={id ? "Edit Route" : "Create Route"}>
            <div className="bg-slate-50 flex flex-col justify-between h-full min-h-[calc(100vh-120px)] relative">
                <Toast ref={toast} />
                
                <div className="p-4 md:p-6 mb-16 ">
                    <h2 className="text-2xl font-bold text-slate-800 mb-6">{id ? "Edit Route" : "Create Route"}</h2>
                    
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 w-full">
                        <h3 className="text-lg font-bold text-slate-800 mb-4">Overview</h3>
                        
                        <div className="flex flex-col gap-5">
                            <div className="field">
                                <label htmlFor="routeName" className="text-sm font-semibold text-slate-600 mb-1 block">Route Name</label>
                                <InputText 
                                    id="routeName" 
                                    value={route.routeName} 
                                    onChange={(e) => setRoute({...route, routeName: e.target.value})} 
                                    className={classNames('w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-100', { 'p-invalid': submitted && !route.routeName })} 
                                    placeholder="Route name"
                                />
                                {submitted && !route.routeName && <small className="p-error">Route Name is required.</small>}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="field">
                                    <label htmlFor="startPoint" className="text-sm font-semibold text-slate-600 mb-1 block">Start Point</label>
                                    <InputText 
                                        id="startPoint" 
                                        value={route.startPoint} 
                                        onChange={(e) => setRoute({...route, startPoint: e.target.value})} 
                                        className={classNames('w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-100', { 'p-invalid': submitted && !route.startPoint })} 
                                        placeholder="Start point"
                                    />
                                    {submitted && !route.startPoint && <small className="p-error">Start Point is required.</small>}
                                </div>
                                <div className="field">
                                    <label htmlFor="endPoint" className="text-sm font-semibold text-slate-600 mb-1 block">End Point</label>
                                    <InputText 
                                        id="endPoint" 
                                        value={route.endPoint} 
                                        onChange={(e) => setRoute({...route, endPoint: e.target.value})} 
                                        className={classNames('w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-100', { 'p-invalid': submitted && !route.endPoint })} 
                                        placeholder="End point"
                                    />
                                    {submitted && !route.endPoint && <small className="p-error">End Point is required.</small>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sticky Footer */}
                <div className="sticky bottom-0 bg-white border-t border-slate-200 p-4 flex justify-end gap-3 z-50 mt-auto w-full shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] text-right">
                    <Button 
                        label="Discard" 
                        icon="pi pi-trash" 
                        outlined 
                        className="p-button-danger border-red-200 text-red-500 hover:bg-red-50 px-6 py-2 rounded-xl font-bold" 
                        onClick={handleDiscard}
                        disabled={loading}
                    />
                    <Button 
                        label={id ? "Update" : "Create"} 
                        className="bg-blue-600 border-none hover:bg-blue-700 px-8 py-2 rounded-xl font-bold shadow-sm" 
                        onClick={handleSave} 
                        loading={loading}
                    />
                </div>
            </div>
        </Page>
    );
};

export default AddRoute;

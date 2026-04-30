import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Toast } from 'primereact/toast';
import { classNames } from 'primereact/utils';
import axios from 'axios';
import { useSelector } from 'react-redux';
import FormLayout, { FormSection } from '@/components/shared/FormLayout';

const RouteCreate = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const location = useLocation();
    const toast = useRef(null);
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const token = useSelector((state) => state.auth.token);
    const BASE_URL = import.meta.env.VITE_BACKEND_BASEURL;

    const [route, setRoute] = useState({
        routeName: '',
        startPoint: '',
        endPoint: '',
        status: 'Active'
    });

    useEffect(() => {
        if (id && location.state?.route) {
            const r = location.state.route;
            setRoute({
                routeName: r.routeName || r.name || '',
                startPoint: r.startPoint || '',
                endPoint: r.endPoint || '',
                status: r.status || 'Active'
            });
        } else if (id) {
            fetchRouteDetails();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, location.state]);

    const fetchRouteDetails = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/admin/routes`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = response.data?.data || response.data || [];
            const found = data.find(r => (r.id?.toString() === id?.toString()) || (r._id?.toString() === id?.toString()));
            if (found) {
                setRoute({
                    routeName: found.routeName || found.name || '',
                    startPoint: found.startPoint || '',
                    endPoint: found.endPoint || '',
                    status: found.status || 'Active'
                });
            }
        } catch (error) {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to fetch route details' });
        }
    };

    const handleSave = async () => {
        setSubmitted(true);
        if (route.routeName?.trim()) {
            setLoading(true);
            try {
                const payload = {
                    name: route.routeName,
                    routeName: route.routeName,
                    startPoint: route.startPoint || '',
                    endPoint: route.endPoint || '',
                    status: route.status || 'Active'
                };
                
                if (id) {
                    await axios.put(`${BASE_URL}/admin/routes/${id}`, payload, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    toast.current?.show({ 
                        severity: 'success', 
                        summary: 'Route Configuration Saved', 
                        detail: 'The delivery route has been successfully updated.',
                        life: 3000 
                    });
                } else {
                    await axios.post(`${BASE_URL}/admin/routes`, payload, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    toast.current?.show({ 
                        severity: 'success', 
                        summary: 'New Route Created', 
                        detail: 'The delivery route has been added to your logistics map.',
                        life: 3000 
                    });
                }
                setTimeout(() => navigate('/admin/routes'), 1000);
            } catch (error) {
                toast.current?.show({ 
                    severity: 'error', 
                    summary: 'Save Attempt Failed', 
                    detail: error?.response?.data?.message || 'Unable to save route details. Please check the network connection and try again.',
                    life: 5000 
                });
                setLoading(false);
            }
        }
    };

    const fieldClass = (isValid) => classNames(
        'w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400 text-[15px] transition-all outline-none font-medium text-slate-700 shadow-inner',
        { 'border-rose-400 bg-rose-50/50': submitted && !isValid }
    );

    return (
        <div className="animate-fade-in">
            <Toast ref={toast} />
            <FormLayout
                title={id ? "Edit Route" : "Create Route"}
                loading={loading}
                isEditMode={!!id}
                onSave={handleSave}
                onDiscard={() => navigate('/admin/routes')}
            >
                <FormSection title="Overview">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
                        <div className="flex flex-col gap-2 md:col-span-2">
                            <label className="text-[13px] font-bold text-slate-500">Route Name</label>
                            <InputText
                                value={route.routeName || ''}
                                onChange={(e) => setRoute({ ...route, routeName: e.target.value })}
                                className={fieldClass(route.routeName)}
                                placeholder="Route name"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-[13px] font-bold text-slate-500">Start Point</label>
                            <InputText
                                value={route.startPoint || ''}
                                onChange={(e) => setRoute({ ...route, startPoint: e.target.value })}
                                className={fieldClass(true)}
                                placeholder="Start point"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-[13px] font-bold text-slate-500">End Point</label>
                            <InputText
                                value={route.endPoint || ''}
                                onChange={(e) => setRoute({ ...route, endPoint: e.target.value })}
                                className={fieldClass(true)}
                                placeholder="End point"
                            />
                        </div>
                    </div>
                </FormSection>
            </FormLayout>
        </div>
    );
};

export default RouteCreate;

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
        description: ''
    });

    useEffect(() => {
        if (id && location.state?.route) {
            setRoute(location.state.route);
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
            const found = data.find(r => r.id === parseInt(id));
            if (found) setRoute(found);
        } catch (error) {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to fetch route details' });
        }
    };

    const handleSave = async () => {
        setSubmitted(true);
        if (route.routeName.trim()) {
            setLoading(true);
            try {
                if (id) {
                    await axios.put(`${BASE_URL}/admin/routes/${id}`, route, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Route Updated Successfully' });
                } else {
                    await axios.post(`${BASE_URL}/admin/routes`, route, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Route Created Successfully' });
                }
                setTimeout(() => navigate('/admin/routes'), 1000);
            } catch (error) {
                toast.current?.show({ severity: 'error', summary: 'Error', detail: error?.response?.data?.message || 'Failed to save route' });
                setLoading(false);
            }
        }
    };

    const fieldClass = (isValid) => classNames(
        'w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400 text-sm transition-all outline-none font-medium text-slate-700 shadow-inner',
        { 'border-rose-400 bg-rose-50/50': submitted && !isValid }
    );

    return (
        <div className="animate-fade-in">
            <Toast ref={toast} />
            <FormLayout
                title={id ? "Edit Delivery Route" : "Create New Route"}
                loading={loading}
                isEditMode={!!id}
                onSave={handleSave}
                onDiscard={() => navigate('/admin/routes')}
            >
                <FormSection title="Route Configuration" icon="pi pi-map">
                    <div className="flex flex-col gap-6">
                        <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Route Name</label>
                            <InputText
                                value={route.routeName || route.name || ''}
                                onChange={(e) => setRoute({ ...route, routeName: e.target.value })}
                                className={fieldClass(route.routeName || route.name)}
                                placeholder="e.g. North Sector A"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Description / Area Details</label>
                            <InputTextarea
                                value={route.description}
                                onChange={(e) => setRoute({ ...route, description: e.target.value })}
                                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400 text-sm transition-all outline-none font-medium text-slate-700 shadow-inner min-h-[120px]"
                                placeholder="Details about covered buildings, landmarks, etc."
                            />
                        </div>
                    </div>
                </FormSection>
            </FormLayout>
        </div>
    );
};

export default RouteCreate;

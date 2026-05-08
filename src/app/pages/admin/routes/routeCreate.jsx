import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { classNames } from 'primereact/utils';
import useApi from '@/hooks/useApi';
import { SimpleLayout, SimpleSection, SimpleField } from '@/components/shared/SimpleLayout';

const RouteCreate = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const location = useLocation();
    const toast = useRef(null);
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const { apiGet, apiPost, apiPut } = useApi();

    const [route, setRoute] = useState({
        routeName: '',
        startPoint: '',
        endPoint: '',
        status: 'Active'
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const fetchRouteDetails = async () => {
            try {
                const response = await apiGet('/admin/routes');
                const data = response?.data || response || [];
                const found = data.find(r => (r.id?.toString() === id?.toString()) || (r._id?.toString() === id?.toString()));
                if (found) {
                    setRoute({
                        routeName: found.routeName || found.name || '',
                        startPoint: found.startPoint || '',
                        endPoint: found.endPoint || '',
                        status: found.status || 'Active'
                    });
                } else {
                    navigate('/admin/routes');
                }
            } catch (error) {
                toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to fetch route details' });
                navigate('/admin/routes');
            }
        };

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
    }, [id, location.state, apiGet, navigate]);

    const validate = () => {
        let errs = {};
        if (!route.routeName?.trim()) errs.routeName = "Please enter route name!";
        if (!route.startPoint?.trim()) errs.startPoint = "Please enter start point!";
        if (!route.endPoint?.trim()) errs.endPoint = "Please enter end point!";
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSave = async () => {
        setSubmitted(true);
        if (validate()) {
            setLoading(true);
            try {
                const payload = {
                    routeName: route.routeName,
                    startPoint: route.startPoint,
                    endPoint: route.endPoint,
                    status: route.status
                };
                
                if (id) {
                    await apiPut(`/admin/routes/${id}`, payload);
                    toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Route Updated Successfully' });
                } else {
                    await apiPost('/admin/routes', payload);
                    toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Route Created Successfully' });
                }
                setTimeout(() => navigate('/admin/routes'), 1000);
            } catch (error) {
                const errorMsg = error.response?.data?.message || error.message || 'Operation failed';
                toast.current?.show({ severity: 'error', summary: 'Error', detail: errorMsg });
                setLoading(false);
            }
        }
    };

    const inputClass = (isValid) => classNames(
        'w-full p-4 bg-white border border-slate-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-50 text-[15px] transition-all outline-none font-medium text-slate-700 placeholder:text-slate-400 shadow-sm',
        { 'border-rose-400 bg-rose-50/50': submitted && !isValid }
    );

    return (
        <div className="animate-fade-in">
            <Toast ref={toast} />
            <SimpleLayout
                title={id ? "Edit Route" : "Create Route"}
                onSave={handleSave}
                loading={loading}
                saveLabel={id ? "Update Route" : "Create Route"}
            >
                <SimpleSection title="Overview">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
                        <div className="md:col-span-2">
                            <SimpleField label="Route Name">
                                <InputText
                                    value={route.routeName || ''}
                                    onChange={(e) => {
                                        setRoute({ ...route, routeName: e.target.value });
                                        if (errors.routeName) setErrors({ ...errors, routeName: null });
                                    }}
                                    className={inputClass(!errors.routeName)}
                                    placeholder="Enter route name"
                                />
                                {errors.routeName && <small className="text-red-500 font-bold mt-1 ml-1">{errors.routeName}</small>}
                            </SimpleField>
                        </div>
                        <SimpleField label="Start Point">
                            <InputText
                                value={route.startPoint || ''}
                                onChange={(e) => {
                                    setRoute({ ...route, startPoint: e.target.value });
                                    if (errors.startPoint) setErrors({ ...errors, startPoint: null });
                                }}
                                className={inputClass(!errors.startPoint)}
                                placeholder="Start location"
                            />
                            {errors.startPoint && <small className="text-red-500 font-bold mt-1 ml-1">{errors.startPoint}</small>}
                        </SimpleField>
                        <SimpleField label="End Point">
                            <InputText
                                value={route.endPoint || ''}
                                onChange={(e) => {
                                    setRoute({ ...route, endPoint: e.target.value });
                                    if (errors.endPoint) setErrors({ ...errors, endPoint: null });
                                }}
                                className={inputClass(!errors.endPoint)}
                                placeholder="End location"
                            />
                            {errors.endPoint && <small className="text-red-500 font-bold mt-1 ml-1">{errors.endPoint}</small>}
                        </SimpleField>
                    </div>
                </SimpleSection>
            </SimpleLayout>
        </div>
    );
};

export default RouteCreate;

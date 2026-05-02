import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { classNames } from 'primereact/utils';
import useApi from '@/hooks/useApi';
import FormLayout, { FormSection } from '@/components/shared/FormLayout';

const OutletCreate = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const location = useLocation();
    const toast = useRef(null);
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const { apiPost, apiPut } = useApi();
    
    const [outlet, setOutlet] = useState({
        name: '',
        mobileNumber: '',
        location: '',
        address: ''
    });

    useEffect(() => {
        if (id && location.state?.outlet) {
            setOutlet(location.state.outlet);
        }
    }, [id, location.state]);

    const handleSave = async () => {
        setSubmitted(true);
        if (outlet.name.trim() && outlet.mobileNumber.trim()) {
            setLoading(true);
            try {
                if (id) {
                    await apiPut(`/master/outlets/${id}`, outlet);
                    toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Outlet Updated' });
                } else {
                    await apiPost('/master/outlets', outlet);
                    toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Outlet Created' });
                }
                setTimeout(() => navigate('/master/outlets'), 1000);
            } catch (error) {
                toast.current?.show({ severity: 'error', summary: 'Error', detail: error?.response?.data?.message || 'Failed to save outlet' });
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
                title={id ? "Edit Outlet Definition" : "Register New Outlet"}
                loading={loading}
                isEditMode={!!id}
                onSave={handleSave}
                onDiscard={() => navigate('/master/outlets')}
            >
                <FormSection title="Core Information" icon="pi pi-building">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">Outlet Name</label>
                            <InputText 
                                value={outlet.name} 
                                onChange={(e) => setOutlet({...outlet, name: e.target.value})} 
                                className={fieldClass(outlet.name)}
                                placeholder="e.g. Surat Main Branch"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">Contact Number</label>
                            <InputText 
                                value={outlet.mobileNumber} 
                                onChange={(e) => setOutlet({...outlet, mobileNumber: e.target.value})} 
                                className={fieldClass(outlet.mobileNumber)}
                                placeholder="Phone number"
                            />
                        </div>
                    </div>
                </FormSection>

                <FormSection title="Geographic Data" icon="pi pi-map-marker">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">City / Region</label>
                            <InputText 
                                value={outlet.location} 
                                onChange={(e) => setOutlet({...outlet, location: e.target.value})} 
                                className={fieldClass(true)}
                                placeholder="e.g. Surat"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">Full Address</label>
                            <InputText 
                                value={outlet.address} 
                                onChange={(e) => setOutlet({...outlet, address: e.target.value})} 
                                className={fieldClass(true)}
                                placeholder="Detailed address"
                            />
                        </div>
                    </div>
                </FormSection>
            </FormLayout>
        </div>
    );
};

export default OutletCreate;



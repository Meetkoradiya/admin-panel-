import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { classNames } from 'primereact/utils';
import { Page } from "@/components/shared/Page";
import { Tag } from 'primereact/tag';
import useApi from '@/hooks/useApi';

const OutletCreate = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { id } = useParams();
    const toast = useRef(null);
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const isEditMode = Boolean(id);
    const { apiPost, apiPut, apiGet } = useApi();

    const [outlet, setOutlet] = useState({
        name: '',
        address: '',
        isActive: true,
    });

    useEffect(() => {
        if (isEditMode) {
            const existing = location.state?.outlet;
            if (existing) {
                setOutlet({
                    name: existing.name || '',
                    address: existing.address || '',
                    isActive: existing.isActive !== false,
                });
            } else {
                // Fetch from API if no state (e.g. page refresh)
                apiGet(`/master/outlets/${id}`)
                    .then(data => {
                        const o = data?.id ? data : (data?.data || {});
                        setOutlet({ name: o.name || '', address: o.address || '', isActive: o.isActive !== false });
                    })
                    .catch(() => navigate('/master/outlets'));
            }
        }
    }, [id, isEditMode]);

    const handleSave = async () => {
        setSubmitted(true);
        if (!outlet.name.trim() || !outlet.address.trim()) {
            toast.current?.show({ severity: 'warn', summary: 'Validation', detail: 'Outlet name and address are required' });
            return;
        }

        setLoading(true);
        try {
            const payload = {
                name: outlet.name,
                address: outlet.address,
                isActive: outlet.isActive,
            };

            if (isEditMode) {
                await apiPut(`/master/outlets/${id}`, payload);
                toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Outlet updated successfully' });
            } else {
                await apiPost('/master/outlets', payload);
                toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Outlet registered successfully' });
            }
            setTimeout(() => navigate('/master/outlets'), 1200);
        } catch (error) {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: error?.response?.data?.message || 'Operation failed' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Page title={isEditMode ? 'Edit Outlet' : 'Register Outlet'}>
            <div className="bg-[#f8fafc] flex flex-col min-h-[calc(100vh-5rem)] p-2 md:p-6 lg:p-8">
                <Toast ref={toast} />

                <div className="w-full">
                    <div className="flex items-center gap-5 mb-8">
                        <Button
                            icon="pi pi-arrow-left"
                            className="p-button-text p-button-rounded text-slate-600 hover:bg-white w-12 h-12 shadow-xl shadow-slate-200/50 border border-slate-100 bg-white transition-all shadow-sm hover:-translate-x-1"
                            onClick={() => navigate(-1)}
                        />
                        <div>
                            <div className="flex items-center gap-1.5 mb-1">
                                <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse"></span>
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600">Network Expansion</span>
                            </div>
                            <h2 className="text-3xl font-black text-slate-800 tracking-tight leading-none">
                                {isEditMode ? 'Modify Outlet' : 'Deploy New Outlet'}
                            </h2>
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/40 border border-slate-100 p-6 md:p-8 lg:p-10 transition-all relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50/50 rounded-full -mr-32 -mt-32 blur-3xl -z-0"></div>

                        <div className="relative z-10">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-100">
                                    <i className="pi pi-building text-xl" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-slate-800 tracking-tight">Branch Identity</h3>
                                    <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Core location Details</p>
                                </div>
                            </div>
                            
                            <div className="space-y-6">
                                <div className="flex flex-col gap-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">Official Outlet Name <span className="text-rose-500">*</span></label>
                                    <InputText 
                                        value={outlet.name} 
                                        onChange={(e) => setOutlet({...outlet, name: e.target.value})}
                                        className={classNames("w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all text-sm font-bold", {
                                            'border-rose-400 bg-rose-50/50': submitted && !outlet.name
                                        })}
                                        placeholder="e.g. Amrut Water Station 1"
                                    />
                                    {submitted && !outlet.name && <small className="text-rose-500 font-semibold mt-1 block">Outlet name is required.</small>}
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">Physical Address <span className="text-rose-500">*</span></label>
                                    <InputText 
                                        value={outlet.address} 
                                        onChange={(e) => setOutlet({...outlet, address: e.target.value})}
                                        className={classNames("w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all text-sm font-bold", {
                                            'border-rose-400 bg-rose-50/50': submitted && !outlet.address
                                        })}
                                        placeholder="Full street address, city, and state"
                                    />
                                    {submitted && !outlet.address && <small className="text-rose-500 font-semibold mt-1 block">Address is required.</small>}
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row items-center gap-4 mt-12 pt-4">
                                <Button
                                    label={isEditMode ? 'Update Outlet' : 'Deploy Branch'}
                                    icon={isEditMode ? 'pi pi-refresh' : 'pi pi-cloud-upload'}
                                    className="w-full sm:w-auto flex-1 bg-indigo-600 border-none py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-2xl shadow-indigo-100/50"
                                    onClick={handleSave}
                                    loading={loading}
                                />
                                <Button
                                    label="Cancel Deployment"
                                    icon="pi pi-times"
                                    className="w-full sm:w-auto p-button-text p-button-secondary py-5 rounded-2xl font-bold text-xs uppercase tracking-widest text-slate-400 hover:text-slate-600"
                                    onClick={() => navigate(-1)}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Page>
    );
};

export default OutletCreate;

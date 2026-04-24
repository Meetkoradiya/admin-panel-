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
        <Page title="Create Outlet">
            <div className="bg-[#f4f7fa] min-h-[calc(100vh-4rem)] p-4 md:p-6 pb-32">
                <Toast ref={toast} />
                
                <h2 className="text-xl font-bold text-slate-800 mb-6">Create Outlet</h2>

                <div>
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
                        <h3 className="text-base font-bold text-slate-800 mb-6">Overview</h3>
                        
                        <div className="grid grid-cols-1 gap-8">
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-bold text-slate-500">Outlet Name</label>
                                <InputText
                                    value={outlet.name}
                                    onChange={(e) => setOutlet({...outlet, name: e.target.value})}
                                    placeholder="Enter outlet name"
                                    className={classNames("p-3 border-slate-200 rounded-xl focus:border-blue-400 focus:ring-0 transition-all outline-none font-medium text-sm", {
                                        'border-rose-400': submitted && !outlet.name
                                    })}
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-bold text-slate-500">Address</label>
                                <InputText
                                    value={outlet.address}
                                    onChange={(e) => setOutlet({...outlet, address: e.target.value})}
                                    placeholder="Enter permanent address"
                                    className={classNames("p-3 border-slate-200 rounded-xl focus:border-blue-400 focus:ring-0 transition-all outline-none font-medium text-sm", {
                                        'border-rose-400': submitted && !outlet.address
                                    })}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Fixed Footer */}
                <div className="fixed bottom-0 left-[260px] right-0 bg-white border-t border-slate-100 p-4 z-50">
                    <div className="flex justify-end gap-4 px-8">
                        <Button
                            label="Discard"
                            icon="pi pi-trash"
                            className="p-button-outlined border-rose-400 text-rose-500 hover:bg-rose-50 px-8 py-2.5 rounded-xl font-bold transition-all text-sm"
                            onClick={() => navigate('/master/outlets')}
                            disabled={loading}
                        />
                        <Button
                            label={isEditMode ? "Update" : "Create"}
                            className="bg-[#3b82f6] border-none text-white px-10 py-2.5 rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-600 transition-all text-sm"
                            onClick={handleSave}
                            loading={loading}
                        />
                    </div>
                </div>
            </div>
        </Page>
    );
};

export default OutletCreate;

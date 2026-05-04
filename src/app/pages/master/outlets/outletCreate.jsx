import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { classNames } from 'primereact/utils';
import useApi from '@/hooks/useApi';
import { SimpleLayout, SimpleSection, SimpleField } from '@/components/shared/SimpleLayout';

const OutletCreate = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const location = useLocation();
    const toast = useRef(null);
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const { apiPost, apiPut, apiGet } = useApi();
    
    const [outlet, setOutlet] = useState({
        name: '',
        mobileNumber: '',
        location: '',
        address: ''
    });

    useEffect(() => {
        const fetchOutletDetails = async () => {
            setLoading(true);
            try {
                const response = await apiGet('/master/outlets');
                const data = response?.data || response || [];
                const found = data.find(o => (o.id?.toString() === id?.toString()) || (o._id?.toString() === id?.toString()));
                
                if (found) {
                    setOutlet({
                        name: found.name || found.outletName || '',
                        location: found.location || found.address || '',
                        mobileNumber: found.mobileNumber || '',
                        address: found.address || ''
                    });
                } else {
                    navigate('/master/outlets');
                }
            } catch (error) {
                navigate('/master/outlets');
            } finally {
                setLoading(false);
            }
        };

        if (id && location.state?.outlet) {
            setOutlet(location.state.outlet);
        } else if (id) {
            fetchOutletDetails();
        }
    }, [id, location.state, apiGet, navigate]);

    const handleSave = async () => {
        setSubmitted(true);
        if (outlet.name.trim() && outlet.mobileNumber.trim()) {
            setLoading(true);
            try {
                if (id) {
                    await apiPut(`/master/outlets/${id}`, outlet);
                    toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Outlet Updated Successfully' });
                } else {
                    await apiPost('/master/outlets', outlet);
                    toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Outlet Created Successfully' });
                }
                setTimeout(() => navigate('/master/outlets'), 1000);
            } catch (error) {
                toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Operation failed' });
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
                title={id ? "Edit Outlet" : "Create Outlet"}
                onSave={handleSave}
                loading={loading}
                saveLabel={id ? "Update Outlet" : "Create Outlet"}
            >
                <SimpleSection title="Overview">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
                        <SimpleField label="Outlet Name">
                            <InputText 
                                value={outlet.name} 
                                onChange={(e) => setOutlet({...outlet, name: e.target.value})} 
                                className={inputClass(outlet.name)}
                                placeholder="Enter outlet name"
                            />
                        </SimpleField>
                        <SimpleField label="Contact Number">
                            <InputText 
                                value={outlet.mobileNumber} 
                                maxLength={10}
                                onChange={(e) => setOutlet({...outlet, mobileNumber: e.target.value})} 
                                className={inputClass(outlet.mobileNumber && outlet.mobileNumber.length === 10)}
                                placeholder="Enter mobile number"
                            />
                        </SimpleField>
                    </div>
                </SimpleSection>

                <SimpleSection title="Additional Information">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
                        <SimpleField label="City / Region">
                            <InputText 
                                value={outlet.location} 
                                onChange={(e) => setOutlet({...outlet, location: e.target.value})} 
                                className={inputClass(true)}
                                placeholder="Enter city"
                            />
                        </SimpleField>
                        <div className="md:col-span-2">
                            <SimpleField label="Full Address">
                                <InputText 
                                    value={outlet.address} 
                                    onChange={(e) => setOutlet({...outlet, address: e.target.value})} 
                                    className={inputClass(true)}
                                    placeholder="Enter permanent address"
                                />
                            </SimpleField>
                        </div>
                    </div>
                </SimpleSection>
            </SimpleLayout>
        </div>
    );
};

export default OutletCreate;

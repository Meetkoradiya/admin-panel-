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
    const [errors, setErrors] = useState({});

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

    const validate = () => {
        let errs = {};
        if (!outlet.name?.trim()) errs.name = "Outlet name is required!";
        if (!outlet.mobileNumber?.trim()) errs.mobileNumber = "Contact number is required!";
        else if (outlet.mobileNumber.length !== 10) errs.mobileNumber = "Mobile must be 10 digits!";
        if (!outlet.location?.trim()) errs.location = "City/Region is required!";
        if (!outlet.address?.trim()) errs.address = "Address is required!";
        
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSave = async () => {
        setSubmitted(true);
        if (validate()) {
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
                                onChange={(e) => {
                                    setOutlet({...outlet, name: e.target.value});
                                    if (errors.name) setErrors({...errors, name: null});
                                }} 
                                className={inputClass(!errors.name)}
                                placeholder="Enter outlet name"
                            />
                            {errors.name && <small className="text-red-500 font-bold mt-1 ml-1">{errors.name}</small>}
                        </SimpleField>
                        <SimpleField label="Contact Number">
                            <InputText 
                                value={outlet.mobileNumber} 
                                maxLength={10}
                                onChange={(e) => {
                                    setOutlet({...outlet, mobileNumber: e.target.value});
                                    if (errors.mobileNumber) setErrors({...errors, mobileNumber: null});
                                }} 
                                className={inputClass(!errors.mobileNumber)}
                                placeholder="Enter mobile number"
                            />
                            {errors.mobileNumber && <small className="text-red-500 font-bold mt-1 ml-1">{errors.mobileNumber}</small>}
                        </SimpleField>
                    </div>
                </SimpleSection>

                <SimpleSection title="Additional Information">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
                        <SimpleField label="City / Region">
                            <InputText 
                                value={outlet.location} 
                                onChange={(e) => {
                                    setOutlet({...outlet, location: e.target.value});
                                    if (errors.location) setErrors({...errors, location: null});
                                }} 
                                className={inputClass(!errors.location)}
                                placeholder="Enter city"
                            />
                            {errors.location && <small className="text-red-500 font-bold mt-1 ml-1">{errors.location}</small>}
                        </SimpleField>
                        <div className="md:col-span-2">
                            <SimpleField label="Full Address">
                                <InputText 
                                    value={outlet.address} 
                                    onChange={(e) => {
                                        setOutlet({...outlet, address: e.target.value});
                                        if (errors.address) setErrors({...errors, address: null});
                                    }} 
                                    className={inputClass(!errors.address)}
                                    placeholder="Enter permanent address"
                                />
                                {errors.address && <small className="text-red-500 font-bold mt-1 ml-1">{errors.address}</small>}
                            </SimpleField>
                        </div>
                    </div>
                </SimpleSection>
            </SimpleLayout>
        </div>
    );
};

export default OutletCreate;

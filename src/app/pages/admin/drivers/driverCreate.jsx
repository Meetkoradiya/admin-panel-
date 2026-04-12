import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { classNames } from 'primereact/utils';
import { Page } from "@/components/shared/Page";
import axios from 'axios';
import { useSelector } from 'react-redux';

const AddDriver = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const location = useLocation();
    
    const passedDriver = location.state?.driver;

    const [driver, setDriver] = useState({
        username: '',
        mobileNumber: '',
        address: '',
        vehicleName: '',
        vehicleNumber: '',
        routeId: null,
        status: 'ACTIVE'
    });
    
    const [routes, setRoutes] = useState([]);
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const toast = useRef(null);

    const token = useSelector((state) => state.auth.token);
    const BASE_URL = import.meta.env.VITE_BACKEND_BASEURL;

    useEffect(() => {
        fetchRoutes();
        if (id) {
            if (passedDriver) {
                setDriver({
                    ...passedDriver,
                    address: passedDriver.address || '',
                    routeId: passedDriver.routeId || null
                });
            } else {
                fetchDriverDetails(id);
            }
        }
    }, [id, passedDriver]);

    const fetchRoutes = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/admin/routes`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = Array.isArray(response.data) ? response.data : (response.data?.data || []);
            setRoutes(data);
        } catch (error) {
            console.error("Failed to fetch routes");
        }
    };

    const fetchDriverDetails = async (driverId) => {
        try {
            const response = await axios.get(`${BASE_URL}/admin/drivers`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const allDrivers = Array.isArray(response.data) ? response.data : (response.data?.data || []);
            const found = allDrivers.find(d => d.id === parseInt(driverId) || d.id === driverId);
            if (found) {
                setDriver({
                    ...found,
                    address: found.address || '',
                    routeId: found.routeId || null
                });
            }
        } catch (error) {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to fetch driver details' });
        }
    };

    const handleDiscard = () => {
        navigate(-1);
    };

    const handleSave = async () => {
        setSubmitted(true);
        if (driver.username.trim() && driver.mobileNumber.trim() && driver.mobileNumber.length === 10) {
            setLoading(true);
            try {
                const payload = {
                    username: driver.username,
                    mobileNumber: driver.mobileNumber,
                    address: driver.address || '',
                    vehicleNumber: driver.vehicleNumber || 'N/A',
                    vehicleName: driver.vehicleName || 'N/A',
                    routeId: driver.routeId || null
                };

                if (id) {
                    await axios.put(`${BASE_URL}/admin/drivers/${id}`, payload, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Driver Updated Successfully', life: 3000 });
                } else {
                    await axios.post(`${BASE_URL}/admin/register-driver`, payload, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Driver Added Successfully', life: 3000 });
                }
                
                setTimeout(() => navigate('/admin/drivers'), 1000);
            } catch (error) {
                toast.current?.show({ severity: 'error', summary: 'Error', detail: error?.response?.data?.message || 'Failed to save driver', life: 3000 });
                setLoading(false);
            }
        }
    };

    return (
        <Page title={id ? "Edit Driver" : "Create Driver"}>
            <div className="bg-slate-50 flex flex-col justify-between h-full min-h-[calc(100vh-120px)] relative">
                <Toast ref={toast} />
                
                <div className="p-4 md:p-6 mb-16 flex-grow">
                    <h2 className="text-2xl font-bold text-slate-800 mb-6">{id ? "Edit Driver" : "Create Driver"}</h2>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
                        {/* Overview Card */}
                        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                            <h3 className="text-lg font-bold text-slate-800 mb-4">Overview</h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                                <div className="field">
                                    <label className="text-sm font-semibold text-slate-600 mb-1 block">Full Name</label>
                                    <InputText 
                                        value={driver.username} 
                                        onChange={(e) => setDriver({...driver, username: e.target.value})} 
                                        className={classNames('w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-100', { 'p-invalid': submitted && !driver.username })} 
                                        placeholder="Full name"
                                    />
                                    {submitted && !driver.username && <small className="p-error">Full Name is required.</small>}
                                </div>
                                <div className="field">
                                    <label className="text-sm font-semibold text-slate-600 mb-1 block">Mobile number</label>
                                    <InputText 
                                        value={driver.mobileNumber} 
                                        maxLength={10}
                                        onChange={(e) => setDriver({...driver, mobileNumber: e.target.value})} 
                                        className={classNames('w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-100', { 'p-invalid': submitted && (!driver.mobileNumber || driver.mobileNumber.length !== 10) })} 
                                        placeholder="Mobile number"
                                    />
                                    {submitted && (!driver.mobileNumber || driver.mobileNumber.length !== 10) && <small className="p-error">Valid 10-digit mobile is required.</small>}
                                </div>
                            </div>

                            <div className="field">
                                <label className="text-sm font-semibold text-slate-600 mb-1 block">Address</label>
                                <InputText 
                                    value={driver.address} 
                                    onChange={(e) => setDriver({...driver, address: e.target.value})} 
                                    className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-100" 
                                    placeholder="Enter address"
                                />
                            </div>
                        </div>

                        {/* Vehicle Information Card */}
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                            <h3 className="text-lg font-bold text-slate-800 mb-4">Vehicle Information</h3>
                            
                            <div className="flex flex-col gap-5">
                                <div className="field">
                                    <label className="text-sm font-semibold text-slate-600 mb-1 block">Vehicle name</label>
                                    <InputText 
                                        value={driver.vehicleName} 
                                        onChange={(e) => setDriver({...driver, vehicleName: e.target.value})} 
                                        className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-100" 
                                        placeholder="Vehicle name"
                                    />
                                </div>
                                <div className="field">
                                    <label className="text-sm font-semibold text-slate-600 mb-1 block">Vehicle number</label>
                                    <InputText 
                                        value={driver.vehicleNumber} 
                                        onChange={(e) => setDriver({...driver, vehicleNumber: e.target.value})} 
                                        className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-100" 
                                        placeholder="Vehicle number"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Route Information Card */}
                        <div className="lg:col-span-3 bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mt-2">
                            <h3 className="text-lg font-bold text-slate-800 mb-4">Route Information</h3>
                            
                            <div className="field w-full lg:w-1/2">
                                <label className="text-sm font-semibold text-slate-600 mb-1 block">Select Route</label>
                                <Dropdown 
                                    value={driver.routeId} 
                                    options={routes} 
                                    optionLabel="routeName" 
                                    optionValue="id"
                                    onChange={(e) => setDriver({...driver, routeId: e.value})} 
                                    placeholder="Select route" 
                                    className="w-full border-slate-200 rounded-xl h-12 flex items-center"
                                />
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

export default AddDriver;

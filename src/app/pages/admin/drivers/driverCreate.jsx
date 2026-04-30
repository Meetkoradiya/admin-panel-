import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import { classNames } from 'primereact/utils';
import axios from 'axios';
import { useSelector } from 'react-redux';
import FormLayout, { FormSection } from '@/components/shared/FormLayout';

const DriverCreate = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const location = useLocation();
    const toast = useRef(null);
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const token = useSelector((state) => state.auth.token);
    const BASE_URL = import.meta.env.VITE_BACKEND_BASEURL;

    const [routesData, setRoutesData] = useState([]);
    const [driver, setDriver] = useState({
        username: '',
        mobileNumber: '',
        route: '',
        password: '',
        vehicleName: '',
        vehicleNumber: ''
    });

    useEffect(() => {
        const fetchRoutes = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/admin/routes`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setRoutesData(response.data?.data || response.data || []);
            } catch (error) {
                console.error("Failed to load routes");
            }
        };

        const fetchDriverDetails = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${BASE_URL}/admin/drivers`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const data = response.data?.data || response.data || [];
                const found = data.find(d => (d.id?.toString() === id?.toString()) || (d.userId?.toString() === id?.toString()) || (d._id?.toString() === id?.toString()));
                if (found) {
                    setDriver({
                        username: found.username || '',
                        mobileNumber: found.mobileNumber || '',
                        route: found.routeId || found.route?.id || found.route?._id || '',
                        password: '',
                        vehicleName: found.vehicleName || '',
                        vehicleNumber: found.vehicleNumber || ''
                    });
                } else {
                    toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Driver profile not found.' });
                }
            } catch (error) {
                toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to fetch driver details' });
            } finally {
                setLoading(false);
            }
        };

        if (token) {
            fetchRoutes();
            if (id && !location.state?.driver) {
                fetchDriverDetails();
            } else if (id && location.state?.driver) {
                const d = location.state.driver;
                setDriver({
                    username: d.username || '',
                    mobileNumber: d.mobileNumber || '',
                    route: d.routeId || d.route?.id || d.route?._id || '',
                    password: '',
                    vehicleName: d.vehicleName || '',
                    vehicleNumber: d.vehicleNumber || ''
                });
            }
        }
    }, [id, location.state, token, BASE_URL]);

    const handleSave = async () => {
        setSubmitted(true);
        const isValid = driver.username.trim() && 
                        driver.mobileNumber.trim() && 
                        driver.mobileNumber.length === 10 &&
                        driver.vehicleName.trim() &&
                        driver.vehicleNumber.trim();

        if (isValid) {
            setLoading(true);
            try {
                const payload = {
                    username: driver.username,
                    mobileNumber: driver.mobileNumber,
                    vehicleName: driver.vehicleName,
                    vehicleNumber: driver.vehicleNumber
                };

                // Add routeId if selected
                if (driver.route) {
                    payload.routeId = parseInt(driver.route);
                }

                if (id) {
                    // Update profile
                    await axios.put(`${BASE_URL}/admin/drivers/${id}`, payload, {
                        headers: { Authorization: `Bearer ${token}` }
                    });

                    toast.current?.show({ 
                        severity: 'success', 
                        summary: 'Profile Updated', 
                        detail: 'Driver and vehicle information saved successfully.',
                        life: 3000 
                    });
                } else {
                    // Registration
                    const regPayload = { 
                        ...payload, 
                        password: driver.password || 'driver123' 
                    };
                    await axios.post(`${BASE_URL}/admin/register-driver`, regPayload, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    toast.current?.show({ 
                        severity: 'success', 
                        summary: 'Driver Registered', 
                        detail: 'New driver and vehicle added to the system.',
                        life: 3000 
                    });
                }
                setTimeout(() => navigate('/admin/drivers'), 1000);
            } catch (error) {
                toast.current?.show({ 
                    severity: 'error', 
                    summary: 'Update Failed', 
                    detail: error?.response?.data?.message || 'Server validation failed. Please ensure all vehicle details are unique.',
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
                title={id ? "Edit Driver" : "Create Driver"}
                loading={loading}
                isEditMode={!!id}
                onSave={handleSave}
                onDiscard={() => navigate('/admin/drivers')}
            >
                <FormSection title="Overview">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
                        <div className="flex flex-col gap-2">
                            <label className="text-[13px] font-bold text-slate-500">Full Name</label>
                            <InputText
                                value={driver.username}
                                onChange={(e) => setDriver({ ...driver, username: e.target.value })}
                                className={fieldClass(driver.username)}
                                placeholder="Driver name"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-[13px] font-bold text-slate-500">Mobile Number</label>
                            <InputText
                                value={driver.mobileNumber}
                                maxLength={10}
                                onChange={(e) => setDriver({ ...driver, mobileNumber: e.target.value })}
                                className={fieldClass(driver.mobileNumber && driver.mobileNumber.length === 10)}
                                placeholder="10-digit number"
                            />
                        </div>
                    </div>
                </FormSection>

                <FormSection title="Vehicle & Logistics">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
                        <div className="flex flex-col gap-2">
                            <label className="text-[13px] font-bold text-slate-500">Vehicle Name</label>
                            <InputText
                                value={driver.vehicleName}
                                onChange={(e) => setDriver({ ...driver, vehicleName: e.target.value })}
                                className={fieldClass(driver.vehicleName)}
                                placeholder="e.g. Tata Ace"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-[13px] font-bold text-slate-500">Vehicle Number</label>
                            <InputText
                                value={driver.vehicleNumber}
                                onChange={(e) => setDriver({ ...driver, vehicleNumber: e.target.value })}
                                className={fieldClass(driver.vehicleNumber)}
                                placeholder="Registration number"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-[13px] font-bold text-slate-500">Assigned Route</label>
                            <Dropdown
                                value={driver.route}
                                options={routesData.map(r => ({ label: r.routeName || r.name, value: r.id }))}
                                onChange={(e) => setDriver({ ...driver, route: e.value })}
                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl h-[52px] flex items-center px-2 shadow-inner"
                                placeholder="Select route"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-[13px] font-bold text-slate-500">Login Password</label>
                            <InputText
                                type="password"
                                value={driver.password}
                                onChange={(e) => setDriver({ ...driver, password: e.target.value })}
                                className={fieldClass(!id ? driver.password : true)}
                                placeholder={id ? "••••••••" : "Create password"}
                            />
                        </div>
                    </div>
                </FormSection>
            </FormLayout>
        </div>
    );
};

export default DriverCreate;

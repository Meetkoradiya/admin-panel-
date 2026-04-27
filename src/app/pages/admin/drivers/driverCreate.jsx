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
        password: ''
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
        if (token) fetchRoutes();
    }, [token, BASE_URL]);

    useEffect(() => {
        if (id && location.state?.driver) {
            const d = location.state.driver;
            setDriver({
                username: d.username || '',
                mobileNumber: d.mobileNumber || '',
                route: d.routeId || d.route?.id || '',
                password: ''
            });
        }
    }, [id, location.state]);

    const handleSave = async () => {
        setSubmitted(true);
        if (driver.username.trim() && driver.mobileNumber.trim() && driver.mobileNumber.length === 10) {
            setLoading(true);
            try {
                const payload = {
                    username: driver.username,
                    mobileNumber: driver.mobileNumber,
                    routeId: driver.route,
                    password: driver.password || 'driver123' // default if empty on create
                };

                if (id) {
                    await axios.put(`${BASE_URL}/admin/drivers/${id}`, payload, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Driver Profile Updated' });
                } else {
                    await axios.post(`${BASE_URL}/admin/register-driver`, payload, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    toast.current?.show({ severity: 'success', summary: 'Success', detail: 'New Driver Registered' });
                }
                setTimeout(() => navigate('/admin/drivers'), 1000);
            } catch (error) {
                toast.current?.show({ severity: 'error', summary: 'Error', detail: error?.response?.data?.message || 'Failed to save driver' });
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
                title={id ? "Edit Driver Profile" : "Register New Driver"}
                loading={loading}
                isEditMode={!!id}
                onSave={handleSave}
                onDiscard={() => navigate('/admin/drivers')}
            >
                <FormSection title="Identity Details" icon="pi pi-user">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Full Name</label>
                            <InputText
                                value={driver.username}
                                onChange={(e) => setDriver({ ...driver, username: e.target.value })}
                                className={fieldClass(driver.username)}
                                placeholder="Enter driver's name"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Mobile Number</label>
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

                <FormSection title="Account & Logistics" icon="pi pi-shield">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Assigned Route</label>
                            <Dropdown
                                value={driver.route}
                                options={routesData.map(r => ({ label: r.routeName || r.name, value: r.id }))}
                                onChange={(e) => setDriver({ ...driver, route: e.value })}
                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl h-[52px] flex items-center px-2 shadow-inner"
                                placeholder="Select delivery route"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Login Password</label>
                            <InputText
                                type="password"
                                value={driver.password}
                                onChange={(e) => setDriver({ ...driver, password: e.target.value })}
                                className={fieldClass(!id ? driver.password : true)}
                                placeholder={id ? "Keep blank to leave unchanged" : "••••••••"}
                            />
                        </div>
                    </div>
                </FormSection>
            </FormLayout>
        </div>
    );
};

export default DriverCreate;

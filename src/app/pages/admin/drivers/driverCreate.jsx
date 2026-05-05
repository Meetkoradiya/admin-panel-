import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import { classNames } from 'primereact/utils';
import useApi from '@/hooks/useApi';
import { SimpleLayout, SimpleSection, SimpleField } from '@/components/shared/SimpleLayout';

const DriverCreate = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const location = useLocation();
    const toast = useRef(null);
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const { apiGet, apiPost, apiPut } = useApi();

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
        const fetchDependencies = async () => {
            try {
                const response = await apiGet('/admin/routes');
                setRoutesData(response?.data || response || []);
            } catch (error) {
                console.error("Failed to load routes");
            }
        };

        const fetchDriverDetails = async () => {
            setLoading(true);
            try {
                const response = await apiGet('/admin/drivers');
                const data = response?.data || response || [];
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
                    navigate('/admin/drivers');
                }
            } catch (error) {
                toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to fetch driver details' });
                navigate('/admin/drivers');
            } finally {
                setLoading(false);
            }
        };

        fetchDependencies();
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
    }, [id, location.state, apiGet]);

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
                const payload = { ...driver };
                if (driver.route) payload.routeId = parseInt(driver.route);

                if (id) {
                    await apiPut(`/admin/drivers/${id}`, payload);
                    toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Driver Updated Successfully' });
                } else {
                    const regPayload = { ...payload, password: driver.password || 'driver123' };
                    await apiPost('/admin/register-driver', regPayload);
                    toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Driver Registered Successfully' });
                }
                setTimeout(() => navigate('/admin/drivers'), 1000);
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

    const dropdownClass = "w-full bg-white border border-slate-200 rounded-xl h-[54px] flex items-center px-2 focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all font-medium text-slate-700 shadow-sm";

    return (
        <div className="animate-fade-in">
            <Toast ref={toast} />
            <SimpleLayout
                title={id ? "Edit Driver" : "Create Driver"}
                onSave={handleSave}
                loading={loading}
                saveLabel={id ? "Update Driver" : "Create Driver"}
            >
                <SimpleSection title="Overview">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
                        <SimpleField label="Full Name">
                            <InputText
                                value={driver.username}
                                onChange={(e) => setDriver({ ...driver, username: e.target.value })}
                                className={inputClass(driver.username)}
                                placeholder="Enter driver name"
                            />
                        </SimpleField>
                        <SimpleField label="Mobile Number">
                            <InputText
                                value={driver.mobileNumber}
                                maxLength={10}
                                onChange={(e) => setDriver({ ...driver, mobileNumber: e.target.value })}
                                className={inputClass(driver.mobileNumber && driver.mobileNumber.length === 10)}
                                placeholder="Enter mobile number"
                            />
                        </SimpleField>
                    </div>
                </SimpleSection>

                <SimpleSection title="Vehicle & Logistics">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
                        <SimpleField label="Vehicle Name">
                            <InputText
                                value={driver.vehicleName}
                                onChange={(e) => setDriver({ ...driver, vehicleName: e.target.value })}
                                className={inputClass(driver.vehicleName)}
                                placeholder="Enter vehicle name"
                            />
                        </SimpleField>
                        <SimpleField label="Vehicle Number">
                            <InputText
                                value={driver.vehicleNumber}
                                onChange={(e) => setDriver({ ...driver, vehicleNumber: e.target.value })}
                                className={inputClass(driver.vehicleNumber)}
                                placeholder="Enter registration number"
                            />
                        </SimpleField>
                        <SimpleField label="Assigned Route">
                            <Dropdown
                                value={driver.route}
                                options={routesData.map(r => ({ label: r.routeName || r.name, value: r.id }))}
                                onChange={(e) => setDriver({ ...driver, route: e.value })}
                                className={dropdownClass}
                                placeholder="Select route"
                            />
                        </SimpleField>
                        <SimpleField label="Login Password">
                            <InputText
                                type="password"
                                value={driver.password}
                                onChange={(e) => setDriver({ ...driver, password: e.target.value })}
                                className={inputClass(!id ? driver.password : true)}
                                placeholder={id ? "••••••••" : "Create password"}
                            />
                        </SimpleField>
                    </div>
                </SimpleSection>
            </SimpleLayout>
        </div>
    );
};

export default DriverCreate;

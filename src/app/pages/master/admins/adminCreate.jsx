import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { classNames } from 'primereact/utils';
import { Dropdown } from 'primereact/dropdown';
import useApi from '@/hooks/useApi';
import { SimpleLayout, SimpleSection, SimpleField } from '@/components/shared/SimpleLayout';

const AdminCreate = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { id } = useParams();
    const toast = useRef(null);
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const isEditMode = Boolean(id);
    const { apiPost, apiPut, apiGet } = useApi();

    const [outlets, setOutlets] = useState([]);
    const [admin, setAdmin] = useState({
        username: '',
        mobileNumber: '',
        email: '',
        password: '',
        outletId: null,
        city: '',
        postalCode: '',
        address: ''
    });

    useEffect(() => {
        apiGet('/master/outlets')
            .then(data => {
                const list = Array.isArray(data) ? data : (Array.isArray(data?.data) ? data.data : []);
                setOutlets(list.map(o => ({ label: o.name || 'Unnamed Outlet', value: o.id })));
            })
            .catch(() => {});
    }, [apiGet]);

    useEffect(() => {
        const fetchAdminDetails = async () => {
            setLoading(true);
            try {
                const response = await apiGet('/admin/admins');
                const data = response?.data || response || [];
                const found = data.find(a => (a.id?.toString() === id?.toString()) || (a._id?.toString() === id?.toString()));
                
                if (found) {
                    setAdmin({
                        username: found.username || '',
                        mobileNumber: found.mobileNumber || '',
                        email: found.email || '',
                        password: '',
                        outletId: found.outletId || null,
                        city: found.city || '',
                        postalCode: found.postalCode || '',
                        address: found.address || ''
                    });
                } else {
                    toast.current?.show({ severity: 'warn', summary: 'Not Found', detail: 'Administrator not found. Redirecting...' });
                    setTimeout(() => navigate('/master/admins'), 1500);
                }
            } catch (error) {
                toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to fetch administrator details' });
                navigate('/master/admins');
            } finally {
                setLoading(false);
            }
        };

        if (isEditMode && location.state?.admin) {
            const existingAdmin = location.state.admin;
            setAdmin({
                username: existingAdmin.username || '',
                mobileNumber: existingAdmin.mobileNumber || '',
                email: existingAdmin.email || '',
                password: '',
                outletId: existingAdmin.outletId || null,
                city: existingAdmin.city || '',
                postalCode: existingAdmin.postalCode || '',
                address: existingAdmin.address || ''
            });
        } else if (isEditMode) {
            fetchAdminDetails();
        }
    }, [id, location.state, isEditMode, apiGet, navigate]);

    const handleSave = async () => {
        setSubmitted(true);
        const isValid = admin.username.trim() && admin.mobileNumber.trim() && admin.mobileNumber.length === 10
            && (isEditMode || admin.password.trim());

        if (!isValid) return;

        setLoading(true);
        try {
            if (isEditMode) {
                await apiPut(`/admin/admins/${id}`, admin);
                toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Admin Updated Successfully' });
            } else {
                const createPayload = { ...admin };
                if (admin.outletId) createPayload.outletId = Number(admin.outletId);
                await apiPost('/admin/register-admin', createPayload);
                toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Admin Created Successfully' });
            }
            setTimeout(() => navigate('/master/admins'), 1000);
        } catch (error) {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Operation failed' });
        } finally {
            setLoading(false);
        }
    };

    const inputClass = (isValid) => classNames(
        'w-full p-4 bg-white border border-slate-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-50 text-[15px] transition-all outline-none font-medium text-slate-700 placeholder:text-slate-400',
        { 'border-rose-400 bg-rose-50/50': submitted && !isValid }
    );

    const dropdownClass = "w-full bg-white border border-slate-200 rounded-xl h-[54px] flex items-center px-2 focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all";

    return (
        <div className="animate-fade-in">
            <Toast ref={toast} />
            <SimpleLayout
                title={isEditMode ? 'Edit Admin' : 'Create Admin'}
                onSave={handleSave}
                loading={loading}
                saveLabel={isEditMode ? 'Update Admin' : 'Create Admin'}
            >
                <SimpleSection title="Overview">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
                        <SimpleField label="Full Name">
                            <InputText
                                value={admin.username}
                                onChange={(e) => setAdmin({ ...admin, username: e.target.value })}
                                className={inputClass(admin.username)}
                                placeholder="Enter admin name"
                            />
                        </SimpleField>
                        <SimpleField label="Mobile Number">
                            <InputText
                                value={admin.mobileNumber}
                                maxLength={10}
                                onChange={(e) => setAdmin({ ...admin, mobileNumber: e.target.value })}
                                className={inputClass(admin.mobileNumber && admin.mobileNumber.length === 10)}
                                placeholder="Enter mobile number"
                            />
                        </SimpleField>
                    </div>
                </SimpleSection>

                <SimpleSection title="Additional Information">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
                        <SimpleField label="City">
                            <InputText
                                value={admin.city}
                                onChange={(e) => setAdmin({ ...admin, city: e.target.value })}
                                className={inputClass(true)}
                                placeholder="Enter city"
                            />
                        </SimpleField>
                        <SimpleField label="Postal Code">
                            <InputText
                                value={admin.postalCode}
                                onChange={(e) => setAdmin({ ...admin, postalCode: e.target.value })}
                                className={inputClass(true)}
                                placeholder="Enter postal code"
                            />
                        </SimpleField>
                        <div className="md:col-span-2">
                            <SimpleField label="Address">
                                <InputText
                                    value={admin.address}
                                    onChange={(e) => setAdmin({ ...admin, address: e.target.value })}
                                    className={inputClass(true)}
                                    placeholder="Enter permanent address"
                                />
                            </SimpleField>
                        </div>
                    </div>
                </SimpleSection>

                <SimpleSection title="Credentials & Access">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
                        <SimpleField label="Email Address">
                            <InputText
                                value={admin.email}
                                onChange={(e) => setAdmin({ ...admin, email: e.target.value })}
                                className={inputClass(true)}
                                placeholder="Enter email address"
                            />
                        </SimpleField>
                        <SimpleField label="Login Password">
                            <InputText
                                type="password"
                                value={admin.password}
                                onChange={(e) => setAdmin({ ...admin, password: e.target.value })}
                                className={inputClass(isEditMode || admin.password)}
                                placeholder={isEditMode ? "Leave blank to keep same" : "Create password"}
                            />
                        </SimpleField>
                        <div className="md:col-span-2">
                            <SimpleField label="Assigned Outlet (Optional)">
                                <Dropdown
                                    value={admin.outletId}
                                    options={outlets}
                                    onChange={(e) => setAdmin({ ...admin, outletId: e.value })}
                                    className={dropdownClass}
                                    placeholder="Select an outlet"
                                />
                            </SimpleField>
                        </div>
                    </div>
                </SimpleSection>
            </SimpleLayout>
        </div>
    );
};

export default AdminCreate;

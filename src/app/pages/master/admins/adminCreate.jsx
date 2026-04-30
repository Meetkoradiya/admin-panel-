import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { classNames } from 'primereact/utils';
import { Dropdown } from 'primereact/dropdown';
import useApi from '@/hooks/useApi';
import FormLayout, { FormSection } from '@/components/shared/FormLayout';

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
        const existingAdmin = location.state?.admin;
        if (isEditMode && existingAdmin) {
            setAdmin({
                username: existingAdmin.username || '',
                mobileNumber: existingAdmin.mobileNumber || '',
                email: existingAdmin.email || '',
                password: '',
                outletId: existingAdmin.outletId || null,
            });
        }
    }, [id, location.state, isEditMode]);

    const handleSave = async () => {
        setSubmitted(true);
        const isValid = admin.username.trim() && admin.mobileNumber.trim() && admin.mobileNumber.length === 10
            && (isEditMode || admin.password.trim());

        if (!isValid) {
            toast.current?.show({ severity: 'warn', summary: 'Validation', detail: 'Please fill all required fields correctly', life: 3000 });
            return;
        }

        setLoading(true);
        try {
            if (isEditMode) {
                const updatePayload = {
                    username: admin.username,
                    mobileNumber: admin.mobileNumber,
                    email: admin.email,
                };
                await apiPut('/admin/update-profile', updatePayload);
                toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Admin Updated Successfully', life: 3000 });
            } else {
                const createPayload = {
                    username: admin.username,
                    mobileNumber: admin.mobileNumber,
                    email: admin.email,
                    password: admin.password,
                };
                if (admin.outletId) createPayload.outletId = Number(admin.outletId);

                await apiPost('/admin/register-admin', createPayload);
                toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Admin Created Successfully', life: 3000 });
            }

            setTimeout(() => navigate('/master/admins'), 1200);
        } catch (error) {
            toast.current?.show({
                severity: 'error', summary: 'Error',
                detail: error?.response?.data?.message || 'Operation failed. Please try again.',
                life: 4000
            });
        } finally {
            setLoading(false);
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
                title={isEditMode ? 'Edit Administrator' : 'Register New Admin'}
                loading={loading}
                isEditMode={isEditMode}
                onSave={handleSave}
                onDiscard={() => navigate('/master/admins')}
                sidebar={
                    <FormSection title="Account Security" icon="pi pi-shield">
                        <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Access Password</label>
                            <InputText
                                type="password"
                                value={admin.password}
                                onChange={(e) => setAdmin({ ...admin, password: e.target.value })}
                                className={fieldClass(isEditMode || admin.password)}
                                placeholder={isEditMode ? "Leave blank to keep same" : "••••••••"}
                            />
                        </div>
                    </FormSection>
                }
            >
                <FormSection title="Identity Details" icon="pi pi-user">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Username</label>
                            <InputText
                                value={admin.username}
                                onChange={(e) => setAdmin({ ...admin, username: e.target.value })}
                                className={fieldClass(admin.username)}
                                placeholder="e.g. john_doe"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Mobile Number</label>
                            <InputText
                                value={admin.mobileNumber}
                                maxLength={10}
                                onChange={(e) => setAdmin({ ...admin, mobileNumber: e.target.value })}
                                className={fieldClass(admin.mobileNumber && admin.mobileNumber.length === 10)}
                                placeholder="10-digit mobile"
                            />
                        </div>
                        <div className="flex flex-col gap-2 md:col-span-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Email Address</label>
                            <InputText
                                value={admin.email}
                                onChange={(e) => setAdmin({ ...admin, email: e.target.value })}
                                className={fieldClass(true)}
                                placeholder="admin@example.com"
                            />
                        </div>
                    </div>
                </FormSection>

                <FormSection title="Assignment" icon="pi pi-building">
                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Assigned Outlet</label>
                        <Dropdown
                            value={admin.outletId}
                            options={outlets}
                            onChange={(e) => setAdmin({ ...admin, outletId: e.value })}
                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl h-52px flex items-center px-2 shadow-inner"
                            placeholder="Select an outlet (optional)"
                        />
                    </div>
                </FormSection>
            </FormLayout>
        </div>
    );
};

export default AdminCreate;

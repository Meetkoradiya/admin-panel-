import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { classNames } from 'primereact/utils';
import { Dropdown } from 'primereact/dropdown';
import { Page } from "@/components/shared/Page";
import { ImageUploader } from "@/components/shared/ImageUploader";
import useApi from '@/hooks/useApi';

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

    // Fetch outlets for dropdown
    useEffect(() => {
        apiGet('/master/outlets')
            .then(data => {
                const list = Array.isArray(data) ? data : (Array.isArray(data?.data) ? data.data : []);
                setOutlets(list.map(o => ({ label: o.name || 'Unnamed Outlet', value: o.id })));
            })
            .catch(() => {});
    }, []);

    // Pre-fill form in edit mode
    useEffect(() => {
        const existingAdmin = location.state?.admin;
        if (isEditMode && existingAdmin) {
            setAdmin({
                username: existingAdmin.username || '',
                mobileNumber: existingAdmin.mobileNumber || '',
                email: existingAdmin.email || '',
                password: '',
                outletId: null,
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
                // Update admin profile
                const updatePayload = {
                    username: admin.username,
                    mobileNumber: admin.mobileNumber,
                    email: admin.email,
                };
                await apiPut('/admin/update-profile', updatePayload);
                toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Admin Updated Successfully', life: 3000 });
            } else {
                // Create admin — AdminRegisterRequest: { mobileNumber, username, email, password, outletId }
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
            console.error('Admin Save Error:', error);
            toast.current?.show({
                severity: 'error', summary: 'Error',
                detail: error?.response?.data?.message || 'Operation failed. Please try again.',
                life: 4000
            });
        } finally {
            setLoading(false);
        }
    };

    const fieldClass = (fieldName) => classNames(
        'w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400 text-sm transition-all outline-none font-medium text-slate-700',
        { 'border-red-400 bg-red-50/50': submitted && !admin[fieldName] }
    );

    return (
        <Page title={isEditMode ? 'Edit Admin' : 'Create Admin'}>
            <div className="bg-[#f8fafc] flex flex-col min-h-[calc(100vh-5rem)] relative p-2 md:p-6 lg:p-8">
                <Toast ref={toast} />

                <div className="w-full">
                    {/* Header */}
                    <div className="flex items-center gap-5 mb-8">
                        <Button
                            icon="pi pi-arrow-left"
                            className="p-button-text p-button-rounded text-slate-600 hover:bg-white w-12 h-12 shadow-xl shadow-slate-200/50 border border-slate-100 bg-white transition-all hover:-translate-x-1"
                            onClick={() => navigate(-1)}
                        />
                        <div>
                            <div className="flex items-center gap-1.5 mb-1">
                                <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600">Amrut Water System</span>
                            </div>
                            <h2 className="text-3xl font-black text-slate-800 tracking-tight leading-none">
                                {isEditMode ? 'Modify Personnel' : 'Onboard Administrator'}
                            </h2>
                        </div>
                    </div>

                    {/* Unified Form Card */}
                    <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/40 border border-slate-100 p-6 md:p-8 lg:p-10 transition-all relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/50 rounded-full -mr-32 -mt-32 blur-3xl z-0"></div>
                        
                        <div className="relative z-10">
                            {/* Section 1: Identity */}
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-200">
                                    <i className="pi pi-user text-xl" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-slate-800 tracking-tight">Core Identity</h3>
                                    <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Primary identification details</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                <div className="flex flex-col gap-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">
                                        Full System Name <span className="text-rose-500">*</span>
                                    </label>
                                    <InputText
                                        value={admin.username}
                                        onChange={(e) => setAdmin({ ...admin, username: e.target.value })}
                                        className={fieldClass('username')}
                                        placeholder="e.g. Amrut Admin"
                                    />
                                    {submitted && !admin.username && <small className="text-rose-500 mt-1 block font-bold text-[10px] ml-1 uppercase tracking-tighter">Field is mandatory</small>}
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">
                                        Mobile Number <span className="text-rose-500">*</span>
                                    </label>
                                    <InputText
                                        value={admin.mobileNumber}
                                        maxLength={10}
                                        keyfilter="int"
                                        onChange={(e) => setAdmin({ ...admin, mobileNumber: e.target.value })}
                                        className={classNames('w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm transition-all outline-none font-medium', {
                                            'border-rose-400 bg-rose-50/50': submitted && (!admin.mobileNumber || admin.mobileNumber.length !== 10)
                                        })}
                                        placeholder="10-digit mobile"
                                    />
                                    {submitted && (!admin.mobileNumber || admin.mobileNumber.length !== 10) &&
                                        <small className="text-rose-500 mt-1 block font-bold text-[10px] ml-1 uppercase tracking-tighter">Invalid format</small>}
                                </div>
                                <div className="flex flex-col gap-2 md:col-span-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">Official Email</label>
                                    <InputText
                                        value={admin.email}
                                        onChange={(e) => setAdmin({ ...admin, email: e.target.value })}
                                        className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm transition-all outline-none font-medium"
                                        placeholder="admin@amrutwater.in"
                                    />
                                </div>
                            </div>

                            {/* Section 2: Security */}
                            <div className="flex items-center gap-4 mb-8 mt-12 pt-8 border-t border-slate-50">
                                <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-100">
                                    <i className="pi pi-lock text-xl" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-slate-800 tracking-tight">Access Configuration</h3>
                                    <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Security & infrastructure permissions</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                                {!isEditMode && (
                                    <div className="flex flex-col gap-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">
                                            Master Password <span className="text-rose-500">*</span>
                                        </label>
                                        <InputText
                                            type="password"
                                            value={admin.password}
                                            onChange={(e) => setAdmin({ ...admin, password: e.target.value })}
                                            className={classNames('w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm transition-all outline-none font-medium', {
                                                'border-rose-400 bg-rose-50/50': submitted && !admin.password
                                            })}
                                            placeholder="••••••••"
                                        />
                                        {submitted && !admin.password && <small className="text-rose-500 mt-1 block font-bold text-[10px] ml-1 uppercase tracking-tighter">Key required</small>}
                                    </div>
                                )}
                                <div className="flex flex-col gap-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">Assign Outlet</label>
                                    <Dropdown
                                        value={admin.outletId}
                                        options={outlets}
                                        onChange={(e) => setAdmin({ ...admin, outletId: e.value })}
                                        placeholder="Select outlet..."
                                        className="w-full border border-slate-200 rounded-2xl bg-slate-50 text-sm"
                                        emptyMessage="No outlets found"
                                        showClear
                                    />
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
                                <Button
                                    label={isEditMode ? 'Authorize Changes' : 'Grant Full System Access'}
                                    icon={isEditMode ? 'pi pi-shield' : 'pi pi-bolt'}
                                    className="w-full sm:w-auto flex-1 bg-blue-600 border-none hover:bg-blue-700 transition-all text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest shadow-2xl shadow-blue-100"
                                    onClick={handleSave}
                                    loading={loading}
                                />
                                <Button
                                    label="Discard Changes"
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

export default AdminCreate;

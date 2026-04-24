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
            <div className="bg-[#f4f7fa] min-h-[calc(100vh-4rem)] p-4 md:p-6">
                <Toast ref={toast} />
                
                <h2 className="text-xl font-bold text-slate-800 mb-6">{isEditMode ? 'Edit Admin' : 'Create Admin'}</h2>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column: Form Sections */}
                    <div className="lg:col-span-2 flex flex-col gap-8">
                        {/* Overview Card */}
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
                            <h3 className="text-base font-bold text-slate-800 mb-8 border-b border-slate-50 pb-4">Overview</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-bold text-slate-500">Full Name</label>
                                    <InputText
                                        value={admin.username}
                                        onChange={(e) => setAdmin({ ...admin, username: e.target.value })}
                                        className={classNames('p-3 border-slate-200 rounded-xl focus:border-blue-400 focus:ring-0 transition-all outline-none font-medium text-sm', { 'border-rose-400': submitted && !admin.username })}
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-bold text-slate-500">Mobile Number</label>
                                    <InputText
                                        value={admin.mobileNumber}
                                        maxLength={10}
                                        onChange={(e) => setAdmin({ ...admin, mobileNumber: e.target.value })}
                                        className={classNames('p-3 border-slate-200 rounded-xl focus:border-blue-400 focus:ring-0 transition-all outline-none font-medium text-sm', { 'border-rose-400': submitted && (!admin.mobileNumber || admin.mobileNumber.length !== 10) })}
                                    />
                                </div>
                                <div className="flex flex-col gap-2 md:col-span-2">
                                    <label className="text-sm font-bold text-slate-500">Email</label>
                                    <InputText
                                        value={admin.email}
                                        onChange={(e) => setAdmin({ ...admin, email: e.target.value })}
                                        className="p-3 border-slate-200 rounded-xl focus:border-blue-400 focus:ring-0 transition-all outline-none font-medium text-sm"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Additional Information Card */}
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
                            <h3 className="text-base font-bold text-slate-800 mb-8 border-b border-slate-50 pb-4">Additional Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-bold text-slate-500">City</label>
                                    <InputText
                                        className="p-3 border-slate-200 rounded-xl focus:border-blue-400 focus:ring-0 transition-all outline-none font-medium text-sm"
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-bold text-slate-500">Postal Code</label>
                                    <InputText
                                        className="p-3 border-slate-200 rounded-xl focus:border-blue-400 focus:ring-0 transition-all outline-none font-medium text-sm"
                                    />
                                </div>
                                <div className="flex flex-col gap-2 md:col-span-2">
                                    <label className="text-sm font-bold text-slate-500">Address</label>
                                    <InputText
                                        className="p-3 border-slate-200 rounded-xl focus:border-blue-400 focus:ring-0 transition-all outline-none font-medium text-sm"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Image & Personal */}
                    <div className="flex flex-col gap-8">
                        {/* Image Card */}
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
                            <h3 className="text-base font-bold text-slate-800 mb-6">Image</h3>
                            <div className="bg-slate-50 rounded-2xl p-10 flex flex-col items-center justify-center border-2 border-dashed border-slate-100 min-h-[240px]">
                                <i className="pi pi-image text-4xl text-slate-200 mb-4" />
                                <Button label="Upload Image" className="bg-[#3b82f6] border-none text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-sm" />
                            </div>
                        </div>

                        {/* Personal Card */}
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
                            <h3 className="text-base font-bold text-slate-800 mb-6">Personal</h3>
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-bold text-slate-500">Password</label>
                                <InputText
                                    type="password"
                                    value={admin.password}
                                    onChange={(e) => setAdmin({ ...admin, password: e.target.value })}
                                    className={classNames('p-3 border-slate-200 rounded-xl focus:border-blue-400 focus:ring-0 transition-all outline-none font-medium text-sm', { 'border-rose-400': submitted && !admin.password })}
                                    placeholder="••••••••"
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
                            onClick={() => navigate('/master/admins')}
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

export default AdminCreate;

import React, { useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import { Password } from 'primereact/password';
import { Dialog } from 'primereact/dialog';
import { classNames } from 'primereact/utils';
import { login } from "../../../redux/slice/AuthSlice";

const SignUp = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const toast = useRef(null);

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        mobileNumber: '',
        gender: '',
        password: '',
        confirmPassword: '',
    });

    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [showApprovalDialog, setShowApprovalDialog] = useState(false);

    const genderOptions = [
        { name: 'Male', code: 'Male' },
        { name: 'Female', code: 'Female' },
        { name: 'Other', code: 'Other' },
    ];

    const validateField = (name, value) => {
        if (['username', 'email', 'password', 'gender', 'confirmPassword'].includes(name) && !value?.trim()) {
            return `${name.charAt(0).toUpperCase() + name.slice(1).replace(/([A-Z])/g, ' $1')} is required.`;
        }
        if (name === 'mobileNumber' && !/^\d{10}$/.test(value)) {
            return 'Mobile number must be 10 digits.';
        }
        if (name === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            return 'Invalid email format.';
        }
        if (name === 'confirmPassword' && value !== formData.password) {
            return 'Passwords do not match.';
        }
        return '';
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
    };

    const handleSignUp = () => {
        const newErrors = {};
        Object.entries(formData).forEach(([key, value]) => {
            const err = validateField(key, value);
            if (err) newErrors[key] = err;
        });
        
        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            setIsLoading(true);
            setTimeout(() => {
                setIsLoading(false);
                setShowApprovalDialog(true);
            }, 1500);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100 p-2 md:p-4">
            <Toast ref={toast} />

            <div className="flex w-full max-w-6xl h-auto md:h-[90vh] rounded-3xl shadow-2xl overflow-hidden bg-white">
                
                {/* LEFT: FORM SECTION */}
                <div className="w-full lg:w-1/2 flex items-center justify-center px-6 md:px-12 bg-white overflow-y-auto py-8">
                    <div className="w-full max-w-md">
                        <div className="mb-8">
                            <h1 className="text-4xl font-extrabold text-slate-900 mb-2">Create Account</h1>
                            <p className="text-slate-500 text-sm font-medium">Join the system to manage your water services.</p>
                        </div>

                        <div className="space-y-4">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-bold text-slate-700">Full Name</label>
                                <InputText
                                    name="username"
                                    value={formData.username}
                                    onChange={handleInputChange}
                                    placeholder="Enter your name"
                                    className={classNames("w-full p-3 rounded-xl border border-slate-200 bg-slate-50 focus:border-cyan-500 focus:bg-white transition-all", { 'p-invalid': errors.username })}
                                />
                                {errors.username && <small className="text-red-500 font-semibold">{errors.username}</small>}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-sm font-bold text-slate-700">Email</label>
                                    <InputText
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        placeholder="admin@email.com"
                                        className={classNames("w-full p-3 rounded-xl border border-slate-200 bg-slate-50", { 'p-invalid': errors.email })}
                                    />
                                    {errors.email && <small className="text-red-500 font-semibold">{errors.email}</small>}
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-sm font-bold text-slate-700">Mobile No.</label>
                                    <InputText
                                        name="mobileNumber"
                                        maxLength={10}
                                        value={formData.mobileNumber}
                                        onChange={handleInputChange}
                                        placeholder="1234567890"
                                        className={classNames("w-full p-3 rounded-xl border border-slate-200 bg-slate-50", { 'p-invalid': errors.mobileNumber })}
                                    />
                                    {errors.mobileNumber && <small className="text-red-500 font-semibold">{errors.mobileNumber}</small>}
                                </div>
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-bold text-slate-700">Gender</label>
                                <Dropdown
                                    name="gender"
                                    value={genderOptions.find((g) => g.code === formData.gender)}
                                    options={genderOptions}
                                    onChange={(e) => handleInputChange({ target: { name: 'gender', value: e.value?.code || '' } })}
                                    optionLabel="name"
                                    placeholder="Select Gender"
                                    className={classNames("w-full rounded-xl border border-slate-200 bg-slate-50 h-11.5 flex items-center", { 'p-invalid': errors.gender })}
                                />
                                {errors.gender && <small className="text-red-500 font-semibold">{errors.gender}</small>}
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-bold text-slate-700">Password</label>
                                <Password
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    toggleMask
                                    feedback={false}
                                    placeholder="••••••••"
                                    className="w-full"
                                    inputClassName={classNames("w-full p-3 rounded-xl border border-slate-200 bg-slate-50", { 'p-invalid': errors.password })}
                                />
                                {errors.password && <small className="text-red-500 font-semibold">{errors.password}</small>}
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-bold text-slate-700">Confirm Password</label>
                                <Password
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                    toggleMask
                                    feedback={false}
                                    placeholder="••••••••"
                                    className="w-full"
                                    inputClassName={classNames("w-full p-3 rounded-xl border border-slate-200 bg-slate-50", { 'p-invalid': errors.confirmPassword })}
                                />
                                {errors.confirmPassword && <small className="text-red-500 font-semibold">{errors.confirmPassword}</small>}
                            </div>

                            <div className="mt-4 mb-8"> 
                                <Button
                                    label="Sign Up"
                                    loading={isLoading}
                                    onClick={handleSignUp}
                                    className="w-full py-4 text-lg bg-cyan-500 border-none rounded-xl font-bold hover:bg-cyan-600 transition-all shadow-lg shadow-cyan-100"
                                />
                                
                                <div className="text-center mt-6">
                                    <p className="text-slate-500 text-sm font-medium">
                                        Already have an account? {' '}
                                        <span 
                                            className="text-cyan-600 font-bold hover:underline cursor-pointer" 
                                            onClick={() => navigate('/login')}
                                        >
                                            Sign In
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT: IMAGE SECTION */}
                <div className="hidden lg:block lg:w-1/2 relative bg-white">
                    <img
                        src="/images/authImage.png"
                        alt="Water Management"
                        className="w-full h-full object-cover"
                    />
                </div>
            </div>

            <Dialog
                header="Registration Submitted"
                visible={showApprovalDialog}
                style={{ width: '90%', maxWidth: '25rem' }}
                modal
                closable={false}
                className="rounded-3xl"
                footer={<Button label="Back to Login" onClick={() => navigate('/login')} className="bg-slate-900 border-none rounded-xl px-8" />}
            >
                <p className="m-0 text-slate-600 text-sm leading-relaxed">
                    Your registration has been submitted. For security purposes, a Super Admin must review and approve your account before you can log in.
                </p>
            </Dialog>
        </div>
    );
};

export default SignUp;
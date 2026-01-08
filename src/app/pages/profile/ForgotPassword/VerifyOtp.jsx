import axios from 'axios';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import React, { useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

const VerifyOtp = () => {
	const toast = useRef(null);
	const navigate = useNavigate();
	const location = useLocation();
	const email = location.state?.email || '';
	const BASE_URL = import.meta.env.VITE_BACKEND_BASEURL;
	const [errors, setErrors] = useState({});
	const [isLoading, setIsLoading] = useState(false);
	const [formData, setFormData] = useState({
		otp: '',
	});

	const handleInputChange = (e) => {
		const { name, value } = e.target;

		setFormData((prevData) => ({
			...prevData,
			[name]: value,
		}));

		setErrors((prev) => ({
			...prev,
			[name]: validateField(name, value),
		}));
	};

	const validateForm = () => {
		const newErrors = {};
		Object.entries(formData).forEach(([key, value]) => {
			const err = validateField(key, value);
			if (err) newErrors[key] = err;
		});
		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const validateField = (name, value) => {
		if (name === 'otp' && !value.trim()) return 'OTP is required.';

		if (name === 'otp' && value.length !== 6) return 'OTP must be 6 digits.';
		return '';
	};

	const handleSubmit = () => {
		if (!validateForm()) return;

		setIsLoading(true);
		axios
			.post(`${BASE_URL}/users/reset-password/verify-otp?email=${email}&otp=${formData.otp}`)
			.then((response) => {
				toast.current.show({
					severity: 'success',
					detail: response.data.message || 'OTP verified successfully.',
					life: 1500,
				});

				setTimeout(() => {
					navigate('/confirm-password', { state: { email } });
				}, 1500);
			})
			.catch((error) => {
				if (error?.response?.status === 400) {
					toast.current.show({
						severity: 'error',
						detail: error.response.data.error || 'Invalid or expired OTP.',
						life: 1500,
					});
				} else {
					toast.current.show({
						severity: 'error',
						detail: 'Something went wrong, please try again later !',
						life: 1500,
					});
				}
			})
			.finally(() => {
				setIsLoading(false);
			});
	};
	return (
		<>
			<Toast ref={toast} />
			<div className="bg-[var(--background)] flex align-items-center justify-content-center min-h-screen overflow-hidden p-3">
				<div className="flex flex-col align-items-center justify-center">
					<div
						className="rounded-[35px] md:rounded-[53px]"
						style={{
							padding: '0.3rem',
							background:
								'linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)',
						}}
					>
						<div className="surface-card md:py-6 py-4 md:px-4 px-3 rounded-[35px] md:rounded-[53px] max-w-[27rem]">
							<div className="text-center mb-5">
								<img
									src="/vite.svg"
									alt="Image"
									width="50"
									className="mx-auto select-none"
								/>
								<div className="text-lg font-bold">Enter OTP Details</div>
								<div className="flex justify-center">
									<div className="text-600 font-medium text-xs">
										{
											"We've sent a One-Time Password (OTP) to your registered email. Please enter it below to continue."
										}
									</div>
								</div>
							</div>

							<div>
								<div className="field mb-4">
									<label
										htmlFor="otp"
										className="block text-900 font-medium mb-2"
									>
										One-Time Password
									</label>
									<InputText
										id="otp"
										name="otp"
										type="text"
										maxLength={6}
										keyfilter="int"
										placeholder="Enter OTP"
										className="w-full"
										onChange={handleInputChange}
									/>
									{errors.otp && <small className="p-error">{errors.otp}</small>}
								</div>

								<Button
									label="Verify OTP"
									className="w-full text-sm h-10"
									onClick={handleSubmit}
									disabled={isLoading}
									loading={isLoading}
								></Button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default VerifyOtp;

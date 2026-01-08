import axios from 'axios';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { classNames } from 'primereact/utils';
import React, { useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
	const toast = useRef(null);
	const navigate = useNavigate();
	const BASE_URL = import.meta.env.VITE_BACKEND_BASEURL;
	const superAdminToken = useSelector((state) => state.auth.token);
	const [errors, setErrors] = useState({});
	const [isLoading, setIsLoading] = useState(false);
	const [formData, setFormData] = useState({
		email: '',
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
		if (name === 'email' && !value.trim()) {
			return 'Email is required';
		}

		if (name === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
			return 'Invalid email format.';
		}
		return '';
	};

	const handleSubmit = () => {
		if (!validateForm()) return;
		setIsLoading(true);
		const config = {
			headers: {
				Authorization: `Bearer ${superAdminToken}`,
			},
		};
		axios
			.post(
				`${BASE_URL}/users/reset-password/send-otp?email=${formData.email}`,
				formData,
				config
			)
			.then((response) => {
				setFormData({
					email: '',
				});

				toast.current.show({
					severity: 'success',
					detail: response.data.message || 'OTP sent to registered email',
					life: 1500,
				});

				setTimeout(() => {
					navigate('/verify-otp', {
						state: { email: formData.email },
					});
				}, 1500);
			})
			.catch((error) => {
				if (error?.response?.status === 400) {
					toast.current.show({
						severity: 'error',
						detail: 'Email is not registered !',
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
								<div className="text-lg font-bold">Forgot your password?</div>
								<div className="flex justify-center">
									<div className="text-600 font-medium text-xs w-10">
										Enter your registered email to receive password reset
										instructions.
									</div>
								</div>
							</div>

							<div>
								<div className="field mb-4">
									<label
										htmlFor="email"
										className="block text-900 font-medium mb-2"
									>
										Email
									</label>
									<InputText
										id="email"
										name="email"
										type="text"
										placeholder="Enter email"
										className="w-full"
										onChange={handleInputChange}
									/>
									{errors.email && (
										<small className="p-error">{errors.email}</small>
									)}
								</div>

								<Button
									label="Send OTP"
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

export default ForgotPassword;

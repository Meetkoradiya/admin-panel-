import axios from 'axios';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import { Toast } from 'primereact/toast';
import { useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

const ConfirmPassword = () => {
	const toast = useRef(null);
	const navigate = useNavigate();
	const location = useLocation();
	const email = location.state?.email || '';
	const BASE_URL = import.meta.env.VITE_BACKEND_BASEURL;
	const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
	const [errors, setErrors] = useState({});
	const [isLoading, setIsLoading] = useState(false);
	const [formData, setFormData] = useState({
		newPassword: '',
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
		if (name === 'newPassword') {
			if (!value.trim()) return 'New Password is required.';
			if (value.length < 8) return 'Password must be at least 8 characters.';
		}

		if (name === 'confirmPassword') {
			if (!value.trim()) return 'Verify Password is required.';
			if (value !== formData.newPassword) return 'Passwords do not match.';
		}
		return '';
	};

	const handleSubmit = () => {
		if (!validateForm()) return;

		setIsLoading(true);

		axios
			.put(
				`${BASE_URL}/users/reset-password?email=${email}&newPassword=${formData.newPassword}`
			)
			.then(() => {
				toast.current.show({
					severity: 'success',
					detail: 'Password changed successfully.',
					life: 1500,
				});

				setTimeout(() => {
					if (isAuthenticated) {
						navigate('/');
					} else {
						navigate('/login');
					}
				}, 1500);
			})
			.catch(() => {
				toast.current.show({
					severity: 'error',
					detail: 'Password was not changed.',
					life: 1500,
				});
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
								<div className="text-lg font-bold">Reset your Password</div>
								<div className="flex justify-center">
									<div className="text-600 font-medium text-xs">
										Enter your new password below to change your password
									</div>
								</div>
							</div>

							<div>
								<div className="field mb-4">
									<label
										htmlFor="newPassword"
										className="block text-900 font-medium mb-2"
									>
										New Password
									</label>
									<Password
										id="newPassword"
										name="newPassword"
										toggleMask
										feedback={false}
										placeholder="Enter password"
										className="w-full"
										inputClassName="w-full"
										onChange={handleInputChange}
									/>
									{errors.newPassword && (
										<small className="p-error">{errors.newPassword}</small>
									)}
								</div>

								<div className="field mb-4">
									<label
										htmlFor="confirmPassword"
										className="block text-900 font-medium mb-2"
									>
										Confirm Password
									</label>
									<Password
										id="confirmPassword"
										name="confirmPassword"
										toggleMask
										feedback={false}
										placeholder="Verify Password"
										className="w-full"
										inputClassName="w-full"
										onChange={handleInputChange}
									/>
									{errors.confirmPassword && (
										<small className="p-error">{errors.confirmPassword}</small>
									)}
								</div>

								<Button
									label="Change Password"
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

export default ConfirmPassword;

import { useContext, useRef, useState } from 'react';
import axios from 'axios';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import { Password } from 'primereact/password';
import { classNames } from 'primereact/utils';
import { Dialog } from 'primereact/dialog';
import { LayoutContext } from '../../context/layoutcontent';

const SignUp = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const toast = useRef(null);
	const { layoutConfig } = useContext(LayoutContext);
	const BASE_URL = import.meta.env.VITE_BACKEND_BASEURL;

	const [formData, setFormData] = useState({
		username: '',
		email: '',
		mobileNumber: '',
		gender: '',
		password: '',
	});

	const [errors, setErrors] = useState({});
	const [isLoading, setIsLoading] = useState(false);
	const [splash, setSplash] = useState(false);
	const [showApprovalDialog, setShowApprovalDialog] = useState(false);

	const Genders = [
		{ name: 'Male', code: 'Male' },
		{ name: 'Female', code: 'Female' },
		{ name: 'Other', code: 'Other' },
	];

	const containerClassName = classNames(
		'bg-[var(--background)] flex items-center justify-center min-h-screen overflow-x-hidden overflow-y-auto p-2'
	);

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
		if (['username', 'email', 'password', 'gender'].includes(name) && !value?.trim()) {
			return `${name.charAt(0).toUpperCase() + name.slice(1)} is required.`;
		}

		if (name === 'mobileNumber' && !/^\d{10}$/.test(value)) {
			return 'Mobile number must be 10 digits.';
		}

		if (name === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
			return 'Invalid email format.';
		}

		return '';
	};

	const handleInputChange = (e) => {
		const { name, value } = e.target;

		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));

		setErrors((prev) => ({
			...prev,
			[name]: validateField(name, value),
		}));
	};

	const handleSignUp = () => {
		if (!validateForm()) return;
		// setIsLoading(true);

		// axios
		//   .post(`${BASE_URL}/users/register-admin`, formData)
		//   .then(() => {
		//     toast.current.show({
		//       severity: "success",
		//       detail: "Signup successful.",
		//       life: 1500,
		//     });

		//     setShowApprovalDialog(true);
		//   })
		//   .catch((error) => {
		//     if (error?.response?.status === 400) {
		//       toast.current.show({
		//         severity: "error",
		//         detail: error.response?.data?.message,
		//         life: 2000,
		//       });
		//     }
		//   })
		//   .finally(() => setIsLoading(false));
	};

	return (
		<>
			<Toast ref={toast} />
			<div className={containerClassName}>
				<div className="flex flex-col align-items-center justify-center">
					<div
						style={{
							borderRadius: '56px',
							padding: '0.3rem',
							background:
								'linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)',
						}}
					>
						<div
							className="surface-card py-4 md:px-5 px-4 md:min-w-108"
							style={{ borderRadius: '53px', maxWidth: '27rem' }}
						>
							<div className="text-center mb-5">
								<img
									src="/vite.svg"
									alt="Image"
									width="50"
									className="md:mb-2 mb-0 mx-auto select-none"
								/>
								<div className="md:text-3xl text-xl font-medium md:mb-2 mb-1">
									Welcome, Admin!
								</div>
								<span className="text-600 font-medium">Sign Up to continue</span>
							</div>

							<div>
								<label htmlFor="name" className="block md:text-base text-sm mb-2">
									Name
								</label>
								<InputText
									id="username"
									name="username"
									value={formData.username}
									onChange={handleInputChange}
									type="text"
									placeholder="Enter name"
									className={`w-full mb-1 h-10 ${errors.name ? 'mb-1' : 'mb-3'}`}
									style={{ padding: '1rem' }}
								/>
								{errors.username && (
									<small className="p-error block mb-3">{errors.username}</small>
								)}

								<label htmlFor="email" className="block md:text-base text-sm mb-2">
									Email
								</label>
								<InputText
									id="email"
									name="email"
									value={formData.email}
									onChange={handleInputChange}
									type="text"
									placeholder="Enter email"
									className={`w-full mb-1 h-10 ${errors.email ? 'mb-1' : 'mb-3'}`}
									style={{ padding: '1rem' }}
								/>
								{errors.email && (
									<small className="p-error block mb-3">{errors.email}</small>
								)}

								<label
									htmlFor="mobileNumber"
									className="block md:text-base text-sm mb-2"
								>
									Mobile No.
								</label>
								<InputText
									id="mobileNumber"
									name="mobileNumber"
									maxLength={10}
									value={formData.mobileNumber}
									onChange={handleInputChange}
									type="text"
									placeholder="Mobile No."
									className={`w-full mb-1 h-10 ${
										errors.mobileNumber ? 'mb-1' : 'mb-3'
									}`}
									style={{ padding: '1rem' }}
								/>
								{errors.mobileNumber && (
									<small className="p-error block mb-3">
										{errors.mobileNumber}
									</small>
								)}

								<label htmlFor="gender" className="block md:text-base text-sm mb-2">
									Gender
								</label>
								<Dropdown
									id="gender"
									value={Genders.find((g) => g.code === formData.gender)}
									options={Genders}
									onChange={(e) => {
										const selectedGender = e.value?.code || '';
										setFormData((prev) => ({
											...prev,
											gender: selectedGender,
										}));
										setErrors((prev) => ({
											...prev,
											gender: selectedGender ? '' : 'Gender is required.',
										}));
									}}
									optionLabel="name"
									placeholder="Select Type"
									className={`w-full mb-1 h-10 ${
										errors.gender ? 'mb-1' : 'mb-3'
									}`}
									showClear
								/>
								{errors.gender && (
									<small className="p-error block mb-3">{errors.gender}</small>
								)}

								<label
									htmlFor="password"
									className="block md:text-base text-sm mb-2"
								>
									Password
								</label>
								<Password
									inputId="password"
									name="password"
									value={formData.password}
									onChange={handleInputChange}
									placeholder="Password"
									toggleMask
									feedback={false}
									className={`w-full h-10 ${errors.password ? 'mb-1' : 'mb-4'}`}
									inputClassName="w-full p-3"
								></Password>
								{errors.password && (
									<small className="p-error block mb-3">{errors.password}</small>
								)}

								<Button
									label="Sign Up"
									className="w-full text-lg h-11 mb-3"
									onClick={handleSignUp}
									loading={isLoading}
								></Button>

								<div className="flex align-items-center justify-center gap-1">
									<span className="text-sm">Already have an account?</span>
									<span
										className="text-(--primary-color) text-sm font-bold hover:underline cursor-pointer"
										onClick={() => navigate('/login')}
									>
										Sign In
									</span>
								</div>
							</div>
						</div>
					</div>
				</div>

				<Dialog
					header="Registration Submitted"
					visible={showApprovalDialog}
					style={{ width: '90%', maxWidth: '25rem' }}
					modal
					closable={false}
					footer={
						<div className="flex justify-content-end">
							<Button
								label="Back to Login"
								onClick={() => navigate('/login')}
								className="p-button-primary"
							/>
						</div>
					}
				>
					<p className="m-0 text-sm">
						Please wait for super admin approval. You will be able to log in once your
						registration is approved.
					</p>
				</Dialog>
			</div>
		</>
	);
};

export default SignUp;

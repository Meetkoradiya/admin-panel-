import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import { classNames } from 'primereact/utils';
import axios from 'axios';
import { useSelector } from 'react-redux';
import FormLayout, { FormSection } from '@/components/shared/FormLayout';

const AddCustomer = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const location = useLocation();
    const passedCustomer = location.state?.customer;

    const [customer, setCustomer] = useState({
        username: '',
        mobileNumber: '',
        address: '',
        deposit: '',
        deliveryType: 'DAILY',
        status: 'ACTIVE',
        route: '',
        price: '',
        quantity: '',
        product: ''
    });

    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const toast = useRef(null);

    const token = useSelector((state) => state.auth.token);
    const BASE_URL = import.meta.env.VITE_BACKEND_BASEURL;

    const [productsData, setProductsData] = useState([]);
    const [routesData, setRoutesData] = useState([]);

    const deliveryOptions = [
        { label: 'Daily', value: 'DAILY' },
        { label: 'Weekly', value: 'WEEKLY' },
        { label: 'Monthly', value: 'MONTHLY' }
    ];

    const fetchDependencies = async () => {
        try {
            const [prodRes, routeRes] = await Promise.all([
                axios.get(`${BASE_URL}/admin/products`, { headers: { Authorization: `Bearer ${token}` } }),
                axios.get(`${BASE_URL}/admin/routes`, { headers: { Authorization: `Bearer ${token}` } })
            ]);
            setProductsData(prodRes.data?.data || prodRes.data || []);
            setRoutesData(routeRes.data?.data || routeRes.data || []);
        } catch (error) {
            console.error("Failed to load options", error);
        }
    };

    useEffect(() => {
        if (token) fetchDependencies();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token]);

    useEffect(() => {
        if (id) {
            if (passedCustomer) {
                setCustomer(c => ({
                    ...c,
                    ...passedCustomer,
                    price: passedCustomer.pricePerBottle || passedCustomer.price || '',
                    quantity: passedCustomer.defaultQty || passedCustomer.qty || passedCustomer.quantity || '',
                    product: passedCustomer.productId || passedCustomer.product?.id || passedCustomer.product || ''
                }));
            } else {
                fetchCustomerDetails(id);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, passedCustomer]);

    const fetchCustomerDetails = async (customerId) => {
        try {
            const response = await axios.get(`${BASE_URL}/admin/customers`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const allCustomers = Array.isArray(response.data) ? response.data : (response.data?.data || []);
            const found = allCustomers.find(c => c.id === parseInt(customerId) || c.id === customerId || c.userId === parseInt(customerId) || c.userId === customerId);
            if (found) {
                setCustomer(c => ({
                    ...c,
                    ...found,
                    price: found.pricePerBottle || found.price || '',
                    quantity: found.defaultQty || found.qty || found.quantity || '',
                    product: found.productId || found.product?.id || found.product || ''
                }));
            }
        } catch (error) {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to fetch customer details' });
        }
    };

    const handleSave = async () => {
        setSubmitted(true);
        if (customer.username.trim() && customer.mobileNumber.trim() && customer.mobileNumber.length === 10) {
            setLoading(true);
            try {
                const payload = {
                    username: customer.username,
                    mobileNumber: customer.mobileNumber,
                    address: customer.address || '',
                    deposit: Number(customer.deposit) || 0,
                    deliveryType: customer.deliveryType || 'DAILY',
                    status: customer.status || 'ACTIVE',
                    routeId: customer.route,
                    price: Number(customer.price) || 0,
                    pricePerBottle: Number(customer.price) || 0,
                    quantity: Number(customer.quantity) || 0,
                    defaultQty: Number(customer.quantity) || 0,
                    productId: customer.product
                };

                const updateId = id || customer.userId;
                if (updateId) {
                    await axios.put(`${BASE_URL}/admin/customers/${updateId}`, payload, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Customer Updated Successfully', life: 3000 });
                } else {
                    await axios.post(`${BASE_URL}/admin/register-customer`, payload, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Customer Added Successfully', life: 3000 });
                }
                setTimeout(() => navigate('/admin/customers'), 1000);
            } catch (error) {
                toast.current?.show({ severity: 'error', summary: 'Error', detail: error?.response?.data?.message || 'Failed to save customer', life: 3000 });
                setLoading(false);
            }
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
                title={id ? "Edit Customer Account" : "Create New Customer"}
                loading={loading}
                isEditMode={!!id}
                onSave={handleSave}
                onDiscard={() => navigate('/admin/customers')}
            >
                <FormSection title="Customer Overview" icon="pi pi-user">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Full Name</label>
                            <InputText
                                value={customer.username}
                                onChange={(e) => setCustomer({ ...customer, username: e.target.value })}
                                className={fieldClass(customer.username)}
                                placeholder="Enter full name"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Mobile Number</label>
                            <InputText
                                value={customer.mobileNumber}
                                maxLength={10}
                                onChange={(e) => setCustomer({ ...customer, mobileNumber: e.target.value })}
                                className={fieldClass(customer.mobileNumber && customer.mobileNumber.length === 10)}
                                placeholder="10-digit number"
                            />
                        </div>
                        <div className="flex flex-col gap-2 md:col-span-2">
                            <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Delivery Address</label>
                            <InputText
                                value={customer.address}
                                onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                                className={fieldClass(true)}
                                placeholder="Detailed address"
                            />
                        </div>
                    </div>
                </FormSection>

                <FormSection title="Pricing & Subscription" icon="pi pi-tag">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Price Per Bottle (₹)</label>
                            <InputText
                                type="number"
                                value={customer.price}
                                onChange={(e) => setCustomer({ ...customer, price: e.target.value })}
                                className={fieldClass(true)}
                                placeholder="₹ 0.00"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Default Daily Quantity</label>
                            <InputText
                                type="number"
                                value={customer.quantity}
                                onChange={(e) => setCustomer({ ...customer, quantity: e.target.value })}
                                className={fieldClass(true)}
                                placeholder="0"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Security Deposit (₹)</label>
                            <InputText
                                type="number"
                                value={customer.deposit}
                                onChange={(e) => setCustomer({ ...customer, deposit: e.target.value })}
                                className={fieldClass(true)}
                                placeholder="₹ 0.00"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Status</label>
                            <Dropdown
                                value={customer.status}
                                options={[
                                    { label: 'Active', value: 'ACTIVE' },
                                    { label: 'Blocked', value: 'INACTIVE' }
                                ]}
                                onChange={(e) => setCustomer({ ...customer, status: e.value })}
                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl h-[52px] flex items-center px-2 shadow-inner"
                            />
                        </div>
                    </div>
                </FormSection>

                <FormSection title="Route & Logistics" icon="pi pi-map">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Assigned Route</label>
                            <Dropdown
                                value={customer.route}
                                options={routesData.map(r => ({ label: r.routeName || r.name, value: r.id }))}
                                onChange={(e) => setCustomer({ ...customer, route: e.value })}
                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl h-[52px] flex items-center px-2 shadow-inner"
                                placeholder="Select route"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Delivery Frequency</label>
                            <Dropdown
                                value={customer.deliveryType}
                                options={deliveryOptions}
                                onChange={(e) => setCustomer({ ...customer, deliveryType: e.value })}
                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl h-[52px] flex items-center px-2 shadow-inner"
                            />
                        </div>
                        <div className="flex flex-col gap-2 md:col-span-2">
                            <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Preferred Product</label>
                            <Dropdown
                                value={customer.product}
                                options={productsData.map(p => ({ label: p.name, value: p.id }))}
                                onChange={(e) => setCustomer({ ...customer, product: e.value })}
                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl h-[52px] flex items-center px-2 shadow-inner"
                                placeholder="Select product"
                            />
                        </div>
                    </div>
                </FormSection>
            </FormLayout>
        </div>
    );
};

export default AddCustomer;

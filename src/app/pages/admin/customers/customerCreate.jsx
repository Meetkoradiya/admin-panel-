import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import { classNames } from 'primereact/utils';
import useApi from '@/hooks/useApi';
import FormLayout, { FormSection } from '@/components/shared/FormLayout';

const AddCustomer = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const location = useLocation();
    const toast = useRef(null);
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const { apiGet, apiPost, apiPut } = useApi();

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

    const [productsData, setProductsData] = useState([]);
    const [routesData, setRoutesData] = useState([]);

    const deliveryOptions = [
        { label: 'Daily', value: 'DAILY' },
        { label: 'Weekly', value: 'WEEKLY' },
        { label: 'Monthly', value: 'MONTHLY' }
    ];

    const fetchDependencies = useCallback(async () => {
        try {
            const [prodRes, routeRes] = await Promise.all([
                apiGet('/admin/products'),
                apiGet('/admin/routes')
            ]);
            
            const prodList = prodRes?.data || prodRes || [];
            const routeList = routeRes?.data || routeRes || [];
            
            setProductsData(Array.isArray(prodList) ? prodList : []);
            setRoutesData(Array.isArray(routeList) ? routeList : []);
        } catch (error) {
            console.error("Failed to load options", error);
        }
    }, [apiGet]);

    useEffect(() => {
        fetchDependencies();
    }, [fetchDependencies]);

    useEffect(() => {
        const passedCustomer = location.state?.customer;
        if (id && passedCustomer) {
            setCustomer({
                ...passedCustomer,
                price: passedCustomer.pricePerBottle || passedCustomer.price || '',
                quantity: passedCustomer.defaultQty || passedCustomer.qty || passedCustomer.quantity || '',
                product: passedCustomer.productId || passedCustomer.product?.id || passedCustomer.product || '',
                route: passedCustomer.routeId || passedCustomer.route?.id || passedCustomer.route || ''
            });
        } else if (id) {
            // If ID exists but no passed data, fetch from list (since there's no single fetch endpoint typically)
            apiGet('/admin/customers').then(res => {
                const list = res?.data || res || [];
                const found = list.find(c => String(c.id) === String(id) || String(c.userId) === String(id));
                if (found) {
                    setCustomer({
                        ...found,
                        price: found.pricePerBottle || found.price || '',
                        quantity: found.defaultQty || found.qty || found.quantity || '',
                        product: found.productId || found.product?.id || found.product || '',
                        route: found.routeId || found.route?.id || found.route || ''
                    });
                }
            });
        }
    }, [id, location.state, apiGet]);

    const handleSave = async () => {
        setSubmitted(true);
        if (customer.username?.trim() && customer.mobileNumber?.trim() && customer.mobileNumber?.length === 10) {
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

                const updateId = id || customer.userId || customer.id;
                if (updateId) {
                    await apiPut(`/admin/customers/${updateId}`, payload);
                    toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Customer Updated' });
                } else {
                    await apiPost('/admin/register-customer', payload);
                    toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Customer Registered' });
                }
                setTimeout(() => navigate('/admin/customers'), 1000);
            } catch (error) {
                toast.current?.show({ 
                    severity: 'error', summary: 'Error', 
                    detail: error?.response?.data?.message || 'Failed to save customer' 
                });
            } finally {
                setLoading(false);
            }
        }
    };

    const fieldClass = (isValid) => classNames(
        'w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400 text-[15px] transition-all outline-none font-medium text-slate-700 shadow-inner',
        { 'border-rose-400 bg-rose-50/50': submitted && !isValid }
    );

    return (
        <div className="animate-fade-in">
            <Toast ref={toast} />
            <FormLayout
                title={id ? "Edit Customer" : "Register Customer"}
                loading={loading}
                isEditMode={!!id}
                onSave={handleSave}
                onDiscard={() => navigate('/admin/customers')}
            >
                <FormSection title="Core Profile" icon="pi pi-user">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
                        <div className="flex flex-col gap-2">
                            <label className="text-[13px] font-bold text-slate-500">Full Name</label>
                            <InputText
                                value={customer.username}
                                onChange={(e) => setCustomer({ ...customer, username: e.target.value })}
                                className={fieldClass(customer.username)}
                                placeholder="Customer name"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-[13px] font-bold text-slate-500">Mobile Number</label>
                            <InputText
                                value={customer.mobileNumber}
                                maxLength={10}
                                onChange={(e) => setCustomer({ ...customer, mobileNumber: e.target.value })}
                                className={fieldClass(customer.mobileNumber && customer.mobileNumber.length === 10)}
                                placeholder="10-digit number"
                            />
                        </div>
                        <div className="flex flex-col gap-2 md:col-span-2">
                            <label className="text-[13px] font-bold text-slate-500">Delivery Address</label>
                            <InputText
                                value={customer.address}
                                onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                                className={fieldClass(true)}
                                placeholder="Full address"
                            />
                        </div>
                    </div>
                </FormSection>

                <FormSection title="Subscription Settings" icon="pi pi-tag">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
                        <div className="flex flex-col gap-2">
                            <label className="text-[13px] font-bold text-slate-500">Price Per Bottle (₹)</label>
                            <InputText
                                type="number"
                                value={customer.price}
                                onChange={(e) => setCustomer({ ...customer, price: e.target.value })}
                                className={fieldClass(true)}
                                placeholder="0.00"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-[13px] font-bold text-slate-500">Daily Quantity</label>
                            <InputText
                                type="number"
                                value={customer.quantity}
                                onChange={(e) => setCustomer({ ...customer, quantity: e.target.value })}
                                className={fieldClass(true)}
                                placeholder="0"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-[13px] font-bold text-slate-500">Security Deposit (₹)</label>
                            <InputText
                                type="number"
                                value={customer.deposit}
                                onChange={(e) => setCustomer({ ...customer, deposit: e.target.value })}
                                className={fieldClass(true)}
                                placeholder="0.00"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-[13px] font-bold text-slate-500">Account Status</label>
                            <Dropdown
                                value={customer.status}
                                options={[
                                    { label: 'Active', value: 'ACTIVE' },
                                    { label: 'Blocked', value: 'INACTIVE' }
                                ]}
                                onChange={(e) => setCustomer({ ...customer, status: e.value })}
                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl h-13 flex items-center px-2 shadow-inner"
                            />
                        </div>
                    </div>
                </FormSection>

                <FormSection title="Logistics" icon="pi pi-map">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
                        <div className="flex flex-col gap-2">
                            <label className="text-[13px] font-bold text-slate-500">Assigned Route</label>
                            <Dropdown
                                value={customer.route}
                                options={routesData.map(r => ({ label: r.routeName || r.name, value: r.id }))}
                                onChange={(e) => setCustomer({ ...customer, route: e.value })}
                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl h-13 flex items-center px-2 shadow-inner"
                                placeholder="Select route"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-[13px] font-bold text-slate-500">Delivery Frequency</label>
                            <Dropdown
                                value={customer.deliveryType}
                                options={deliveryOptions}
                                onChange={(e) => setCustomer({ ...customer, deliveryType: e.value })}
                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl h-13 flex items-center px-2 shadow-inner"
                            />
                        </div>
                        <div className="flex flex-col gap-2 md:col-span-2">
                            <label className="text-[13px] font-bold text-slate-500">Preferred Product</label>
                            <Dropdown
                                value={customer.product}
                                options={productsData.map(p => ({ label: p.name, value: p.id }))}
                                onChange={(e) => setCustomer({ ...customer, product: e.value })}
                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl h-13 flex items-center px-2 shadow-inner"
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

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import { classNames } from 'primereact/utils';
import useApi from '@/hooks/useApi';
import { SimpleLayout, SimpleSection, SimpleField } from '@/components/shared/SimpleLayout';

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
        city: '',
        postalCode: '',
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
            setProductsData(Array.isArray(prodRes?.data || prodRes) ? (prodRes?.data || prodRes) : []);
            setRoutesData(Array.isArray(routeRes?.data || routeRes) ? (routeRes?.data || routeRes) : []);
        } catch (error) {
            console.error("Failed to load options", error);
        }
    }, [apiGet]);

    useEffect(() => { fetchDependencies(); }, [fetchDependencies]);

    useEffect(() => {
        const fetchCustomerDetails = async () => {
            setLoading(true);
            try {
                const response = await apiGet('/admin/customers');
                const data = response?.data || response || [];
                const found = data.find(c => (c.id?.toString() === id?.toString()) || (c.userId?.toString() === id?.toString()) || (c._id?.toString() === id?.toString()));
                
                if (found) {
                    setCustomer({
                        ...found,
                        city: found.city || '',
                        postalCode: found.postalCode || '',
                        price: found.pricePerBottle || found.price || '',
                        quantity: found.defaultQty || found.qty || found.quantity || '',
                        product: found.productId || found.product?.id || found.product || '',
                        route: found.routeId || found.route?.id || found.route || ''
                    });
                } else {
                    toast.current?.show({ severity: 'warn', summary: 'Not Found', detail: 'Customer not found. Redirecting...' });
                    setTimeout(() => navigate('/admin/customers'), 1500);
                }
            } catch (error) {
                toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to fetch customer details' });
                navigate('/admin/customers');
            } finally {
                setLoading(false);
            }
        };

        if (id && location.state?.customer) {
            const passedCustomer = location.state.customer;
            setCustomer({
                ...passedCustomer,
                city: passedCustomer.city || '',
                postalCode: passedCustomer.postalCode || '',
                price: passedCustomer.pricePerBottle || passedCustomer.price || '',
                quantity: passedCustomer.defaultQty || passedCustomer.qty || passedCustomer.quantity || '',
                product: passedCustomer.productId || passedCustomer.product?.id || passedCustomer.product || '',
                route: passedCustomer.routeId || passedCustomer.route?.id || passedCustomer.route || ''
            });
        } else if (id) {
            fetchCustomerDetails();
        }
    }, [id, location.state, apiGet, navigate]);

    const handleSave = async () => {
        setSubmitted(true);
        if (customer.username?.trim() && customer.mobileNumber?.trim() && customer.mobileNumber?.length === 10) {
            setLoading(true);
            try {
                const payload = {
                    ...customer,
                    deposit: Number(customer.deposit) || 0,
                    price: Number(customer.price) || 0,
                    pricePerBottle: Number(customer.price) || 0,
                    quantity: Number(customer.quantity) || 0,
                    defaultQty: Number(customer.quantity) || 0
                };

                if (id) {
                    await apiPut(`/admin/customers/${id}`, payload);
                    toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Customer Updated Successfully' });
                } else {
                    await apiPost('/admin/register-customer', payload);
                    toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Customer Registered Successfully' });
                }
                setTimeout(() => navigate('/admin/customers'), 1000);
            } catch (error) {
                toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Operation failed' });
            } finally {
                setLoading(false);
            }
        }
    };

    const inputClass = (isValid) => classNames(
        'w-full p-4 bg-white border border-slate-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-50 text-[15px] transition-all outline-none font-medium text-slate-700 placeholder:text-slate-400 shadow-sm',
        { 'border-rose-400 bg-rose-50/50': submitted && !isValid }
    );

    const dropdownClass = "w-full bg-white border border-slate-200 rounded-xl h-[54px] flex items-center px-2 focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all font-medium text-slate-700 shadow-sm";

    return (
        <div className="animate-fade-in">
            <Toast ref={toast} />
            <SimpleLayout
                title={id ? "Edit Customer" : "Create Customer"}
                onSave={handleSave}
                loading={loading}
                saveLabel={id ? "Update Account" : "Register Customer"}
            >
                <SimpleSection title="Overview">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
                        <SimpleField label="Full Name">
                            <InputText
                                value={customer.username}
                                onChange={(e) => setCustomer({ ...customer, username: e.target.value })}
                                className={inputClass(customer.username)}
                                placeholder="Enter customer name"
                            />
                        </SimpleField>
                        <SimpleField label="Mobile Number">
                            <InputText
                                value={customer.mobileNumber}
                                maxLength={10}
                                onChange={(e) => setCustomer({ ...customer, mobileNumber: e.target.value })}
                                className={inputClass(customer.mobileNumber && customer.mobileNumber.length === 10)}
                                placeholder="Enter mobile number"
                            />
                        </SimpleField>
                    </div>
                </SimpleSection>

                <SimpleSection title="Additional Information">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
                        <SimpleField label="City">
                            <InputText
                                value={customer.city}
                                onChange={(e) => setCustomer({ ...customer, city: e.target.value })}
                                className={inputClass(true)}
                                placeholder="Enter city"
                            />
                        </SimpleField>
                        <SimpleField label="Postal Code">
                            <InputText
                                value={customer.postalCode}
                                onChange={(e) => setCustomer({ ...customer, postalCode: e.target.value })}
                                className={inputClass(true)}
                                placeholder="Enter postal code"
                            />
                        </SimpleField>
                        <div className="md:col-span-2">
                            <SimpleField label="Address">
                                <InputText
                                    value={customer.address}
                                    onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                                    className={inputClass(true)}
                                    placeholder="Enter permanent address"
                                />
                            </SimpleField>
                        </div>
                    </div>
                </SimpleSection>

                <SimpleSection title="Subscription Settings">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
                        <SimpleField label="Price (₹)">
                            <InputText
                                type="number"
                                value={customer.price}
                                onChange={(e) => setCustomer({ ...customer, price: e.target.value })}
                                className={inputClass(true)}
                                placeholder="0.00"
                            />
                        </SimpleField>
                        <SimpleField label="Daily Qty">
                            <InputText
                                type="number"
                                value={customer.quantity}
                                onChange={(e) => setCustomer({ ...customer, quantity: e.target.value })}
                                className={inputClass(true)}
                                placeholder="0"
                            />
                        </SimpleField>
                        <SimpleField label="Deposit (₹)">
                            <InputText
                                type="number"
                                value={customer.deposit}
                                onChange={(e) => setCustomer({ ...customer, deposit: e.target.value })}
                                className={inputClass(true)}
                                placeholder="0.00"
                            />
                        </SimpleField>
                    </div>
                </SimpleSection>

                <SimpleSection title="Logistics">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
                        <SimpleField label="Assigned Route">
                            <Dropdown
                                value={customer.route}
                                options={routesData.map(r => ({ label: r.routeName || r.name, value: r.id }))}
                                onChange={(e) => setCustomer({ ...customer, route: e.value })}
                                className={dropdownClass}
                                placeholder="Select route"
                            />
                        </SimpleField>
                        <SimpleField label="Delivery Frequency">
                            <Dropdown
                                value={customer.deliveryType}
                                options={deliveryOptions}
                                onChange={(e) => setCustomer({ ...customer, deliveryType: e.value })}
                                className={dropdownClass}
                            />
                        </SimpleField>
                        <div className="md:col-span-2">
                            <SimpleField label="Preferred Product">
                                <Dropdown
                                    value={customer.product}
                                    options={productsData.map(p => ({ label: p.name, value: p.id }))}
                                    onChange={(e) => setCustomer({ ...customer, product: e.value })}
                                    className={dropdownClass}
                                    placeholder="Select product"
                                />
                            </SimpleField>
                        </div>
                    </div>
                </SimpleSection>
            </SimpleLayout>
        </div>
    );
};

export default AddCustomer;

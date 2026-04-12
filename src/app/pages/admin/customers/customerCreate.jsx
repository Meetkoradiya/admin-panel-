import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { classNames } from 'primereact/utils';
import { Page } from "@/components/shared/Page";
import axios from 'axios';
import { useSelector } from 'react-redux';

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
        deliveryType: '',
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

    const routeOptions = [
        { label: 'Select route', value: '' },
        ...routesData.map(r => ({ label: r.routeName || r.name, value: r.id }))
    ];

    const productOptions = [
        { label: 'Select products', value: '' },
        ...productsData.map(p => ({ label: p.name, value: p.id }))
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
        if (token) {
            fetchDependencies();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token]);

    useEffect(() => {
        if (id) {
            if (passedCustomer) {
                setCustomer(c => ({...c, ...passedCustomer}));
            } else {
                fetchCustomerDetails(id);
            }
        }
    }, [id, passedCustomer]);

    const fetchCustomerDetails = async (customerId) => {
        try {
            const response = await axios.get(`${BASE_URL}/admin/customers`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const allCustomers = Array.isArray(response.data) ? response.data : (response.data?.data || []);
            const found = allCustomers.find(c => c.id === parseInt(customerId) || c.id === customerId || c.userId === parseInt(customerId) || c.userId === customerId);
            if (found) {
                setCustomer(c => ({...c, ...found}));
            }
        } catch (error) {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to fetch customer details' });
        }
    };

    const handleDiscard = () => {
        navigate(-1);
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
                    // Attach extra keys gracefully incase backend takes them
                    routeId: customer.route,
                    price: Number(customer.price) || 0,
                    quantity: Number(customer.quantity) || 0,
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

    return (
        <Page title={id ? "Edit Customer" : "Create Customer"}>
            <div className="bg-slate-50 flex flex-col justify-between h-full min-h-[calc(100vh-80px)] relative">
                <Toast ref={toast} />
                
                <div className="p-4 md:p-6 mb-16 flex-grow w-full">
                    <h2 className="text-xl font-bold text-slate-900 mb-6">{id ? "Edit Customer" : "Create Customer"}</h2>
                    
                    <div className="flex flex-col gap-6">
                        
                        {/* Top row: Overview & Delivery Details */}
                        <div className="flex flex-col xl:flex-row gap-6">
                            
                            {/* Overview Box */}
                            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex-1 hover:shadow-md transition-shadow">
                                <h3 className="text-base font-bold text-slate-800 mb-5">Overview</h3>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                                    <div className="field">
                                        <label className="text-xs font-bold text-slate-500 mb-2 block">Full Name</label>
                                        <InputText 
                                            value={customer.username} 
                                            onChange={(e) => setCustomer({...customer, username: e.target.value})} 
                                            className={classNames('w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-100 text-sm', { 'p-invalid border-red-400': submitted && !customer.username })} 
                                            placeholder="Full name"
                                        />
                                        {submitted && !customer.username && <small className="p-error block mt-1">Full Name is required.</small>}
                                    </div>
                                    <div className="field">
                                        <label className="text-xs font-bold text-slate-500 mb-2 block">Mobile number</label>
                                        <InputText 
                                            value={customer.mobileNumber} 
                                            maxLength={10}
                                            onChange={(e) => setCustomer({...customer, mobileNumber: e.target.value})} 
                                            className={classNames('w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-100 text-sm', { 'p-invalid border-red-400': submitted && (!customer.mobileNumber || customer.mobileNumber.length !== 10) })} 
                                            placeholder="Mobile number"
                                        />
                                        {submitted && (!customer.mobileNumber || customer.mobileNumber.length !== 10) && <small className="p-error block mt-1">Valid 10-digit mobile is required.</small>}
                                    </div>
                                </div>

                                <div className="field">
                                    <label className="text-xs font-bold text-slate-500 mb-2 block">Address</label>
                                    <InputText 
                                        value={customer.address} 
                                        onChange={(e) => setCustomer({...customer, address: e.target.value})} 
                                        className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-100 min-h-[50px] text-sm" 
                                        placeholder="Enter address"
                                    />
                                </div>
                            </div>

                            {/* Delivery details Box */}
                            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 xl:w-[400px] hover:shadow-md transition-shadow">
                                <h3 className="text-base font-bold text-slate-800 mb-5">Delivery details</h3>
                                
                                <div className="flex flex-col gap-6">
                                    <div className="field">
                                        <label className="text-xs font-bold text-slate-500 mb-2 block">Select Route</label>
                                        <Dropdown 
                                            value={customer.route} 
                                            options={routeOptions} 
                                            onChange={(e) => setCustomer({...customer, route: e.value})} 
                                            className="w-full border border-slate-200 rounded-xl h-[46px] flex items-center bg-white shadow-sm" 
                                            placeholder="Select route"
                                        />
                                    </div>
                                    <div className="field">
                                        <label className="text-xs font-bold text-slate-500 mb-2 block">Delivery Type</label>
                                        <Dropdown 
                                            value={customer.deliveryType} 
                                            options={deliveryOptions} 
                                            onChange={(e) => setCustomer({...customer, deliveryType: e.value})} 
                                            className="w-full border border-slate-200 rounded-xl h-[46px] flex items-center bg-white shadow-sm" 
                                            placeholder="Select Delivery Type"
                                        />
                                    </div>
                                </div>
                            </div>

                        </div>

                        {/* Product Information Box (Bottom Full-width) */}
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 w-full hover:shadow-md transition-shadow">
                            <h3 className="text-base font-bold text-slate-800 mb-5">Product Information</h3>
                            
                            <div className="flex flex-col gap-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="field">
                                        <label className="text-xs font-bold text-slate-500 mb-2 block">Deposit Amount</label>
                                        <InputText 
                                            type="number"
                                            value={customer.deposit} 
                                            onChange={(e) => setCustomer({...customer, deposit: e.target.value})} 
                                            className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-100 text-sm" 
                                            placeholder="Deposit amount"
                                        />
                                    </div>
                                    <div className="field">
                                        <label className="text-xs font-bold text-slate-500 mb-2 block">Price ( Per Bottle )</label>
                                        <InputText 
                                            type="number"
                                            value={customer.price} 
                                            onChange={(e) => setCustomer({...customer, price: e.target.value})} 
                                            className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-100 text-sm" 
                                            placeholder="Price"
                                        />
                                    </div>
                                </div>

                                <div className="field">
                                    <label className="text-xs font-bold text-slate-500 mb-2 block">Quantity( Per day )</label>
                                    <InputText 
                                        type="number"
                                        value={customer.quantity} 
                                        onChange={(e) => setCustomer({...customer, quantity: e.target.value})} 
                                        className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-100 text-sm" 
                                        placeholder="Quantity"
                                    />
                                </div>

                                <div className="field">
                                    <label className="text-xs font-bold text-slate-500 mb-2 block">Select Products</label>
                                    <Dropdown 
                                        value={customer.product} 
                                        options={productOptions} 
                                        onChange={(e) => setCustomer({...customer, product: e.value})} 
                                        className="w-full border border-slate-200 rounded-xl h-[46px] flex items-center shadow-sm" 
                                        placeholder="Select products"
                                    />
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Sticky Footer */}
                <div className="sticky bottom-0 bg-white border-t border-slate-100 px-6 py-4 flex justify-end gap-3 z-50 mt-auto w-full text-right shadow-[0_-5px_15px_-5px_rgba(0,0,0,0.05)]">
                    <Button 
                        label="Discard" 
                        icon="pi pi-trash" 
                        className="p-button-outlined border-red-300 text-red-500 hover:bg-red-50 hover:border-red-400 px-8 py-2.5 rounded-xl font-bold bg-white transition-colors" 
                        onClick={handleDiscard}
                        disabled={loading}
                    />
                    <Button 
                        label={id ? "Update" : "Create"} 
                        className="bg-blue-600 border-none hover:bg-blue-700 hover:-translate-y-0.5 transition-all text-white px-10 py-2.5 rounded-xl font-bold shadow-md hover:shadow-lg" 
                        onClick={handleSave} 
                        loading={loading}
                    />
                </div>
            </div>
        </Page>
    );
};

export default AddCustomer;

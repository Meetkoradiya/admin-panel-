import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { Tag } from 'primereact/tag';
import EmptyMessage from "@/components/shared/EmptyMessage";
import { Page } from "@/components/shared/Page";
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const CustomerManagement = () => {
    const [customers, setCustomers] = useState([]);
    const [globalFilter, setGlobalFilter] = useState("");
    const [loading, setLoading] = useState(false);
    const toast = useRef(null);
    const navigate = useNavigate();

    const token = useSelector((state) => state.auth.token);
    const BASE_URL = import.meta.env.VITE_BACKEND_BASEURL;

    const hasData = customers.length > 0;

    const emptyMessageContent = !hasData ? (
        <EmptyMessage
            title="No Customers Found"
            subtitle="There are currently no customers in the database. Add a new customer to see them here."
        />
    ) : (
        <EmptyMessage
            title="No Matching Customers"
            subtitle="No customers match your applied search filter. Try a different query."
        />
    );

    const fetchCustomers = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${BASE_URL}/admin/customers`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (Array.isArray(response.data)) {
                setCustomers(response.data);
            } else if (response.data && Array.isArray(response.data.data)) {
                setCustomers(response.data.data);
            } else {
                setCustomers([]);
            }
        } catch (error) {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to fetch customers' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchCustomers();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token]);

    const deleteCustomer = async (rowData) => {
        try {
            const deleteId = rowData.id || rowData.userId;
            await axios.delete(`${BASE_URL}/admin/users/${deleteId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Customer Deleted Successfully', life: 3000 });
            fetchCustomers();
        } catch (error) {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to delete customer' });
        }
    };

    const statusBodyTemplate = (rowData) => {
        let bg, text, dot;
        switch (rowData.status) {
            case "ACTIVE": bg = "bg-emerald-500/10"; text = "text-emerald-500"; dot = "bg-emerald-500"; break;
            case "INACTIVE": bg = "bg-amber-500/10"; text = "text-amber-500"; dot = "bg-amber-500"; break;
            case "DELETE": bg = "bg-rose-500/10"; text = "text-rose-500"; dot = "bg-rose-500"; break;
            default: bg = "bg-emerald-500/10"; text = "text-emerald-500"; dot = "bg-emerald-500";
        }
        return (
            <span className={`inline-flex items-center gap-2 px-3 py-1 font-bold text-xs uppercase tracking-wider rounded-lg ${bg} ${text}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${dot} animate-pulse`}></span>
                {rowData.status || "ACTIVE"}
            </span>
        );
    };

    const nameTemplate = (rowData) => (
        <span className="font-extrabold text-slate-800 text-sm tracking-tight">{rowData.username}</span>
    );
    const mobileTemplate = (rowData) => (
        <span className="font-bold text-slate-600 text-sm">{rowData.mobileNumber}</span>
    );

    const actionBodyTemplate = (rowData) => (
        <div className="flex justify-center gap-3 opacity-80 hover:opacity-100 transition-opacity">
            <Button icon="pi pi-pencil" rounded outlined tooltip="Edit" tooltipOptions={{position:'top'}} className="w-8 h-8 !rounded-full border-blue-400 text-blue-500 hover:bg-blue-500 hover:text-white transition-all duration-300 shadow-sm" onClick={() => navigate(`/admin/customers/edit/${rowData.id || rowData.userId}`, { state: { customer: rowData } })} />
            <Button icon="pi pi-trash" rounded outlined tooltip="Delete" tooltipOptions={{position:'top'}} className="w-8 h-8 !rounded-full border-red-400 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300 shadow-sm" onClick={() => deleteCustomer(rowData)} />
        </div>
    );

    const header = (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 bg-white/50 backdrop-blur-md border-b border-slate-100/60 rounded-t-[30px]">
            <div>
                <h2 className="text-2xl font-extrabold text-slate-800 m-0 tracking-tight">Customer Database</h2>
                <p className="text-sm font-semibold text-slate-400 mt-1">Manage and overview {Array.isArray(customers) ? customers.length : 0} registered patrons</p>
            </div>
            <div className="flex items-center gap-3 w-full md:w-auto">
                <span className="p-input-icon-left w-full shadow-sm rounded-xl">
                    <i className="pi pi-search text-indigo-400" />
                    <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search records..." className="bg-white/80 border-slate-200 rounded-xl w-full focus:ring-4 focus:ring-indigo-100 transition-all font-semibold" />
                </span>
                <Button label="New Customer" icon="pi pi-plus" className="bg-gradient-to-tr from-indigo-500 to-sky-500 hover:from-indigo-600 hover:to-sky-600 border-none px-6 py-3 rounded-xl font-extrabold shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 whitespace-nowrap text-white" onClick={() => navigate('/admin/customers/add')} />
            </div>
        </div>
    );

    return (
        <Page title="Customers">
            <div className="min-h-full bg-slate-50 relative overflow-hidden font-sans p-4 md:p-6 lg:p-8">
                <Toast ref={toast} />

                {/* Abstract Background Blobs tailored to match dashboard */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                    <div className="absolute top-0 -left-20 w-96 h-96 bg-sky-200 rounded-full mix-blend-multiply filter blur-[100px] opacity-40 animate-blob"></div>
                    <div className="absolute bottom-0 right-10 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-[100px] opacity-40 animate-blob animation-delay-2000"></div>
                </div>

                <div className="relative z-10 w-full">
                    
                    <div className="backdrop-blur-xl bg-white/80 border border-white/60 shadow-2xl rounded-[32px] hover:shadow-xl transition-all duration-500 flex flex-col">
                        
                        <div className="flex-1 rounded-[32px]">
                            <DataTable 
                                value={Array.isArray(customers) ? customers : []} 
                                header={header} 
                                paginator 
                                rows={10} 
                                loading={loading}
                                globalFilter={globalFilter}
                                rowHover
                                className="p-datatable-sm bg-transparent"
                                emptyMessage={emptyMessageContent}
                            >
                                <Column field="username" header="Full Name" body={nameTemplate} sortable headerClassName="bg-slate-50/50 border-b border-slate-100 text-slate-500 font-extrabold text-xs uppercase tracking-wider py-4"></Column>
                                <Column field="mobileNumber" header="Mobile No" body={mobileTemplate} headerClassName="bg-slate-50/50 border-b border-slate-100 text-slate-500 font-extrabold text-xs uppercase tracking-wider py-4"></Column>
                                <Column field="address" header="Location" headerClassName="bg-slate-50/50 border-b border-slate-100 text-slate-500 font-extrabold text-xs uppercase tracking-wider py-4" className="text-slate-600 font-medium"></Column>
                                <Column field="status" header="Status" body={statusBodyTemplate} sortable headerClassName="bg-slate-50/50 border-b border-slate-100 text-slate-500 font-extrabold text-xs uppercase tracking-wider py-4"></Column>
                                <Column header="Actions" body={actionBodyTemplate} headerClassName="bg-slate-50/50 border-b border-slate-100 text-slate-500 font-extrabold text-xs uppercase tracking-wider py-4" align="center" style={{ width: '120px' }}></Column>
                            </DataTable>
                        </div>
                    </div>

                </div>
            </div>

            <style dangerouslySetInnerHTML={{__html: `
                @keyframes blob {
                0% { transform: translate(0px, 0px) scale(1); }
                33% { transform: translate(30px, -50px) scale(1.1); }
                66% { transform: translate(-20px, 20px) scale(0.9); }
                100% { transform: translate(0px, 0px) scale(1); }
                }
                .animate-blob { animation: blob 7s infinite; }
                .animation-delay-2000 { animation-delay: 2s; }
            `}} />
        </Page>
    );
};

export default CustomerManagement;

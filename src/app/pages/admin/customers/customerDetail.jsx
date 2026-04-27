import React, { useEffect, useState, useRef } from "react";
import dayjs from "dayjs";
import { Button } from "primereact/button";
import { useNavigate, useParams } from "react-router-dom";
import { Skeleton } from "primereact/skeleton";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Tag } from "primereact/tag";
import { Toast } from "primereact/toast";
import { Avatar } from "primereact/avatar";
import axios from "axios";
import { useSelector } from "react-redux";
import { Page } from "@/components/shared/Page";

const CustomerDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const toast = useRef(null);
    const [customer, setCustomer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loadingOrders, setLoadingOrders] = useState(true);
    const [orders, setOrders] = useState([]);
    
    const token = useSelector((state) => state.auth.token);
    const BASE_URL = import.meta.env.VITE_BACKEND_BASEURL;

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                setLoading(true);
                const res = await axios.get(`${BASE_URL}/admin/customers/by-user/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setCustomer(res.data?.data || res.data);
            } catch (err) {
                toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to load profile' });
            } finally {
                setLoading(false);
            }
        };

        const fetchOrders = async () => {
            try {
                setLoadingOrders(true);
                const res = await axios.get(`${BASE_URL}/orders/customer/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const data = res.data?.data || res.data || [];
                setOrders(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error("Orders fetch failed");
            } finally {
                setLoadingOrders(false);
            }
        };

        if (id && token) {
            fetchDetails();
            fetchOrders();
        }
    }, [id, token, BASE_URL]);

    const handleDelete = async () => {
        if (!window.confirm("Permanentely delete this customer?")) return;
        try {
            await axios.delete(`${BASE_URL}/admin/users/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.current?.show({ severity: 'success', summary: 'Deleted', detail: 'Customer removed' });
            setTimeout(() => navigate('/admin/customers'), 1000);
        } catch (error) {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Delete failed' });
        }
    };

    const statusBodyTemplate = (row) => {
        const status = row.status || 'PENDING';
        const map = {
            DELIVERED: 'success',
            IN_PROGRESS: 'warning',
            CANCELLED: 'danger'
        };
        return <Tag value={status} severity={map[status] || 'info'} rounded className="px-3 py-1 font-bold text-[10px] uppercase tracking-widest" />;
    };

    return (
        <Page title="Customer Insights">
            <Toast ref={toast} />
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 animate-fade-in pb-20">
                
                {/* LEFT SIDEBAR: PROFILE CARD */}
                <div className="lg:col-span-1 flex flex-col gap-8">
                    <div className="bg-white rounded-[40px] p-8 shadow-sm border border-slate-100 flex flex-col items-center text-center">
                        {loading ? <Skeleton shape="circle" size="6rem" className="mb-4" /> : (
                            <Avatar 
                                label={customer?.username?.charAt(0)} 
                                size="xlarge" 
                                className="bg-blue-50 text-blue-500 font-black mb-6 w-24 h-24 text-4xl rounded-3xl" 
                            />
                        )}
                        
                        <h2 className="text-xl font-black text-slate-800 tracking-tight">
                            {loading ? <Skeleton width="8rem" height="1.5rem" /> : (customer?.username || '—')}
                        </h2>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
                            {loading ? <Skeleton width="5rem" height="0.8rem" /> : `UID: ${id}`}
                        </p>

                        <div className="w-full h-[1px] bg-slate-50 my-8" />

                        <div className="w-full flex flex-col gap-5 text-left">
                            <DetailRow label="Mobile" value={customer?.mobileNumber} icon="pi pi-phone" loading={loading} />
                            <DetailRow label="Location" value={customer?.address} icon="pi pi-map-marker" loading={loading} />
                            <DetailRow label="Type" value={customer?.deliveryType} icon="pi pi-truck" loading={loading} />
                            <DetailRow label="Status" value={customer?.status || 'ACTIVE'} isTag loading={loading} />
                        </div>

                        <div className="w-full flex flex-col gap-3 mt-10 pt-10 border-t border-slate-50">
                            <Button 
                                label="Edit Profile" 
                                icon="pi pi-pencil" 
                                className="w-full p-button-outlined border-slate-200 text-slate-600 font-bold rounded-2xl h-12 transition-all hover:bg-slate-50" 
                                onClick={() => navigate(`/admin/customers/edit/${id}`)}
                            />
                            <Button 
                                label="Delete" 
                                icon="pi pi-trash" 
                                className="w-full p-button-text text-rose-500 font-bold rounded-2xl h-12 transition-all hover:bg-rose-50" 
                                onClick={handleDelete}
                            />
                        </div>
                    </div>
                </div>

                {/* RIGHT CONTENT: STATS & ORDERS */}
                <div className="lg:col-span-3 flex flex-col gap-8">
                    
                    {/* STAT CARDS */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <StatCard label="Monthly Spend" value={`₹${(orders.reduce((a,b) => a + (b.price || 0), 0)).toLocaleString()}`} icon="pi pi-wallet" color="text-emerald-500" bg="bg-emerald-50" />
                        <StatCard label="Total Units" value={orders.reduce((a,b) => a + (b.qty || 0), 0)} icon="pi pi-box" color="text-blue-500" bg="bg-blue-50" />
                        <StatCard label="Order Count" value={orders.length} icon="pi pi-shopping-cart" color="text-violet-500" bg="bg-violet-50" />
                    </div>

                    {/* RECENT ORDERS TABLE */}
                    <div className="bg-white rounded-[40px] shadow-sm border border-slate-100 overflow-hidden">
                        <div className="px-8 py-8 border-b border-slate-50 flex items-center justify-between">
                            <h3 className="text-lg font-black text-slate-800 tracking-tight">Order Timeline</h3>
                            <Button icon="pi pi-refresh" text rounded className="text-slate-400 hover:bg-slate-50" />
                        </div>
                        <DataTable 
                            value={orders} 
                            loading={loadingOrders}
                            paginator rows={10} 
                            className="p-datatable-minimal"
                            responsiveLayout="scroll"
                            emptyMessage="No historical orders found"
                        >
                            <Column field="id" header="Order ID" body={(r) => <span className="font-black text-blue-500 text-xs">#{r.id}</span>} />
                            <Column field="orderDate" header="Timestamp" body={(r) => <span className="text-slate-500 font-medium text-sm">{dayjs(r.orderDate).format('DD MMM, YYYY')}</span>} sortable />
                            <Column field="qty" header="Units" body={(r) => <span className="font-bold text-slate-800">{r.qty}</span>} />
                            <Column field="price" header="Value" body={(r) => <span className="font-black text-slate-900">₹{r.price?.toLocaleString()}</span>} sortable />
                            <Column field="status" header="Status" body={statusBodyTemplate} style={{ textAlign: 'center' }} />
                        </DataTable>
                    </div>
                </div>
            </div>
        </Page>
    );
};

const DetailRow = ({ label, value, icon, isTag, loading }) => (
    <div className="flex flex-col gap-1">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">{label}</span>
        {loading ? <Skeleton width="80%" height="1.2rem" /> : (
            isTag ? (
                <Tag value={value} severity={value === 'ACTIVE' ? 'success' : 'danger'} rounded className="w-fit px-3 py-1 text-[9px] font-black uppercase tracking-widest" />
            ) : (
                <div className="flex items-center gap-2 text-slate-700 font-bold text-sm">
                    {icon && <i className={`${icon} text-blue-400 text-xs`} />}
                    <span className="truncate">{value || 'Not set'}</span>
                </div>
            )
        )}
    </div>
);

const StatCard = ({ label, value, icon, color, bg }) => (
    <div className="bg-white rounded-[32px] p-6 shadow-sm border border-slate-50 flex items-center gap-5 hover:shadow-md transition-all group">
        <div className={`w-14 h-14 rounded-2xl ${bg} ${color} flex items-center justify-center text-xl group-hover:scale-110 transition-transform`}>
            <i className={icon} />
        </div>
        <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{label}</span>
            <span className="text-xl font-black text-slate-800 tracking-tight">{value}</span>
        </div>
    </div>
);

export default CustomerDetail;

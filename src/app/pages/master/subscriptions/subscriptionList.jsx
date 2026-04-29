import React, { useState, useEffect, useRef } from 'react';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Tag } from 'primereact/tag';
import useApi from '@/hooks/useApi';
import ListLayout from '@/components/shared/ListLayout';
import StatusTag from '@/components/shared/StatusTag';

const SubscriptionList = () => {
    const [subscriptions, setSubscriptions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [globalFilter, setGlobalFilter] = useState("");
    const toast = useRef(null);
    const { apiGet } = useApi();

    const fetchSubscriptions = async () => {
        setLoading(true);
        try {
            const data = await apiGet('/master/subscriptions');
            setSubscriptions(Array.isArray(data) ? data : (data?.data || []));
        } catch (error) {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to fetch subscriptions' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchSubscriptions(); }, []);

    const statusBodyTemplate = (rowData) => {
        return <StatusTag status={rowData.status || 'INACTIVE'} />;
    };

    const priceBodyTemplate = (rowData) => (
        <span className="font-black text-slate-800">₹{(rowData.price || 0).toLocaleString()}</span>
    );

    return (
        <div className="animate-fade-in">
            <Toast ref={toast} />
            <ListLayout
                title="Service Subscriptions"
                subtitle="Overview of active franchise plans and billing tiers"
                data={subscriptions}
                loading={loading}
                globalFilter={globalFilter}
                setGlobalFilter={setGlobalFilter}
                onAdd={null}
            >
                <Column field="no" header="#" body={(_, opts) => <span className="text-slate-400 font-bold text-xs ml-2">{opts.rowIndex + 1}</span>} style={{ width: '4rem' }} />
                <Column field="outlet.name" header="Franchise / Outlet" body={(row) => <span className="font-bold text-slate-700">{row.outlet?.name || '—'}</span>} sortable />
                <Column field="planName" header="Plan Tier" body={(row) => <span className="text-blue-500 font-black text-[10px] uppercase tracking-widest">{row.planName || 'STANDARD'}</span>} />
                <Column header="Subscription Fee" body={priceBodyTemplate} sortable sortField="price" />
                <Column field="expiryDate" header="Next Renewal" body={(row) => <span className="text-slate-500 text-sm font-medium">{row.expiryDate || '—'}</span>} sortable />
                <Column header="Status" body={statusBodyTemplate} sortable sortField="status" style={{ width: '10rem', textAlign: 'center' }} />
            </ListLayout>
        </div>
    );
};

export default SubscriptionList;

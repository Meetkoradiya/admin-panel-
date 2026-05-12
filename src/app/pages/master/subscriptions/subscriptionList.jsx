import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import useApi from '@/hooks/useApi';
import ListLayout from '@/components/shared/ListLayout';
import StatusTag from '@/components/shared/StatusTag';
import ActionButtons from '@/components/shared/ActionButtons';

const SubscriptionList = () => {
    const [subscriptions, setSubscriptions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [globalFilter, setGlobalFilter] = useState("");
    const toast = useRef(null);
    const { apiGet } = useApi();

    const fetchSubscriptions = useCallback(async () => {
        setLoading(true);
        try {
            const data = await apiGet('/master/water-plans');
            setSubscriptions(Array.isArray(data) ? data : (data?.data || []));
        } catch (error) {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to fetch subscriptions' });
        } finally {
            setLoading(false);
        }
    }, [apiGet]);

    useEffect(() => { fetchSubscriptions(); }, [fetchSubscriptions]);

    const statusBodyTemplate = (rowData) => {
        return <StatusTag status={rowData.status || 'INACTIVE'} />;
    };

    const priceBodyTemplate = (rowData) => (
        <span className="font-extrabold text-slate-800 text-sm">₹{(rowData.price || 0).toLocaleString()}</span>
    );

    const outletTemplate = (row) => (
        <div className="flex flex-col gap-1 py-1">
            <span className="text-slate-800 font-bold text-sm">{row.outlet?.name || '—'}</span>
            <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-blue-500 bg-blue-50 w-fit px-2 py-0.5 rounded-md border border-blue-100">
                {row.planName || 'STANDARD'}
            </span>
        </div>
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
                <Column field="no" header="#" body={(_, opts) => <span className="text-slate-400 font-bold text-[10px] ml-2">{opts.rowIndex + 1}</span>} style={{ width: '4rem' }} />
                <Column header="Franchise / Outlet" body={outletTemplate} sortField="outlet.name" />
                <Column header="Subscription Fee" body={priceBodyTemplate} sortField="price" />
                <Column field="expiryDate" header="Next Renewal" body={(row) => <span className="text-slate-500 text-xs font-bold uppercase tracking-wider">{row.expiryDate || '—'}</span>} />
                <Column header="Status" body={statusBodyTemplate} sortable sortField="status" style={{ width: '10rem', textAlign: 'center' }} />
                <Column header="Actions" body={() => <ActionButtons onEdit={() => {}} />} style={{ width: '8rem', textAlign: 'center' }} />
            </ListLayout>
        </div>
    );
};

export default SubscriptionList;

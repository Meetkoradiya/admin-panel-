import React, { useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Page } from "@/components/shared/Page";

const SubscriptionList = () => {
    const [subscriptions] = useState([
        { id: 1, plan: 'Basic', price: '$10', status: 'Active', user: 'John Doe' }
    ]);

    const header = (
        <div className="flex flex-wrap items-center justify-between gap-4 py-2">
            <h2 className="m-0 text-2xl font-bold text-slate-800">Subscriptions</h2>
        </div>
    );

    return (
        <Page title="Subscriptions">
            <div className="bg-slate-50 min-h-screen">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <DataTable 
                        value={subscriptions} 
                        header={header} 
                        className="p-datatable-sm"
                        stripedRows
                        responsiveLayout="stack" 
                        emptyMessage="No subscriptions found."
                    >
                        <Column field="user" header="User" className="font-medium text-slate-700"></Column>
                        <Column field="plan" header="Plan" className="font-medium text-slate-700"></Column>
                        <Column field="price" header="Price" className="font-medium text-slate-700"></Column>
                        <Column field="status" header="Status" className="font-medium text-slate-700"></Column>
                    </DataTable>
                </div>
            </div>
        </Page>
    );
};

export default SubscriptionList;

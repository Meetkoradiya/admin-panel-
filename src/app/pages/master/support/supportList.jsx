import React, { useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Page } from "@/components/shared/Page";

const SupportList = () => {
    const [tickets] = useState([
        { id: 1, subject: 'Payment Issue', user: 'John Doe', status: 'Open', date: '2026-04-16' }
    ]);

    const header = (
        <div className="flex flex-wrap items-center justify-between gap-4 py-2">
            <h2 className="m-0 text-2xl font-bold text-slate-800">Contact Support</h2>
        </div>
    );

    return (
        <Page title="Contact Support">
            <div className="bg-slate-50 min-h-screen">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <DataTable 
                        value={tickets} 
                        header={header} 
                        className="p-datatable-sm"
                        stripedRows
                        responsiveLayout="stack" 
                        emptyMessage="No tickets found."
                    >
                        <Column field="subject" header="Subject" className="font-medium text-slate-700"></Column>
                        <Column field="user" header="User" className="font-medium text-slate-700"></Column>
                        <Column field="date" header="Date" className="font-medium text-slate-700"></Column>
                        <Column field="status" header="Status" className="font-medium text-slate-700"></Column>
                    </DataTable>
                </div>
            </div>
        </Page>
    );
};

export default SupportList;

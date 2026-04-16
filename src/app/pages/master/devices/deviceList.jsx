import React, { useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Page } from "@/components/shared/Page";

const DeviceList = () => {
    const [devices] = useState([
        { id: 1, deviceId: 'DEV-001', type: 'Sensor', user: 'John Doe', status: 'Verified' }
    ]);

    const header = (
        <div className="flex flex-wrap items-center justify-between gap-4 py-2">
            <h2 className="m-0 text-2xl font-bold text-slate-800">Device Verification</h2>
        </div>
    );

    return (
        <Page title="Device Verification">
            <div className="bg-slate-50 min-h-screen">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <DataTable 
                        value={devices} 
                        header={header} 
                        className="p-datatable-sm"
                        stripedRows
                        responsiveLayout="stack" 
                        emptyMessage="No devices found."
                    >
                        <Column field="deviceId" header="Device ID" className="font-medium text-slate-700"></Column>
                        <Column field="type" header="Type" className="font-medium text-slate-700"></Column>
                        <Column field="user" header="User" className="font-medium text-slate-700"></Column>
                        <Column field="status" header="Status" className="font-medium text-slate-700"></Column>
                    </DataTable>
                </div>
            </div>
        </Page>
    );
};

export default DeviceList;

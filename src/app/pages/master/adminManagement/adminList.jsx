import React, { useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Page } from "@/components/shared/Page";

const AdminList = () => {
    const [admins] = useState([
        { id: 1, name: 'Super Admin', email: 'admin@amrut.com', role: 'Master Admin', status: 'ACTIVE' }
    ]);

    const header = (
        <div className="flex flex-wrap items-center justify-between gap-4 py-2">
            <h2 className="m-0 text-2xl font-bold text-slate-800">Admin Management</h2>
        </div>
    );

    return (
        <Page title="Admin Management">
            <div className="bg-slate-50 min-h-screen">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <DataTable 
                        value={admins} 
                        header={header} 
                        className="p-datatable-sm"
                        stripedRows
                        responsiveLayout="stack" 
                        emptyMessage="No admins found."
                    >
                        <Column field="name" header="Name" className="font-medium text-slate-700"></Column>
                        <Column field="email" header="Email" className="font-medium text-slate-700"></Column>
                        <Column field="role" header="Role" className="font-medium text-slate-700"></Column>
                        <Column field="status" header="Status" className="font-medium text-slate-700"></Column>
                    </DataTable>
                </div>
            </div>
        </Page>
    );
};

export default AdminList;

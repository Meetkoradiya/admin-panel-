import React, { useState, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { ContextMenu } from 'primereact/contextmenu';
import { Toast } from 'primereact/toast';
import { Tag } from 'primereact/tag';
import { Page } from "@/components/shared/Page";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const BillingManagement = () => {
    const toast = useRef(null);
    const cm = useRef(null);
    const [selectedOrder, setSelectedOrder] = useState(null);

    // Sample Data
    const [orders] = useState([
        { id: 101, customer: "Suresh Patel", date: "2026-01-20", amount: 450, status: "PAID" },
        { id: 102, customer: "Ramesh Bhai", date: "2026-01-19", amount: 1200, status: "PENDING" },
        { id: 103, customer: "Meet Bhai", date: "2026-01-20", amount: 1750, status: "PAID" },

    ]);

    // PDF Download Function
    const exportSingleBill = (data) => {
        if (!data) return;

        try {
            const doc = new jsPDF('p', 'pt', 'a4');

            // 1. Header Design (Amrut Water Theme)
            doc.setFillColor(34, 190, 219); // Cyan header
            doc.rect(0, 0, 600, 80, 'F');
            
            doc.setFontSize(22);
            doc.setTextColor(255, 255, 255);
            doc.text("AMRUT WATER", 40, 45);
            
            doc.setFontSize(10);
            doc.text("Smart Water Management System", 40, 60);

            // 2. Invoice Details
            doc.setTextColor(40, 40, 40);
            doc.setFontSize(12);
            doc.setFont("helvetica", "bold");
            doc.text("INVOICE DETAILS", 40, 110);
            
            doc.setFont("helvetica", "normal");
            doc.setFontSize(10);
            doc.text(`Invoice No: INV-${data.id}`, 40, 130);
            doc.text(`Date: ${data.date}`, 40, 145);
            doc.text(`Customer: ${data.customer}`, 40, 160);
            doc.text(`Status: ${data.status}`, 40, 175);

            // 3. Table Data
            const tableColumn = ["Description", "Qty", "Rate", "Total"];
            const tableRows = [
                ["Water Delivery Service", "1", `Rs. ${data.amount}`, `Rs. ${data.amount}`]
            ];

            // FIX: Use autoTable(doc, options) instead of doc.autoTable
            autoTable(doc, {
                startY: 200,
                head: [tableColumn],
                body: tableRows,
                theme: 'grid',
                headStyles: { fillColor: [34, 190, 219], textColor: [255, 255, 255] },
                styles: { fontSize: 10, cellPadding: 8 }
            });

            // 4. Total Section
            const finalY = doc.lastAutoTable.finalY + 30;
            doc.setFontSize(14);
            doc.setFont("helvetica", "bold");
            doc.text(`Grand Total: Rs. ${data.amount}`, 380, finalY);

            // 5. Footer
            doc.setFontSize(10);
            doc.setFont("helvetica", "italic");
            doc.setTextColor(100);
            doc.text("Thank you for choosing Amrut Water services!", 300, finalY + 50, { align: "center" });

            // 6. Save File
            doc.save(`Invoice_${data.id}_${data.customer.replace(/\s+/g, '_')}.pdf`);

            toast.current.show({ 
                severity: 'success', 
                summary: 'Success', 
                detail: 'Bill Downloaded Successfully', 
                life: 3000 
            });

        } catch (err) {
            console.error("PDF Error:", err);
            toast.current.show({ 
                severity: 'error', 
                summary: 'Error', 
                detail: 'Could not generate PDF' 
            });
        }
    };

    // Context Menu Model
    const menuModel = [
        { 
            label: 'Download PDF Bill', 
            icon: 'pi pi-fw pi-file-pdf', 
            command: () => exportSingleBill(selectedOrder) 
        }
    ];

    // Status Template
    const statusBodyTemplate = (rowData) => {
        return (
            <Tag 
                value={rowData.status} 
                severity={rowData.status === 'PAID' ? 'success' : 'warning'} 
            />
        );
    };

    // Action Button Template
    const actionTemplate = (rowData) => {
        return (
            <Button 
                icon="pi pi-file-pdf" 
                className="p-button-rounded p-button-warning p-button-text" 
                onClick={() => exportSingleBill(rowData)} 
                tooltip="Download PDF"
            />
        );
    };

    return (
        <Page title="Billing History">
            <div className="card p-4">
                <Toast ref={toast} />
                
                {/* Context Menu for right-click */}
                <ContextMenu model={menuModel} ref={cm} onHide={() => setSelectedOrder(null)} />

                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">Billing History</h2>
                </div>

                <DataTable 
                    value={orders} 
                    onContextMenu={(e) => cm.current.show(e.originalEvent)} 
                    contextMenuSelection={selectedOrder} 
                    onContextMenuSelectionChange={(e) => setSelectedOrder(e.value)}
                    className="p-datatable-sm"
                >
                    <Column field="id" header="Order ID" />
                    <Column field="customer" header="Customer" />
                    <Column field="date" header="Date" />
                    <Column field="amount" header="Amount" />
                    <Column field="status" header="Status" body={statusBodyTemplate} />
                    <Column header="Action" body={actionTemplate} style={{ width: '80px' }} />
                </DataTable>
            </div>
        </Page>
    );
};

export default BillingManagement;
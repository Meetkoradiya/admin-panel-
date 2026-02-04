import React, { useState, useRef, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { Page } from "@/components/shared/Page";

const CustomerManagement = () => {
  const toast = useRef(null);

  // Load from localStorage
  const [customers, setCustomers] = useState(() => {
    const saved = localStorage.getItem("customer_list");
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: 1,
            name: "John Doe",
            email: "john@example.com",
            phone: "9876543210",
            address: "123 Street, NY",
          },
          {
            id: 2,
            name: "Jane Smith",
            email: "jane@example.com",
            phone: "8877665544",
            address: "456 Avenue, CA",
          },
        ];
  });

  const [customerDialog, setCustomerDialog] = useState(false);
  const [customer, setCustomer] = useState({
    id: null,
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem("customer_list", JSON.stringify(customers));
  }, [customers]);

  const openNew = () => {
    setCustomer({
      id: null,
      name: "",
      email: "",
      phone: "",
      address: "",
    });
    setCustomerDialog(true);
  };

  const saveCustomer = () => {
    if (!customer.name.trim()) return;

    let _customers = [...customers];

    if (customer.id) {
      // Update
      const index = _customers.findIndex((c) => c.id === customer.id);
      _customers[index] = customer;
      toast.current.show({
        severity: "success",
        summary: "Updated",
        detail: "Customer Updated",
        life: 3000,
      });
    } else {
      // Create
      const newCustomer = {
        ...customer,
        id: Math.floor(Math.random() * 100000),
      };
      _customers.push(newCustomer);
      toast.current.show({
        severity: "success",
        summary: "Created",
        detail: "Customer Added",
        life: 3000,
      });
    }

    setCustomers(_customers);
    setCustomerDialog(false);
  };

  const deleteCustomer = (id) => {
    const _customers = customers.filter((c) => c.id !== id);
    setCustomers(_customers);
    toast.current.show({
      severity: "warn",
      summary: "Deleted",
      detail: "Customer Removed",
      life: 3000,
    });
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <div className="flex gap-2 justify-center">
        <Button
          icon="pi pi-pencil"
          rounded
          outlined
          className="p-button-info"
          onClick={() => {
            setCustomer({ ...rowData });
            setCustomerDialog(true);
          }}
        />
        <Button
          icon="pi pi-trash"
          rounded
          outlined
          className="p-button-danger"
          onClick={() => deleteCustomer(rowData.id)}
        />
      </div>
    );
  };

  return (
    <Page title="Customer Management">
      <Toast ref={toast} />

      <div className="bg-white rounded-xl shadow border border-slate-200 p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-slate-800">
            Manage Customers
          </h2>
          <Button
            label="Add New"
            icon="pi pi-plus"
            className="p-button-info"
            onClick={openNew}
          />
        </div>

        {/* Table */}
        <DataTable
          value={customers}
          paginator
          rows={5}
          responsiveLayout="scroll"
          className="p-datatable-sm"
        >
          <Column
            header="#"
            body={(rowData, options) => options.rowIndex + 1}
            style={{ width: "60px" }}
          />
          <Column field="name" header="Name" sortable />
          <Column field="email" header="Email" sortable />
          <Column field="phone" header="Phone" />
          <Column field="address" header="Address" />
          <Column
            header="Actions"
            body={actionBodyTemplate}
            style={{ width: "150px", textAlign: "center" }}
          />
        </DataTable>
      </div>

      {/* Dialog */}
      <Dialog
        visible={customerDialog}
        style={{ width: "450px" }}
        header="Customer Details"
        modal
        onHide={() => setCustomerDialog(false)}
      >
        <div className="p-fluid">
          <div className="field mb-3">
            <label className="font-semibold">Name</label>
            <InputText
              value={customer.name}
              onChange={(e) =>
                setCustomer({ ...customer, name: e.target.value })
              }
            />
          </div>

          <div className="field mb-3">
            <label className="font-semibold">Email</label>
            <InputText
              value={customer.email}
              onChange={(e) =>
                setCustomer({ ...customer, email: e.target.value })
              }
            />
          </div>

          <div className="field mb-3">
            <label className="font-semibold">Phone</label>
            <InputText
              value={customer.phone}
              onChange={(e) =>
                setCustomer({ ...customer, phone: e.target.value })
              }
            />
          </div>

          <div className="field mb-3">
            <label className="font-semibold">Address</label>
            <InputText
              value={customer.address}
              onChange={(e) =>
                setCustomer({ ...customer, address: e.target.value })
              }
            />
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button
              label="Cancel"
              text
              onClick={() => setCustomerDialog(false)}
            />
            <Button label="Save" icon="pi pi-check" onClick={saveCustomer} />
          </div>
        </div>
      </Dialog>
    </Page>
  );
};

export default CustomerManagement;

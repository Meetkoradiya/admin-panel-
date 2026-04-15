import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
import { toast } from "sonner";
import axios from "axios";

import { Page } from "@/components/shared/Page";
import EmptyMessage from "@/components/shared/EmptyMessage";
import { Skeleton } from "primereact/skeleton";
import { Button } from "primereact/button";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Tag } from "primereact/tag";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";

const OrderList = () => {
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);
  const BASE_URL = import.meta.env.VITE_BACKEND_BASEURL;
  
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [globalFilter, setGlobalFilter] = useState("");
  
  const [generateDialog, setGenerateDialog] = useState(false);
  const [pendingCustomers, setPendingCustomers] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const blankRows = Array.from({ length: 15 }, (_, i) => ({ id: `skeleton-${i}` }));

 
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/orders/all`, {
          headers: { Authorization: `Bearer ${token}` }
      });
      console.log("Orders List API Response:", res.data);

      let dataArray = [];
      const responseData = res.data;
      
    
      if (Array.isArray(responseData)) {
        dataArray = responseData;
      } else if (responseData?.data) {
        if (Array.isArray(responseData.data)) dataArray = responseData.data;
        else if (Array.isArray(responseData.data.content)) dataArray = responseData.data.content;
      } else if (responseData?.content && Array.isArray(responseData.content)) {
        dataArray = responseData.content;
      }

      setOrders(dataArray);

      if(dataArray.length === 0) {
        toast.info("There are no orders in the system. The backend is returning 0 orders.");
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch orders from server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    
  }, []);

  const hasData = orders.length > 0;

  const openGenerateDialog = async () => {
    try {
      setIsGenerating(true);
      setGenerateDialog(true);
      
    
      const res = await axios.get(`${BASE_URL}/admin/customers`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      let allCust = [];
      if (Array.isArray(res.data)) allCust = res.data;
      else if (Array.isArray(res.data?.data)) allCust = res.data.data;
      else if (Array.isArray(res.data?.data?.content)) allCust = res.data.data.content;

      const activeCust = allCust.filter(c => c.status === 'ACTIVE');
      setPendingCustomers(activeCust);
    } catch (err) {
      toast.error('Could not fetch potential customers for order generation');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateOrders = async () => {
    if(!pendingCustomers || pendingCustomers.length === 0) {
      toast.error('No active customers to generate orders for!');
      return;
    }

    try {
      setIsGenerating(true);
      // Generate daily orders
      await axios.post(`${BASE_URL}/orders/generate`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success('Orders generated securely from backend!');
      setGenerateDialog(false);
      fetchOrders(); // Refresh table
    } catch (error) {
      toast.error('Failed to generate orders');
    } finally {
      setIsGenerating(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await axios.put(`${BASE_URL}/orders/status/${orderId}`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Order status updated successfully!");
      fetchOrders();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update status");
    }
  };

 
  const indexBodyTemplate = (_, { rowIndex }) => loading ? <Skeleton /> : <span>{rowIndex + 1}</span>;

  const orderTypeBodyTemplate = (rowData) => {
    if (loading) return <Skeleton width="100%" height="1.2rem" />;
    const isCustom = rowData.orderType === "CUSTOM";
    return (
      <Tag
        value={rowData.orderType || 'N/A'}
        style={{
          background: isCustom ? "linear-gradient(135deg, #FF9800 0%, #FF5722 100%)" : "linear-gradient(135deg, #7C3AED 0%, #A855F7 100%)",
          color: "#fff", borderRadius: "999px", padding: "4px 14px", fontSize: "12px", fontWeight: 600, border: "none",
        }}
      />
    );
  };

  const statusOptions = [
    { label: 'Created', value: 'CREATED' },
    { label: 'Assigned', value: 'ASSIGNED' },
    { label: 'In Transit', value: 'INTRANSIT' },
    { label: 'Delivered', value: 'DELIVERED' },
    { label: 'Modified', value: 'MODIFIED' },
  ];

  const statusBodyTemplate = (row) => {
    if (loading) return <Skeleton width="100%" height="1.2rem" />;
    return (
      <Dropdown
        value={row.status}
        options={statusOptions}
        onChange={(e) => updateOrderStatus(row.id, e.value)}
        className="w-full" style={{ minWidth: '130px' }}
      />
    );
  };

  const actionBodyTemplate = (row) => loading ? (
    <div className="flex gap-2">
      <Skeleton width="2rem" height="2rem" shape="circle" />
      <Skeleton width="2rem" height="2rem" shape="circle" />
    </div>
  ) : (
    <div className="flex gap-2">
      <Button
        icon="pi pi-pencil"
        rounded
        outlined
        severity="info"
        tooltip="Edit Customer"
        tooltipOptions={{ position: "top" }}
        onClick={(e) => {
          e.stopPropagation();
          navigate(`/admin/customers/edit/${row.customerId || row.userId}`);
        }}
        style={{ width: "2rem", height: "2rem" }}
      />
      <Button
        icon="pi pi-eye"
        rounded
        outlined
        severity="warning"
        tooltip="View Customer"
        tooltipOptions={{ position: "top" }}
        onClick={(e) => {
          e.stopPropagation();
          navigate(`/admin/customers/${row.customerId || row.userId || row.id}`);
        }}
        style={{ width: "2rem", height: "2rem" }}
      />
    </div>
  );

  const tableHeader = (
    <div className="flex items-center justify-between gap-4">
      <div>
        <IconField iconPosition="left">
          <InputIcon className="pi pi-search"> </InputIcon>
          <InputText
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Quick Search..."
          />
        </IconField>
      </div>
      <div>
        <Button
          label="Generate Orders"
          icon="pi pi-bolt"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold h-10 px-5 rounded-lg border-none shadow-sm"
          onClick={openGenerateDialog}
        ></Button>
      </div>
    </div>
  );

  const dialogFooter = (
    <div className="flex justify-end gap-3 mt-4 border-t pt-4 border-slate-100">
      <Button label="Cancel" icon="pi pi-times" onClick={() => setGenerateDialog(false)} className="p-button-text text-slate-500 rounded-lg px-4" disabled={isGenerating} />
      <Button label="Confirm & Generate" icon="pi pi-check" onClick={handleGenerateOrders} className="bg-blue-600 hover:bg-blue-700 border-none text-white rounded-lg px-6 font-bold shadow-sm" loading={isGenerating} />
    </div>
  );

  return (
    <Page title="Orders List">
      <main className="h-full">
        <div className="w-full h-full pb-0">
          <div className="flex h-full w-full">
            <div className="form-container vertical flex w-full flex-col justify-between">
              <div className="w-full">
                <div className="card">
                  <div className="w-full mb-4 flex items-center justify-between">
                    <h3 className="ml-1 text-xl font-bold">Order list</h3>
                    <div></div>
                  </div>
                  
                  <DataTable
                    header={tableHeader}
                    rowHover
                    rowClassName={() => "cursor-pointer"}
                    value={loading ? blankRows : orders}
                    paginator
                    rows={20}
                    rowsPerPageOptions={[10, 20, 50]}
                    paginatorTemplate=" FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
                    className="mt-4"
                    globalFilter={globalFilter}
                    globalFilterFields={["mobileNumber", "username", "driverName", "customerName", "status", "orderType"]}
                    emptyMessage={!hasData ? <EmptyMessage title="No Orders Found" subtitle="There are currently no generated orders in the system. Click 'Generate Orders' to schedule today's deliveries." /> : <EmptyMessage title="No Matching Orders" subtitle="No orders match your search criteria." />}
                  >
                    <Column header="No." body={indexBodyTemplate} style={{ width: "60px" }} />
                    <Column header="Order" body={(r) => loading ? <Skeleton width="100%" height="1.2rem" /> : <span>{r.id}</span>} />
                    <Column header="Customer" body={(r) => loading ? <Skeleton width="100%" height="1.2rem" /> : <span>{r.customerName}</span>} />
                    <Column header="Driver" body={(r) => loading ? <Skeleton width="100%" height="1.2rem" /> : <span>{r.driverName}</span>} />
                    <Column field="orderType" header="Order Type" body={orderTypeBodyTemplate} />
                    <Column field="orderDate" header="Date" body={(r) => loading ? <Skeleton width="100%" height="1.2rem" /> : <span>{dayjs(r.orderDate).format("DD MMM YYYY")}</span>} />
                    <Column header="Created at" body={(r) => loading ? <Skeleton width="100%" height="1.2rem" /> : <span>{dayjs(r.createdAt).format("DD MMM YYYY, hh:mm A")}</span>} />
                    <Column header="Status" field="status" sortable body={statusBodyTemplate} />
                    <Column header="Actions" body={actionBodyTemplate} style={{ width: "140px" }} />
                  </DataTable>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Dialog visible={generateDialog} maximized={true} style={{ width: '90vw' }} header="Review Daily Subscriptions" modal className="p-fluid" footer={dialogFooter} onHide={() => setGenerateDialog(false)}>
          <div className="mb-4">
            <p className="text-slate-500 font-medium my-2">
              Review the following active customers. Clicking confirm will batch-process these payloads into today&apos;s deliveries.
            </p>
          </div>
          <div className="border border-slate-200 rounded-xl overflow-hidden mt-4 shadow-sm bg-white">
            <DataTable value={isGenerating ? [] : pendingCustomers} loading={isGenerating} scrollable scrollHeight="400px" stripedRows className="p-datatable-sm" emptyMessage="Fetching active route subscribers...">
              <Column field="username" header="Customer Name" headerClassName="bg-slate-50 text-slate-700" className="font-semibold text-slate-800" />
              <Column field="mobileNumber" header="Mobile" headerClassName="bg-slate-50 text-slate-700" />
              <Column field="deliveryType" header="Schedule" headerClassName="bg-slate-50 text-slate-700" body={(r) => <Tag value={r.deliveryType} className="bg-amber-100 text-amber-700 rounded-full px-3 text-xs font-bold" />} />
            </DataTable>
          </div>
        </Dialog>
      </main>
    </Page>
  );
};
export default OrderList;
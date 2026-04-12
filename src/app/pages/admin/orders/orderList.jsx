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

  const blankRows = Array.from({ length: 15 }, (_, i) => ({
    id: `skeleton-${i}`,
    mobileNumber: "",
    username: "",
    createdAt: "",
    status: "",
  }));

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/orders/all`, {
          headers: { Authorization: `Bearer ${token}` }
      });
      const dataArray = Array.isArray(res.data) ? res.data : (Array.isArray(res.data?.data) ? res.data.data : []);
      setOrders(dataArray);
    } catch (error) {
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to fetch orders' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const hasData = orders.length > 0;

  const emptyMessage = !hasData ? (
    <EmptyMessage
      title="No Orders Found"
      subtitle="There are currently no generated orders in the system. Click 'Generate Orders' to schedule today's active route deliveries."
    />
  ) : (
    <EmptyMessage
      title="No Matching Orders"
      subtitle="No orders match your search criteria. Try adjusting the filters or clearing the search."
    />
  );

  const openGenerateDialog = async () => {
    try {
      setGenerateDialog(true);
      setIsGenerating(true);
      // Fetch active customers for preview
      const res = await axios.get(`${BASE_URL}/admin/customers`, {
          headers: { Authorization: `Bearer ${token}` }
      });
      const allCust = Array.isArray(res.data) ? res.data : (res.data?.data || []);
      const activeCust = allCust.filter(c => c.status === 'ACTIVE');
      setPendingCustomers(activeCust);
    } catch (err) {
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Could not fetch potential customers for generation' });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateOrders = async () => {
    if(!pendingCustomers || pendingCustomers.length === 0) {
        toast.current?.show({ severity: 'warn', summary: 'Warning', detail: 'No active customers to generate orders for.' });
        return;
    }

    try {
      setIsGenerating(true);
      // Backend automatically generates orders for today's subscriptions
      await axios.post(`${BASE_URL}/orders/generate`, {}, {
          headers: { Authorization: `Bearer ${token}` }
      });

      toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Orders generated successfully' });
      setGenerateDialog(false);
      fetchOrders();
    } catch (error) {
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to generate orders' });
    } finally {
      setIsGenerating(false);
    }
  };

  // Delete Order
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/orders/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Order deleted");
      fetchOrders();
    } catch {
      toast.error("Delete failed");
    }
  };

  const indexBodyTemplate = (_, { rowIndex }) => {
    return loading ? <Skeleton /> : <span>{rowIndex + 1}</span>;
  };

  const orderTypeBodyTemplate = (rowData) => {
    if (loading) {
      return <Skeleton width="100%" height="1.2rem" />;
    }

    const isAssigned = rowData.orderType === "DAILY";

    return (
      <Tag
        value={rowData.orderType}
        style={{
          background: isAssigned
            ? "linear-gradient(135deg, #7C3AED 0%, #A855F7 100%)"
            : "linear-gradient(135deg, #EF4444 0%, #F97316 100%)",
          color: "#fff",
          borderRadius: "999px",
          padding: "4px 14px",
          fontSize: "12px",
          fontWeight: 600,
          border: "none",
        }}
      />
    );
  };

  const orderTemplate = (rowData) => {
    return loading ? (
      <Skeleton width="100%" height="1.2rem" />
    ) : (
      <span>{rowData.id}</span>
    );
  };

  const dateBodyTemplate = (rowData) => {
    return loading ? (
      <Skeleton width="100%" height="1.2rem" />
    ) : (
      <span>{dayjs(rowData.orderDate).format("DD MMM YYYY")}</span>
    );
  };

  const customerBodyTemplate = (rowData) => {
    return loading ? (
      <Skeleton width="100%" height="1.2rem" />
    ) : (
      <span>{rowData.customerName}</span>
    );
  };

  const userNameBodyTemplate = (rowData) => {
    return loading ? (
      <Skeleton width="100%" height="1.2rem" />
    ) : (
      <span>{rowData.driverName}</span>
    );
  };

  const addressBodyTemplate = (rowData) => {
    return loading ? (
      <Skeleton width="100%" height="1.2rem" />
    ) : (
      <span>{rowData.address}</span>
    );
  };

  const deliveryTypeBodyTemplate = (rowData) => {
    return loading ? (
      <Skeleton width="100%" height="1.2rem" />
    ) : (
      <span>{rowData.deliveryType}</span>
    );
  };

  const createdAtBodyTemplate = (rowData) => {
    return loading ? (
      <Skeleton width="100%" height="1.2rem" />
    ) : (
      <span>{dayjs(rowData.createdAt).format("DD MMM YYYY, hh:mm A")}</span>
    );
  };

  const statusBodyTemplate = (row) => {
  if (loading) {
    return <Skeleton width="100%" height="1.2rem" />;
  }

  const statusStyles = {
    CREATED: "bg-blue-300 text-gray-900",
    IN_PROGRESS: "bg-yellow-300 text-gray-900",
    DELIVERED: "bg-emerald-300 text-gray-900",
  };

  return (
    <span
      className={`rounded-lg px-2 py-1 text-xs ${
        statusStyles[row.status] || "bg-gray-200"
      }`}
    >
      {row.status}
    </span>
  );
};

  const actionBodyTemplate = (row) => {
    return loading ? (
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
          severity="Info"
          tooltip="Edit"
          tooltipOptions={{ position: "top" }}
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/admin/customers/edit/${row.userId}`);
          }}
          style={{ width: "2rem", height: "2rem" }}
        />
        <Button
          icon="pi pi-eye"
          rounded
          outlined
          severity="warning"
          tooltip="View"
          tooltipOptions={{ position: "top" }}
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/admin/orders/${row.userId}`);
          }}
          style={{ width: "2rem", height: "2rem" }}
        />
      </div>
    );
  };

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
          <Button label="Cancel" icon="pi pi-times" onClick={() => setGenerateDialog(false)} className="p-button-text text-slate-500 hover:bg-slate-50 rounded-lg px-4" disabled={isGenerating} />
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
                    globalFilterFields={["mobileNumber", "username", "driverName", "customerName"]}
                    emptyMessage={emptyMessage}
                    dataKey="id"
                    onRowClick={(e) => {
                      if (!loading) {
                        navigate(`/admin/orders/${e.data.customerId || e.data.userId || e.data.id}`);
                      }
                    }}
                  >
                    <Column
                      header="No."
                      body={indexBodyTemplate}
                      style={{ width: "60px" }}
                    />

                    <Column header="Order" body={orderTemplate} />

                    <Column header="Customer" body={customerBodyTemplate} />
                    <Column header="Driver" body={userNameBodyTemplate} />

                    <Column
                      field="orderType"
                      header="Order Type"
                      body={orderTypeBodyTemplate}
                    />

                    <Column
                      field="orderDate"
                      header="Date"
                      body={dateBodyTemplate}
                    />

                    <Column header="Created at" body={createdAtBodyTemplate} />

                    <Column
                      header="Status"
                      field="status"
                      sortable
                      body={statusBodyTemplate}
                    />

                    <Column
                      header="Actions"
                      body={actionBodyTemplate}
                      style={{ width: "140px" }}
                    />
                  </DataTable>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Generate Orders Preview Dialog */}
        <Dialog 
            visible={generateDialog} 
            maximized={true}
            style={{ width: '90vw' }} 
            header="Review Daily Subscriptions" 
            modal 
            className="p-fluid" 
            footer={dialogFooter} 
            onHide={() => setGenerateDialog(false)}
        >
            <div className="mb-4">
                <p className="text-slate-500 font-medium text-sm">
                    Review the following {pendingCustomers.length} active customer profiles. Clicking confirm will batch-process these payloads into today&apos;s active delivery orders securely.
                </p>
            </div>
            
            <div className="border border-slate-200 rounded-xl overflow-hidden mt-4 shadow-sm bg-white">
                <DataTable 
                    value={isGenerating ? [] : pendingCustomers} 
                    loading={isGenerating} 
                    scrollable 
                    scrollHeight="400px" 
                    className="p-datatable-sm" 
                    stripedRows
                    emptyMessage="Fetching active route subscribers..."
                >
                    <Column field="username" header="Customer Name" headerClassName="bg-slate-50 text-slate-700" className="font-semibold text-slate-800"></Column>
                    <Column field="mobileNumber" header="Mobile" headerClassName="bg-slate-50 text-slate-700"></Column>
                    <Column field="deliveryType" header="Schedule" headerClassName="bg-slate-50 text-slate-700" body={(row) => <Tag value={row.deliveryType} className="bg-amber-100 text-amber-700 rounded-full px-3 text-xs font-bold" />}></Column>
                </DataTable>
            </div>
        </Dialog>
      </main>
    </Page>
  );
};

export default OrderList;
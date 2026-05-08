import React, { useEffect, useState, useRef, useCallback } from "react";
import dayjs from "dayjs";
import Button from "@/components/ui/Button";
import { useNavigate, useParams } from "react-router-dom";
import { Skeleton } from "primereact/skeleton";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Avatar } from "primereact/avatar";
import { useSelector } from "react-redux";
import { Page } from "@/components/shared/Page";
import StatusTag from "@/components/shared/StatusTag";
import useApi from "@/hooks/useApi";
import { showConfirmDialog } from "@/utils/confirmUtils";

const CustomerDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useRef(null);

  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [orders, setOrders] = useState([]);

  const { apiGet, apiDelete } = useApi();

  const fetchCustomer = useCallback(async () => {
    try {
      setLoading(true);
      const res = await apiGet(`/admin/customers/by-user/${id}`);
      setCustomer(res?.data || res);
    } catch (error) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to load customer",
      });
    } finally {
      setLoading(false);
    }
  }, [id, apiGet]);

  const fetchOrders = useCallback(async () => {
    try {
      setLoadingOrders(true);
      const res = await apiGet(`/orders/customer/${id}`);
      const data = res?.data || res || [];
      setOrders(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Orders fetch failed");
    } finally {
      setLoadingOrders(false);
    }
  }, [id, apiGet]);

  useEffect(() => {
    if (!id) return;
    fetchCustomer();
    fetchOrders();
  }, [id, fetchCustomer, fetchOrders]);



  const handleDelete = async () => {
    showConfirmDialog({
      title: 'Delete Customer',
      message: 'Permanently delete this customer? This action cannot be undone.',
      acceptLabel: 'Delete',
      onAccept: async () => {
        try {
          await apiDelete(`/admin/users/${id}`);

          toast.current?.show({
            severity: "success",
            summary: "Deleted",
            detail: "Customer removed successfully",
          });

          setTimeout(() => {
            navigate("/admin/customers");
          }, 1000);
        } catch (error) {
          toast.current?.show({
            severity: "error",
            summary: "Error",
            detail: "Delete failed",
          });
        }
      }
    });
  };

  const statusBodyTemplate = (rowData) => {
    return <StatusTag status={rowData.status || "PENDING"} />;
  };

  const totalSpend = orders.reduce(
    (sum, item) => sum + (item.price || 0),
    0
  );

  const totalUnits = orders.reduce(
    (sum, item) => sum + (item.qty || 0),
    0
  );

  return (
    <Page title="Customer Insights">
      <Toast ref={toast} />

      <div className="grid grid-cols-1 gap-8 pb-20 lg:grid-cols-4">
        {/* LEFT SIDE */}
        <div className="flex flex-col gap-8 lg:col-span-1">
          <div className="flex flex-col items-center rounded-3xl border border-slate-100 bg-white p-8 text-center shadow-sm">
            {loading ? (
              <Skeleton
                shape="circle"
                size="6rem"
                className="mb-4"
              />
            ) : (
              <Avatar
                label={customer?.username?.charAt(0) || "U"}
                size="xlarge"
                className="mb-6 h-24 w-24 rounded-3xl bg-blue-50 text-4xl font-bold text-blue-500"
              />
            )}

            <h2 className="text-xl font-bold text-slate-800">
              {loading ? (
                <Skeleton width="8rem" height="1.5rem" />
              ) : (
                customer?.username || "N/A"
              )}
            </h2>

            <p className="mt-1 text-xs font-semibold uppercase tracking-widest text-slate-400">
              {loading ? (
                <Skeleton width="5rem" height="1rem" />
              ) : (
                `UID: ${id}`
              )}
            </p>

            {/* FIXED ERROR */}
            <div className="my-8 h-px w-full bg-slate-100" />

            <div className="flex w-full flex-col gap-5 text-left">
              <DetailRow
                label="Mobile"
                value={customer?.mobileNumber}
                icon="pi pi-phone"
                loading={loading}
              />

              <DetailRow
                label="Location"
                value={customer?.address}
                icon="pi pi-map-marker"
                loading={loading}
              />

              <DetailRow
                label="Type"
                value={customer?.deliveryType}
                icon="pi pi-truck"
                loading={loading}
              />

              <DetailRow
                label="Status"
                value={customer?.status || "ACTIVE"}
                isTag
                loading={loading}
              />
            </div>

            <div className="mt-10 flex w-full flex-col gap-3 border-t border-slate-100 pt-10">
              <Button
                label="Edit Profile"
                icon="pi pi-pencil"
                onClick={() =>
                  navigate(`/admin/customers/edit/${id}`)
                }
                variant="secondary"
                className="h-12 w-full"
              />

              <Button
                label="Delete"
                icon="pi pi-trash"
                onClick={handleDelete}
                variant="ghost"
                className="h-12 w-full text-rose-500 hover:bg-rose-50"
              />
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex flex-col gap-8 lg:col-span-3">
          {/* STATS */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <StatCard
              label="Monthly Spend"
              value={`â‚¹${totalSpend.toLocaleString()}`}
              icon="pi pi-wallet"
              color="text-emerald-500"
              bg="bg-emerald-50"
            />

            <StatCard
              label="Total Units"
              value={totalUnits}
              icon="pi pi-box"
              color="text-blue-500"
              bg="bg-blue-50"
            />

            <StatCard
              label="Order Count"
              value={orders.length}
              icon="pi pi-shopping-cart"
              color="text-violet-500"
              bg="bg-violet-50"
            />
          </div>

          {/* TABLE */}
          <div className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 px-8 py-8">
              <h3 className="text-lg font-bold text-slate-800">
                Order Timeline
              </h3>

              <Button
                icon="pi pi-refresh"
                variant="icon"
                size="sm"
                onClick={fetchOrders}
                className="text-slate-400"
              />
            </div>

            <DataTable
              value={orders}
              loading={loadingOrders}
              paginator
              rows={10}
              responsiveLayout="scroll"
              emptyMessage="No historical orders found"
            >
              <Column
                field="id"
                header="Order ID"
                body={(row) => (
                  <span className="text-xs font-bold text-blue-500">
                    #{row.id}
                  </span>
                )}
              />

              <Column
                field="orderDate"
                header="Date"
                sortable
                body={(row) => (
                  <span className="text-sm font-medium text-slate-500">
                    {dayjs(row.orderDate).format(
                      "DD MMM YYYY"
                    )}
                  </span>
                )}
              />

              <Column field="qty" header="Units" />

              <Column
                field="price"
                header="Value"
                sortable
                body={(row) => (
                  <span className="font-bold">
                    â‚¹{row.price?.toLocaleString()}
                  </span>
                )}
              />

              <Column
                field="status"
                header="Status"
                body={statusBodyTemplate}
              />
            </DataTable>
          </div>
        </div>
      </div>
    </Page>
  );
};

const DetailRow = ({
  label,
  value,
  icon,
  isTag,
  loading,
}) => {
  return (
    <div className="flex flex-col gap-1">
      <span className="ml-1 text-xs font-semibold uppercase tracking-widest text-slate-400">
        {label}
      </span>

      {loading ? (
        <Skeleton width="80%" height="1.2rem" />
      ) : isTag ? (
        <div className="mt-1">
          <StatusTag status={value || "ACTIVE"} />
        </div>
      ) : (
        <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
          {icon && (
            <i className={`${icon} text-xs text-blue-400`} />
          )}
          <span className="truncate">
            {value || "Not set"}
          </span>
        </div>
      )}
    </div>
  );
};

const StatCard = ({
  label,
  value,
  icon,
  color,
  bg,
}) => {
  return (
    <div className="group flex items-center gap-5 rounded-3xl border border-slate-50 bg-white p-6 shadow-sm transition-all hover:shadow-md">
      <div
        className={`flex h-14 w-14 items-center justify-center rounded-2xl text-xl transition-transform group-hover:scale-110 ${bg} ${color}`}
      >
        <i className={icon} />
      </div>

      <div className="flex flex-col">
        <span className="mb-1 text-xs font-semibold uppercase tracking-widest text-slate-400">
          {label}
        </span>

        <span className="text-xl font-bold text-slate-800">
          {value}
        </span>
      </div>
    </div>
  );
};

export default CustomerDetail;


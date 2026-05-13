import React, { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { toast } from "sonner";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import useApi from "@/hooks/useApi";
import ListLayout from "@/components/shared/ListLayout";
import ActionButtons from "@/components/shared/ActionButtons";
import StatusTag from "@/components/shared/StatusTag";

const OrderList = () => {
  const navigate = useNavigate();
  const { apiGet, apiPost, apiDelete } = useApi();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [globalFilter, setGlobalFilter] = useState("");
  const toastRef = useRef(null);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const res = await apiGet("/orders/all");
      setOrders(res.data || []);
    } catch (error) {
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  }, [apiGet]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleGenerateOrders = async () => {
    try {
      await apiPost("/orders/generate");
      toast.success("Orders generated successfully");
      fetchOrders();
    } catch (error) {
      toast.error("Failed to generate orders");
    }
  };

  const deleteOrder = async (rowData) => {
    try {
      await apiDelete(`/admin/orders/${rowData.id}`);
      toast.success("Order deleted");
      fetchOrders();
    } catch {
      toast.error("Delete failed");
    }
  };

  const stats = {
    total: orders.length,
    delivered: orders.filter(o => o.status === "DELIVERED").length,
    pending: orders.filter(o => o.status !== "DELIVERED").length
  };

  const statsConfig = [
    { label: 'Total Orders', value: stats.total, sub: 'Lifetime volume', icon: 'pi-shopping-bag', iconColor: 'text-indigo-500', bg: 'bg-indigo-50' },
    { label: 'Delivered', value: stats.delivered, sub: 'Success fulfillment', icon: 'pi-check-circle', iconColor: 'text-emerald-500', bg: 'bg-emerald-50' },
    { label: 'In Transit', value: stats.pending, sub: 'Active deliveries', icon: 'pi-truck', iconColor: 'text-amber-500', bg: 'bg-amber-50' },
  ];

  const formatDate = (date) => {
    return dayjs(date).format("DD MMM YYYY, hh:mm A");
  };

  return (
    <div className="animate-fade-in">
      <Toast ref={toastRef} />

      <ListLayout
        title="Order"
        data={orders}
        loading={loading}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        extraActions={
          <button 
            onClick={handleGenerateOrders}
            className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold transition-all shadow-md flex items-center justify-center gap-2 uppercase tracking-wide"
          >
            Generate Orders
          </button>
        }
      >
        <Column 
          field="no" 
          header="No." 
          body={(_, opts) => <span className="text-slate-400 font-semibold text-[11px]">{opts.rowIndex + 1}</span>} 
          style={{ width: '5rem' }} 
        />

        <Column 
          header="Order" 
          body={(row) => <span className="font-bold text-slate-800 text-[13px] tracking-tight">{row.id}</span>} 
        />

        <Column 
          header="CUSTOMER" 
          body={(row) => (
            <div className="flex flex-col gap-0.5">
              <span className="font-bold text-slate-800 text-[14px]">{row.customerName}</span>
              <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">{row.deliveryType}</span>
            </div>
          )} 
        />

        <Column 
          header="DRIVER" 
          body={(row) => <span className="text-slate-600 font-bold text-xs tracking-tight">{row.driverName || 'Unassigned'}</span>} 
        />

        <Column 
          header="ORDER TYPE" 
          body={(row) => (
            <span className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${
              row.orderType === 'DAILY' ? 'bg-purple-50 text-purple-600 border-purple-100' : 'bg-orange-50 text-orange-600 border-orange-100'
            }`}>
              {row.orderType}
            </span>
          )} 
        />

        <Column 
          header="STATUS" 
          body={(row) => <StatusTag status={row.status} />} 
          style={{ width: '12rem' }} 
        />

        <Column 
          header="CREATED AT" 
          body={(row) => (
            <span className="text-slate-500 text-[11px] font-bold tracking-tight whitespace-nowrap">
              {formatDate(row.createdAt)}
            </span>
          )} 
          style={{ width: '12rem' }} 
        />

        <Column 
          header="ACTIONS" 
          body={(row) => (
            <ActionButtons 
              onDelete={() => deleteOrder(row)}
              onView={() => navigate(`/admin/orders/${row.id}`)}
            />
          )} 
          style={{ width: '10rem' }} 
        />
      </ListLayout>
    </div>
  );
};

export default OrderList;


import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import { Button } from "primereact/button";
import { CheckSquareIcon, ShoppingCart } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { Skeleton } from "primereact/skeleton";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Tag } from "primereact/tag";
import axios from "axios";
import { useSelector } from "react-redux";
import { FiCopy } from "react-icons/fi";
import { Page } from "@/components/shared/Page";
import EmptyMessage from "@/components/shared/EmptyMessage";

const CustomerDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [orders, setOrders] = useState([]);
  
  const token = useSelector((state) => state.auth.token);
  const BASE_URL = import.meta.env.VITE_BACKEND_BASEURL;

  const blankRows = Array.from({ length: 5 }, (_, i) => ({
    id: i,
    orderDate: "",
    qty: "",
    price: "",
    driverName: "",
    status: "",
  }));

  useEffect(() => {
    if (!id) {
      setFormData({});
      return;
    }

    const fetchCustomerById = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${BASE_URL}/admin/customers/by-user/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        setFormData(response?.data?.data || response?.data);
      } catch {
        toast.error("Failed to fetch details");
      } finally {
        setLoading(false);
      }
    };

    const fetchCustomerOrders = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${BASE_URL}/orders/customer/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        
        let dataArray = [];
        if (Array.isArray(res.data)) {
          dataArray = res.data;
        } else if (res.data?.data) {
          if (Array.isArray(res.data.data)) dataArray = res.data.data;
          else if (Array.isArray(res.data.data.content)) dataArray = res.data.data.content;
          else if (typeof res.data.data === 'object') {
            const possibleArray = Object.values(res.data.data).find(Array.isArray);
            if (possibleArray) dataArray = possibleArray;
          }
        }
        setOrders(dataArray);
      } catch {
        toast.error("Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    };

    fetchCustomerOrders();
    fetchCustomerById();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleCopy = async () => {
    if (!formData?.mobileNumber) return;

    await navigator.clipboard.writeText(formData.mobileNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 10000);
  };

  const orderTypeBodyTemplate = (rowData) => {
    if (loading) return <Skeleton width="100%" height="1.2rem" />;
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

  const orderTemplate = (rowData) => loading ? <Skeleton width="100%" height="1.2rem" /> : <span>{rowData.id}</span>;
  const dateBodyTemplate = (rowData) => loading ? <Skeleton width="100%" height="1.2rem" /> : <span>{dayjs(rowData.orderDate).format("DD MMM YYYY")}</span>;
  const userNameBodyTemplate = (rowData) => loading ? <Skeleton width="100%" height="1.2rem" /> : <span>{rowData.driverName}</span>;
  const qtyBodyTemplate = (rowData) => loading ? <Skeleton width="100%" height="1.2rem" /> : <span>{rowData.qty}</span>;
  
  const totalBodyTemplate = (rowData) => {
    return loading ? <Skeleton width="100%" height="1.2rem" /> : (
      <span>{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(rowData.price || 0)}</span>
    );
  };

  const statusBodyTemplate = (row) => {
    if (loading) return <Skeleton width="100%" height="1.2rem" />;
    const statusStyles = {
      CREATED: "bg-blue-300 text-gray-900",
      IN_PROGRESS: "bg-yellow-300 text-gray-900",
      DELIVERED: "bg-emerald-300 text-gray-900",
    };
    return (
      <span className={`rounded-lg px-2 py-1 text-xs ${statusStyles[row.status] || "bg-gray-200"}`}>
        {row.status}
      </span>
    );
  };

  return (
    <Page title="Customer Details">
      <main className="h-full">
        <div className="w-full h-full pb-0">
          <div className="flex h-full w-full">
            <div className="form-container vertical flex w-full flex-col justify-between">
              <div className="w-full">
                <div className="flex flex-col gap-4 xl:flex-row">
                  <div className="min-w-330px 2xl:min-w-400px">
                    <div className="card card-border w-full">
                      {loading ? (
                        <>
                          <div className="flex items-center gap-3">
                            <Skeleton shape="circle" size="6rem" />
                            <div className="flex w-full flex-col gap-2">
                              <Skeleton width="50%" height="1rem" />
                              <Skeleton width="90%" height="0.7rem" />
                              <Skeleton width="40%" height="0.6rem" />
                            </div>
                          </div>
                          <hr className="my-4" />
                          <div className="flex flex-col gap-5">
                            <Skeleton width="70%" height="1rem" />
                            <Skeleton width="60%" height="1rem" />
                          </div>
                        </>
                      ) : (
                        <div className="flex flex-col px-1">
                          <div className="flex items-center gap-3">
                            <div className="h-14 w-14 shrink-0">
                              <img src="/images/avatar.jpg" alt="Avatar" className="h-full w-full rounded-full object-cover" />
                            </div>
                            <div className="flex flex-col">
                              <p className="flex items-center gap-2 text-lg font-bold">
                                {formData.username || 'N/A'}
                                <span className={`w-fit rounded-full px-4 py-0.5 text-xs font-semibold ${formData.status === "ACTIVE" ? "bg-emerald-200 text-gray-900" : "bg-red-200 text-gray-900"}`}>
                                  {formData.status ? "Active" : "Blocked"}
                                </span>
                              </p>
                              <span className="text-sm text-gray-600">{formData.address || 'No Address Provided'}</span>
                            </div>
                          </div>
                          <hr className="my-4" />

                          <div className="mb-6 flex flex-col gap-y-4">
                            <div className="flex flex-row items-center justify-between">
                              <span className="text-sm text-gray-500">Phone :</span>
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-semibold">{formData.mobileNumber}</span>
                                <button onClick={handleCopy} className="text-gray-500 transition hover:text-gray-700">
                                  {copied ? <CheckSquareIcon size={16} color="#008236" /> : <FiCopy size={16} />}
                                </button>
                              </div>
                            </div>
                            
                            <div className="flex flex-row items-center justify-between">
                                <span className="text-sm text-gray-500">Delivery Type :</span>
                                <span className="text-sm font-semibold">{formData.deliveryType}</span>
                            </div>

                            <div className="flex flex-row items-center justify-between">
                                <span className="text-sm text-gray-500">Quantity:</span>
                                <span className="text-sm font-semibold">{formData.defaultQty || formData.qty || 0} items/day</span>
                            </div>

                            <div className="flex flex-row items-center justify-between">
                                <span className="text-sm text-gray-500">Price Per Bottle :</span>
                                <span className="text-sm font-semibold">₹ {formData.pricePerBottle || formData.price || 0}</span>
                            </div>

                            <div className="flex flex-row items-center justify-between">
                                <span className="text-sm text-gray-500">Deposit :</span>
                                <span className="text-sm font-semibold">₹ {formData.deposit || 0}</span>
                            </div>
                          </div>

                          <div className="flex flex-col gap-4">
                            <Button className="h-11 w-full" label="Edit Customer" size="small" onClick={() => navigate(`/admin/customers/edit/${id}`)} />
                            <Button className="h-11 w-full" severity="danger" outlined label="Delete Customer" size="small" />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="card card-border w-full">
                    <div className="mb-3 flex items-start gap-3">
                      <span className="flex items-center justify-center rounded-md bg-blue-200 p-2">
                        <ShoppingCart size={18} />
                      </span>
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold">Total Orders</span>
                        <span className="text-xs text-gray-500">Total orders placed by this customer</span>
                      </div>
                    </div>
                    
                    <DataTable
                        value={loading ? blankRows : orders}
                        paginator
                        rows={20}
                        rowsPerPageOptions={[10, 20, 50]}
                        paginatorTemplate=" FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
                        emptyMessage={<EmptyMessage title="No Orders Found" subtitle="This customer has not placed any orders yet." />}
                        className="border"
                    >
                        <Column header="Order" body={orderTemplate} />
                        <Column field="orderDate" header="Date" body={dateBodyTemplate} />
                        <Column field="qty" header="Quantity" body={qtyBodyTemplate} />
                        <Column field="price" header="Total" body={totalBodyTemplate} />
                        <Column header="Driver" body={userNameBodyTemplate} />
                        <Column header="Status" field="status" sortable body={statusBodyTemplate} />
                    </DataTable>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </Page>
  );
};

export default CustomerDetail;

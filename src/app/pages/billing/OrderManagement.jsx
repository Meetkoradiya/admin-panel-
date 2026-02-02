import React, { useState, useRef, useMemo } from "react";
import { OrderList } from "primereact/orderlist";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Card } from "primereact/card";
import { Badge } from "primereact/badge";
import { Page } from "@/components/shared/Page";

const OrderManagement = () => {
    const toastRef = useRef(null);

    const [orderItems, setOrderItems] = useState([
        { id: 1, name: "Plastic Crate (Blue)", price: 350, category: "Equipment" },
        { id: 2, name: "Mineral Water Bottle 1L", price: 20, category: "Beverage" },
        { id: 3, name: "Water Can 20L", price: 30, category: "Beverage" }
    ]);

    const totalAmount = useMemo(
        () => orderItems.reduce((sum, item) => sum + item.price, 0),
        [orderItems]
    );

    const removeItem = (id) => {
        setOrderItems(orderItems.filter(item => item.id !== id));
    };

    const placeOrder = () => {
        toastRef.current.show({
            severity: "success",
            summary: "Order Placed",
            detail: `Grand Total ₹${totalAmount}`,
            life: 3000
        });
    };

    const renderItem = (item) => (
        <div className="order-item">
            <div className="order-left">
                <i className="pi pi-bars drag-icon" />
                <div>
                    <div className="order-title">
                        {item.name}
                        <Badge value={item.category} severity="info" />
                    </div>
                    <span className="order-price">₹{item.price}</span>
                </div>
            </div>

            <Button
                icon="pi pi-trash"
                className="p-button-text p-button-danger"
                onClick={() => removeItem(item.id)}
            />
        </div>
    );

    return (
        <Page title="Create Order" fullWidth>
            <Toast ref={toastRef} />

            <style>
                {`
                /* Target the main page container to remove empty left space */
                .page-content, .page-wrapper {
                    padding-left: 0 !important;
                    margin-left: 0 !important;
                }

                /* Ensure the order card aligns strictly to the left */
                .left-aligned-container {
                    justify-content: flex-start !important;
                    display: flex;
                    width: 100%;
                }

                .order-card {
                    border-radius: 14px;
                    width: 100%;
                    max-width: 900px; /* Adjust this to control how wide the card is */
                }

                .order-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 1.2rem 1.5rem;
                    border-bottom: 1px solid var(--surface-border);
                }

                .order-left {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                }

                .drag-icon {
                    font-size: 1.1rem;
                    color: #607d8b;
                    cursor: move;
                }

                .order-title {
                    display: flex;
                    align-items: center;
                    gap: 0.6rem;
                    font-weight: 600;
                    color: #1f2937;
                }

                .order-price {
                    color: #6b7280;
                    font-weight: 500;
                }

                .order-summary {
                    background: #f9fafb;
                    padding: 1.8rem;
                    border-radius: 12px;
                    margin-top: 2rem;
                }

                .order-summary-row {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 0.8rem;
                }

                .order-total {
                    font-size: 2rem;
                    font-weight: 700;
                    color: #111827;
                }

                .order-actions {
                    display: flex;
                    gap: 1rem;
                    margin-top: 1.8rem;
                }

                /* Align the reorder buttons to the left of the list */
                .p-orderlist-controls {
                    padding-right: 1rem !important;
                }
                `}
            </style>

            <div className="left-aligned-container">
                <div className="grid m-0 w-full">
                    <div className="col-12 md:col-10 lg:col-8 p-0"> 
                        <Card className="order-card shadow-1">

                            {/* HEADER */}
                            <div className="mb-4">
                                <h2 className="text-3xl font-bold m-0 flex align-items-center">
                                    Create Order <i className="pi pi-shopping-cart ml-2" />
                                </h2>
                                <p className="text-600 mt-2">
                                    Arrange products and confirm order
                                </p>
                            </div>

                            {/* ORDER LIST */}
                            <OrderList
                                value={orderItems}
                                onChange={(e) => setOrderItems(e.value)}
                                itemTemplate={renderItem}
                                dragdrop
                                listStyle={{ minHeight: "280px" }}
                            />

                            {/* SUMMARY */}
                            <div className="order-summary">
                                <div className="order-summary-row">
                                    <span className="text-lg">Total Items</span>
                                    <strong className="text-lg">{orderItems.length}</strong>
                                </div>

                                <div className="order-summary-row border-top-1 surface-border pt-3 mt-2">
                                    <span className="order-total">Grand Total</span>
                                    <span className="order-total text-primary">₹{totalAmount}</span>
                                </div>

                                <div className="order-actions">
                                    <Button
                                        label="Clear"
                                        icon="pi pi-refresh"
                                        className="p-button-outlined p-button-secondary"
                                        onClick={() => setOrderItems([])}
                                    />
                                    <Button
                                        label="Place Order"
                                        icon="pi pi-check"
                                        className="p-button-success flex-1"
                                        onClick={placeOrder}
                                    />
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </Page>
    );
};

export default OrderManagement;
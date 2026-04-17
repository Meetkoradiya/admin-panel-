import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Dialog } from 'primereact/dialog';
import { Tag } from 'primereact/tag';
import { InputTextarea } from 'primereact/inputtextarea';
import { Page } from "@/components/shared/Page";
import { useNavigate } from 'react-router-dom';
import useApi from '@/hooks/useApi';

const SubscriptionList = () => {
    const [plans, setPlans] = useState([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const [loading, setLoading] = useState(false);
    const [showDialog, setShowDialog] = useState(false);
    const [editingPlan, setEditingPlan] = useState(null);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({ planName: '', description: '', price: '', durationInDays: '' });
    const [submitted, setSubmitted] = useState(false);
    const toast = useRef(null);
    const { apiGet, apiPost, apiPut, apiDelete } = useApi();

    const fetchPlans = async () => {
        setLoading(true);
        try {
            const data = await apiGet('/master/water-plans');
            setPlans(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Fetch Plans Error:', error);
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to fetch subscription plans' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchPlans(); }, []);

    const openCreate = () => {
        setEditingPlan(null);
        setFormData({ planName: '', description: '', price: '', durationInDays: '' });
        setSubmitted(false);
        setShowDialog(true);
    };

    const openEdit = (plan) => {
        setEditingPlan(plan);
        setFormData({
            planName: plan.planName || plan.name || '',
            description: plan.description || '',
            price: plan.price || '',
            durationInDays: plan.durationInDays || plan.duration || '',
        });
        setSubmitted(false);
        setShowDialog(true);
    };

    const handleSave = async () => {
        setSubmitted(true);
        if (!formData.planName.trim()) return;
        setSaving(true);
        try {
            const payload = {
                planName: formData.planName,
                description: formData.description,
                price: formData.price ? Number(formData.price) : undefined,
                durationInDays: formData.durationInDays ? Number(formData.durationInDays) : undefined,
            };
            if (editingPlan) {
                const planId = editingPlan.id || editingPlan._id;
                await apiPut(`/master/water-plans/${planId}`, payload);
                toast.current?.show({ severity: 'success', summary: 'Updated', detail: 'Plan updated successfully' });
            } else {
                await apiPost('/master/water-plans', payload);
                toast.current?.show({ severity: 'success', summary: 'Created', detail: 'New plan created successfully' });
            }
            setShowDialog(false);
            fetchPlans();
        } catch (error) {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: error?.response?.data?.message || 'Failed to save plan' });
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = (plan) => {
        confirmDialog({
            message: `Delete the "${plan.planName || plan.name}" plan? This is permanent.`,
            header: 'Confirm Deletion',
            icon: 'pi pi-exclamation-triangle',
            acceptClassName: 'p-button-danger',
            acceptLabel: 'Delete',
            rejectLabel: 'Cancel',
            accept: async () => {
                try {
                    await apiDelete(`/master/water-plans/${plan.id || plan._id}`);
                    toast.current?.show({ severity: 'success', summary: 'Deleted', detail: 'Plan deleted' });
                    fetchPlans();
                } catch (error) {
                    toast.current?.show({ severity: 'error', summary: 'Error', detail: error?.response?.data?.message || 'Delete failed' });
                }
            }
        });
    };

    const priceTemplate = (row) => (
        <span className="font-bold text-slate-800">
            ₹{row.price ? Number(row.price).toLocaleString('en-IN') : '—'}
        </span>
    );

    const statusTemplate = (row) => {
        const active = row.active !== false && row.status !== 'INACTIVE';
        return (
            <Tag
                value={active ? 'Active' : 'Inactive'}
                severity={active ? 'success' : 'danger'}
                style={{ borderRadius: '8px', fontSize: '11px', fontWeight: '700' }}
            />
        );
    };

    const actionTemplate = (row) => (
        <div className="flex gap-2 justify-center">
            <Button
                icon="pi pi-pencil" rounded text
                className="w-9 h-9 text-blue-500 hover:bg-blue-50 hover:border-blue-100 border border-transparent rounded-xl transition-all"
                tooltip="Edit Plan" tooltipOptions={{ position: 'top' }}
                onClick={() => openEdit(row)}
            />
            <Button
                icon="pi pi-trash" rounded text
                className="w-9 h-9 text-rose-500 hover:bg-rose-50 hover:border-rose-100 border border-transparent rounded-xl transition-all"
                tooltip="Delete Plan" tooltipOptions={{ position: 'top' }}
                onClick={() => handleDelete(row)}
            />
        </div>
    );

    const header = (
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-2">
            <div>
                <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">Subscription Plans</h2>
                <p className="text-slate-400 text-sm mt-0.5">Manage water subscription plans available to admins</p>
            </div>
            <div className="flex items-center gap-3 w-full md:w-auto">
                <span className="p-input-icon-left flex-1 md:flex-none">
                    <i className="pi pi-search text-slate-400" />
                    <InputText
                        type="search"
                        onInput={(e) => setGlobalFilter(e.target.value)}
                        placeholder="Search plans..."
                        className="p-inputtext-sm border-slate-200 rounded-xl w-full md:w-56 bg-slate-50"
                    />
                </span>
                <Button
                    label="New Plan"
                    icon="pi pi-plus"
                    className="bg-indigo-600 border-none px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-0.5 transition-all text-white text-sm whitespace-nowrap"
                    onClick={openCreate}
                />
            </div>
        </div>
    );

    const dialogFooter = (
        <div className="flex justify-end gap-3 pt-2">
            <Button label="Cancel" icon="pi pi-times" className="p-button-outlined border-slate-200 text-slate-600 px-6 py-2 rounded-xl font-bold" onClick={() => setShowDialog(false)} disabled={saving} />
            <Button label={editingPlan ? 'Save Changes' : 'Create Plan'} icon={editingPlan ? 'pi pi-save' : 'pi pi-check'} className="bg-indigo-600 border-none text-white px-8 py-2 rounded-xl font-bold shadow-lg shadow-indigo-200" onClick={handleSave} loading={saving} />
        </div>
    );

    return (
        <Page title="Subscriptions">
            <div className="bg-[#f8fafc] min-h-[calc(100vh-5rem)]">
                <Toast ref={toast} />
                <ConfirmDialog />

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                    {[
                        { label: 'Total Plans', value: plans.length, icon: 'pi pi-list', color: 'from-indigo-500 to-indigo-600', shadow: 'shadow-indigo-200' },
                        { label: 'Active Plans', value: plans.filter(p => p.active !== false).length, icon: 'pi pi-check-circle', color: 'from-emerald-500 to-emerald-600', shadow: 'shadow-emerald-200' },
                        { label: 'Avg. Price', value: plans.length ? `₹${Math.round(plans.reduce((s, p) => s + (p.price || 0), 0) / plans.length)}` : '₹0', icon: 'pi pi-rupee', color: 'from-amber-500 to-orange-500', shadow: 'shadow-amber-200' },
                    ].map((s) => (
                        <div key={s.label} className={`bg-linear-to-br ${s.color} rounded-2xl p-5 text-white shadow-lg ${s.shadow}`}>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-white/70 text-xs font-semibold uppercase tracking-widest">{s.label}</p>
                                    <p className="text-3xl font-black mt-1">{loading ? '—' : s.value}</p>
                                </div>
                                <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
                                    <i className={`${s.icon} text-xl`} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Table */}
                <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                    <DataTable
                        value={plans}
                        header={header}
                        paginator rows={10}
                        rowsPerPageOptions={[10, 25, 50]}
                        loading={loading}
                        globalFilter={globalFilter}
                        className="p-datatable-sm"
                        stripedRows rowHover
                        dataKey="id"
                        emptyMessage={
                            <div className="text-center py-12">
                                <i className="pi pi-calendar text-4xl text-slate-300 mb-3 block" />
                                <p className="text-slate-400 font-medium">No subscription plans found</p>
                                <Button label="Create First Plan" icon="pi pi-plus" className="mt-4 bg-indigo-600 border-none text-white px-4 py-2 rounded-xl text-sm font-bold" onClick={openCreate} />
                            </div>
                        }
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first}–{last} of {totalRecords} plans"
                    >
                        <Column header="#" body={(_, opts) => <span className="text-slate-400 font-bold text-xs">{opts.rowIndex + 1}</span>} style={{ width: '3rem' }} />
                        <Column field="planName" header="Plan Name" sortable className="font-bold text-slate-800" />
                        <Column field="description" header="Description" className="text-slate-500 text-sm" />
                        <Column header="Price" body={priceTemplate} sortField="price" sortable />
                        <Column field="durationInDays" header="Duration (Days)" sortable className="text-slate-600 font-medium text-sm" />
                        <Column header="Status" body={statusTemplate} style={{ textAlign: 'center' }} />
                        <Column header="Actions" body={actionTemplate} style={{ width: '8rem', textAlign: 'center' }} />
                    </DataTable>
                </div>

                {/* Create/Edit Dialog */}
                <Dialog
                    visible={showDialog}
                    onHide={() => setShowDialog(false)}
                    header={
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                                <i className="pi pi-calendar text-base" />
                            </div>
                            <span className="font-bold text-slate-800">{editingPlan ? 'Edit Plan' : 'Create New Plan'}</span>
                        </div>
                    }
                    footer={dialogFooter}
                    style={{ width: '480px' }}
                    className="p-fluid"
                    modal
                    draggable={false}
                >
                    <div className="space-y-5 pt-2">
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">Plan Name <span className="text-red-500">*</span></label>
                            <InputText
                                value={formData.planName}
                                onChange={(e) => setFormData({ ...formData, planName: e.target.value })}
                                className={`w-full p-4 rounded-xl border text-sm ${submitted && !formData.planName ? 'border-red-400 bg-red-50' : 'border-slate-200 bg-slate-50'}`}
                                placeholder="e.g. Basic, Premium, Enterprise"
                            />
                            {submitted && !formData.planName && <small className="text-red-500 font-semibold mt-1 block">Plan name is required.</small>}
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">Description</label>
                            <InputTextarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                rows={3}
                                className="w-full p-4 rounded-xl border border-slate-200 bg-slate-50 text-sm resize-none"
                                placeholder="Brief plan description..."
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">Price (₹)</label>
                                <InputText
                                    keyfilter="num"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    className="w-full p-4 rounded-xl border border-slate-200 bg-slate-50 text-sm"
                                    placeholder="e.g. 499"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">Duration (Days)</label>
                                <InputText
                                    keyfilter="int"
                                    value={formData.durationInDays}
                                    onChange={(e) => setFormData({ ...formData, durationInDays: e.target.value })}
                                    className="w-full p-4 rounded-xl border border-slate-200 bg-slate-50 text-sm"
                                    placeholder="e.g. 30"
                                />
                            </div>
                        </div>
                    </div>
                </Dialog>
            </div>
        </Page>
    );
};

export default SubscriptionList;

import React from 'react';

const statusStyles = {
    // Success - Green
    'ACTIVE': 'bg-emerald-50 text-emerald-600 border-emerald-100',
    'COMPLETED': 'bg-emerald-50 text-emerald-600 border-emerald-100',
    'DELIVERED': 'bg-emerald-50 text-emerald-600 border-emerald-100',
    'RESOLVED': 'bg-emerald-50 text-emerald-600 border-emerald-100',
    'PAID': 'bg-emerald-50 text-emerald-600 border-emerald-100',
    'APPROVED': 'bg-emerald-50 text-emerald-600 border-emerald-100',
    'VERIFIED': 'bg-emerald-50 text-emerald-600 border-emerald-100',
    
    // Warning - Amber/Yellow
    'IN_PROGRESS': 'bg-amber-50 text-amber-600 border-amber-100',
    'ON_THE_WAY': 'bg-amber-50 text-amber-600 border-amber-100',
    'PENDING': 'bg-amber-50 text-amber-600 border-amber-100',
    'HOLD': 'bg-amber-50 text-amber-600 border-amber-100',
    
    // Danger - Red
    'INACTIVE': 'bg-rose-50 text-rose-600 border-rose-100',
    'CANCELLED': 'bg-rose-50 text-rose-600 border-rose-100',
    'REJECTED': 'bg-rose-50 text-rose-600 border-rose-100',
    'FAILED': 'bg-rose-50 text-rose-600 border-rose-100',
    'UNPAID': 'bg-rose-50 text-rose-600 border-rose-100',
    
    // Info - Blue/Slate
    'NEW': 'bg-blue-50 text-blue-600 border-blue-100',
    'ASSIGNED': 'bg-emerald-50 text-emerald-600 border-emerald-100',
    'UNASSIGNED': 'bg-rose-50 text-rose-600 border-rose-100',
    'UNKNOWN': 'bg-slate-50 text-slate-500 border-slate-100'
};

const StatusTag = ({ status, className = "" }) => {
    const value = status || 'UNKNOWN';
    const normalizedStatus = value.toString().toUpperCase().replace(/\s+/g, '_');
    
    const style = statusStyles[normalizedStatus] || statusStyles['UNKNOWN'];

    return (
        <span className={`px-3 py-1.5 rounded-xl border text-[10px] font-extrabold uppercase tracking-[0.12em] inline-flex items-center justify-center min-w-[100px] shadow-sm ${style} ${className}`}>
            {value.toString().replace(/_/g, ' ')}
        </span>
    );
};

export default StatusTag;


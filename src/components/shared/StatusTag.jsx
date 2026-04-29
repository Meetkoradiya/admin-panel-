import React from 'react';
import { Tag } from 'primereact/tag';

const defaultSeverityMap = {
    // Success
    'ACTIVE': 'success',
    'COMPLETED': 'success',
    'DELIVERED': 'success',
    'RESOLVED': 'success',
    'PAID': 'success',
    'APPROVED': 'success',
    'VERIFIED': 'success',
    
    // Warning
    'IN_PROGRESS': 'warning',
    'ON_THE_WAY': 'warning',
    'PENDING': 'warning',
    'HOLD': 'warning',
    
    // Danger
    'INACTIVE': 'danger',
    'CANCELLED': 'danger',
    'REJECTED': 'danger',
    'FAILED': 'danger',
    'UNPAID': 'danger',
    
    // Info
    'NEW': 'info',
    'ASSIGNED': 'info',
    'UNKNOWN': 'info'
};

const StatusTag = ({ status, customMap = {}, className = "", ...props }) => {
    const value = status || 'UNKNOWN';
    const normalizedStatus = value.toString().toUpperCase();
    
    const severityMap = { ...defaultSeverityMap, ...customMap };
    const severity = severityMap[normalizedStatus] || 'info';

    return (
        <Tag 
            value={value.toString().replace(/_/g, ' ')} 
            severity={severity} 
            rounded 
            className={`px-3 py-1 font-bold text-[10px] uppercase tracking-widest ${className}`}
            {...props}
        />
    );
};

export default StatusTag;
import React from 'react';
import Button from '@/components/ui/Button';

/**
 * Standardized Create Button for forms and list headers
 */
export const CreateButton = ({ label = "Create", onClick, icon = "pi pi-check", className = "", ...props }) => (
    <Button
        variant="primary"
        size="sm"
        label={label}
        icon={icon}
        onClick={onClick}
        className={`!px-6 rounded-xl shadow-lg shadow-blue-500/20 ${className}`}
        {...props}
    />
);

/**
 * Standardized Discard/Cancel Button for forms
 */
export const DiscardButton = ({ label = "Discard", onClick, icon = "pi pi-trash", className = "", ...props }) => (
    <Button
        variant="outline-danger"
        size="sm"
        label={label}
        icon={icon}
        onClick={onClick}
        className={`!px-6 rounded-xl ${className}`}
        {...props}
    />
);

/**
 * Standardized Form Action Group (Discard + Create)
 */
export const FormActions = ({ onCreate, onDiscard, createLabel = "Create", discardLabel = "Discard", isLoading = false }) => (
    <div className="flex items-center gap-4 justify-end mt-6">
        <DiscardButton 
            label={discardLabel} 
            onClick={onDiscard} 
            disabled={isLoading}
        />
        <CreateButton 
            label={createLabel} 
            onClick={onCreate} 
            loading={isLoading}
        />
    </div>
);

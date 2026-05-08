import React from 'react';
import Button from "@/components/ui/Button";

const ActionButtons = ({ onEdit, onDelete, onDeactivate, isDeactivated }) => {
    return (
        <div className="flex items-center justify-center gap-3">
            {/* Edit Button */}
            {onEdit && (
                <Button
                    variant="icon"
                    size="sm"
                    icon="pi pi-pencil"
                    onClick={(e) => {
                        e.stopPropagation();
                        onEdit();
                    }}
                    data-pr-tooltip="Edit"
                    className="action-tooltip !border-blue-500 !text-blue-600 !bg-transparent hover:!bg-blue-50 transition-all duration-200"
                />
            )}


            {/* Delete Button */}
            {onDelete && (
                <Button
                    variant="icon"
                    size="sm"
                    icon="pi pi-trash"
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete();
                    }}
                    data-pr-tooltip="Delete"
                    className="action-tooltip !border-red-500 !text-red-600 !bg-transparent hover:!bg-red-50 transition-all duration-200"
                />
            )}
        </div>
    );
};

export default ActionButtons;


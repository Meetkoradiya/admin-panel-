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
                    className="action-tooltip !w-10 !h-10 !border-blue-500 !text-blue-500 !bg-white hover:!bg-blue-50 !rounded-xl transition-all duration-300 shadow-sm"
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
                    className="action-tooltip !w-10 !h-10 !border-red-500 !text-red-500 !bg-white hover:!bg-red-50 !rounded-xl transition-all duration-300 shadow-sm"
                />
            )}
        </div>
    );
};

export default ActionButtons;


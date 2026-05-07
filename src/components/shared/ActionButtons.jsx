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
                    className="!border-sky-500 !text-sky-500 !bg-transparent hover:!bg-sky-50 transition-colors"
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
                    className="!border-red-500 !text-red-500 !bg-transparent hover:!bg-red-50 transition-colors"
                />
            )}
        </div>
    );
};

export default ActionButtons;


import React from 'react';
import Button from "@/components/ui/Button";

const ActionButtons = ({ onEdit, onDelete, editTooltip = "Edit", deleteTooltip = "Delete" }) => {
    return (
        <div className="flex items-center justify-center gap-3">
            {/* Edit Button */}
            {onEdit && (
                <Button
                    variant="icon"
                    size="sm"
                    icon="pi pi-pencil"
                    tooltip={editTooltip}
                    tooltipOptions={{ position: 'top' }}
                    onClick={(e) => {
                        e.stopPropagation();
                        onEdit();
                    }}
                    className="text-sky-500 hover:bg-sky-50"
                />
            )}

            {/* Delete Button */}
            {onDelete && (
                <Button
                    variant="icon"
                    size="sm"
                    icon="pi pi-trash"
                    tooltip={deleteTooltip}
                    tooltipOptions={{ position: 'top' }}
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete();
                    }}
                    className="text-rose-500 hover:bg-rose-50"
                />
            )}
        </div>
    );
};

export default ActionButtons;


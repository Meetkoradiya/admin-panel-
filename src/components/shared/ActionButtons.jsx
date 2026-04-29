import React from 'react';

const ActionButtons = ({ onEdit, onDelete, editTooltip = "Edit", deleteTooltip = "Delete" }) => {
    return (
        <div className="flex items-center justify-center gap-3">
            {/* Edit Button */}
            {onEdit && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onEdit();
                    }}
                    className="group relative flex items-center justify-center w-8 h-8 transition-all duration-300 transform active:scale-90"
                    title={editTooltip}
                >
                    <div className="absolute inset-0 border border-sky-400 rounded-full flex items-center justify-center bg-white group-hover:bg-sky-50 transition-all duration-300 shadow-sm">
                        <i className="pi pi-pencil text-sky-500 text-[10px] font-bold" />
                    </div>
                </button>
            )}

            {/* Delete Button */}
            {onDelete && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete();
                    }}
                    className="group relative flex items-center justify-center w-8 h-8 transition-all duration-300 transform active:scale-90"
                    title={deleteTooltip}
                >
                    <div className="absolute inset-0 border border-rose-400 rounded-full flex items-center justify-center bg-white group-hover:bg-rose-50 transition-all duration-300 shadow-sm">
                        <i className="pi pi-trash text-rose-500 text-[10px] font-bold" />
                    </div>
                </button>
            )}
        </div>
    );
};

export default ActionButtons;

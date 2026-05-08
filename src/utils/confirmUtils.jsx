import React from 'react';
import { confirmDialog } from 'primereact/confirmdialog';
import { Button } from 'primereact/button';

/**
 * Global utility for consistent confirmation dialogs.
 * 
 * @param {Object} options
 * @param {string} options.title - The title of the dialog (e.g., "Delete Society")
 * @param {string} options.message - The subtitle message (e.g., "This action cannot be undone.")
 * @param {string} options.icon - The PrimeIcon class (e.g., "pi pi-exclamation-triangle")
 * @param {string} options.acceptLabel - Label for the accept button (e.g., "Delete", "Logout")
 * @param {string} options.rejectLabel - Label for the reject button (e.g., "Cancel")
 * @param {string} options.acceptColor - Tailwind color class for accept button (e.g., "rose", "blue")
 * @param {Function} options.onAccept - Function to call when accepted
 * @param {Function} options.onReject - Function to call when rejected
 */
export const showConfirmDialog = ({
    title = 'Confirm',
    message = 'Are you sure you want to proceed?',
    acceptLabel = 'Yes',
    rejectLabel = 'No',
    type = 'edit', // 'edit' | 'delete' | 'logout'
    onAccept,
    onReject
}) => {
    // Theme configuration based on action type
    const themes = {
        edit: {
            btn: 'bg-blue-600 hover:bg-blue-700',
            text: 'text-blue-600'
        },
        delete: {
            btn: 'bg-rose-600 hover:bg-rose-700',
            text: 'text-rose-600'
        },
        logout: {
            btn: 'bg-blue-600 hover:bg-blue-700',
            text: 'text-blue-600'
        }
    };

    const theme = themes[type] || themes.edit;

    confirmDialog({
        message,
        header: title,
        accept: onAccept,
        reject: onReject,
        content: ({ hide }) => (
            <div className="bg-white rounded-2xl p-8 shadow-2xl w-[95vw] md:w-[480px] mx-auto border border-slate-100 animate-fade-in relative">
                {/* Header Section */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-slate-800 tracking-tight">{title}</h2>
                    <button 
                        onClick={(e) => hide(e)}
                        className="text-slate-400 hover:text-slate-600 transition-colors"
                    >
                        <i className="pi pi-times text-lg"></i>
                    </button>
                </div>

                {/* Message Body */}
                <div className="mb-10">
                    <p className="text-slate-600 text-lg leading-relaxed">
                        {message}
                    </p>
                </div>

                {/* Action Buttons (Right Aligned) */}
                <div className="flex items-center justify-end gap-6 pt-2">
                    <button
                        onClick={(e) => { hide(e); if (onReject) onReject(); }}
                        className={`text-lg font-bold transition-all hover:opacity-80 ${theme.text}`}
                    >
                        {rejectLabel}
                    </button>
                    <button
                        onClick={(e) => { hide(e); if (onAccept) onAccept(); }}
                        className={`px-10 py-3 rounded-xl text-white font-bold transition-all shadow-md active:scale-95 text-lg ${theme.btn}`}
                    >
                        {acceptLabel}
                    </button>
                </div>
            </div>
        )
    });
};


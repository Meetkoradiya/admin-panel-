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
    icon,
    acceptLabel = 'Confirm',
    rejectLabel = 'Cancel',
    type = 'edit', // 'edit' | 'delete' | 'logout'
    onAccept,
    onReject
}) => {
    // Theme configuration based on action type
    const themes = {
        edit: {
            icon: icon || 'pi pi-pencil',
            bg: 'bg-violet-50',
            text: 'text-violet-500',
            btn: 'bg-violet-500 hover:bg-violet-600',
            ring: 'focus:ring-violet-100'
        },
        delete: {
            icon: icon || 'pi pi-trash',
            bg: 'bg-rose-50',
            text: 'text-rose-500',
            btn: 'bg-rose-500 hover:bg-rose-600',
            ring: 'focus:ring-rose-100'
        },
        logout: {
            icon: icon || 'pi pi-sign-out',
            bg: 'bg-amber-50',
            text: 'text-amber-500',
            btn: 'bg-amber-500 hover:bg-amber-600',
            ring: 'focus:ring-amber-100'
        }
    };

    const theme = themes[type] || themes.edit;

    confirmDialog({
        message,
        header: title,
        accept: onAccept,
        reject: onReject,
        content: ({ hide }) => (
            <div className="flex flex-col items-center bg-white rounded-[2.5rem] p-10 shadow-2xl min-w-[380px] max-w-[420px] mx-auto border border-slate-50 animate-zoom-in">
                {/* Visual Icon Header */}
                <div className={`flex items-center justify-center size-24 rounded-full ${theme.bg} ${theme.text} mb-8 ring-12 ring-white shadow-sm border border-slate-50 transition-transform duration-500 hover:scale-110`}>
                    <i className={`${theme.icon} text-4xl`}></i>
                </div>

                {/* Information Body */}
                <div className="text-center mb-10">
                    <h3 className="text-2xl font-black text-slate-800 tracking-tight mb-3 px-2 leading-none">{title}</h3>
                    <p className="text-slate-500 font-bold text-sm leading-relaxed px-6">{message}</p>
                </div>

                {/* Dynamic Actions */}
                <div className="flex flex-col gap-3 w-full">
                    <button 
                        onClick={(e) => { hide(e); if(onAccept) onAccept(); }} 
                        className={`w-full py-4 rounded-2xl text-white font-black transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 ${theme.btn}`}
                    >
                        <i className={`${theme.icon} text-sm`}></i>
                        {acceptLabel}
                    </button>
                    <button 
                        onClick={(e) => { hide(e); if(onReject) onReject(); }} 
                        className="w-full py-4 rounded-2xl bg-slate-50 text-slate-400 font-black hover:bg-slate-100 transition-all active:scale-95"
                    >
                        {rejectLabel}
                    </button>
                </div>
            </div>
        )
    });
};

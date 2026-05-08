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
            <div className="flex flex-col items-center bg-white rounded-[2rem] md:rounded-[3rem] p-6 md:p-12 shadow-2xl w-[90vw] md:w-auto md:min-w-[420px] md:max-w-[480px] mx-auto border border-slate-50 animate-zoom-in overflow-hidden relative">
                {/* Visual Icon Header */}
                <div className={`flex items-center justify-center size-20 md:size-28 rounded-full ${theme.bg} ${theme.text} mb-6 md:mb-10 ring-[12px] md:ring-[16px] ring-white shadow-sm border border-slate-50 transition-transform duration-500 hover:scale-105`}>
                    <i className={`${theme.icon} text-3xl md:text-5xl`}></i>
                </div>

                {/* Information Body */}
                <div className="text-center mb-8 md:mb-12">
                    <h3 className="text-xl md:text-3xl font-extrabold text-slate-800 tracking-tight mb-2 md:mb-4 px-2 leading-none uppercase">{title}</h3>
                    <p className="text-slate-500 font-bold text-[13px] md:text-sm leading-relaxed px-4 md:px-8">{message}</p>
                </div>

                {/* Dynamic Actions */}
                <div className="flex flex-col gap-3 md:gap-4 w-full">
                    <button
                        onClick={(e) => { hide(e); if (onAccept) onAccept(); }}
                        className={`w-full py-3.5 md:py-5 rounded-xl md:rounded-2xl text-white font-bold transition-all shadow-lg active:scale-95 flex items-center justify-center gap-3 text-sm md:text-base ${theme.btn}`}
                    >
                        <i className={`${theme.icon} text-xs md:text-sm`}></i>
                        {acceptLabel}
                    </button>
                    <button
                        onClick={(e) => { hide(e); if (onReject) onReject(); }}
                        className="w-full py-3.5 md:py-5 rounded-xl md:rounded-2xl bg-slate-50 text-slate-400 font-bold hover:bg-slate-100 transition-all active:scale-95 text-sm md:text-base"
                    >
                        {rejectLabel}
                    </button>
                </div>
            </div>
        )
    });
};


import React from 'react';

const EmptyMessage = ({ title, subtitle }) => {
    return (
        <div className="flex flex-col items-center justify-center p-12 text-center">
            <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-slate-100">
                <i className="pi pi-box text-5xl text-slate-300" />
            </div>
            <h3 className="mb-2 text-xl font-bold text-slate-700">{title}</h3>
            <p className="max-w-md text-sm text-slate-500">{subtitle}</p>
        </div>
    );
};

export default EmptyMessage;

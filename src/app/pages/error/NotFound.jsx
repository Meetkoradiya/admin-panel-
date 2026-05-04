import React from 'react';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';

const NotFound = ({ type = "404" }) => {
    const navigate = useNavigate();

    return (
        <div className="min-h-[85vh] flex flex-col items-center justify-center bg-white px-4 text-center animate-fade-in">
            <div className="relative mb-8">
                {/* Reference-style Illustration */}
                <img 
                    src="/images/404-illustration-clean.png" 
                    alt="Not Found" 
                    className="w-full max-w-lg h-auto select-none pointer-events-none"
                />
            </div>
            
            <h2 className="text-3xl font-extrabold text-slate-900 mb-3 tracking-tight">
                Oops. This Page Not Found.
            </h2>
            <p className="text-slate-500 font-medium text-lg max-w-md mx-auto mb-10 leading-relaxed">
                Sorry, the page you&apos;re looking for isn&apos;t available. Let&apos;s get you back on track.
            </p>
            
            <div className="flex flex-wrap items-center justify-center gap-4">
                <button 
                    className="bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 rounded-xl px-8 py-3.5 font-bold shadow-sm transition-all active:scale-95 flex items-center gap-2"
                    onClick={() => navigate(-1)}
                >
                    <i className="pi pi-arrow-left" />
                    Go Back
                </button>
                <button 
                    className="bg-cyan-500 hover:bg-cyan-600 text-white border-none rounded-xl px-10 py-3.5 font-bold shadow-lg shadow-cyan-500/20 transition-all hover:-translate-y-0.5 active:scale-95 flex items-center gap-2"
                    onClick={() => navigate('/')}
                >
                    <i className="pi pi-home" />
                    Back to Dashboard
                </button>
            </div>
        </div>
    );
};

export default NotFound;


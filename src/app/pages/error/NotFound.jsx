import React from 'react';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';

const NotFound = ({ type = "404" }) => {
    const navigate = useNavigate();

    return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 animate-fade-in">
            <div className="relative mb-8">
                <h1 className="text-[12rem] font-black text-slate-100 leading-none select-none">
                    {type}
                </h1>
                <div className="absolute inset-0 flex items-center justify-center">
                    <img 
                        src="/images/no-data.png" 
                        alt="Not Found" 
                        className="w-64 h-auto opacity-90 select-none pointer-events-none animate-bounce-slow"
                        onError={(e) => {
                            e.target.src = 'https://cdn-icons-png.flaticon.com/512/7486/7486744.png';
                        }}
                    />
                </div>
            </div>
            
            <h2 className="text-3xl font-black text-slate-800 mb-4">
                {type === "401" ? "Unauthorized Access" : "Page Not Found"}
            </h2>
            <p className="text-slate-500 max-w-md mx-auto mb-8 font-medium">
                {type === "401" 
                    ? "Sorry, you don't have permission to access this page. Please contact your administrator if you think this is a mistake."
                    : "The page you are looking for might have been moved, deleted, or never existed in the first place."}
            </p>
            
            <div className="flex gap-4">
                <Button 
                    label="Go Back" 
                    icon="pi pi-arrow-left" 
                    className="btn-secondary"
                    onClick={() => navigate(-1)}
                />
                <Button 
                    label="Back to Dashboard" 
                    icon="pi pi-home" 
                    className="btn-primary"
                    onClick={() => navigate('/')}
                />
            </div>
        </div>
    );
};

export default NotFound;

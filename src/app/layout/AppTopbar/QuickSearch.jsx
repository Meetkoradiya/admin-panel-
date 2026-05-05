import React, { useState, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { menuModel } from '../AppSidebar/modals';
import { masterMenuModel } from '../AppSidebar/masterModals';

export const QuickSearch = ({ visible, onHide }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();
    const user = useSelector((state) => state.auth.userData);

    const currentMenuModel = user?.role === "MASTER_ADMIN" ? masterMenuModel : menuModel;

    const allItems = currentMenuModel.flatMap(category => 
        category.items.flatMap(item => 
            item.items ? item.items.map(sub => ({ ...sub, category: category.label })) : [{ ...item, category: category.label }]
        )
    );

    const filteredItems = searchQuery 
        ? allItems.filter(item => item.label.toLowerCase().includes(searchQuery.toLowerCase()))
        : allItems;

    const groupedItems = filteredItems.reduce((acc, item) => {
        if (!acc[item.category]) acc[item.category] = [];
        acc[item.category].push(item);
        return acc;
    }, {});

    const handleItemClick = (to) => {
        navigate(to);
        onHide();
    };

    return (
        <Dialog 
            visible={visible} 
            onHide={onHide} 
            showHeader={false} 
            closable={false}
            className="quick-search-dialog overflow-hidden rounded-3xl shadow-2xl border-none"
            contentClassName="!p-0"
            style={{ width: '500px' }}
            maskClassName="backdrop-blur-sm bg-slate-900/40"
        >
            <div className="flex flex-col h-[55vh]">
                {/* Search Header */}
                <div className="p-4 border-b border-slate-100 flex items-center gap-4 sticky top-0 bg-white z-10">
                    <div className="relative flex-1 flex items-center">
                        <i className="pi pi-search text-slate-400 text-lg absolute left-3 z-10" />
                        <InputText 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search menu..." 
                            className="w-full border-none! shadow-none! ring-0! outline-none! text-[15px] font-medium text-slate-700 py-1 bg-transparent"
                            style={{ paddingLeft: '2.5rem' }}
                            autoFocus
                        />
                    </div>
                    <button 
                        onClick={onHide}
                        className="px-3 py-1.5 bg-white border border-slate-200 rounded-[10px] text-[13px] font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-800 transition-all shadow-sm"
                    >
                        Esc
                    </button>
                </div>

                {/* Search Results */}
                <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                    {Object.keys(groupedItems).length > 0 ? (
                        Object.entries(groupedItems).map(([category, items]) => (
                            <div key={category} className="mb-6">
                                <h3 className="text-[13px] font-bold text-slate-800 mb-3 ml-2">
                                    {category.charAt(0).toUpperCase() + category.slice(1).toLowerCase()}
                                </h3>
                                <div className="space-y-1">
                                    {items.map((item, idx) => (
                                        <div 
                                            key={idx}
                                            onClick={() => handleItemClick(item.to)}
                                            className="flex items-center gap-4 p-2 rounded-xl hover:bg-slate-50 cursor-pointer transition-all"
                                        >
                                            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center border border-slate-200 shadow-sm">
                                                <i className={`${item.icon || 'pi pi-circle-fill'} text-slate-600 text-[15px]`} />
                                            </div>
                                            <span className="text-[14px] font-medium text-slate-700">
                                                {item.label}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 opacity-30 grayscale text-center">
                            <i className="pi pi-search text-6xl mb-4" />
                            <p className="font-semibold uppercase tracking-widest text-sm px-10">No results found for &quot;{searchQuery}&quot;</p>
                        </div>
                    )}
                </div>
            </div>
        </Dialog>
    );
};


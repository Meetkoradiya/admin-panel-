import React, { useState, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { useNavigate } from 'react-router-dom';
import { menuModel } from '../AppSidebar/modals';

export const QuickSearch = ({ visible, onHide }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    const allItems = menuModel.flatMap(category => 
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
            header={null} 
            closable={false}
            className="quick-search-dialog p-0 overflow-hidden rounded-[24px] shadow-2xl"
            style={{ width: '600px' }}
            maskClassName="backdrop-blur-sm bg-slate-900/40"
        >
            <div className="flex flex-col h-[70vh]">
                {/* Search Header */}
                <div className="p-5 border-b border-slate-100 flex items-center gap-4 sticky top-0 bg-white z-10">
                    <div className="relative flex-1">
                        <i className="pi pi-search text-blue-500 text-lg absolute left-3 top-1/2 -translate-y-1/2" />
                        <InputText 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Quick Search..." 
                            className="w-full border-none focus:shadow-none text-lg font-bold text-slate-700 pl-12 py-0"
                            autoFocus
                        />
                    </div>
                    <button 
                        onClick={onHide}
                        className="px-3 py-1 bg-slate-50 border border-slate-200 rounded-lg text-[10px] font-black text-slate-400 uppercase tracking-widest hover:bg-slate-100 transition-all"
                    >
                        Esc
                    </button>
                </div>

                {/* Search Results */}
                <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                    {Object.keys(groupedItems).length > 0 ? (
                        Object.entries(groupedItems).map(([category, items]) => (
                            <div key={category} className="mb-6">
                                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 ml-2">{category}</h3>
                                <div className="space-y-1">
                                    {items.map((item, idx) => (
                                        <div 
                                            key={idx}
                                            onClick={() => handleItemClick(item.to)}
                                            className="flex items-center gap-4 p-3 rounded-xl hover:bg-blue-50 cursor-pointer group transition-all"
                                        >
                                            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 group-hover:bg-white group-hover:border-blue-100 group-hover:shadow-sm transition-all">
                                                <i className={`${item.icon || 'pi pi-circle-fill'} text-slate-400 group-hover:text-blue-500`} />
                                            </div>
                                            <span className="text-sm font-bold text-slate-600 group-hover:text-blue-600 transition-colors">
                                                {item.label}
                                            </span>
                                            <i className="pi pi-chevron-right ml-auto text-[10px] text-slate-300 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 opacity-30 grayscale text-center">
                            <i className="pi pi-search text-6xl mb-4" />
                            <p className="font-bold uppercase tracking-widest text-sm px-10">No results found for &quot;{searchQuery}&quot;</p>
                        </div>
                    )}
                </div>
            </div>
        </Dialog>
    );
};

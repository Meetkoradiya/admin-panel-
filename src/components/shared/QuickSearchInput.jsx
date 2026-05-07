import React from 'react';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';

const QuickSearchInput = ({ 
    value, 
    onInput, 
    placeholder = "Quick Search...", 
    className,
    containerClassName,
    onClick,
    readOnly = false,
    ...props 
}) => {
    return (
        <div className={classNames("relative group flex-grow md:flex-grow-0", containerClassName)}>
            <i className="pi pi-search text-slate-500 absolute left-5 top-1/2 -translate-y-1/2 text-sm group-focus-within:text-blue-500 transition-colors z-10 pointer-events-none" />
            <InputText
                type="text"
                value={value}
                onInput={onInput}
                onClick={onClick}
                placeholder={placeholder}
                readOnly={readOnly}
                style={{ paddingLeft: '4rem' }}
                className={classNames(
                    "pr-6 py-3 border border-slate-200 rounded-2xl w-full md:w-80 !bg-white hover:border-slate-300 text-[15px] font-medium text-slate-700 placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-50/50 transition-all outline-none appearance-none",
                    className
                )}
                {...props}
            />
            <style dangerouslySetInnerHTML={{ __html: `
                input[type="text"]::-webkit-search-decoration,
                input[type="text"]::-webkit-search-cancel-button,
                input[type="text"]::-webkit-search-results-button,
                input[type="text"]::-webkit-search-results-decoration { 
                    -webkit-appearance: none;
                    display: none; 
                }
                input::-ms-clear, input::-ms-reveal { display: none; width: 0; height: 0; }
            `}} />
        </div>
    );
};

export default QuickSearchInput;

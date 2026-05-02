import React from 'react';
import { Button as PrimeButton } from 'primereact/button';
import { motion } from 'motion/react';

/**
 * A reusable, premium Button component built on top of PrimeReact Button
 * with custom styling and animations.
 * 
 * @param {Object} props - Standard PrimeReact Button props plus custom ones
 * @param {string} props.variant - 'primary' | 'secondary' | 'danger' | 'ghost' | 'link' | 'icon'
 * @param {string} props.size - 'sm' | 'md' | 'lg'
 */
const Button = ({ 
    variant = 'primary', 
    size = 'md', 
    className = '', 
    loading = false,
    disabled = false,
    children,
    ...props 
}) => {
    
    // Base styles
    const baseStyles = "relative inline-flex items-center justify-center font-bold transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden";
    
    // Variant styles
    const variants = {
        primary: "bg-cyan-500 text-white border-none shadow-[0_10px_20px_-5px_rgba(6,182,212,0.3)] hover:bg-cyan-600 hover:shadow-[0_15px_25px_-5px_rgba(6,182,212,0.4)]",
        secondary: "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:border-slate-300 shadow-sm",
        danger: "bg-rose-500 text-white border-none shadow-[0_10px_20px_-5px_rgba(244,63,94,0.3)] hover:bg-rose-600 hover:shadow-[0_15px_25px_-5px_rgba(244,63,94,0.4)]",
        ghost: "bg-transparent text-slate-600 border-none hover:bg-slate-100",
        link: "bg-transparent text-cyan-600 border-none underline-offset-4 hover:underline p-0",
        icon: "p-2 rounded-full border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:border-slate-300"
    };

    // Size styles
    const sizes = {
        sm: "px-3 py-1.5 text-xs rounded-lg gap-1.5 h-8",
        md: "px-5 py-2.5 text-sm rounded-xl gap-2 h-10",
        lg: "px-8 py-3.5 text-base rounded-2xl gap-3 h-12"
    };

    // Combine classes
    const buttonClasses = `${baseStyles} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`;
    const isFullWidth = className.includes('w-full');

    return (
        <motion.div
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            className={isFullWidth ? "w-full" : "inline-block"}
        >
            <PrimeButton
                className={buttonClasses}
                disabled={disabled || loading}
                loading={loading}
                {...props}
            >
                {children}
            </PrimeButton>
        </motion.div>
    );
};

export default Button;

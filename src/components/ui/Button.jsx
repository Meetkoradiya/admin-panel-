import React from 'react';
import { Button as PrimeButton } from 'primereact/button';
import { classNames } from 'primereact/utils';
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
    icon,
    children,
    ...props
}) => {

    // Base styles
    const baseStyles = "relative inline-flex items-center justify-center font-bold transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden whitespace-nowrap flex-shrink-0";

    // Variant styles
    const variants = {
        primary: "bg-blue-600 text-white border-none shadow-lg shadow-blue-500/20 hover:bg-blue-700 hover:shadow-blue-500/30 shadow-inner shadow-white/10",
        secondary: "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:border-slate-300 shadow-sm",
        danger: "bg-rose-500 text-white border-none shadow-lg shadow-rose-500/20 hover:bg-rose-600 hover:shadow-rose-500/30 shadow-inner shadow-white/10",
        "outline-danger": "bg-transparent text-rose-500 border border-rose-500 hover:bg-rose-50 shadow-sm",
        "outline-primary": "bg-transparent text-blue-600 border border-blue-600 hover:bg-blue-50 shadow-sm",
        ghost: "bg-transparent text-slate-600 border-none hover:bg-slate-100",
        link: "bg-transparent text-blue-600 border-none underline-offset-4 hover:underline p-0",
        icon: "p-0 rounded-full border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:border-slate-300 shadow-sm flex items-center justify-center"
    };

    // Size styles (for regular buttons)
    const sizes = {
        sm: "px-3 py-1.5 text-xs rounded-lg gap-1.5 h-8",
        md: "px-5 py-2.5 text-sm rounded-xl gap-2 h-10",
        lg: "px-8 py-3.5 text-base rounded-2xl gap-3 h-12.5"
    };

    // Size styles (for circular icon buttons)
    const iconSizes = {
        sm: "w-8 h-8 text-sm",
        md: "w-10 h-10 text-base",
        lg: "w-12 h-12 text-lg"
    };

    // Combine classes
    const isIconOnly = variant === 'icon';
    const buttonClasses = classNames(
        baseStyles,
        variants[variant] || variants.primary,
        isIconOnly ? (iconSizes[size] || iconSizes.md) : (sizes[size] || sizes.md),
        className
    );

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
                icon={icon}
                {...props}
            >
                {children}
            </PrimeButton>
        </motion.div>
    );
};

export default Button;

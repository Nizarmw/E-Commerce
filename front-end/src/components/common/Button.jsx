import React from 'react';
import PropTypes from 'prop-types';
import { twMerge } from 'tailwind-merge';

const Button = ({
    children,
    type = 'button',
    className = '',
    variant = 'primary',
    size = 'md',
    disabled = false,
    isLoading = false,
    onClick,
    ...props
}) => {
    const baseStyles = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 font-poppins';
    
    const variants = {
        // Navy Blue sebagai primary sesuai brief (#1A237E)
        primary: 'bg-[#1A237E] text-white hover:bg-[#151B60] focus:ring-[#1A237E]/50',
        // Soft Gold/Mustard sebagai secondary (#FFCA28)
        secondary: 'bg-[#FFCA28] text-gray-900 hover:bg-[#FFB300] focus:ring-[#FFCA28]/50',
        success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500',
        danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
        outline: 'bg-transparent border-2 border-[#1A237E] text-[#1A237E] hover:bg-[#1A237E]/5 focus:ring-[#1A237E]/50',
    };
    
    const sizes = {
        sm: 'py-1.5 px-4 text-sm',
        md: 'py-2.5 px-6 text-base',
        lg: 'py-3.5 px-8 text-lg',
    };
    
    const classes = twMerge(
        baseStyles,
        variants[variant],
        sizes[size],
        disabled && 'opacity-50 cursor-not-allowed',
        className
    );
    
    return (
        <button
            type={type}
            className={classes}
            disabled={disabled || isLoading}
            onClick={onClick}
            {...props}
        >
            {isLoading ? (
                <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="font-open-sans">Loading...</span>
                </>
            ) : (
                children
            )}
        </button>
    );
};

Button.propTypes = {
    children: PropTypes.node.isRequired,
    type: PropTypes.oneOf(['button', 'submit', 'reset']),
    className: PropTypes.string,
    variant: PropTypes.oneOf(['primary', 'secondary', 'success', 'danger', 'outline']),
    size: PropTypes.oneOf(['sm', 'md', 'lg']),
    disabled: PropTypes.bool,
    isLoading: PropTypes.bool,
    onClick: PropTypes.func,
};

export default Button;
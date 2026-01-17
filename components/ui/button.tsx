'use client';

import { forwardRef, ButtonHTMLAttributes } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'ghost';
    size?: 'sm' | 'md' | 'lg' | 'xl';
    isLoading?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

const variantStyles = {
    primary: `
    bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white
    shadow-[var(--shadow-md)] hover:shadow-[var(--shadow-lg)]
    hover:-translate-y-0.5 active:translate-y-0
  `,
    secondary: `
    bg-[var(--glass-bg)] backdrop-blur-sm border border-[var(--glass-border)]
    text-[var(--foreground)] hover:bg-white/90
    shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)]
  `,
    success: `
    bg-[var(--success)] hover:bg-[var(--success-hover)] text-white
    shadow-[var(--shadow-md)] hover:shadow-[var(--shadow-lg)]
    hover:-translate-y-0.5 active:translate-y-0
  `,
    danger: `
    bg-[var(--danger)] hover:bg-[var(--danger-hover)] text-white
    shadow-[var(--shadow-md)] hover:shadow-[var(--shadow-lg)]
    hover:-translate-y-0.5 active:translate-y-0
  `,
    ghost: `
    bg-transparent hover:bg-[var(--primary-light)] text-[var(--primary)]
    hover:text-[var(--primary-hover)]
  `,
};

const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm rounded-lg',
    md: 'px-4 py-2.5 text-sm rounded-xl',
    lg: 'px-6 py-3 text-base rounded-xl',
    xl: 'px-8 py-4 text-lg rounded-2xl',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            className = '',
            variant = 'primary',
            size = 'md',
            isLoading = false,
            disabled,
            leftIcon,
            rightIcon,
            children,
            ...props
        },
        ref
    ) => {
        return (
            <button
                ref={ref}
                disabled={disabled || isLoading}
                className={`
          inline-flex items-center justify-center gap-2
          font-medium
          transition-all duration-[var(--duration-normal)] ease-out
          disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
          ${variantStyles[variant]}
          ${sizeStyles[size]}
          ${className}
        `}
                {...props}
            >
                {isLoading ? (
                    <svg
                        className="animate-spin h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        />
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                    </svg>
                ) : leftIcon}
                {children}
                {!isLoading && rightIcon}
            </button>
        );
    }
);

Button.displayName = 'Button';

export default Button;

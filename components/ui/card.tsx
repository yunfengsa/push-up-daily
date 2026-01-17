import { ReactNode } from 'react';

export interface CardProps {
    children: ReactNode;
    className?: string;
    hover?: boolean;
    animate?: boolean;
}

export interface CardHeaderProps {
    children: ReactNode;
    className?: string;
}

export interface CardBodyProps {
    children: ReactNode;
    className?: string;
}

export interface CardFooterProps {
    children: ReactNode;
    className?: string;
}

export function Card({
    children,
    className = '',
    hover = false,
    animate = false
}: CardProps) {
    return (
        <div
            className={`
        glass-card rounded-2xl overflow-hidden
        ${hover ? 'transition-all duration-[var(--duration-normal)] hover:-translate-y-1 hover:shadow-[var(--shadow-xl)]' : ''}
        ${animate ? 'animate-scale-in' : ''}
        ${className}
      `}
        >
            {children}
        </div>
    );
}

export function CardHeader({ children, className = '' }: CardHeaderProps) {
    return (
        <div className={`px-6 py-4 border-b border-white/10 ${className}`}>
            {children}
        </div>
    );
}

export function CardBody({ children, className = '' }: CardBodyProps) {
    return (
        <div className={`p-6 ${className}`}>
            {children}
        </div>
    );
}

export function CardFooter({ children, className = '' }: CardFooterProps) {
    return (
        <div className={`px-6 py-4 border-t border-white/10 bg-black/5 ${className}`}>
            {children}
        </div>
    );
}

export default Card;

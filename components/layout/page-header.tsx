import Link from 'next/link';
import { ReactNode } from 'react';

export interface PageHeaderProps {
    title?: string;
    backHref?: string;
    backLabel?: string;
    rightAction?: ReactNode;
}

export function PageHeader({
    title,
    backHref,
    backLabel = '返回',
    rightAction
}: PageHeaderProps) {
    return (
        <header className="glass-card rounded-none border-x-0 border-t-0">
            <div className="flex items-center justify-between px-4 py-3">
                {/* Left - Back Button */}
                {backHref ? (
                    <Link
                        href={backHref}
                        className="flex items-center gap-1.5 text-[var(--muted)] hover:text-[var(--foreground)] transition-colors group"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="transition-transform group-hover:-translate-x-0.5"
                        >
                            <path d="m15 18-6-6 6-6" />
                        </svg>
                        <span className="text-sm font-medium">{backLabel}</span>
                    </Link>
                ) : (
                    <div className="w-20" /> // Placeholder for alignment
                )}

                {/* Center - Title */}
                {title && (
                    <h1 className="text-lg font-bold text-[var(--foreground)]">
                        {title}
                    </h1>
                )}

                {/* Right - Action */}
                {rightAction ? (
                    <div className="flex items-center gap-2">
                        {rightAction}
                    </div>
                ) : (
                    <div className="w-20" /> // Placeholder for alignment
                )}
            </div>
        </header>
    );
}

export default PageHeader;

export interface SkeletonProps {
    className?: string;
    variant?: 'text' | 'circular' | 'rectangular';
    width?: string | number;
    height?: string | number;
}

export function Skeleton({
    className = '',
    variant = 'rectangular',
    width,
    height
}: SkeletonProps) {
    const variantStyles = {
        text: 'rounded h-4',
        circular: 'rounded-full',
        rectangular: 'rounded-xl',
    };

    return (
        <div
            className={`
        skeleton
        ${variantStyles[variant]}
        ${className}
      `}
            style={{
                width: typeof width === 'number' ? `${width}px` : width,
                height: typeof height === 'number' ? `${height}px` : height,
            }}
        />
    );
}

export function SkeletonCard() {
    return (
        <div className="glass-card rounded-2xl p-6 space-y-4">
            <Skeleton height={24} width="60%" />
            <Skeleton height={16} />
            <Skeleton height={16} width="80%" />
            <div className="flex gap-2 pt-2">
                <Skeleton height={36} width={80} />
                <Skeleton height={36} width={80} />
            </div>
        </div>
    );
}

export function SkeletonCalendar() {
    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex justify-between items-center">
                <Skeleton width={32} height={32} variant="circular" />
                <Skeleton width={120} height={24} />
                <Skeleton width={32} height={32} variant="circular" />
            </div>

            {/* Weekdays */}
            <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: 7 }).map((_, i) => (
                    <Skeleton key={i} height={20} className="mx-auto" width={20} />
                ))}
            </div>

            {/* Days */}
            <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: 35 }).map((_, i) => (
                    <Skeleton key={i} height={40} className="aspect-square" />
                ))}
            </div>
        </div>
    );
}

export default Skeleton;

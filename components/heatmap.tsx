'use client';

import React, { useState } from 'react';

type HeatmapProps = {
    data: Record<string, number>;
    year: number;
};

function getDaysInYear(year: number) {
    const days: Date[] = [];
    const date = new Date(year, 0, 1);
    while (date.getFullYear() === year) {
        days.push(new Date(date));
        date.setDate(date.getDate() + 1);
    }
    return days;
}

function getColorClass(count: number) {
    if (count === 0) return 'bg-black/5 dark:bg-white/5';
    if (count <= 10) return 'bg-[#86efac]';
    if (count <= 30) return 'bg-[#4ade80]';
    if (count <= 60) return 'bg-[#22c55e]';
    return 'bg-[#16a34a]';
}

export const Heatmap: React.FC<HeatmapProps> = ({ data, year }) => {
    const [tooltip, setTooltip] = useState<{ dateStr: string; count: number; x: number; y: number } | null>(null);

    const days = getDaysInYear(year);
    const firstDay = days[0];
    const startOffset = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
    const emptyCells = Array.from({ length: startOffset });

    const months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
    const weekDays = ['一', '', '三', '', '五', '', '日'];

    // Calculate month positions
    const getMonthPositions = () => {
        const positions: { month: string; position: number }[] = [];
        let weekCount = 0;
        let currentMonth = -1;

        for (let i = 0; i < startOffset; i++) {
            if ((i + 1) % 7 === 0) weekCount++;
        }

        days.forEach((day, index) => {
            const dayIndex = startOffset + index;
            if ((dayIndex) % 7 === 0 && index > 0) weekCount++;

            if (day.getMonth() !== currentMonth) {
                currentMonth = day.getMonth();
                positions.push({ month: months[currentMonth], position: weekCount });
            }
        });

        return positions;
    };

    const monthPositions = getMonthPositions();
    const totalWeeks = Math.ceil((startOffset + days.length) / 7);

    const handleMouseEnter = (dateStr: string, count: number, e: React.MouseEvent) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setTooltip({
            dateStr,
            count,
            x: rect.left + rect.width / 2,
            y: rect.top - 8
        });
    };

    return (
        <div className="relative">
            {/* Month Labels */}
            <div className="flex mb-2 text-[10px] text-[var(--muted)] pl-6">
                {monthPositions.map(({ month, position }, index) => (
                    <div
                        key={index}
                        className="absolute"
                        style={{ left: `${(position / totalWeeks) * 100}%` }}
                    >
                        {month}
                    </div>
                ))}
            </div>

            <div className="flex">
                {/* Weekday Labels */}
                <div className="flex flex-col gap-[3px] pr-2 pt-4">
                    {weekDays.map((day, i) => (
                        <div key={i} className="w-3 h-3 text-[10px] text-[var(--muted)] flex items-center justify-center">
                            {day}
                        </div>
                    ))}
                </div>

                {/* Heatmap Grid */}
                <div className="overflow-x-auto pb-2 flex-1">
                    <div data-testid="heatmap-grid" className="grid grid-flow-col grid-rows-7 gap-[3px] w-max">
                        {emptyCells.map((_, i) => (
                            <div key={`empty-${i}`} className="w-3 h-3" />
                        ))}
                        {days.map((day) => {
                            const y = day.getFullYear();
                            const m = String(day.getMonth() + 1).padStart(2, '0');
                            const d = String(day.getDate()).padStart(2, '0');
                            const dateStr = `${y}-${m}-${d}`;
                            const count = data[dateStr] || 0;

                            return (
                                <div
                                    key={dateStr}
                                    data-testid="heatmap-cell"
                                    className={`w-3 h-3 rounded-sm ${getColorClass(count)} 
                                              transition-all duration-150 cursor-pointer
                                              hover:scale-150 hover:z-10 hover:shadow-md`}
                                    onMouseEnter={(e) => handleMouseEnter(dateStr, count, e)}
                                    onMouseLeave={() => setTooltip(null)}
                                />
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Legend */}
            <div className="flex items-center justify-end gap-1 mt-3 text-[10px] text-[var(--muted)]">
                <span>少</span>
                <div className="w-3 h-3 rounded-sm bg-black/5" />
                <div className="w-3 h-3 rounded-sm bg-[#86efac]" />
                <div className="w-3 h-3 rounded-sm bg-[#4ade80]" />
                <div className="w-3 h-3 rounded-sm bg-[#22c55e]" />
                <div className="w-3 h-3 rounded-sm bg-[#16a34a]" />
                <span>多</span>
            </div>

            {/* Tooltip */}
            {tooltip && (
                <div
                    className="fixed z-50 px-2 py-1 text-xs rounded-lg shadow-lg pointer-events-none
                             bg-[var(--foreground)] text-[var(--background)] whitespace-nowrap
                             transform -translate-x-1/2 -translate-y-full"
                    style={{ left: tooltip.x, top: tooltip.y }}
                >
                    <span className="font-medium">{tooltip.dateStr}</span>
                    <span className="mx-1">·</span>
                    <span className="text-[var(--success)]">{tooltip.count} 个</span>
                </div>
            )}
        </div>
    );
};

export default Heatmap;

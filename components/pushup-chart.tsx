'use client';

import {
  AreaChart,
  Area,
  XAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

type DataPoint = {
  date: string;
  count: number;
};

type PushupChartProps = {
  data: DataPoint[];
};

export default function PushupChart({ data }: PushupChartProps) {
  // Format date to MM/DD
  const formatXAxis = (tickItem: string) => {
    const date = new Date(tickItem);
    return `${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}`;
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-card rounded-lg px-3 py-2 shadow-lg">
          <p className="text-xs text-[var(--muted)] mb-1">{formatXAxis(label)}</p>
          <p className="text-sm font-bold text-[var(--success)]">
            {payload[0].value} 个俯卧撑
          </p>
        </div>
      );
    }
    return null;
  };

  // Calculate max for better visualization
  const maxCount = Math.max(...data.map(d => d.count), 10);

  return (
    <div className="w-full h-[200px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="date"
            tickFormatter={formatXAxis}
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: 'var(--muted)' }}
            interval="preserveStartEnd"
            dy={8}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="count"
            stroke="#10B981"
            strokeWidth={2.5}
            fill="url(#colorCount)"
            dot={false}
            activeDot={{
              r: 6,
              fill: '#10B981',
              stroke: 'white',
              strokeWidth: 2,
            }}
            isAnimationActive={true}
            animationDuration={800}
            animationEasing="ease-out"
          />
        </AreaChart>
      </ResponsiveContainer>

      {/* Empty State - 只有数据加载完成后且全为0才显示 */}
      {data.length > 0 && data.every(d => d.count === 0) && (
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-sm text-[var(--muted)]">暂无数据，开始你的第一次打卡吧！</p>
        </div>
      )}
    </div>
  );
}

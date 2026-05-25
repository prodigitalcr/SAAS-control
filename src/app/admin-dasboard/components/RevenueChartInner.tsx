'use client';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const revenueData = [
  { month: 'Dic 25', revenue: 540000, tenants: 9 },
  { month: 'Ene 26', revenue: 588000, tenants: 10 },
  { month: 'Feb 26', revenue: 612000, tenants: 11 },
  { month: 'Mar 26', revenue: 588000, tenants: 10 },
  { month: 'Abr 26', revenue: 694000, tenants: 13 },
  { month: 'May 26', revenue: 742000, tenants: 14 },
];

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number; name: string }[];
  label?: string;
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border rounded-xl px-4 py-3 shadow-2xl">
        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2">
          {label}
        </p>
        <p className="text-lg font-black text-foreground font-tabular">
          ₡ {payload[0].value.toLocaleString('es-CR')}
        </p>
        <p className="text-[11px] text-muted-foreground font-bold">
          {payload[1]?.value} escuelas activas
        </p>
      </div>
    );
  }
  return null;
};

export default function RevenueChartInner() {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={revenueData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
            <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
        <XAxis
          dataKey="month"
          tick={{ fill: 'var(--muted-foreground)', fontSize: 10, fontWeight: 700 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: 'var(--muted-foreground)', fontSize: 10 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v: number) => `₡${(v / 1000).toFixed(0)}k`}
        />
        <Tooltip content={<CustomTooltip />} />
        <Area
          type="monotone"
          dataKey="revenue"
          stroke="var(--primary)"
          strokeWidth={2}
          fill="url(#revenueGradient)"
        />
        <Area
          type="monotone"
          dataKey="tenants"
          stroke="var(--accent)"
          strokeWidth={1.5}
          fill="none"
          strokeDasharray="4 4"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
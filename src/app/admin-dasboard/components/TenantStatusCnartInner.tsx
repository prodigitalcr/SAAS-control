'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

const statusData = [
  { status: 'Activo', count: 11, fill: '#10b981' },
  { status: 'Moroso', count: 2, fill: '#ef4444' },
  { status: 'Mantenim.', count: 1, fill: '#f59e0b' },
];

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border rounded-xl px-4 py-3 shadow-2xl">
        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">{label}</p>
        <p className="text-lg font-black text-foreground font-tabular">{payload[0].value} escuelas</p>
      </div>
    );
  }
  return null;
};

export default function TenantStatusChartInner() {
  return (
    <ResponsiveContainer width="100%" height={160}>
      <BarChart data={statusData} barSize={36} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
        <XAxis
          dataKey="status"
          tick={{ fill: 'var(--muted-foreground)', fontSize: 10, fontWeight: 700 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: 'var(--muted-foreground)', fontSize: 10 }}
          axisLine={false}
          tickLine={false}
          allowDecimals={false}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
        <Bar dataKey="count" radius={[6, 6, 0, 0]}>
          {statusData.map((entry) => (
            <Cell key={`cell-status-${entry.status}`} fill={entry.fill} fillOpacity={0.85} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
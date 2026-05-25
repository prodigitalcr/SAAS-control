import { Building2, Wifi, Ban, CircleDollarSign, CalendarClock, TrendingUp, TrendingDown, AlertTriangle, Clock } from 'lucide-react';

interface KPICardProps {
  label: string;
  value: string;
  subValue: string;
  trend: 'up' | 'down' | 'alert' | 'warning';
  variant: 'hero' | 'success' | 'danger' | 'primary' | 'warning';
  icon: string;
  description: string;
}

const iconMap: Record<string, React.ReactNode> = {
  'building-2': <Building2 className="w-5 h-5" />,
  'wifi': <Wifi className="w-5 h-5" />,
  'ban': <Ban className="w-5 h-5" />,
  'circle-dollar-sign': <CircleDollarSign className="w-5 h-5" />,
  'calendar-clock': <CalendarClock className="w-5 h-5" />,
};

const variantStyles: Record<string, { card: string; icon: string; value: string; badge: string }> = {
  hero: {
    card: 'bg-primary/5 border-primary/20 hover:border-primary/40',
    icon: 'bg-primary/20 text-primary border-primary/30',
    value: 'text-foreground',
    badge: 'text-primary',
  },
  success: {
    card: 'bg-success/5 border-success/20 hover:border-success/40',
    icon: 'bg-success/20 text-success border-success/30',
    value: 'text-success',
    badge: 'text-success',
  },
  danger: {
    card: 'bg-danger/10 border-danger/30 hover:border-danger/50',
    icon: 'bg-danger/20 text-danger border-danger/30',
    value: 'text-danger',
    badge: 'text-danger',
  },
  primary: {
    card: 'bg-card border-border hover:border-primary/30',
    icon: 'bg-primary/20 text-primary border-primary/30',
    value: 'text-foreground',
    badge: 'text-primary',
  },
  warning: {
    card: 'bg-warning/5 border-warning/20 hover:border-warning/40',
    icon: 'bg-warning/20 text-warning border-warning/30',
    value: 'text-warning',
    badge: 'text-warning',
  },
};

const TrendIcon = ({ trend }: { trend: string }) => {
  if (trend === 'up') return <TrendingUp className="w-3 h-3" />;
  if (trend === 'down') return <TrendingDown className="w-3 h-3" />;
  if (trend === 'alert') return <AlertTriangle className="w-3 h-3" />;
  return <Clock className="w-3 h-3" />;
};

export default function KPICard({ label, value, subValue, trend, variant, icon, description }: KPICardProps) {
  const styles = variantStyles[variant];
  return (
    <div className={`rounded-2xl border p-5 transition-all duration-200 h-full ${styles.card}`}>
      <div className="flex items-start justify-between mb-3">
        <div className={`p-2.5 rounded-xl border ${styles.icon}`}>
          {iconMap[icon]}
        </div>
        <div className={`flex items-center gap-1 text-[10px] font-bold uppercase ${styles.badge}`}>
          <TrendIcon trend={trend} />
          <span className="hidden sm:inline">{trend === 'alert' ? 'Alerta' : trend === 'warning' ? 'Aviso' : trend === 'up' ? 'Positivo' : 'Negativo'}</span>
        </div>
      </div>
      <div className={`text-hero-metric font-tabular mb-1 ${styles.value}`}>
        {value}
      </div>
      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-wider mb-1">
        {label}
      </p>
      <p className={`text-[11px] font-bold ${styles.badge}`}>
        {subValue}
      </p>
      <p className="text-[10px] text-muted-foreground/50 mt-2 leading-relaxed hidden lg:block">
        {description}
      </p>
    </div>
  );
}
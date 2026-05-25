import TenantStatusChart from './TenantStatusChart';
import RevenueChart from './RevenueChart';
import KPICard from './KPICard';

// Grid plan: 5 KPI cards + 2 charts
// Row 1: hero (spans 2 cols) + 2 regular cards → grid-cols-4
// Row 2: 2 regular cards + status chart (spans 2 cols) → grid-cols-4
// Row 3: revenue chart spans full width

export default function KPIBentoGrid() {
  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-sm font-black text-foreground uppercase tracking-widest">
            Panel de Control — Vista General
          </h2>
          <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-0.5">
            Actualizado: 25 May 2026, 00:05 CST
          </p>
        </div>
      </div>

      {/* Row 1: hero + 2 regular */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-4 gap-4 mb-4">
        {/* Hero: Total Tenants — spans 2 cols */}
        <div className="md:col-span-2 lg:col-span-2 xl:col-span-2 2xl:col-span-2">
          <KPICard
            label="Total Escuelas Desplegadas"
            value="14"
            subValue="+2 este mes"
            trend="up"
            variant="hero"
            icon="building-2"
            description="Instituciones activas en la plataforma"
          />
        </div>
        <KPICard
          label="En Línea (Activas)"
          value="11"
          subValue="78.5% del total"
          trend="up"
          variant="success"
          icon="wifi"
          description="Acceso habilitado y funcionando"
        />
        <KPICard
          label="Morosas (Bloqueadas)"
          value="2"
          subValue="Requieren acción"
          trend="alert"
          variant="danger"
          icon="ban"
          description="Sin pago — acceso restringido"
        />
      </div>

      {/* Row 2: 2 regular + status chart */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-4 gap-4 mb-4">
        <KPICard
          label="MRR Total"
          value="₡ 742,000"
          subValue="↑ ₡48,000 vs mes anterior"
          trend="up"
          variant="primary"
          icon="circle-dollar-sign"
          description="Ingresos recurrentes mensuales"
        />
        <KPICard
          label="Cortes Próximos (7 días)"
          value="3"
          subValue="Vencen pronto"
          trend="warning"
          variant="warning"
          icon="calendar-clock"
          description="Requieren renovación inmediata"
        />
        {/* Status Distribution Chart — spans 2 cols */}
        <div className="md:col-span-2 lg:col-span-2 xl:col-span-2 2xl:col-span-2 bg-card card-border rounded-2xl p-5">
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-4">
            Distribución de Estado — Tenants
          </p>
          <TenantStatusChart />
        </div>
      </div>

      {/* Row 3: Revenue chart full width */}
      <div className="bg-card card-border rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
              Ingresos Mensuales por Contrato
            </p>
            <p className="text-xs text-muted-foreground/60 mt-0.5">
              Últimos 6 meses — todas las escuelas
            </p>
          </div>
          <span className="text-[10px] font-black text-success bg-success/10 border border-success/20 px-3 py-1 rounded-full uppercase tracking-widest">
            +6.9% vs mes anterior
          </span>
        </div>
        <RevenueChart />
      </div>
    </section>
  );
}
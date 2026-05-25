'use client';

import dynamic from 'next/dynamic';

const TenantStatusChartInner = dynamic(
  () => import('./TenantStatusChartInner'),
  {
    ssr: false,
    loading: () => (
      <div className="h-[160px] w-full animate-pulse bg-muted/30 rounded-xl" />
    ),
  }
);

export default function TenantStatusChart() {
  return <TenantStatusChartInner />;
}
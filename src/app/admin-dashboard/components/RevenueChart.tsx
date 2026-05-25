'use client';

import dynamic from 'next/dynamic';

const RevenueChartInner = dynamic(
  () => import('./RevenueChartInner'),
  {
    ssr: false,
    loading: () => (
      <div className="h-[200px] w-full animate-pulse bg-muted/30 rounded-xl" />
    ),
  }
);

export default function RevenueChart() {
  return <RevenueChartInner />;
}
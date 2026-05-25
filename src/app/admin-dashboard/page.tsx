import DashboardTopbar from './components/DashboardTopbar';
import KPIBentoGrid from './components/KPIBentoGrid';
import DeployTenantForm from './components/DeployTenantForm';
import TenantTable from './components/TenantTable';

export default function AdminDashboardPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <DashboardTopbar />
      <main className="flex-1 max-w-screen-2xl mx-auto w-full px-4 md:px-8 xl:px-10 2xl:px-16 py-8 space-y-8">
        <KPIBentoGrid />
        <DeployTenantForm />
        <TenantTable />
      </main>
    </div>
  );
}
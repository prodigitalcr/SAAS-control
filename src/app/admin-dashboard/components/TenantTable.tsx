'use client';

import React, { useState, useMemo } from 'react';
import { toast } from 'sonner';
import {
  Search,
  MessageCircle,
  ExternalLink,
  Settings,
  Trash2,
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
  Filter,
  Building2,
  AlertTriangle,
  CheckCircle2,
  Wrench,
  X,
} from 'lucide-react';
import ManageModal from './ManageModal';
import DeleteConfirmModal from './DeleteConfirmModal';

export interface Tenant {
  id: string;
  empresa: string;
  adminUid: string;
  tipoPlan: string;
  telefono: string;
  montoContrato: number;
  fechaCorte: string;
  estado: 'Activo' | 'Moroso' | 'Mantenimiento';
  htmlMora: string;
  htmlMantenimiento: string;
  notas?: string;
}

// Backend integration point: replace with Firestore real-time listener
const MOCK_TENANTS: Tenant[] = [
  { id: 'escuela_carpio', empresa: 'Escuela El Carpio', adminUid: 'director.carpio@mep.go.cr', tipoPlan: 'Mensual', telefono: '50688123456', montoContrato: 65000, fechaCorte: '2026-06-01', estado: 'Activo', htmlMora: '', htmlMantenimiento: '', notas: 'Primer cliente ProDigital' },
  { id: 'colegio_moravia', empresa: 'Colegio Técnico Moravia', adminUid: 'admin.moravia@ctm.edu.cr', tipoPlan: 'Anual', telefono: '50688234567', montoContrato: 52000, fechaCorte: '2027-01-15', estado: 'Activo', htmlMora: '', htmlMantenimiento: '' },
  { id: 'escuela_hatillo', empresa: 'Escuela Hatillo 4', adminUid: 'director.h4@mep.go.cr', tipoPlan: 'Mensual', telefono: '50687345678', montoContrato: 48000, fechaCorte: '2026-05-28', estado: 'Moroso', htmlMora: '<h1>Servicio suspendido por falta de pago</h1>', htmlMantenimiento: '' },
  { id: 'liceo_desamparados', empresa: 'Liceo de Desamparados', adminUid: 'rectora.desamparados@mep.go.cr', tipoPlan: 'Mensual', telefono: '50686456789', montoContrato: 72000, fechaCorte: '2026-06-10', estado: 'Activo', htmlMora: '', htmlMantenimiento: '' },
  { id: 'escuela_pavas', empresa: 'Escuela Pavas Centro', adminUid: 'admin.pavas@mep.go.cr', tipoPlan: 'Trimestral', telefono: '50685567890', montoContrato: 55000, fechaCorte: '2026-07-01', estado: 'Activo', htmlMora: '', htmlMantenimiento: '' },
  { id: 'colegio_palmares', empresa: 'Colegio Agropecuario Palmares', adminUid: 'director.palmares@cap.ed.cr', tipoPlan: 'Anual', telefono: '50684678901', montoContrato: 61000, fechaCorte: '2026-12-20', estado: 'Activo', htmlMora: '', htmlMantenimiento: '' },
  { id: 'escuela_alajuela', empresa: 'Escuela Central Alajuela', adminUid: 'dir.alajuela@mep.go.cr', tipoPlan: 'Mensual', telefono: '50683789012', montoContrato: 58000, fechaCorte: '2026-05-30', estado: 'Mantenimiento', htmlMora: '', htmlMantenimiento: '<h1>Sistema en actualización — Volvemos en breve</h1>' },
  { id: 'liceo_coronado', empresa: 'Liceo Académico Coronado', adminUid: 'rector.coronado@lac.ed.cr', tipoPlan: 'Mensual', telefono: '50682890123', montoContrato: 67000, fechaCorte: '2026-06-15', estado: 'Activo', htmlMora: '', htmlMantenimiento: '' },
  { id: 'escuela_grecia', empresa: 'Escuela Central Grecia', adminUid: 'directora.grecia@mep.go.cr', tipoPlan: 'Anual', telefono: '50681901234', montoContrato: 44000, fechaCorte: '2026-11-30', estado: 'Activo', htmlMora: '', htmlMantenimiento: '' },
  { id: 'colegio_puriscal', empresa: 'Colegio Técnico Puriscal', adminUid: 'dir.puriscal@ctp.ed.cr', tipoPlan: 'Mensual', telefono: '50680012345', montoContrato: 53000, fechaCorte: '2026-06-05', estado: 'Moroso', htmlMora: '<h1>Acceso restringido. Comuníquese con ProDigital.</h1>', htmlMantenimiento: '' },
  { id: 'escuela_heredia', empresa: 'Escuela Juan XXIII Heredia', adminUid: 'dir.jxxiii@mep.go.cr', tipoPlan: 'Trimestral', telefono: '50689123456', montoContrato: 49000, fechaCorte: '2026-08-10', estado: 'Activo', htmlMora: '', htmlMantenimiento: '' },
  { id: 'liceo_cartago', empresa: 'Liceo de Cartago', adminUid: 'rectora.cartago@ldc.ed.cr', tipoPlan: 'Anual', telefono: '50688765432', montoContrato: 78000, fechaCorte: '2026-10-01', estado: 'Activo', htmlMora: '', htmlMantenimiento: '' },
];

const BASE_CLIENT_URL = 'https://prodigitalcr.github.io/TENANT-ESCUELA/';

const statusConfig = {
  Activo: {
    label: 'EN LÍNEA',
    className: 'text-success bg-success/10 border-success/20',
    icon: <CheckCircle2 className="w-3 h-3" />,
  },
  Moroso: {
    label: 'MOROSO',
    className: 'text-danger bg-danger/10 border-danger/20',
    icon: <AlertTriangle className="w-3 h-3" />,
  },
  Mantenimiento: {
    label: 'MANTENIM.',
    className: 'text-warning bg-warning/10 border-warning/20',
    icon: <Wrench className="w-3 h-3" />,
  },
};

const ITEMS_PER_PAGE_OPTIONS = [5, 10, 20];

export default function TenantTable() {
  const [tenants, setTenants] = useState<Tenant[]>(MOCK_TENANTS);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [planFilter, setPlanFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [managingTenant, setManagingTenant] = useState<Tenant | null>(null);
  const [deletingTenant, setDeletingTenant] = useState<Tenant | null>(null);

  const filtered = useMemo(() => {
    return tenants.filter((t) => {
      const matchSearch =
        search === '' ||
        t.empresa.toLowerCase().includes(search.toLowerCase()) ||
        t.id.toLowerCase().includes(search.toLowerCase()) ||
        t.adminUid.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === 'all' || t.estado === statusFilter;
      const matchPlan = planFilter === 'all' || t.tipoPlan === planFilter;
      return matchSearch && matchStatus && matchPlan;
    });
  }, [tenants, search, statusFilter, planFilter]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const copyToClipboard = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(key);
      setTimeout(() => setCopiedId(null), 2000);
      toast.success('Copiado al portapapeles');
    } catch {
      toast.error('Error al copiar');
    }
  };

  const handleSaveTenant = (updated: Tenant) => {
    // Backend integration point: replace with Firestore update
    setTenants((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
    toast.success(`Estado de "${updated.empresa}" actualizado`);
    setManagingTenant(null);
  };

  const handleDeleteTenant = (id: string) => {
    // Backend integration point: replace with Firestore delete
    setTenants((prev) => prev.filter((t) => t.id !== id));
    toast.success('Institución eliminada del sistema');
    setDeletingTenant(null);
  };

  return (
    <>
      <div className="bg-card card-border rounded-3xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-border bg-surface/40">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-black text-foreground uppercase tracking-widest">
                Sistemas Escolares Monitorizados
              </h3>
              <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-0.5">
                {filtered.length} institución{filtered.length !== 1 ? 'es' : ''} •{' '}
                {tenants.filter((t) => t.estado === 'Activo').length} en línea •{' '}
                {tenants.filter((t) => t.estado === 'Moroso').length} morosas
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Buscar escuela, ID, UID..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="bg-surface border border-border rounded-xl pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all w-full sm:w-64"
                />
                {search && (
                  <button
                    onClick={() => setSearch('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Status Filter */}
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="bg-surface border border-border rounded-xl pl-9 pr-8 py-2.5 text-xs font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all appearance-none"
                >
                  <option value="all">Todos los estados</option>
                  <option value="Activo">En Línea</option>
                  <option value="Moroso">Morosos</option>
                  <option value="Mantenimiento">Mantenimiento</option>
                </select>
              </div>

              {/* Plan Filter */}
              <div className="relative">
                <select
                  value={planFilter}
                  onChange={(e) => {
                    setPlanFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="bg-surface border border-border rounded-xl px-4 py-2.5 text-xs font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all appearance-none"
                >
                  <option value="all">Todos los planes</option>
                  <option value="Mensual">Mensual</option>
                  <option value="Trimestral">Trimestral</option>
                  <option value="Anual">Anual</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {paginated.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="bg-muted/30 rounded-2xl p-5">
                <Building2 className="w-10 h-10 text-muted-foreground" />
              </div>
              <div className="text-center">
                <p className="text-sm font-black text-foreground uppercase tracking-widest mb-1">
                  No se encontraron instituciones
                </p>
                <p className="text-xs text-muted-foreground">
                  {search || statusFilter !== 'all' || planFilter !== 'all' ?'Ajusta los filtros de búsqueda para ver resultados' :'Usa el formulario superior para desplegar tu primera escuela'}
                </p>
              </div>
              {(search || statusFilter !== 'all' || planFilter !== 'all') && (
                <button
                  onClick={() => {
                    setSearch('');
                    setStatusFilter('all');
                    setPlanFilter('all');
                  }}
                  className="text-[11px] font-black text-primary uppercase tracking-widest hover:underline"
                >
                  Limpiar filtros
                </button>
              )}
            </div>
          ) : (
            <table className="w-full text-left min-w-[900px]">
              <thead className="bg-surface/60 text-muted-foreground text-[10px] uppercase font-black border-b border-border">
                <tr>
                  <th className="px-6 py-4">Institución / ID URL</th>
                  <th className="px-6 py-4">Admin UID</th>
                  <th className="px-6 py-4">Plan</th>
                  <th className="px-6 py-4">Corte</th>
                  <th className="px-6 py-4">Monto</th>
                  <th className="px-6 py-4 text-center">Estado</th>
                  <th className="px-6 py-4">WhatsApp</th>
                  <th className="px-6 py-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {paginated.map((tenant) => {
                  const tenantUrl = `${BASE_CLIENT_URL}?tenant=${tenant.id}`;
                  const waLink = `https://wa.me/${tenant.telefono.replace(/\D/g, '')}?text=${encodeURIComponent(`Hola ${tenant.empresa}, te contactamos de soporte ProDigital.`)}`;
                  const status = statusConfig[tenant.estado];
                  const isOverdueSoon =
                    tenant.estado === 'Activo' &&
                    new Date(tenant.fechaCorte) <=
                      new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

                  return (
                    <tr
                      key={`tenant-row-${tenant.id}`}
                      className="hover:bg-muted/20 transition-colors group"
                    >
                      {/* Institution */}
                      <td className="px-6 py-4">
                        <div className="font-black text-foreground text-xs uppercase group-hover:text-primary transition-colors mb-1">
                          {tenant.empresa}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span
                            className="text-[9px] font-mono text-muted-foreground/70 bg-surface px-2 py-0.5 rounded border border-border truncate max-w-[180px]"
                            title={tenantUrl}
                          >
                            ?tenant={tenant.id}
                          </span>
                          <button
                            onClick={() => copyToClipboard(tenantUrl, `url-${tenant.id}`)}
                            className="text-primary/60 hover:text-primary transition-colors"
                            title="Copiar URL completa"
                          >
                            {copiedId === `url-${tenant.id}` ? (
                              <Check className="w-3 h-3 text-success" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                      </td>

                      {/* Admin UID */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`text-[10px] font-mono font-bold truncate max-w-[130px] ${
                              tenant.adminUid ? 'text-success' : 'text-danger'
                            }`}
                            title={tenant.adminUid || 'No asignado'}
                          >
                            {tenant.adminUid || 'No asignado'}
                          </span>
                          {tenant.adminUid && (
                            <button
                              onClick={() => copyToClipboard(tenant.adminUid, `uid-${tenant.id}`)}
                              className="text-success/50 hover:text-success transition-colors flex-shrink-0"
                              title="Copiar UID"
                            >
                              {copiedId === `uid-${tenant.id}` ? (
                                <Check className="w-3 h-3 text-success" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </button>
                          )}
                        </div>
                      </td>

                      {/* Plan */}
                      <td className="px-6 py-4">
                        <span className="text-[10px] font-black text-foreground/80 uppercase bg-surface border border-border px-2.5 py-1 rounded-lg">
                          {tenant.tipoPlan}
                        </span>
                      </td>

                      {/* Cutoff Date */}
                      <td className="px-6 py-4">
                        <div
                          className={`text-[11px] font-mono font-bold ${
                            isOverdueSoon ? 'text-warning' : 'text-muted-foreground'
                          }`}
                        >
                          {tenant.fechaCorte}
                          {isOverdueSoon && (
                            <span className="block text-[9px] text-warning font-black uppercase tracking-widest mt-0.5">
                              ⚠ Próximo
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Amount */}
                      <td className="px-6 py-4">
                        <span className="text-sm font-black text-primary font-tabular">
                          ₡{tenant.montoContrato.toLocaleString('es-CR')}
                        </span>
                      </td>

                      {/* Status Badge */}
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[9px] font-black uppercase tracking-widest ${status.className}`}
                        >
                          {status.icon}
                          {status.label}
                        </span>
                      </td>

                      {/* WhatsApp */}
                      <td className="px-6 py-4">
                        <a
                          href={waLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-[10px] font-mono text-muted-foreground hover:text-success transition-colors"
                          title={`WhatsApp: ${tenant.telefono}`}
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span className="hidden xl:inline">{tenant.telefono}</span>
                        </a>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-1.5">
                          <a
                            href={waLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 bg-success/10 text-success rounded-xl hover:bg-success hover:text-white transition-all duration-150 opacity-0 group-hover:opacity-100"
                            title="Contactar por WhatsApp"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                          </a>
                          <a
                            href={tenantUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 bg-muted/50 text-muted-foreground rounded-xl hover:bg-foreground hover:text-background transition-all duration-150 opacity-0 group-hover:opacity-100"
                            title="Visitar app del cliente"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                          <button
                            onClick={() => setManagingTenant(tenant)}
                            className="p-2 bg-primary/10 text-primary rounded-xl hover:bg-primary hover:text-white transition-all duration-150"
                            title="Configurar estado y bloqueos"
                          >
                            <Settings className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeletingTenant(tenant)}
                            className="p-2 bg-danger/10 text-danger rounded-xl hover:bg-danger hover:text-white transition-all duration-150 opacity-0 group-hover:opacity-100"
                            title="Eliminar institución"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {filtered.length > 0 && (
          <div className="px-6 py-4 border-t border-border bg-surface/30 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
                Mostrando {(currentPage - 1) * itemsPerPage + 1}–
                {Math.min(currentPage * itemsPerPage, filtered.length)} de {filtered.length}
              </span>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="bg-surface border border-border rounded-lg px-2 py-1 text-[10px] font-bold text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              >
                {ITEMS_PER_PAGE_OPTIONS.map((n) => (
                  <option key={`perpage-${n}`} value={n}>
                    {n} por página
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                .reduce<(number | string)[]>((acc, p, idx, arr) => {
                  if (idx > 0 && (p as number) - (arr[idx - 1] as number) > 1) {
                    acc.push('...');
                  }
                  acc.push(p);
                  return acc;
                }, [])
                .map((item, idx) =>
                  item === '...' ? (
                    <span
                      key={`ellipsis-${idx}`}
                      className="px-2 text-muted-foreground text-xs"
                    >
                      …
                    </span>
                  ) : (
                    <button
                      key={`page-${item}`}
                      onClick={() => setCurrentPage(item as number)}
                      className={`w-8 h-8 rounded-lg text-[11px] font-black transition-all ${
                        currentPage === item
                          ? 'bg-primary text-primary-foreground'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                      }`}
                    >
                      {item}
                    </button>
                  )
                )}

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Manage Modal */}
      {managingTenant && (
        <ManageModal
          tenant={managingTenant}
          onClose={() => setManagingTenant(null)}
          onSave={handleSaveTenant}
        />
      )}

      {/* Delete Confirm Modal */}
      {deletingTenant && (
        <DeleteConfirmModal
          tenant={deletingTenant}
          onClose={() => setDeletingTenant(null)}
          onConfirm={() => handleDeleteTenant(deletingTenant.id)}
        />
      )}
    </>
  );
}
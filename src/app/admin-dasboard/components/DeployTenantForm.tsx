'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Zap, ShieldCheck, Loader2, AlertTriangle, ChevronDown } from 'lucide-react';

interface DeployFormValues {
  tenantId: string;
  adminUid: string;
  companyName: string;
  plan: string;
  whatsapp: string;
  monthlyAmount: string;
  cutoffDate: string;
  notes: string;
}

interface DeployTenantFormProps {
  onTenantCreated?: () => void;
}

export default function DeployTenantForm({ onTenantCreated }: DeployTenantFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DeployFormValues>();

  const onSubmit = async (data: DeployFormValues) => {
    setIsSubmitting(true);
    try {
      // Backend integration point: replace with Firestore db.collection('tenants').doc(id).set({...})
      await new Promise((r) => setTimeout(r, 1200));
      toast.success(`Escuela "${data.companyName}" desplegada exitosamente`);
      reset();
      onTenantCreated?.();
    } catch {
      toast.error('Error al desplegar escuela. Verifica los permisos.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="bg-card card-border rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
      {/* Decorative glow */}
      <div className="absolute -top-16 -right-16 w-48 h-48 bg-primary opacity-[0.04] rounded-full blur-[60px] pointer-events-none" />

      <div className="flex items-center gap-3 mb-6">
        <div className="bg-primary/20 border border-primary/30 p-2.5 rounded-xl">
          <Zap className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="text-sm font-black text-foreground uppercase tracking-widest">
            Desplegar Nueva Escuela (Tenant)
          </h3>
          <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mt-0.5">
            Registra y activa una nueva institución en Firestore
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {/* Row 1 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-4 gap-4 mb-4">
          {/* Tenant ID */}
          <div className="space-y-1.5">
            <label
              htmlFor="tenantId"
              className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1"
            >
              ID Único (URL / Carpeta)
            </label>
            <p className="text-[10px] text-muted-foreground/50 ml-1 mb-1">
              Sin espacios. Ej: escuela_carpio
            </p>
            <input
              id="tenantId"
              type="text"
              placeholder="escuela_carpio"
              className="w-full bg-surface border border-border rounded-xl p-3.5 text-sm font-mono text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
              {...register('tenantId', {
                required: 'El ID es requerido',
                pattern: {
                  value: /^[a-z0-9_-]+$/,
                  message: 'Solo minúsculas, números y guiones',
                },
              })}
            />
            {errors.tenantId && (
              <p className="text-[10px] text-danger font-bold flex items-center gap-1 ml-1">
                <AlertTriangle className="w-3 h-3" />
                {errors.tenantId.message}
              </p>
            )}
          </div>

          {/* Admin UID */}
          <div className="space-y-1.5">
            <label
              htmlFor="adminUid"
              className="block text-[10px] font-bold text-success uppercase tracking-widest ml-1"
            >
              UID Admin Director
            </label>
            <p className="text-[10px] text-muted-foreground/50 ml-1 mb-1">
              Correo o UID de Firebase
            </p>
            <input
              id="adminUid"
              type="text"
              placeholder="director@escuela.edu.cr"
              className="w-full bg-surface border border-border rounded-xl p-3.5 text-sm font-mono text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-success focus:border-success transition-all"
              {...register('adminUid', { required: 'El UID es requerido' })}
            />
            {errors.adminUid && (
              <p className="text-[10px] text-danger font-bold flex items-center gap-1 ml-1">
                <AlertTriangle className="w-3 h-3" />
                {errors.adminUid.message}
              </p>
            )}
          </div>

          {/* Company Name */}
          <div className="space-y-1.5">
            <label
              htmlFor="companyName"
              className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1"
            >
              Nombre de la Institución
            </label>
            <p className="text-[10px] text-muted-foreground/50 ml-1 mb-1">
              Nombre oficial completo
            </p>
            <input
              id="companyName"
              type="text"
              placeholder="Escuela El Carpio"
              className="w-full bg-surface border border-border rounded-xl p-3.5 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
              {...register('companyName', { required: 'El nombre es requerido' })}
            />
            {errors.companyName && (
              <p className="text-[10px] text-danger font-bold flex items-center gap-1 ml-1">
                <AlertTriangle className="w-3 h-3" />
                {errors.companyName.message}
              </p>
            )}
          </div>

          {/* Plan */}
          <div className="space-y-1.5">
            <label
              htmlFor="plan"
              className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1"
            >
              Plan de Servicio
            </label>
            <p className="text-[10px] text-muted-foreground/50 ml-1 mb-1">
              Ciclo de facturación
            </p>
            <div className="relative">
              <select
                id="plan"
                className="w-full bg-surface border border-border rounded-xl p-3.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all appearance-none pr-10"
                {...register('plan', { required: 'Selecciona un plan' })}
              >
                <option value="">Seleccionar...</option>
                <option value="Mensual">Suscripción Mensual</option>
                <option value="Anual">Suscripción Anual</option>
                <option value="Trimestral">Suscripción Trimestral</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>
            {errors.plan && (
              <p className="text-[10px] text-danger font-bold flex items-center gap-1 ml-1">
                <AlertTriangle className="w-3 h-3" />
                {errors.plan.message}
              </p>
            )}
          </div>
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-4 gap-4 mb-6">
          {/* WhatsApp */}
          <div className="space-y-1.5">
            <label
              htmlFor="whatsapp"
              className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1"
            >
              WhatsApp de Contacto
            </label>
            <p className="text-[10px] text-muted-foreground/50 ml-1 mb-1">
              Formato: 50688888888
            </p>
            <input
              id="whatsapp"
              type="tel"
              placeholder="50688888888"
              className="w-full bg-surface border border-border rounded-xl p-3.5 text-sm font-mono text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
              {...register('whatsapp', {
                pattern: {
                  value: /^[0-9+\s()-]{7,20}$/,
                  message: 'Número de teléfono inválido',
                },
              })}
            />
            {errors.whatsapp && (
              <p className="text-[10px] text-danger font-bold flex items-center gap-1 ml-1">
                <AlertTriangle className="w-3 h-3" />
                {errors.whatsapp.message}
              </p>
            )}
          </div>

          {/* Monthly Amount */}
          <div className="space-y-1.5">
            <label
              htmlFor="monthlyAmount"
              className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1"
            >
              Mensualidad (₡ / $)
            </label>
            <p className="text-[10px] text-muted-foreground/50 ml-1 mb-1">
              Monto del contrato
            </p>
            <input
              id="monthlyAmount"
              type="number"
              placeholder="0.00"
              min="0"
              step="0.01"
              className="w-full bg-surface border border-border rounded-xl p-3.5 text-sm font-mono text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
              {...register('monthlyAmount', {
                required: 'El monto es requerido',
                min: { value: 0, message: 'Monto inválido' },
              })}
            />
            {errors.monthlyAmount && (
              <p className="text-[10px] text-danger font-bold flex items-center gap-1 ml-1">
                <AlertTriangle className="w-3 h-3" />
                {errors.monthlyAmount.message}
              </p>
            )}
          </div>

          {/* Cutoff Date */}
          <div className="space-y-1.5">
            <label
              htmlFor="cutoffDate"
              className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1"
            >
              Fecha de Próximo Corte
            </label>
            <p className="text-[10px] text-muted-foreground/50 ml-1 mb-1">
              Fecha de vencimiento
            </p>
            <input
              id="cutoffDate"
              type="date"
              className="w-full bg-surface border border-border rounded-xl p-3.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
              {...register('cutoffDate', { required: 'La fecha de corte es requerida' })}
            />
            {errors.cutoffDate && (
              <p className="text-[10px] text-danger font-bold flex items-center gap-1 ml-1">
                <AlertTriangle className="w-3 h-3" />
                {errors.cutoffDate.message}
              </p>
            )}
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <label
              htmlFor="notes"
              className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1"
            >
              Notas Internas
            </label>
            <p className="text-[10px] text-muted-foreground/50 ml-1 mb-1">
              Opcional — solo visible aquí
            </p>
            <input
              id="notes"
              type="text"
              placeholder="Referido por director Mora..."
              className="w-full bg-surface border border-border rounded-xl p-3.5 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
              {...register('notes')}
            />
          </div>
        </div>

        {/* Submit */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2.5 bg-primary hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed text-primary-foreground font-black px-8 py-4 rounded-2xl transition-all duration-150 active:scale-[0.98] uppercase text-xs tracking-widest shadow-lg shadow-primary/25"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Desplegando...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Iniciar Plataforma y Activar UID</span>
              </>
            )}
          </button>
          <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wide">
            Se creará el documento en Firestore{' '}
            <span className="text-primary">tenants/{'{id}'}</span> con estado Activo
          </p>
        </div>
      </form>
    </section>
  );
}
'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import {
  Settings2,
  XCircle,
  Loader2,
  Code2,
  CheckCircle2,
  AlertTriangle,
  Wrench,
  Copy,
  Check,
} from 'lucide-react';
import type { Tenant } from './TenantTable';

interface ManageModalProps {
  tenant: Tenant;
  onClose: () => void;
  onSave: (updated: Tenant) => void;
}

interface ManageFormValues {
  estado: 'Activo' | 'Moroso' | 'Mantenimiento';
  htmlMora: string;
  htmlMantenimiento: string;
}

const statusOptions = [
  {
    value: 'Activo',
    label: 'EN LÍNEA',
    icon: <CheckCircle2 className="w-4 h-4" />,
    styles: 'peer-checked:bg-success/10 peer-checked:border-success peer-checked:text-success',
  },
  {
    value: 'Moroso',
    label: 'MOROSO',
    icon: <AlertTriangle className="w-4 h-4" />,
    styles: 'peer-checked:bg-danger/10 peer-checked:border-danger peer-checked:text-danger',
  },
  {
    value: 'Mantenimiento',
    label: 'MANTENIM.',
    icon: <Wrench className="w-4 h-4" />,
    styles: 'peer-checked:bg-warning/10 peer-checked:border-warning peer-checked:text-warning',
  },
];

export default function ManageModal({ tenant, onClose, onSave }: ManageModalProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedUid, setCopiedUid] = useState(false);
  const BASE_CLIENT_URL = 'https://prodigitalcr.github.io/TENANT-ESCUELA/';
  const tenantUrl = `${BASE_CLIENT_URL}?tenant=${tenant.id}`;

  const { register, handleSubmit, setValue, watch } = useForm<ManageFormValues>({
    defaultValues: {
      estado: tenant.estado,
      htmlMora: tenant.htmlMora,
      htmlMantenimiento: tenant.htmlMantenimiento,
    },
  });

  const currentEstado = watch('estado');

  useEffect(() => {
    setValue('estado', tenant.estado);
    setValue('htmlMora', tenant.htmlMora);
    setValue('htmlMantenimiento', tenant.htmlMantenimiento);
  }, [tenant, setValue]);

  const copyText = async (text: string, type: 'url' | 'uid') => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === 'url') {
        setCopiedUrl(true);
        setTimeout(() => setCopiedUrl(false), 2000);
      } else {
        setCopiedUid(true);
        setTimeout(() => setCopiedUid(false), 2000);
      }
      toast.success('Copiado');
    } catch {
      toast.error('Error al copiar');
    }
  };

  const onSubmit = async (data: ManageFormValues) => {
    setIsSaving(true);
    try {
      // Backend integration point: replace with Firestore db.collection('tenants').doc(tenant.id).set({...}, {merge: true})
      await new Promise((r) => setTimeout(r, 800));
      onSave({ ...tenant, ...data });
    } catch {
      toast.error('Error al guardar cambios');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 modal-backdrop z-[200] flex items-center justify-center p-4 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-card border border-border w-full max-w-2xl rounded-3xl p-8 my-auto shadow-2xl animate-slide-up relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-primary/20 border border-primary/30 p-3 rounded-2xl">
              <Settings2 className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-base font-black text-foreground uppercase tracking-tight">
                Gestión del Cliente SaaS
              </h2>
              <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-0.5">
                Configurar estado y mensajes de bloqueo
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
            aria-label="Cerrar modal"
          >
            <XCircle className="w-6 h-6" />
          </button>
        </div>

        {/* Tenant Info */}
        <div className="bg-surface border border-primary/20 rounded-2xl p-5 mb-6">
          <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-2">
            Aplicando cambios a:
          </p>
          <h3 className="text-white font-black text-base mb-4">{tenant.empresa}</h3>

          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-bold text-muted-foreground uppercase w-16 flex-shrink-0">
                URL / ID:
              </span>
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <span className="text-[11px] font-mono text-primary bg-primary/10 border border-primary/20 px-3 py-1.5 rounded-lg truncate flex-1">
                  {tenantUrl}
                </span>
                <button
                  onClick={() => copyText(tenantUrl, 'url')}
                  className="flex-shrink-0 p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
                  title="Copiar URL"
                >
                  {copiedUrl ? (
                    <Check className="w-3.5 h-3.5 text-success" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-bold text-muted-foreground uppercase w-16 flex-shrink-0">
                UID Admin:
              </span>
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <span className="text-[11px] font-mono text-success bg-success/10 border border-success/20 px-3 py-1.5 rounded-lg truncate flex-1">
                  {tenant.adminUid || 'No asignado'}
                </span>
                {tenant.adminUid && (
                  <button
                    onClick={() => copyText(tenant.adminUid, 'uid')}
                    className="flex-shrink-0 p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
                    title="Copiar UID"
                  >
                    {copiedUid ? (
                      <Check className="w-3.5 h-3.5 text-success" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Status Selection */}
          <div>
            <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-3">
              Estado de Acceso para la Escuela
            </label>
            <div className="grid grid-cols-3 gap-2">
              {statusOptions.map((opt) => (
                <label key={`status-opt-${opt.value}`} className="cursor-pointer group">
                  <input
                    type="radio"
                    value={opt.value}
                    className="hidden peer"
                    {...register('estado')}
                  />
                  <div
                    className={`py-4 flex flex-col items-center gap-1.5 rounded-xl border border-border bg-surface/50 text-muted-foreground font-black text-[10px] uppercase transition-all group-hover:border-border/80 ${opt.styles}`}
                  >
                    {opt.icon}
                    {opt.label}
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* HTML Mora */}
          <div className="bg-surface border border-border rounded-2xl p-5">
            <label
              htmlFor="htmlMora"
              className="flex items-center gap-2 text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-3"
            >
              <Code2 className="w-3.5 h-3.5 text-danger" />
              Mensaje de Morosidad (HTML)
            </label>
            <p className="text-[10px] text-muted-foreground/50 mb-3">
              Se inyecta en el body de la escuela cuando el estado es Moroso
            </p>
            <textarea
              id="htmlMora"
              rows={4}
              placeholder="<div style='...'>Servicio suspendido por falta de pago...</div>"
              className={`w-full bg-transparent border rounded-xl p-3.5 outline-none font-mono text-xs resize-none transition-all focus:ring-2 ${
                currentEstado === 'Moroso' ?'border-danger/40 text-danger/80 focus:ring-danger/30' :'border-border text-primary/70 focus:ring-primary/30'
              }`}
              {...register('htmlMora')}
            />
          </div>

          {/* HTML Mantenimiento */}
          <div className="bg-surface border border-border rounded-2xl p-5">
            <label
              htmlFor="htmlMantenimiento"
              className="flex items-center gap-2 text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-3"
            >
              <Code2 className="w-3.5 h-3.5 text-warning" />
              Mensaje de Mantenimiento (HTML)
            </label>
            <p className="text-[10px] text-muted-foreground/50 mb-3">
              Se inyecta cuando el estado es Mantenimiento
            </p>
            <textarea
              id="htmlMantenimiento"
              rows={4}
              placeholder="<div style='...'>Sistema en mantenimiento. Volvemos pronto...</div>"
              className={`w-full bg-transparent border rounded-xl p-3.5 outline-none font-mono text-xs resize-none transition-all focus:ring-2 ${
                currentEstado === 'Mantenimiento' ?'border-warning/40 text-warning/80 focus:ring-warning/30' :'border-border text-primary/70 focus:ring-primary/30'
              }`}
              {...register('htmlMantenimiento')}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-4 bg-muted/50 hover:bg-muted rounded-2xl font-bold text-muted-foreground uppercase text-xs tracking-widest transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex-[2] py-4 bg-primary hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed rounded-2xl font-black text-primary-foreground uppercase text-xs tracking-widest shadow-lg shadow-primary/20 transition-all duration-150 active:scale-[0.99] flex items-center justify-center gap-2"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                'Guardar Cambios de Estado'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
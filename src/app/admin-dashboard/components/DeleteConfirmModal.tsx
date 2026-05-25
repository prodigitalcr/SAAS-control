'use client';

import React, { useState } from 'react';
import { toast } from 'sonner';
import { Trash2, XCircle, Loader2, AlertTriangle } from 'lucide-react';
import type { Tenant } from './TenantTable';

interface DeleteConfirmModalProps {
  tenant: Tenant;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteConfirmModal({ tenant, onClose, onConfirm }: DeleteConfirmModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmText, setConfirmText] = useState('');

  const handleDelete = async () => {
    if (confirmText.toLowerCase() !== tenant.id.toLowerCase()) {
      toast.error('El ID ingresado no coincide');
      return;
    }
    setIsDeleting(true);
    try {
      // Backend integration point: replace with Firestore db.collection('tenants').doc(tenant.id).delete()
      await new Promise((r) => setTimeout(r, 800));
      onConfirm();
    } catch {
      toast.error('Error al eliminar la institución');
      setIsDeleting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 modal-backdrop z-[300] flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-card border border-danger/30 w-full max-w-md rounded-3xl p-8 shadow-2xl animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-danger/20 border border-danger/30 p-3 rounded-2xl">
              <Trash2 className="w-5 h-5 text-danger" />
            </div>
            <div>
              <h2 className="text-base font-black text-foreground uppercase tracking-tight">
                Eliminar Institución
              </h2>
              <p className="text-[10px] text-danger font-bold uppercase tracking-widest mt-0.5">
                Acción irreversible
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
            aria-label="Cerrar"
          >
            <XCircle className="w-5 h-5" />
          </button>
        </div>

        {/* Warning */}
        <div className="bg-danger/10 border border-danger/20 rounded-2xl p-4 mb-6 flex gap-3">
          <AlertTriangle className="w-5 h-5 text-danger flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-black text-danger uppercase tracking-wide mb-1">
              ¿Estás completamente seguro?
            </p>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Eliminarás permanentemente{' '}
              <span className="text-foreground font-bold">{tenant.empresa}</span> y todos sus datos
              de configuración. El acceso de los usuarios será cortado inmediatamente.
            </p>
          </div>
        </div>

        {/* Tenant info */}
        <div className="bg-surface border border-border rounded-xl p-4 mb-5">
          <div className="flex justify-between items-center">
            <span className="text-[10px] text-muted-foreground font-bold uppercase">ID:</span>
            <span className="text-[11px] font-mono text-danger">{tenant.id}</span>
          </div>
          <div className="flex justify-between items-center mt-1.5">
            <span className="text-[10px] text-muted-foreground font-bold uppercase">Monto:</span>
            <span className="text-[11px] font-mono text-foreground">
              ₡{tenant.montoContrato.toLocaleString('es-CR')}/mes
            </span>
          </div>
        </div>

        {/* Confirm by typing ID */}
        <div className="space-y-1.5 mb-5">
          <label
            htmlFor="confirmId"
            className="block text-[10px] font-black text-muted-foreground uppercase tracking-widest"
          >
            Escribe el ID{' '}
            <span className="font-mono text-danger">{tenant.id}</span> para confirmar
          </label>
          <input
            id="confirmId"
            type="text"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder={tenant.id}
            className="w-full bg-surface border border-border rounded-xl p-3.5 text-sm font-mono text-foreground placeholder:text-muted-foreground/30 focus:outline-none focus:ring-2 focus:ring-danger focus:border-danger transition-all"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-4 bg-muted/50 hover:bg-muted rounded-2xl font-bold text-muted-foreground uppercase text-xs tracking-widest transition-all"
          >
            Cancelar
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting || confirmText.toLowerCase() !== tenant.id.toLowerCase()}
            className="flex-[2] py-4 bg-danger hover:bg-danger/90 disabled:opacity-40 disabled:cursor-not-allowed rounded-2xl font-black text-white uppercase text-xs tracking-widest transition-all duration-150 active:scale-[0.99] flex items-center justify-center gap-2 shadow-lg shadow-danger/20"
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Eliminando...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                Eliminar Permanentemente
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
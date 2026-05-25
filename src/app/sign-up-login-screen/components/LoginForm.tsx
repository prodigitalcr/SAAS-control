'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  ShieldCheck,
  Eye,
  EyeOff,
  Loader2,
  Copy,
  Check,
  AlertTriangle,
  Terminal,
} from 'lucide-react';

interface LoginFormValues {
  email: string;
  password: string;
}

const DEMO_CREDENTIALS = [
  {
    role: 'Super Admin',
    email: 'admin@prodigitalcr.com',
    password: 'MaestroSaaS2026',
  },
  {
    role: 'Operador',
    email: 'ops@prodigitalcr.com',
    password: 'OpsControl88',
  },
];

// Backend integration point: replace this mock with Firebase Auth signInWithEmailAndPassword
const mockAuthCheck = async (email: string, password: string): Promise<boolean> => {
  await new Promise((r) => setTimeout(r, 900));
  return DEMO_CREDENTIALS.some(
    (c) => c.email.toLowerCase() === email.toLowerCase() && c.password === password
  );
};

export default function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormValues>();

  const copyToClipboard = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(key);
      setTimeout(() => setCopiedField(null), 2000);
      toast.success('Copiado al portapapeles');
    } catch {
      toast.error('Error al copiar');
    }
  };

  const autofillCredentials = (cred: (typeof DEMO_CREDENTIALS)[0]) => {
    setValue('email', cred.email);
    setValue('password', cred.password);
    setAuthError('');
    toast.success(`Credenciales de ${cred.role} aplicadas`);
  };

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    setAuthError('');
    try {
      const valid = await mockAuthCheck(data.email, data.password);
      if (valid) {
        toast.success('Acceso autorizado — cargando panel...');
        // Backend integration point: store auth token / session here
        setTimeout(() => router.push('/admin-dashboard'), 600);
      } else {
        setAuthError(
          'Credenciales inválidas — usa las cuentas demo que aparecen abajo para ingresar'
        );
      }
    } catch {
      setAuthError('Error de conexión. Intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-card card-border rounded-3xl p-8 md:p-10 shadow-2xl">
      {/* Header */}
      <div className="flex flex-col items-center mb-8">
        <div className="relative mb-5">
          <div className="bg-primary/20 border border-primary/30 w-20 h-20 rounded-2xl flex items-center justify-center glow-indigo pulse-ring">
            <ShieldCheck className="w-10 h-10 text-primary" />
          </div>
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-success rounded-full border-2 border-card" />
        </div>
        <h1 className="text-2xl font-black text-foreground uppercase tracking-tighter text-center">
          SaaS Master Control
        </h1>
        <p className="text-muted-foreground text-xs font-bold uppercase tracking-widest mt-1 text-center">
          ProDigital — Administración Central
        </p>
        <div className="flex items-center gap-2 mt-3 bg-surface border border-border px-3 py-1.5 rounded-full">
          <Terminal className="w-3 h-3 text-primary" />
          <span className="text-[10px] font-mono text-primary font-bold uppercase tracking-widest">
            v2.0 — Acceso Restringido
          </span>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        {/* Email */}
        <div className="space-y-1.5">
          <label
            htmlFor="email"
            className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider ml-1"
          >
            Correo Autorizado
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="admin@prodigitalcr.com"
            className="w-full bg-surface border border-border rounded-xl p-4 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
            {...register('email', {
              required: 'El correo es requerido',
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Ingresa un correo válido',
              },
            })}
          />
          {errors.email && (
            <p className="text-[11px] text-danger font-bold ml-1 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" />
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <label
            htmlFor="password"
            className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider ml-1"
          >
            Contraseña
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              placeholder="••••••••••••"
              className="w-full bg-surface border border-border rounded-xl p-4 pr-12 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
              {...register('password', {
                required: 'La contraseña es requerida',
                minLength: { value: 6, message: 'Mínimo 6 caracteres' },
              })}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password && (
            <p className="text-[11px] text-danger font-bold ml-1 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" />
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Auth Error */}
        {authError && (
          <div className="bg-danger/10 border border-danger/20 rounded-xl p-3 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-danger flex-shrink-0 mt-0.5" />
            <p className="text-[11px] text-danger font-bold uppercase leading-relaxed">
              {authError}
            </p>
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-primary hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed text-primary-foreground font-black py-4 rounded-xl transition-all duration-150 active:scale-[0.98] uppercase text-xs tracking-widest shadow-lg shadow-primary/25 flex items-center justify-center gap-2 mt-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Autenticando...</span>
            </>
          ) : (
            <>
              <ShieldCheck className="w-4 h-4" />
              <span>Autenticar Sistema</span>
            </>
          )}
        </button>
      </form>

      {/* Demo Credentials */}
      <div className="mt-6 bg-surface border border-border rounded-2xl overflow-hidden">
        <div className="px-4 py-2.5 border-b border-border flex items-center gap-2">
          <Terminal className="w-3 h-3 text-primary" />
          <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
            Cuentas Demo — Clic para usar
          </span>
        </div>
        <div className="divide-y divide-border">
          {DEMO_CREDENTIALS.map((cred) => (
            <div key={`cred-${cred.role}`} className="px-4 py-3 flex items-center justify-between gap-3 hover:bg-card/50 transition-colors">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full border ${
                      cred.role === 'Super Admin' ?'text-primary bg-primary/10 border-primary/20' :'text-muted-foreground bg-muted/50 border-border'
                    }`}
                  >
                    {cred.role}
                  </span>
                </div>
                <p className="text-[11px] font-mono text-foreground truncate">{cred.email}</p>
                <p className="text-[10px] font-mono text-muted-foreground/60">
                  {'•'.repeat(cred.password.length)}
                </p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => copyToClipboard(cred.password, `pw-${cred.role}`)}
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
                  aria-label={`Copiar contraseña de ${cred.role}`}
                  title="Copiar contraseña"
                >
                  {copiedField === `pw-${cred.role}` ? (
                    <Check className="w-3.5 h-3.5 text-success" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => autofillCredentials(cred)}
                  className="text-[9px] font-black uppercase px-3 py-1.5 bg-primary/10 text-primary border border-primary/20 rounded-lg hover:bg-primary hover:text-primary-foreground transition-all duration-150"
                >
                  Usar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <p className="text-center text-[10px] text-muted-foreground/50 mt-5 font-bold uppercase tracking-wider">
        Acceso exclusivo para administradores autorizados
      </p>
    </div>
  );
}
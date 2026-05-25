'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { LogOut, Bell, RefreshCw, ChevronDown, Shield,  } from 'lucide-react';
import AppLogo from '@/components/ui/AppLogo';

export default function DashboardTopbar() {
  const router = useRouter();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Backend integration point: replace with real auth signOut
  const handleLogout = () => {
    toast?.success('Sesión cerrada correctamente');
    setTimeout(() => router?.push('/'), 600);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Backend integration point: trigger data re-fetch
    setTimeout(() => {
      setIsRefreshing(false);
      toast?.success('Datos actualizados');
    }, 1200);
  };

  return (
    <header className="bg-card/90 border-b border-border sticky top-0 z-40 backdrop-blur-xl">
      <div className="max-w-screen-2xl mx-auto px-4 md:px-8 xl:px-10 2xl:px-16 h-16 flex items-center justify-between gap-4">
        {/* Left: Logo + Title */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <AppLogo size={32} />
            <div className="hidden sm:block">
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-black text-foreground uppercase tracking-tighter">
                  Master Control
                </h1>
                <span className="text-[10px] font-black text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-full">
                  v2.0
                </span>
              </div>
              <p className="text-[10px] font-mono text-success font-bold uppercase tracking-widest -mt-0.5">
                admin@prodigitalcr.com
              </p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-1.5 bg-surface border border-border px-3 py-1.5 rounded-full ml-2">
            <div className="w-1.5 h-1.5 bg-success rounded-full pulse-ring" />
            <span className="text-[10px] font-black text-success uppercase tracking-widest">
              Sistema Operativo
            </span>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Refresh */}
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-150 disabled:opacity-50"
            title="Actualizar datos"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>

          {/* Notifications */}
          <button className="relative p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-150">
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-danger rounded-full border border-card" />
          </button>

          {/* User menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu((v) => !v)}
              className="flex items-center gap-2 bg-surface border border-border hover:border-primary/50 px-3 py-2 rounded-xl transition-all duration-150"
            >
              <div className="w-7 h-7 gradient-indigo rounded-lg flex items-center justify-center">
                <Shield className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="hidden sm:block text-[11px] font-bold text-foreground">
                Super Admin
              </span>
              <ChevronDown className="w-3 h-3 text-muted-foreground" />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-card border border-border rounded-2xl shadow-2xl overflow-hidden z-50 animate-fade-in">
                <div className="px-4 py-3 border-b border-border">
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                    Sesión activa
                  </p>
                  <p className="text-xs font-mono text-foreground truncate mt-0.5">
                    admin@prodigitalcr.com
                  </p>
                </div>
                <div className="p-2">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-danger hover:bg-danger/10 transition-all text-[11px] font-bold uppercase tracking-wide"
                  >
                    <LogOut className="w-4 h-4" />
                    Cerrar Sesión
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
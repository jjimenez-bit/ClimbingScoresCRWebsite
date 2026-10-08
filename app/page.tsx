"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Trophy, 
  Users, 
  Send, 
  Sparkles, 
  CheckCircle2, 
  Flame, 
  TrendingUp, 
  ArrowRight,
  ShieldCheck,
  Activity
} from "lucide-react";

export default function HomePage() {
  // Athlete Update Form State
  const [formData, setFormData] = useState({
    athleteName: "",
    email: "",
    country: "",
    category: "Senior",
    suggestedChanges: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulated async submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 1000);
  };

  return (
    <div className="flex flex-col gap-12 pb-16">
      {/* 1. Announcements / Live Feed Banner */}
      <section className="border-b border-border bg-brand-50/70">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2.5 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2.5 text-xs font-medium text-brand-700">
            <span className="flex h-2 w-2 rounded-full bg-brand animate-pulse" />
            <span className="font-bold uppercase tracking-wider">Actualización:</span>
            <span>Resultados de la Copa Continental 2026 ya disponibles en el directorio.</span>
          </div>
          <Link
            href="/campeonatos"
            className="hidden items-center gap-1 text-xs font-semibold text-brand hover:text-brand-700 sm:flex"
          >
            Ver eventos <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </section>

      {/* 2. Hero & Platform Overview */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-border bg-background-surface p-8 sm:p-12 shadow-card">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700 mb-6 border border-brand-200">
              <Sparkles className="h-3.5 w-3.5 text-brand" />
              <span>Plataforma Oficial de Competición</span>
            </div>
            
            <h1 className="text-4xl font-extrabold tracking-tightest text-foreground sm:text-5xl">
              Seguimiento analítico de <span className="text-brand">escalada deportiva</span>.
            </h1>
            
            <p className="mt-4 text-base sm:text-lg text-foreground-muted leading-relaxed">
              Ascend centraliza resultados históricos, estadísticas de bloques y vías, rankings unificados y perfiles de atletas en un único ecosistema abierto y accesible.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/atletas"
                className="inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-brand-600 transition-all"
              >
                <Users className="h-4 w-4" />
                Explorar Atletas
              </Link>
              <Link
                href="/campeonatos"
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-background-surface px-5 py-3 text-sm font-semibold text-foreground hover:bg-background-subtle hover:border-border-strong transition-all"
              >
                <Trophy className="h-4 w-4 text-brand" />
                Directorio de Campeonatos
              </Link>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="mt-12 grid grid-cols-2 gap-4 border-t border-border pt-8 sm:grid-cols-4">
            <div>
              <p className="text-2xl font-bold text-foreground">500+</p>
              <p className="text-xs text-foreground-muted">Atletas registrados</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">42</p>
              <p className="text-xs text-foreground-muted">Campeonatos oficiales</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">1,200+</p>
              <p className="text-xs text-foreground-muted">Resultados de bloque y vía</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">100%</p>
              <p className="text-xs text-foreground-muted">Datos verificados</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Project Objectives & Core Pillars */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Objetivos del Proyecto
          </h2>
          <p className="text-sm text-foreground-muted mt-1">
            Los tres pilares sobre los que estructuramos nuestra base de datos.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-xl border border-border bg-background-surface p-6 shadow-card hover:shadow-hover transition-all">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 text-brand mb-4">
              <Activity className="h-5 w-5" />
            </div>
            <h3 className="text-base font-semibold text-foreground">Trazabilidad Total</h3>
            <p className="mt-2 text-sm text-foreground-muted leading-relaxed">
              Desglose detallado por tops, zonas e intentos por cada bloque y vía de competición.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-background-surface p-6 shadow-card hover:shadow-hover transition-all">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-100 text-accent-cyan mb-4">
              <TrendingUp className="h-5 w-5" />
            </div>
            <h3 className="text-base font-semibold text-foreground">Rankings Dinámicos</h3>
            <p className="mt-2 text-sm text-foreground-muted leading-relaxed">
              Clasificaciones actualizadas automáticamente según las normativas vigentes y coeficientes por evento.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-background-surface p-6 shadow-card hover:shadow-hover transition-all">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-foreground mb-4">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h3 className="text-base font-semibold text-foreground">Datos Comunitarios</h3>
            <p className="mt-2 text-sm text-foreground-muted leading-relaxed">
              Mecanismos transparentes para que atletas y federaciones corrijan o actualicen información.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Interactive Athlete Information Update Form */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-border bg-background-surface p-8 sm:p-10 shadow-card">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand uppercase tracking-wider">
              <Flame className="h-4 w-4" />
              <span>Colaboración Abierta</span>
            </div>
            <h2 className="mt-1 text-2xl font-bold tracking-tight text-foreground">
              Solicitud de Actualización de Atleta
            </h2>
            <p className="mt-2 text-sm text-foreground-muted">
              ¿Eres atleta o representante y has detectado un error en tu perfil o resultados? Envíanos tu corrección para que el equipo la valide con las actas oficiales.
            </p>
          </div>

          <div className="mt-8 max-w-2xl">
            {submitted ? (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-6 text-emerald-800">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-6 w-6 text-emerald-600 flex-shrink-0" />
                  <div>
                    <h3 className="text-base font-semibold">¡Solicitud recibida correctamente!</h3>
                    <p className="mt-1 text-sm text-emerald-700">
                      Revisaremos los datos y cotejaremos las actas oficiales antes de reflejar los cambios en la base de datos.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({
                      athleteName: "",
                      email: "",
                      country: "",
                      category: "Senior",
                      suggestedChanges: "",
                    });
                  }}
                  className="mt-4 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-700 transition-colors"
                >
                  Enviar otra solicitud
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1.5">
                      Nombre Completo del Atleta *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.athleteName}
                      onChange={(e) => setFormData({ ...formData, athleteName: e.target.value })}
                      placeholder="Ej. Alberto Ginés López"
                      className="w-full rounded-lg border border-border bg-background-subtle/50 px-3.5 py-2.5 text-sm text-foreground focus:border-brand focus:bg-background-surface focus:outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1.5">
                      Email de Contacto *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="atleta@ejemplo.com"
                      className="w-full rounded-lg border border-border bg-background-subtle/50 px-3.5 py-2.5 text-sm text-foreground focus:border-brand focus:bg-background-surface focus:outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1.5">
                      País o Federación
                    </label>
                    <input
                      type="text"
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      placeholder="Ej. España / FEDME"
                      className="w-full rounded-lg border border-border bg-background-subtle/50 px-3.5 py-2.5 text-sm text-foreground focus:border-brand focus:bg-background-surface focus:outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1.5">
                      Categoría
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full rounded-lg border border-border bg-background-subtle/50 px-3.5 py-2.5 text-sm text-foreground focus:border-brand focus:bg-background-surface focus:outline-none transition-all"
                    >
                      <option value="Senior">Senior</option>
                      <option value="U20">Sub-20 (Juvenil)</option>
                      <option value="U18">Sub-18 (Cadete)</option>
                      <option value="Paraclimbing">Paraclimbing</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-foreground mb-1.5">
                    Detalles de la Corrección o Actualización *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.suggestedChanges}
                    onChange={(e) => setFormData({ ...formData, suggestedChanges: e.target.value })}
                    placeholder="Indica qué dato necesita corrección (p. ej., categoría errónea, resultado en campeonato específico, enlace a acta oficial)..."
                    className="w-full rounded-lg border border-border bg-background-subtle/50 px-3.5 py-2.5 text-sm text-foreground focus:border-brand focus:bg-background-surface focus:outline-none transition-all"
                  />
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-600 disabled:opacity-50 transition-all"
                  >
                    {isSubmitting ? (
                      "Enviando solicitud..."
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        Enviar Solicitud
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
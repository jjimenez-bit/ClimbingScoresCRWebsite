"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { 
  ArrowLeft, 
  Medal, 
  Trophy, 
  Calendar, 
  MapPin, 
  Award, 
  ExternalLink,
  ShieldCheck
} from "lucide-react";
import { AthletePlacement } from "@/types/climbing";

const samplePlacements: AthletePlacement[] = [
  {
    competition_id: "comp-2026-01",
    competition_name: "Copa Continental de Bloque 2026",
    date: "14 Mar 2026",
    discipline: "Boulder",
    rank: 1,
    score: "4T 4z 7 5",
  },
  {
    competition_id: "comp-2025-08",
    competition_name: "Campeonato Europeo de Dificultad",
    date: "22 Sep 2025",
    discipline: "Lead",
    rank: 2,
    score: "Top (Final)",
  },
  {
    competition_id: "comp-2025-04",
    competition_name: "World Cup Innsbruck",
    date: "18 Jun 2025",
    discipline: "Boulder",
    rank: 3,
    score: "3T 4z 6 8",
  },
  {
    competition_id: "comp-2024-11",
    competition_name: "Copa del Mundo Lead Chamonix",
    date: "12 Jul 2024",
    discipline: "Lead",
    rank: 1,
    score: "48+",
  },
];

export default function AtletaProfilePage() {
  const params = useParams();
  const id = params?.id as string;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Back button */}
      <Link
        href="/atletas"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-foreground-muted hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver al Directorio de Atletas
      </Link>

      {/* Profile Header Card */}
      <div className="rounded-2xl border border-border bg-background-surface p-6 sm:p-8 shadow-card">
        <div className="flex flex-col sm:flex-row sm:items-center gap-6">
          <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-2xl bg-brand-50 border border-brand-200 text-2xl font-black text-brand shadow-sm">
            AG
          </div>

          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-md bg-brand-50 px-2.5 py-1 text-xs font-bold text-brand-700 border border-brand-200">
                Senior
              </span>
              <span className="rounded-md bg-background-subtle px-2.5 py-1 text-xs font-bold text-foreground">
                ESP • España
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600">
                <ShieldCheck className="h-3.5 w-3.5" />
                Perfil Verificado
              </span>
            </div>

            <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Alberto Ginés López
            </h1>

            <p className="mt-1 text-sm text-foreground-muted max-w-2xl">
              Especialista en Lead y Boulder. Primer medallista de oro olímpico de la historia de la escalada deportiva (Tokio 2020).
            </p>
          </div>

          <div className="flex sm:flex-col gap-2">
            <Link
              href="/#update-form"
              className="rounded-lg border border-border bg-background-surface px-3 py-2 text-xs font-semibold text-foreground hover:bg-background-subtle text-center"
            >
              Solicitar Corrección
            </Link>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="mt-8 grid grid-cols-2 gap-4 border-t border-border pt-6 sm:grid-cols-4">
          <div>
            <span className="text-xs text-foreground-subtle">Posición Ranking</span>
            <p className="text-2xl font-extrabold text-brand">#1</p>
          </div>
          <div>
            <span className="text-xs text-foreground-subtle">Podios Oficiales</span>
            <p className="text-2xl font-extrabold text-foreground">14</p>
          </div>
          <div>
            <span className="text-xs text-foreground-subtle">Disciplina Principal</span>
            <p className="text-2xl font-extrabold text-foreground">Lead / Vía</p>
          </div>
          <div>
            <span className="text-xs text-foreground-subtle">ID Registro</span>
            <p className="text-xs font-mono text-foreground-muted mt-2">{id}</p>
          </div>
        </div>
      </div>

      {/* Historical Placements Section */}
      <div className="mt-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Trophy className="h-5 w-5 text-brand" />
            Historial de Campeonatos y Clasificaciones
          </h2>
          <span className="text-xs text-foreground-muted">
            {samplePlacements.length} resultados registrados
          </span>
        </div>

        <div className="overflow-hidden rounded-xl border border-border bg-background-surface shadow-card">
          <table className="min-w-full divide-y divide-border text-left text-sm">
            <thead className="bg-background-subtle/60 text-xs font-semibold uppercase tracking-wider text-foreground-muted">
              <tr>
                <th scope="col" className="px-6 py-3.5">Puesto</th>
                <th scope="col" className="px-6 py-3.5">Campeonato</th>
                <th scope="col" className="px-6 py-3.5">Disciplina</th>
                <th scope="col" className="px-6 py-3.5">Fecha</th>
                <th scope="col" className="px-6 py-3.5 text-right">Resultado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {samplePlacements.map((p, idx) => (
                <tr key={idx} className="hover:bg-background-subtle/30 transition-colors">
                  <td className="px-6 py-4 font-semibold text-foreground">
                    <span className="flex items-center gap-1.5">
                      {p.rank === 1 && <Award className="h-4 w-4 text-amber-500" />}
                      {p.rank === 2 && <Award className="h-4 w-4 text-slate-400" />}
                      {p.rank === 3 && <Award className="h-4 w-4 text-amber-700" />}
                      #{p.rank}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium text-foreground">
                    <Link
                      href={`/campeonatos/${p.competition_id}`}
                      className="hover:text-brand flex items-center gap-1.5"
                    >
                      {p.competition_name}
                      <ExternalLink className="h-3 w-3 text-foreground-subtle" />
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <span className="rounded bg-brand-50 px-2 py-0.5 text-xs font-semibold text-brand-700 border border-brand-200">
                      {p.discipline}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-foreground-muted">{p.date}</td>
                  <td className="px-6 py-4 text-right font-mono text-xs font-bold text-foreground">
                    {p.score}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
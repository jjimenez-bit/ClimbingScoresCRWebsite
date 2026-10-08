"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  Medal, 
  Layers, 
  Award
} from "lucide-react";
import { CompetitionResult, RouteDetail } from "@/types/climbing";

// Mock results data for detailed view
const sampleResults: CompetitionResult[] = [
  { rank: 1, athlete_id: "ath-1", athlete_name: "Alberto Ginés López", country: "ESP", category: "Senior Masculino", score: "4T 4z 7 5" },
  { rank: 2, athlete_id: "ath-2", athlete_name: "Tomoa Narasaki", country: "JPN", category: "Senior Masculino", score: "3T 4z 5 6" },
  { rank: 3, athlete_id: "ath-3", athlete_name: "Jakob Schubert", country: "AUT", category: "Senior Masculino", score: "3T 3z 6 4" },
  { rank: 4, athlete_id: "ath-4", athlete_name: "Sorato Anraku", country: "JPN", category: "Senior Masculino", score: "2T 4z 3 7" },
  { rank: 5, athlete_id: "ath-5", athlete_name: "Mickael Mawem", country: "FRA", category: "Senior Masculino", score: "2T 3z 4 5" },
];

const sampleRouteDetails: RouteDetail[] = [
  { route_name: "Bloque 1 - Dinámico de Coordinación", round: "Final", tops: 5, zones: 6, top_attempts: 11, zone_attempts: 7 },
  { route_name: "Bloque 2 - Placa Técnica & Pies Falsos", round: "Final", tops: 2, zones: 5, top_attempts: 8, zone_attempts: 9 },
  { route_name: "Bloque 3 - Físico de Compresión", round: "Final", tops: 3, zones: 4, top_attempts: 9, zone_attempts: 6 },
  { route_name: "Bloque 4 - Salto Final a Regletas", round: "Final", tops: 1, zones: 3, top_attempts: 4, zone_attempts: 6 },
];

export default function CampeonatoDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const [activeTab, setActiveTab] = useState<"classification" | "routes">("classification");

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb / Back button */}
      <Link
        href="/campeonatos"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-foreground-muted hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver al Directorio
      </Link>

      {/* Header Banner */}
      <div className="rounded-2xl border border-border bg-background-surface p-6 sm:p-8 shadow-card">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-md bg-brand-50 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-brand-700 border border-brand-200">
            Boulder
          </span>
          <span className="rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 border border-emerald-200">
            Acta Oficial Validada
          </span>
        </div>

        <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
          Copa Continental de Bloque 2026
        </h1>

        <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-foreground-muted">
          <div className="flex items-center gap-1.5">
            <MapPin className="h-4 w-4 text-brand" />
            <span>Madrid, España</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4 text-brand" />
            <span>12 - 14 Marzo 2026</span>
          </div>
          <div>ID de Evento: <code className="font-mono text-foreground">{id}</code></div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="mt-8 flex gap-2 border-b border-border">
        <button
          onClick={() => setActiveTab("classification")}
          className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold transition-all ${
            activeTab === "classification"
              ? "border-brand text-brand"
              : "border-transparent text-foreground-muted hover:text-foreground"
          }`}
        >
          <Medal className="h-4 w-4" />
          Clasificación General
        </button>
        <button
          onClick={() => setActiveTab("routes")}
          className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold transition-all ${
            activeTab === "routes"
              ? "border-brand text-brand"
              : "border-transparent text-foreground-muted hover:text-foreground"
          }`}
        >
          <Layers className="h-4 w-4" />
          Desglose de Rutas y Bloques
        </button>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === "classification" ? (
          <div className="overflow-hidden rounded-xl border border-border bg-background-surface shadow-card">
            <table className="min-w-full divide-y divide-border text-left text-sm">
              <thead className="bg-background-subtle/60 text-xs font-semibold uppercase tracking-wider text-foreground-muted">
                <tr>
                  <th scope="col" className="px-6 py-3.5">Posición</th>
                  <th scope="col" className="px-6 py-3.5">Atleta</th>
                  <th scope="col" className="px-6 py-3.5">País</th>
                  <th scope="col" className="px-6 py-3.5">Categoría</th>
                  <th scope="col" className="px-6 py-3.5 text-right">Resultado (Tops/Zonas)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {sampleResults.map((res) => (
                  <tr key={res.athlete_id} className="hover:bg-background-subtle/30 transition-colors">
                    <td className="px-6 py-4 font-semibold text-foreground">
                      <span className="flex items-center gap-2">
                        {res.rank === 1 && <Award className="h-4 w-4 text-amber-500" />}
                        {res.rank === 2 && <Award className="h-4 w-4 text-slate-400" />}
                        {res.rank === 3 && <Award className="h-4 w-4 text-amber-700" />}
                        #{res.rank}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium text-foreground">
                      <Link 
                        href={`/atletas/${res.athlete_id}`}
                        className="hover:text-brand hover:underline"
                      >
                        {res.athlete_name}
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <span className="rounded bg-background-subtle px-2 py-0.5 text-xs font-bold text-foreground-muted">
                        {res.country}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-foreground-muted text-xs">{res.category}</td>
                    <td className="px-6 py-4 text-right font-mono text-xs font-bold text-foreground">
                      {res.score}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {sampleRouteDetails.map((route, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-border bg-background-surface p-5 shadow-card"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-brand uppercase tracking-wider">
                    {route.round}
                  </span>
                  <span className="text-xs font-medium text-foreground-muted">
                    Bloque #{idx + 1}
                  </span>
                </div>
                <h4 className="mt-2 text-base font-bold text-foreground">{route.route_name}</h4>

                <div className="mt-4 grid grid-cols-2 gap-3 border-t border-border pt-4 text-xs">
                  <div>
                    <span className="text-foreground-muted">Tops conseguidos:</span>
                    <p className="text-base font-bold text-foreground">{route.tops} <span className="text-xs font-normal text-foreground-muted">({route.top_attempts} intentos)</span></p>
                  </div>
                  <div>
                    <span className="text-foreground-muted">Zonas alcanzadas:</span>
                    <p className="text-base font-bold text-foreground">{route.zones} <span className="text-xs font-normal text-foreground-muted">({route.zone_attempts} intentos)</span></p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
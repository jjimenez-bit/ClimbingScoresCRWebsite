"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Trophy, 
  MapPin, 
  Calendar, 
  Filter, 
  BarChart2, 
  ArrowRight,
  Search,
  CheckCircle2,
  Clock
} from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { Competition } from "@/types/climbing";

// Initial fallback dataset in case Supabase table is in sync
const fallbackCompetitions: Competition[] = [
  {
    id: "comp-2026-01",
    name: "Copa Continental de Bloque 2026",
    location: "Madrid, España",
    country_code: "ESP",
    start_date: "2026-03-12",
    end_date: "2026-03-14",
    discipline: "Boulder",
    status: "Completed",
    participants_count: 64,
  },
  {
    id: "comp-2026-02",
    name: "Master Internacional de Dificultad",
    location: "Innsbruck, Austria",
    country_code: "AUT",
    start_date: "2026-04-05",
    end_date: "2026-04-07",
    discipline: "Lead",
    status: "Completed",
    participants_count: 52,
  },
  {
    id: "comp-2026-03",
    name: "Open Nacional Combinada Tokio-Style",
    location: "Barcelona, España",
    country_code: "ESP",
    start_date: "2026-05-20",
    end_date: "2026-05-22",
    discipline: "Combined",
    status: "Upcoming",
    participants_count: 48,
  },
  {
    id: "comp-2026-04",
    name: "Trofeo Ibérico de Velocidad",
    location: "Lisboa, Portugal",
    country_code: "POR",
    start_date: "2026-06-10",
    end_date: "2026-06-11",
    discipline: "Speed",
    status: "Upcoming",
    participants_count: 30,
  },
];

export default function CampeonatosPage() {
  const [competitions, setCompetitions] = useState<Competition[]>(fallbackCompetitions);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>("All");

  useEffect(() => {
    async function fetchCompetitions() {
      try {
        const { data, error } = await supabase
          .from("competitions")
          .select("*")
          .order("start_date", { ascending: false });

        if (!error && data && data.length > 0) {
          setCompetitions(data);
        }
      } catch (err) {
        console.warn("Using fallback local competitions:", err);
      }
    }

    fetchCompetitions();
  }, []);

  const filteredCompetitions = competitions.filter((comp) => {
    const matchesSearch = comp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comp.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDiscipline = selectedDiscipline === "All" || comp.discipline === selectedDiscipline;
    return matchesSearch && matchesDiscipline;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end border-b border-border pb-6">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-brand">
            Competiciones Oficiales
          </span>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Directorio de Campeonatos
          </h1>
          <p className="mt-2 text-sm text-foreground-muted">
            Explora las actas oficiales, clasificaciones de rondas y desgloses de bloques.
          </p>
        </div>

        {/* Quick Link to Ranking */}
        <Link
          href="/ranking"
          className="inline-flex items-center gap-2 rounded-xl border border-border bg-background-surface px-4 py-2.5 text-sm font-semibold text-foreground shadow-sm hover:border-brand hover:text-brand transition-all"
        >
          <BarChart2 className="h-4 w-4 text-brand" />
          <span>Ver Ranking General</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground-subtle" />
          <input
            type="text"
            placeholder="Buscar por nombre o ciudad..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-border bg-background-surface pl-10 pr-4 py-2 text-sm text-foreground placeholder:text-foreground-subtle focus:border-brand focus:outline-none shadow-sm"
          />
        </div>

        {/* Discipline filter chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <Filter className="h-4 w-4 text-foreground-subtle flex-shrink-0" />
          {["All", "Boulder", "Lead", "Combined", "Speed"].map((disc) => (
            <button
              key={disc}
              onClick={() => setSelectedDiscipline(disc)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                selectedDiscipline === disc
                  ? "bg-brand text-white shadow-sm"
                  : "bg-background-surface border border-border text-foreground-muted hover:bg-background-subtle"
              }`}
            >
              {disc === "All" ? "Todos" : disc}
            </button>
          ))}
        </div>
      </div>

      {/* Championships Grid */}
      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredCompetitions.map((comp) => {
          const isCompleted = comp.status === "Completed";
          return (
            <div
              key={comp.id}
              className="group flex flex-col justify-between rounded-xl border border-border bg-background-surface p-6 shadow-card hover:border-brand-300 hover:shadow-hover transition-all"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="rounded-md bg-brand-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-brand-700 border border-brand-200">
                    {comp.discipline}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 text-[11px] font-medium ${
                      isCompleted ? "text-emerald-600" : "text-amber-600"
                    }`}
                  >
                    {isCompleted ? (
                      <>
                        <CheckCircle2 className="h-3.5 w-3.5" /> Finalizado
                      </>
                    ) : (
                      <>
                        <Clock className="h-3.5 w-3.5" /> Próximo
                      </>
                    )}
                  </span>
                </div>

                <h3 className="mt-4 text-lg font-bold text-foreground group-hover:text-brand transition-colors">
                  {comp.name}
                </h3>

                <div className="mt-3 space-y-1.5 text-xs text-foreground-muted">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5 text-foreground-subtle" />
                    <span>{comp.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3.5 w-3.5 text-foreground-subtle" />
                    <span>
                      {new Date(comp.start_date).toLocaleDateString("es-ES", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
                <span className="text-xs text-foreground-muted">
                  {comp.participants_count ? `${comp.participants_count} Atletas` : "Inscripciones abiertas"}
                </span>
                <Link
                  href={`/campeonatos/${comp.id}`}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand hover:text-brand-700"
                >
                  Ver Resultados
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {filteredCompetitions.length === 0 && (
        <div className="mt-12 rounded-xl border border-dashed border-border p-12 text-center text-sm text-foreground-muted">
          No se encontraron campeonatos con los criterios seleccionados.
        </div>
      )}
    </div>
  );
}
"use client";

import { useState, useEffect, useMemo } from "react";
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
  Users,
  AlertCircle
} from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

interface DatabaseCompetition {
  id: string;
  nombre: string;
  modalidad?: string;
  sede?: string;
  categoria?: string;
  año?: number;
  participants_count?: number;
  [key: string]: any;
}

export default function CampeonatosPage() {
  const [competitions, setCompetitions] = useState<DatabaseCompetition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>("All");

  useEffect(() => {
    async function fetchCompetitions() {
      setLoading(true);
      setError(null);

      try {
        // 1. Fetch competitions
        const { data: comps, error: compErr } = await supabase
          .from("competitions")
          .select("*")
          .order("año", { ascending: false });

        if (compErr) throw compErr;

        // 2. Fetch participant counts per competition from results table
        const { data: resultsData } = await supabase
          .from("results")
          .select("competition_id, athlete_id");

        const countsMap = new Map<string, Set<string>>();
        if (resultsData) {
          resultsData.forEach((r) => {
            if (!countsMap.has(r.competition_id)) {
              countsMap.set(r.competition_id, new Set());
            }
            countsMap.get(r.competition_id)!.add(r.athlete_id);
          });
        }

        const merged = (comps || []).map((c) => ({
          ...c,
          participants_count: countsMap.get(c.id)?.size || 0,
        }));

        setCompetitions(merged);
      } catch (err: unknown) {
        console.error("Error fetching competitions:", err);
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Error al cargar los campeonatos desde Supabase.");
        }
      } finally {
        setLoading(false);
      }
    }

    fetchCompetitions();
  }, []);

  // Filtered list
  const filteredCompetitions = useMemo(() => {
    return competitions.filter((comp) => {
      const name = (comp.nombre || "").toLowerCase();
      const location = (comp.sede || "").toLowerCase();
      const query = searchTerm.trim().toLowerCase();

      const matchesSearch = !query || name.includes(query) || location.includes(query);
      const matchesDiscipline =
        selectedDiscipline === "All" ||
        (comp.modalidad || "").toLowerCase() === selectedDiscipline.toLowerCase();

      return matchesSearch && matchesDiscipline;
    });
  }, [competitions, searchTerm, selectedDiscipline]);

  // Extract unique disciplines from actual database entries
  const availableDisciplines = useMemo(() => {
    const set = new Set<string>();
    competitions.forEach((c) => {
      if (c.modalidad) set.add(c.modalidad);
    });
    return ["All", ...Array.from(set)];
  }, [competitions]);

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
            Resultados oficiales, fases clasificatorias y actas técnicas de competición.
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
            placeholder="Buscar por nombre o sede..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-border bg-background-surface pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-foreground-subtle focus:border-brand focus:outline-none shadow-sm"
          />
        </div>

        {/* Discipline filter chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <Filter className="h-4 w-4 text-foreground-subtle flex-shrink-0" />
          {availableDisciplines.map((disc) => (
            <button
              key={disc}
              onClick={() => setSelectedDiscipline(disc)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                selectedDiscipline === disc
                  ? "bg-brand text-white shadow-sm"
                  : "bg-background-surface border border-border text-foreground-muted hover:bg-background-subtle"
              }`}
            >
              {disc === "All" ? "Todas las Modalidades" : disc}
            </button>
          ))}
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="mt-6 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-500" />
          <span>Error: {error}</span>
        </div>
      )}

      {/* Loading Skeletons */}
      {loading ? (
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="rounded-xl border border-border bg-background-surface p-6 shadow-card animate-pulse space-y-4"
            >
              <div className="flex justify-between">
                <div className="h-5 w-20 rounded bg-slate-200" />
                <div className="h-5 w-16 rounded bg-slate-200" />
              </div>
              <div className="h-6 w-3/4 rounded bg-slate-200" />
              <div className="h-4 w-1/2 rounded bg-slate-100" />
              <div className="h-8 rounded bg-slate-100" />
            </div>
          ))}
        </div>
      ) : (
        /* Championships Grid */
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredCompetitions.map((comp) => (
            <div
              key={comp.id}
              className="group flex flex-col justify-between rounded-xl border border-border bg-background-surface p-6 shadow-card hover:border-brand-300 hover:shadow-hover transition-all"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="rounded-md bg-brand-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-brand-700 border border-brand-200">
                    {comp.modalidad || "Competición"}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Oficial
                  </span>
                </div>

                <h3 className="mt-4 text-lg font-bold text-foreground group-hover:text-brand transition-colors">
                  {comp.nombre}
                </h3>

                <div className="mt-3 space-y-1.5 text-xs text-foreground-muted">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5 text-foreground-subtle" />
                    <span>{comp.sede || "Sede por confirmar"}</span>
                  </div>
                  {comp.año && (
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3.5 w-3.5 text-foreground-subtle" />
                      <span>Temporada {comp.año}</span>
                    </div>
                  )}
                  {comp.categoria && (
                    <div className="text-[11px] text-foreground-subtle">
                      Categoría: <span className="font-semibold text-foreground">{comp.categoria}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
                <span className="text-xs text-foreground-muted flex items-center gap-1">
                  <Users className="h-3.5 w-3.5" />
                  {comp.participants_count} Atletas
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
          ))}
        </div>
      )}

      {!loading && filteredCompetitions.length === 0 && (
        <div className="mt-12 rounded-xl border border-dashed border-border p-12 text-center text-sm text-foreground-muted">
          No se encontraron campeonatos con los criterios seleccionados.
        </div>
      )}
    </div>
  );
}
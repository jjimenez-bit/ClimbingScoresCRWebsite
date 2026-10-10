"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  Award,
  Loader2,
  AlertCircle,
  Filter,
  CheckCircle2,
  Sparkles
} from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

interface CompetitionDetail {
  id: string;
  nombre: string;
  modalidad?: string;
  sede?: string;
  año?: number;
  categoria?: string;
}

interface StageStanding {
  result_id: string;
  athlete_id: string;
  athlete_name: string;
  nacionalidad: string;
  result_categoria?: string;
  etapa: string;
  tops: number;
  zones: number;
  top_attempts: number;
  zone_attempts: number;
  total_points: number;
  score_breakdown: string;
  score_formatted: string;
  rank: number;
}

export default function CampeonatoDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const [competition, setCompetition] = useState<CompetitionDetail | null>(null);
  const [standings, setStandings] = useState<StageStanding[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Active stage and category filters
  const [selectedStage, setSelectedStage] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  useEffect(() => {
    if (!id) return;

    async function fetchCompetitionData() {
      setLoading(true);
      setError(null);

      try {
        // 1. Fetch competition metadata
        const { data: compData, error: compErr } = await supabase
          .from("competitions")
          .select("*")
          .eq("id", id)
          .single();

        if (compErr) throw compErr;
        setCompetition(compData);

        // 2. Fetch computed stage results from view
        const { data: resultsData, error: resultsErr } = await supabase
          .from("v_competition_results")
          .select("*")
          .eq("competition_id", id)
          .order("rank", { ascending: true });

        if (!resultsErr && resultsData) {
          setStandings(resultsData);
          if (resultsData.length > 0) {
            const stages = Array.from(new Set(resultsData.map((r) => r.etapa)));
            const initialStage = stages.find((s) => s.toLowerCase().includes("final")) || stages[0];
            setSelectedStage(initialStage);

            const categoriesForStage = Array.from(
              new Set(
                resultsData
                  .filter((r) => r.etapa === initialStage)
                  .map((r) => r.result_categoria || "General")
              )
            );
            if (categoriesForStage.length > 0) {
              setSelectedCategory(categoriesForStage[0]);
            }
          }
        }
      } catch (err: unknown) {
        console.error("Error loading competition details:", err);
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Error al cargar la información del campeonato.");
        }
      } finally {
        setLoading(false);
      }
    }

    fetchCompetitionData();
  }, [id]);

  const isModernScoring = (competition?.año || 0) >= 2025;

  // Distinct stages ordered (Clasificatoria -> Semifinal -> Final)
  const availableStages = useMemo(() => {
    const stages = Array.from(new Set(standings.map((s) => s.etapa)));
    const orderWeight = (st: string) => {
      const s = st.toLowerCase();
      if (s.includes("clasif")) return 1;
      if (s.includes("semi")) return 2;
      if (s.includes("final")) return 3;
      return 4;
    };
    return stages.sort((a, b) => orderWeight(a) - orderWeight(b));
  }, [standings]);

  // Distinct categories available in current selected stage
  const availableCategories = useMemo(() => {
    if (!selectedStage) return [];
    const cats = Array.from(
      new Set(
        standings
          .filter((s) => s.etapa === selectedStage)
          .map((s) => s.result_categoria || "General")
      )
    );
    return cats;
  }, [standings, selectedStage]);

  useEffect(() => {
    if (availableCategories.length > 0 && !availableCategories.includes(selectedCategory)) {
      setSelectedCategory(availableCategories[0]);
    }
  }, [availableCategories, selectedCategory]);

  // Athletes who qualified for Final (to highlight them in Clasificatoria)
  const finalistAthleteIds = useMemo(() => {
    return new Set(
      standings
        .filter((s) => s.etapa.toLowerCase().includes("final") && !s.etapa.toLowerCase().includes("semi"))
        .map((s) => s.athlete_id)
    );
  }, [standings]);

  // Filtered stage results by Category
  const filteredResults = useMemo(() => {
    return standings.filter(
      (s) =>
        s.etapa === selectedStage &&
        (s.result_categoria || "General") === selectedCategory
    );
  }, [standings, selectedStage, selectedCategory]);

  const isFinalRound = selectedStage.toLowerCase().includes("final") && !selectedStage.toLowerCase().includes("semi");
  const isQualificationRound = selectedStage.toLowerCase().includes("clasif") || selectedStage.toLowerCase().includes("quali");

  if (loading) {
    return (
      <div className="mx-auto flex max-w-7xl items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-brand" />
        <span className="ml-3 text-sm text-foreground-muted">Cargando resultados del campeonato...</span>
      </div>
    );
  }

  if (error || !competition) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Link
          href="/campeonatos"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-foreground-muted hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver al Directorio
        </Link>
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center text-sm text-red-700">
          <AlertCircle className="mx-auto h-8 w-8 text-red-500 mb-2" />
          <h2 className="text-base font-bold">No se pudo cargar el campeonato</h2>
          <p className="mt-1 text-xs">{error || "El campeonato no existe en la base de datos."}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Back button */}
      <Link
        href="/campeonatos"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-foreground-muted hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver a Campeonatos
      </Link>

      {/* Header Banner */}
      <div className="rounded-2xl border border-border bg-background-surface p-6 sm:p-8 shadow-card">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-md bg-brand-50 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-brand-700 border border-brand-200">
            {competition.modalidad || "Competición"}
          </span>
          {competition.categoria && (
            <span className="rounded-md bg-background-subtle px-2.5 py-1 text-xs font-semibold text-foreground">
              {competition.categoria}
            </span>
          )}
          {isModernScoring && (
            <span className="inline-flex items-center gap-1 rounded-md bg-sky-50 px-2.5 py-1 text-xs font-bold text-sky-700 border border-sky-200">
              <Sparkles className="h-3 w-3" /> Sistema Olímpico de Puntos (≥2025)
            </span>
          )}
        </div>

        <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
          {competition.nombre}
        </h1>

        <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-foreground-muted">
          {competition.sede && (
            <div className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-brand" />
              <span>{competition.sede}</span>
            </div>
          )}
          {competition.año && (
            <div className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-brand" />
              <span>Año {competition.año}</span>
            </div>
          )}
          <div>
            Total Atletas: <strong className="text-foreground">{new Set(standings.map((s) => s.athlete_id)).size}</strong>
          </div>
        </div>
      </div>

      {/* 1. Stage Selector (Rondas) */}
      {availableStages.length > 0 && (
        <div className="mt-8 flex items-center gap-2 overflow-x-auto pb-1">
          <span className="text-xs font-semibold uppercase text-foreground-muted mr-2">
            Rondas:
          </span>
          {availableStages.map((stage) => (
            <button
              key={stage}
              onClick={() => setSelectedStage(stage)}
              className={`rounded-lg px-3.5 py-2 text-xs font-bold transition-all ${
                selectedStage === stage
                  ? "bg-brand text-white shadow-sm"
                  : "bg-background-surface border border-border text-foreground-muted hover:bg-background-subtle"
              }`}
            >
              {stage}
            </button>
          ))}
        </div>
      )}

      {/* 2. Category Filter (Categorías) */}
      {availableCategories.length > 0 && (
        <div className="mt-4 flex items-center gap-2 overflow-x-auto pb-1 border-b border-border pb-4">
          <Filter className="h-4 w-4 text-foreground-subtle flex-shrink-0" />
          <span className="text-xs font-medium text-foreground-muted mr-1">
            Categoría:
          </span>
          {availableCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                selectedCategory === cat
                  ? "bg-slate-900 text-white shadow-sm"
                  : "bg-background-surface border border-border text-foreground-muted hover:bg-background-subtle"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Standings Table */}
      <div className="mt-6">
        {filteredResults.length > 0 ? (
          <div className="overflow-hidden rounded-xl border border-border bg-background-surface shadow-card">
            <div className="bg-background-subtle/50 px-6 py-3 border-b border-border flex items-center justify-between">
              <span className="text-xs font-bold text-foreground uppercase tracking-wider">
                {selectedStage} • {selectedCategory}
              </span>
              <span className="text-xs text-foreground-muted">
                {filteredResults.length} atletas clasificados
              </span>
            </div>

            <table className="min-w-full divide-y divide-border text-left text-sm">
              <thead className="bg-background-subtle/30 text-xs font-semibold uppercase tracking-wider text-foreground-muted">
                <tr>
                  <th scope="col" className="px-6 py-3.5">Puesto</th>
                  <th scope="col" className="px-6 py-3.5">Atleta</th>
                  <th scope="col" className="px-6 py-3.5">País</th>
                  <th scope="col" className="px-6 py-3.5 text-center">Tops</th>
                  <th scope="col" className="px-6 py-3.5 text-center">Zonas</th>
                  <th scope="col" className="px-6 py-3.5 text-center">T / Z / Intentos</th>
                  {isModernScoring && (
                    <th scope="col" className="px-6 py-3.5 text-right">Puntos Totales</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredResults.map((res) => {
                  const qualifiedToFinal = isQualificationRound && (
                    finalistAthleteIds.has(res.athlete_id) || res.rank <= 6
                  );

                  return (
                    <tr 
                      key={res.athlete_id} 
                      className={`transition-colors ${
                        qualifiedToFinal
                          ? "bg-emerald-50/40 hover:bg-emerald-50/70"
                          : "hover:bg-background-subtle/30"
                      }`}
                    >
                      <td className="px-6 py-4 font-semibold text-foreground">
                        <span className="flex items-center gap-1.5">
                          {isFinalRound && res.rank === 1 && <Award className="h-4 w-4 text-amber-500" />}
                          {isFinalRound && res.rank === 2 && <Award className="h-4 w-4 text-slate-400" />}
                          {isFinalRound && res.rank === 3 && <Award className="h-4 w-4 text-amber-700" />}
                          #{res.rank}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-medium text-foreground">
                        <div className="flex items-center gap-2">
                          <Link 
                            href={`/atletas/${res.athlete_id}`}
                            className="hover:text-brand hover:underline font-semibold"
                          >
                            {res.athlete_name}
                          </Link>
                          {qualifiedToFinal && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                              <CheckCircle2 className="h-3 w-3" /> Pasa a Final
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="rounded bg-background-subtle px-2 py-0.5 text-xs font-bold text-foreground">
                          {res.nacionalidad || "-"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center font-bold text-foreground">
                        {res.tops}
                      </td>
                      <td className="px-6 py-4 text-center font-bold text-foreground">
                        {res.zones}
                      </td>
                      <td className="px-6 py-4 text-center font-mono text-xs text-foreground-muted">
                        {res.score_breakdown || `${res.tops}T ${res.zones}z ${res.top_attempts} ${res.zone_attempts}`}
                      </td>
                      {isModernScoring && (
                        <td className="px-6 py-4 text-right font-mono text-sm font-black text-brand">
                          {res.total_points ?? 0} pts
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-border p-8 text-center text-xs text-foreground-muted">
            No hay resultados registrados para la ronda y categoría seleccionadas.
          </div>
        )}
      </div>
    </div>
  );
}
"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  Medal, 
  Layers, 
  Award,
  Loader2,
  AlertCircle
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

  // Active view tab
  const [activeTab, setActiveTab] = useState<"classification" | "boulders">("classification");
  // Active stage selector
  const [selectedStage, setSelectedStage] = useState<string>("");

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
            // Find distinct stages
            const stages = Array.from(new Set(resultsData.map((r) => r.etapa)));
            // Default to 'Final' if present, otherwise first stage
            const initialStage = stages.find((s) => s.toLowerCase().includes("final")) || stages[0];
            setSelectedStage(initialStage);
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

  // Distinct stages available for this competition
  const availableStages = useMemo(() => {
    const stages = Array.from(new Set(standings.map((s) => s.etapa)));
    // Order: Clasificatoria -> Semifinal -> Final
    const orderWeight = (st: string) => {
      const s = st.toLowerCase();
      if (s.includes("clasif")) return 1;
      if (s.includes("semi")) return 2;
      if (s.includes("final")) return 3;
      return 4;
    };
    return stages.sort((a, b) => orderWeight(a) - orderWeight(b));
  }, [standings]);

  // Filtered standings for the chosen stage
  const stageResults = useMemo(() => {
    return standings.filter((s) => s.etapa === selectedStage);
  }, [standings, selectedStage]);

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
            Participantes registrados: <strong className="text-foreground">{new Set(standings.map((s) => s.athlete_id)).size}</strong>
          </div>
        </div>
      </div>

      {/* Stage Selector Pills */}
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

      {/* Standings Table */}
      <div className="mt-6">
        {stageResults.length > 0 ? (
          <div className="overflow-hidden rounded-xl border border-border bg-background-surface shadow-card">
            <div className="bg-background-subtle/50 px-6 py-3 border-b border-border flex items-center justify-between">
              <span className="text-xs font-bold text-foreground uppercase tracking-wider">
                Resultados Oficiales - {selectedStage}
              </span>
              <span className="text-xs text-foreground-muted">
                {stageResults.length} atletas clasificados
              </span>
            </div>

            <table className="min-w-full divide-y divide-border text-left text-sm">
              <thead className="bg-background-subtle/30 text-xs font-semibold uppercase tracking-wider text-foreground-muted">
                <tr>
                  <th scope="col" className="px-6 py-3.5">Posición</th>
                  <th scope="col" className="px-6 py-3.5">Atleta</th>
                  <th scope="col" className="px-6 py-3.5">País</th>
                  <th scope="col" className="px-6 py-3.5 text-center">Tops</th>
                  <th scope="col" className="px-6 py-3.5 text-center">Zonas</th>
                  <th scope="col" className="px-6 py-3.5 text-right">Resultado (Tops/Zonas/Intentos)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {stageResults.map((res) => (
                  <tr key={res.athlete_id} className="hover:bg-background-subtle/30 transition-colors">
                    <td className="px-6 py-4 font-semibold text-foreground">
                      <span className="flex items-center gap-1.5">
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
                    <td className="px-6 py-4 text-right font-mono text-xs font-bold text-foreground">
                      {res.score_formatted}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-border p-8 text-center text-xs text-foreground-muted">
            No hay resultados registrados para la ronda seleccionada.
          </div>
        )}
      </div>
    </div>
  );
}
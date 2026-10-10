"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { 
  ArrowLeft, 
  Trophy, 
  Award, 
  ExternalLink, 
  ShieldCheck, 
  AlertCircle, 
  Loader2, 
  Calendar 
} from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

interface AthleteDetail {
  id: string;
  nombre_completo?: string;
  nombre?: string;
  primer_apellido?: string;
  segundo_apellido?: string;
  nacionalidad?: string;
  fecha_nacimiento?: string;
  gender?: string;
}

interface StageResult {
  result_id?: string;
  competition_id: string;
  competition_name: string;
  modalidad?: string;
  sede?: string;
  año?: number;
  etapa: string;
  rank: number | string;
  score_formatted?: string;
}

interface OverallEventResult {
  competition_id: string;
  competition_name: string;
  modalidad?: string;
  sede?: string;
  año?: number;
  highest_stage: string;
  final_rank: number | string;
  final_score?: string;
}

// Stage ranking priority weight
const getStageWeight = (stageName: string): number => {
  const normalized = (stageName || "").toLowerCase();
  if (normalized.includes("final") && !normalized.includes("semi")) return 3;
  if (normalized.includes("semi")) return 2;
  if (normalized.includes("clasif") || normalized.includes("quali")) return 1;
  return 0;
};

export default function AtletaProfilePage() {
  const params = useParams();
  const id = params?.id as string;

  const [athlete, setAthlete] = useState<AthleteDetail | null>(null);
  const [rawResults, setRawResults] = useState<StageResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    async function fetchAthleteProfile() {
      setLoading(true);
      setError(null);

      try {
        // 1. Fetch athlete details
        const { data: athleteData, error: athleteError } = await supabase
          .from("athletes")
          .select("*")
          .eq("id", id)
          .single();

        if (athleteError) throw athleteError;
        setAthlete(athleteData);

        // 2. Fetch results from v_competition_results
        const { data: viewData, error: viewError } = await supabase
          .from("v_competition_results")
          .select("*")
          .eq("athlete_id", id)
          .order("año", { ascending: false });

        if (!viewError && viewData && viewData.length > 0) {
          setRawResults(viewData);
        } else {
          // Fallback if view had no rows
          const { data: fallbackData } = await supabase
            .from("results")
            .select("id, competition_id, categoria, etapa, competitions(id, nombre, modalidad, sede, año)")
            .eq("athlete_id", id);

          if (fallbackData && fallbackData.length > 0) {
            const mapped: StageResult[] = fallbackData.map((r: any) => ({
              result_id: r.id,
              competition_id: r.competition_id || r.competitions?.id,
              competition_name: r.competitions?.nombre || "Campeonato Oficial",
              modalidad: r.competitions?.modalidad || "Competición",
              sede: r.competitions?.sede || "-",
              año: r.competitions?.año || null,
              etapa: r.etapa || "-",
              rank: "-",
              score_formatted: "-",
            }));
            setRawResults(mapped);
          }
        }
      } catch (err: unknown) {
        console.error("Error loading athlete details:", err);
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Error al cargar los datos del atleta.");
        }
      } finally {
        setLoading(false);
      }
    }

    fetchAthleteProfile();
  }, [id]);

  // Consolidate into 1 result per competition based on highest stage reached
  const overallEvents = useMemo(() => {
    const map = new Map<string, StageResult[]>();

    rawResults.forEach((res) => {
      const compId = res.competition_id;
      if (!map.has(compId)) {
        map.set(compId, []);
      }
      map.get(compId)!.push(res);
    });

    const consolidated: OverallEventResult[] = [];

    map.forEach((stages, compId) => {
      // Sort stages by weight descending (Final > Semifinal > Clasificatoria)
      stages.sort((a, b) => getStageWeight(b.etapa) - getStageWeight(a.etapa));

      const topStage = stages[0];

      consolidated.push({
        competition_id: compId,
        competition_name: topStage.competition_name,
        modalidad: topStage.modalidad,
        sede: topStage.sede,
        año: topStage.año,
        highest_stage: topStage.etapa,
        final_rank: topStage.rank,
        final_score: topStage.score_formatted,
      });
    });

    // Sort by year descending
    return consolidated.sort((a, b) => (b.año || 0) - (a.año || 0));
  }, [rawResults]);

  const getFullName = () => {
    if (!athlete) return "Atleta";
    if (athlete.nombre_completo) return athlete.nombre_completo;
    const parts = [athlete.nombre, athlete.primer_apellido, athlete.segundo_apellido].filter(Boolean);
    return parts.join(" ") || `Atleta #${athlete.id.slice(0, 6)}`;
  };

  const getInitials = () => {
    const name = getFullName();
    const parts = name.split(" ").filter(Boolean);
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase() || "AT";
  };

  if (loading) {
    return (
      <div className="mx-auto flex max-w-7xl items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-brand" />
        <span className="ml-3 text-sm text-foreground-muted">Cargando perfil del atleta...</span>
      </div>
    );
  }

  if (error || !athlete) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Link
          href="/atletas"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-foreground-muted hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver al Directorio
        </Link>
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center text-sm text-red-700">
          <AlertCircle className="mx-auto h-8 w-8 text-red-500 mb-2" />
          <h2 className="text-base font-bold">No se pudo encontrar el atleta</h2>
          <p className="mt-1 text-xs">{error || "El registro no existe en la base de datos."}</p>
        </div>
      </div>
    );
  }

  const fullName = getFullName();
  const initials = getInitials();
  const podiumCount = overallEvents.filter((e) => typeof e.final_rank === "number" && e.final_rank >= 1 && e.final_rank <= 3).length;

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
            {initials}
          </div>

          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-md bg-background-subtle px-2.5 py-1 text-xs font-bold text-foreground">
                {athlete.nacionalidad || "N/A"}
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600">
                <ShieldCheck className="h-3.5 w-3.5" />
                Perfil Registrado
              </span>
            </div>

            <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              {fullName}
            </h1>

            <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-foreground-muted">
              {athlete.fecha_nacimiento && (
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5 text-foreground-subtle" />
                  Nacimiento: {new Date(athlete.fecha_nacimiento).toLocaleDateString("es-ES")}
                </span>
              )}
              {athlete.gender && (
                <span>Género: <strong className="text-foreground">{athlete.gender}</strong></span>
              )}
            </div>
          </div>

          <div className="flex sm:flex-col gap-2">
            <Link
              href="/#update-form"
              className="rounded-lg border border-border bg-background-surface px-3.5 py-2 text-xs font-semibold text-foreground hover:bg-background-subtle text-center shadow-sm"
            >
              Solicitar Corrección
            </Link>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="mt-8 grid grid-cols-2 gap-4 border-t border-border pt-6 sm:grid-cols-3">
          <div>
            <span className="text-xs text-foreground-subtle">Campeonatos Disputados</span>
            <p className="text-2xl font-extrabold text-brand">
              {overallEvents.length}
            </p>
          </div>
          <div>
            <span className="text-xs text-foreground-subtle">Podios Oficiales (Top 3)</span>
            <p className="text-2xl font-extrabold text-foreground">
              {podiumCount}
            </p>
          </div>
          <div>
            <span className="text-xs text-foreground-subtle">Nacionalidad</span>
            <p className="text-lg font-bold text-foreground mt-1">
              {athlete.nacionalidad || "N/A"}
            </p>
          </div>
        </div>
      </div>

      {/* Historical Placements Section (1 Row Per Championship) */}
      <div className="mt-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Trophy className="h-5 w-5 text-brand" />
            Historial de Campeonatos
          </h2>
          <span className="text-xs text-foreground-muted">
            {overallEvents.length} eventos completados
          </span>
        </div>

        {overallEvents.length > 0 ? (
          <div className="overflow-hidden rounded-xl border border-border bg-background-surface shadow-card">
            <table className="min-w-full divide-y divide-border text-left text-sm">
              <thead className="bg-background-subtle/60 text-xs font-semibold uppercase tracking-wider text-foreground-muted">
                <tr>
                  <th scope="col" className="px-6 py-3.5">Puesto Final</th>
                  <th scope="col" className="px-6 py-3.5">Campeonato</th>
                  <th scope="col" className="px-6 py-3.5">Ronda Alcanzada</th>
                  <th scope="col" className="px-6 py-3.5">Modalidad</th>
                  <th scope="col" className="px-6 py-3.5">Año / Sede</th>
                  <th scope="col" className="px-6 py-3.5 text-right">Puntuación Final</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {overallEvents.map((event) => (
                  <tr key={event.competition_id} className="hover:bg-background-subtle/30 transition-colors">
                    <td className="px-6 py-4 font-semibold text-foreground">
                      <span className="flex items-center gap-1.5">
                        {event.final_rank === 1 && <Award className="h-4 w-4 text-amber-500" />}
                        {event.final_rank === 2 && <Award className="h-4 w-4 text-slate-400" />}
                        {event.final_rank === 3 && <Award className="h-4 w-4 text-amber-700" />}
                        {event.final_rank !== "-" ? `#${event.final_rank}` : "-"}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium text-foreground">
                      <Link
                        href={`/campeonatos/${event.competition_id}`}
                        className="hover:text-brand flex items-center gap-1.5"
                      >
                        {event.competition_name}
                        <ExternalLink className="h-3 w-3 text-foreground-subtle" />
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <span className="rounded bg-background-subtle px-2.5 py-1 text-xs font-semibold text-foreground">
                        {event.highest_stage}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="rounded bg-brand-50 px-2 py-0.5 text-xs font-semibold text-brand-700 border border-brand-200">
                        {event.modalidad || "Competición"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-foreground-muted">
                      {event.año ? `${event.año} • ` : ""}{event.sede}
                    </td>
                    <td className="px-6 py-4 text-right font-mono text-xs font-bold text-foreground">
                      {event.final_score || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-border p-8 text-center text-xs text-foreground-muted">
            Este atleta no tiene resultados registrados en campeonatos todavía.
          </div>
        )}
      </div>
    </div>
  );
}
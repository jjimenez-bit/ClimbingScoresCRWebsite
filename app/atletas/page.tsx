"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  ArrowRight,
  AlertCircle
} from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

interface DatabaseAthlete {
  id: string;
  nombre_completo?: string;
  nombre?: string;
  primer_apellido?: string;
  segundo_apellido?: string;
  nacionalidad?: string;
  [key: string]: any;
}

const PAGE_SIZE = 12;

export default function AtletasPage() {
  const [allAthletes, setAllAthletes] = useState<DatabaseAthlete[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Search & Pagination
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const getAthleteName = (ath: DatabaseAthlete): string => {
    if (ath.nombre_completo) return ath.nombre_completo;
    const parts = [ath.nombre, ath.primer_apellido, ath.segundo_apellido].filter(Boolean);
    return parts.join(" ") || `Atleta #${ath.id.slice(0, 6)}`;
  };

  const getInitials = (ath: DatabaseAthlete): string => {
    const name = getAthleteName(ath);
    const parts = name.split(" ").filter(Boolean);
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase() || "AT";
  };

  useEffect(() => {
    async function loadAllAthletes() {
      setLoading(true);
      setError(null);

      try {
        const { data, error: fetchErr } = await supabase
          .from("athletes")
          .select("*")
          .order("nombre_completo", { ascending: true });

        if (fetchErr) throw fetchErr;
        setAllAthletes(data || []);
      } catch (err: unknown) {
        console.error("Error loading athletes:", err);
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Error al conectar con la base de datos de atletas.");
        }
      } finally {
        setLoading(false);
      }
    }

    loadAllAthletes();
  }, []);

  // Instant reactive client-side search across name & country
  const filteredAthletes = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return allAthletes;

    return allAthletes.filter((ath) => {
      const name = getAthleteName(ath).toLowerCase();
      const country = (ath.nacionalidad || "").toLowerCase();
      return name.includes(query) || country.includes(query);
    });
  }, [allAthletes, searchQuery]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const totalCount = filteredAthletes.length;
  const totalPages = Math.ceil(totalCount / PAGE_SIZE) || 1;
  const paginatedAthletes = useMemo(() => {
    const from = (currentPage - 1) * PAGE_SIZE;
    return filteredAthletes.slice(from, from + PAGE_SIZE);
  }, [filteredAthletes, currentPage]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="border-b border-border pb-6">
        <span className="text-xs font-semibold uppercase tracking-wider text-brand">
          Comunidad Deportiva
        </span>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Directorio de Atletas
        </h1>
        <p className="mt-2 text-sm text-foreground-muted">
          Base de datos oficial sincronizada en tiempo real con Supabase.
        </p>
      </div>

      {/* Clean Full-Width Search Bar */}
      <div className="mt-6">
        <div className="relative w-full">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-foreground-subtle" />
          <input
            type="text"
            placeholder="Buscar por nombre, apellido o país de atleta..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-border bg-background-surface pl-12 pr-4 py-3 text-sm text-foreground placeholder:text-foreground-subtle focus:border-brand focus:outline-none shadow-sm transition-all"
          />
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="mt-6 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-500" />
          <span>Error de conexión: {error}</span>
        </div>
      )}

      {/* Loading Skeletons */}
      {loading ? (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="rounded-xl border border-border bg-background-surface p-6 shadow-card animate-pulse space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="h-12 w-12 rounded-xl bg-slate-200" />
                <div className="h-5 w-12 rounded bg-slate-200" />
              </div>
              <div className="h-5 w-3/4 rounded bg-slate-200" />
              <div className="h-8 rounded bg-slate-100" />
            </div>
          ))}
        </div>
      ) : paginatedAthletes.length > 0 ? (
        /* Minimalist Clean Athletes Grid */
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {paginatedAthletes.map((ath) => {
            const fullName = getAthleteName(ath);
            const initials = getInitials(ath);
            const country = ath.nacionalidad || "N/A";

            return (
              <div
                key={ath.id}
                className="group flex flex-col justify-between rounded-xl border border-border bg-background-surface p-6 shadow-card hover:border-brand-300 hover:shadow-hover transition-all"
              >
                <div>
                  {/* Initials & Country only */}
                  <div className="flex items-start justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 border border-brand-200 text-brand font-bold text-base shadow-sm">
                      {initials}
                    </div>

                    <span className="rounded-md bg-background-subtle px-2.5 py-1 text-xs font-bold text-foreground">
                      {country}
                    </span>
                  </div>

                  {/* Athlete Name */}
                  <h3 className="mt-4 text-lg font-bold text-foreground group-hover:text-brand transition-colors">
                    {fullName}
                  </h3>
                </div>

                {/* Drill-down button */}
                <div className="mt-6 border-t border-border pt-4">
                  <Link
                    href={`/atletas/${ath.id}`}
                    className="flex items-center justify-between text-xs font-semibold text-brand hover:text-brand-700"
                  >
                    <span>Ver Perfil Completo</span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="mt-12 rounded-xl border border-dashed border-border p-12 text-center text-sm text-foreground-muted">
          No se encontraron atletas que coincidan con &quot;{searchQuery}&quot;.
        </div>
      )}

      {/* Pagination Controls */}
      {!loading && totalCount > 0 && (
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 sm:flex-row">
          <span className="text-xs text-foreground-muted">
            Mostrando{" "}
            <span className="font-semibold text-foreground">
              {(currentPage - 1) * PAGE_SIZE + 1}
            </span>{" "}
            a{" "}
            <span className="font-semibold text-foreground">
              {Math.min(currentPage * PAGE_SIZE, totalCount)}
            </span>{" "}
            de <span className="font-semibold text-foreground">{totalCount}</span> atletas
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="inline-flex items-center gap-1 rounded-lg border border-border bg-background-surface px-3 py-2 text-xs font-semibold text-foreground shadow-sm hover:bg-background-subtle disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft className="h-4 w-4" />
              Anterior
            </button>

            <span className="px-2 text-xs font-semibold text-foreground">
              Página {currentPage} de {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="inline-flex items-center gap-1 rounded-lg border border-border bg-background-surface px-3 py-2 text-xs font-semibold text-foreground shadow-sm hover:bg-background-subtle disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              Siguiente
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Users, 
  Search, 
  Filter, 
  Trophy, 
  Medal, 
  ArrowRight,
  Sparkles
} from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { Athlete } from "@/types/climbing";

const fallbackAthletes: Athlete[] = [
  {
    id: "ath-1",
    first_name: "Alberto",
    last_name: "Ginés López",
    country_code: "ESP",
    country_name: "España",
    category: "Senior",
    discipline_primary: "Lead",
    current_rank: 1,
    total_podiums: 14,
    bio: "Campeón olímpico en Tokio 2020 y especialista en dificultad y bloque.",
  },
  {
    id: "ath-2",
    first_name: "Tomoa",
    last_name: "Narasaki",
    country_code: "JPN",
    country_name: "Japón",
    category: "Senior",
    discipline_primary: "Boulder",
    current_rank: 2,
    total_podiums: 26,
    bio: "Pionero del estilo dinámico moderno e inventor del paso Tomoa-skip.",
  },
  {
    id: "ath-3",
    first_name: "Jakob",
    last_name: "Schubert",
    country_code: "AUT",
    country_name: "Austria",
    category: "Senior",
    discipline_primary: "Lead",
    current_rank: 3,
    total_podiums: 32,
    bio: "Múltiple campeón mundial de dificultad y combinado.",
  },
  {
    id: "ath-4",
    first_name: "Sorato",
    last_name: "Anraku",
    country_code: "JPN",
    country_name: "Japón",
    category: "Senior",
    discipline_primary: "Combined",
    current_rank: 4,
    total_podiums: 18,
    bio: "Fenómeno de consistencia técnica tanto en búlder como en vía.",
  },
  {
    id: "ath-5",
    first_name: "Janja",
    last_name: "Garnbret",
    country_code: "SLO",
    country_name: "Eslovenia",
    category: "Senior",
    discipline_primary: "Combined",
    current_rank: 1,
    total_podiums: 45,
    bio: "Considerada una de las mejores escaladoras de competición de todos los tiempos.",
  },
  {
    id: "ath-6",
    first_name: "Mickael",
    last_name: "Mawem",
    country_code: "FRA",
    country_name: "Francia",
    category: "Senior",
    discipline_primary: "Boulder",
    current_rank: 8,
    total_podiums: 9,
    bio: "Campeón mundial de bloque conocido por su potencia y coordinación explosiva.",
  },
];

export default function AtletasPage() {
  const [athletes, setAthletes] = useState<Athlete[]>(fallbackAthletes);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  useEffect(() => {
    async function fetchAthletes() {
      try {
        const { data, error } = await supabase
          .from("athletes")
          .select("*")
          .order("last_name", { ascending: true });

        if (!error && data && data.length > 0) {
          // Normalize if table has different column naming
          setAthletes(data);
        }
      } catch (err) {
        console.warn("Using fallback local athletes:", err);
      }
    }

    fetchAthletes();
  }, []);

  const filteredAthletes = athletes.filter((athlete) => {
    const fullName = `${athlete.first_name} ${athlete.last_name}`.toLowerCase();
    const matchesSearch = fullName.includes(searchQuery.toLowerCase()) ||
      athlete.country_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      athlete.country_code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || athlete.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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
          Perfiles oficiales, categorías federativas y palmarés de competición internacional.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground-subtle" />
          <input
            type="text"
            placeholder="Buscar por nombre, apellido o país..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-border bg-background-surface pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-foreground-subtle focus:border-brand focus:outline-none shadow-sm"
          />
        </div>

        {/* Category Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <Filter className="h-4 w-4 text-foreground-subtle flex-shrink-0" />
          {["All", "Senior", "U20", "U18", "Paraclimbing"].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                selectedCategory === cat
                  ? "bg-brand text-white shadow-sm"
                  : "bg-background-surface border border-border text-foreground-muted hover:bg-background-subtle"
              }`}
            >
              {cat === "All" ? "Todas las categorías" : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Athletes Cards Grid */}
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredAthletes.map((athlete) => {
          const initials = `${athlete.first_name[0]}${athlete.last_name[0]}`;
          return (
            <div
              key={athlete.id}
              className="group flex flex-col justify-between rounded-xl border border-border bg-background-surface p-6 shadow-card hover:border-brand-300 hover:shadow-hover transition-all"
            >
              <div>
                <div className="flex items-start justify-between">
                  {/* Avatar / Monogram */}
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 border border-brand-200 text-brand font-bold text-base shadow-sm">
                    {initials}
                  </div>

                  {/* Discipline / Country Tag */}
                  <div className="flex flex-col items-end gap-1">
                    <span className="rounded-md bg-background-subtle px-2 py-0.5 text-xs font-bold text-foreground">
                      {athlete.country_code}
                    </span>
                    <span className="text-[11px] font-medium text-foreground-muted">
                      {athlete.category}
                    </span>
                  </div>
                </div>

                {/* Name */}
                <h3 className="mt-4 text-lg font-bold text-foreground group-hover:text-brand transition-colors">
                  {athlete.first_name} {athlete.last_name}
                </h3>
                <p className="text-xs text-foreground-muted">{athlete.country_name}</p>

                {athlete.bio && (
                  <p className="mt-3 text-xs text-foreground-muted line-clamp-2 leading-relaxed">
                    {athlete.bio}
                  </p>
                )}

                {/* Quick stats */}
                <div className="mt-5 grid grid-cols-2 gap-2 border-t border-border pt-4 text-xs">
                  <div>
                    <span className="text-foreground-subtle">Disciplina:</span>
                    <p className="font-semibold text-foreground">{athlete.discipline_primary}</p>
                  </div>
                  <div>
                    <span className="text-foreground-subtle">Podios Totales:</span>
                    <p className="font-semibold text-foreground flex items-center gap-1">
                      <Medal className="h-3.5 w-3.5 text-amber-500" />
                      {athlete.total_podiums ?? 0}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="mt-6 border-t border-border pt-4">
                <Link
                  href={`/atletas/${athlete.id}`}
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

      {filteredAthletes.length === 0 && (
        <div className="mt-12 rounded-xl border border-dashed border-border p-12 text-center text-sm text-foreground-muted">
          No se encontraron atletas que coincidan con &quot;{searchQuery}&quot;.
        </div>
      )}
    </div>
  );
}
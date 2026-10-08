import Link from "next/link";
import { Trophy, ArrowLeft } from "lucide-react";

export default function RankingPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href="/campeonatos"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-foreground-muted hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver a Campeonatos
      </Link>

      <div className="rounded-2xl border border-border bg-background-surface p-8 shadow-card text-center max-w-xl mx-auto">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-50 text-brand mb-4">
          <Trophy className="h-6 w-6" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">Ranking Oficial Unificado</h1>
        <p className="mt-2 text-sm text-foreground-muted">
          Los coeficientes globales por temporada y tablas ponderadas por modalidad estarán sincronizados con las tablas de Supabase en el siguiente paso.
        </p>
      </div>
    </div>
  );
}
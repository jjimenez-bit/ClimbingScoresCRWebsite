"use client";

import { useState } from "react";
import { Send, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

interface FormState {
  athleteName: string;
  email: string;
  country: string;
  category: string;
  suggestedChanges: string;
}

const initialFormState: FormState = {
  athleteName: "",
  email: "",
  country: "",
  category: "Senior",
  suggestedChanges: "",
};

export default function AthleteUpdateForm() {
  const [formData, setFormData] = useState<FormState>(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const { data, error } = await supabase
        .from("athlete_update_requests")
        .insert([
          {
            athlete_name: formData.athleteName.trim(),
            email: formData.email.trim(),
            country: formData.country.trim() || null,
            category: formData.category,
            suggested_changes: formData.suggestedChanges.trim(),
            status: "pending",
          },
        ]);

      if (error) {
        console.error("Supabase PostgREST Error:", error);
        setErrorMessage(
          error.message || error.details || error.hint || "Error al insertar en la base de datos."
        );
        return;
      }

      setSubmissionSuccess(true);
      setFormData(initialFormState);
    } catch (err: any) {
      console.error("Unexpected error:", err);
      setErrorMessage(
        err?.message || "Ocurrió un error inesperado al enviar la solicitud."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submissionSuccess) {
    return (
      <div className="rounded-xl border border-emerald-200 bg-emerald-50/80 p-6 text-emerald-900 shadow-sm">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="h-6 w-6 text-emerald-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-base font-semibold">¡Solicitud recibida correctamente!</h3>
            <p className="mt-1 text-sm text-emerald-700">
              Hemos registrado tu solicitud en nuestra cola de revisión. Nuestro equipo validará los datos con las actas oficiales antes de aplicar los cambios en la plataforma.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setSubmissionSuccess(false)}
          className="mt-4 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-emerald-700 transition-colors"
        >
          Enviar otra solicitud
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errorMessage && (
        <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3.5 text-xs text-red-700">
          <AlertCircle className="h-4 w-4 flex-shrink-0 text-red-500 mt-0.5" />
          <div>
            <span className="font-semibold">Error:</span> {errorMessage}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-xs font-semibold text-foreground mb-1.5">
            Nombre Completo del Atleta *
          </label>
          <input
            type="text"
            required
            value={formData.athleteName}
            onChange={(e) =>
              setFormData({ ...formData, athleteName: e.target.value })
            }
            placeholder="Ej. Alberto Ginés López"
            className="w-full rounded-lg border border-border bg-background-subtle/50 px-3.5 py-2.5 text-sm text-foreground focus:border-brand focus:bg-background-surface focus:outline-none transition-all"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-foreground mb-1.5">
            Email de Contacto *
          </label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            placeholder="atleta@ejemplo.com"
            className="w-full rounded-lg border border-border bg-background-subtle/50 px-3.5 py-2.5 text-sm text-foreground focus:border-brand focus:bg-background-surface focus:outline-none transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-xs font-semibold text-foreground mb-1.5">
            País o Federación
          </label>
          <input
            type="text"
            value={formData.country}
            onChange={(e) =>
              setFormData({ ...formData, country: e.target.value })
            }
            placeholder="Ej. España / FEDME"
            className="w-full rounded-lg border border-border bg-background-subtle/50 px-3.5 py-2.5 text-sm text-foreground focus:border-brand focus:bg-background-surface focus:outline-none transition-all"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-foreground mb-1.5">
            Categoría
          </label>
          <select
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
            className="w-full rounded-lg border border-border bg-background-subtle/50 px-3.5 py-2.5 text-sm text-foreground focus:border-brand focus:bg-background-surface focus:outline-none transition-all"
          >
            <option value="Senior">Senior</option>
            <option value="U20">Sub-20 (Juvenil)</option>
            <option value="U18">Sub-18 (Cadete)</option>
            <option value="Paraclimbing">Paraclimbing</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-foreground mb-1.5">
          Detalles de la Corrección o Actualización *
        </label>
        <textarea
          rows={4}
          required
          value={formData.suggestedChanges}
          onChange={(e) =>
            setFormData({ ...formData, suggestedChanges: e.target.value })
          }
          placeholder="Describe la actualización necesaria..."
          className="w-full rounded-lg border border-border bg-background-subtle/50 px-3.5 py-2.5 text-sm text-foreground focus:border-brand focus:bg-background-surface focus:outline-none transition-all"
        />
      </div>

      <div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-600 disabled:opacity-50 transition-all cursor-pointer"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Enviando solicitud...</span>
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              <span>Enviar Solicitud</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
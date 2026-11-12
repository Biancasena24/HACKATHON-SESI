export type HealthAnswers = Partial<Record<HabitId, string>>;
export type HabitId = "sono" | "atividade" | "agua" | "pausas" | "preventivo";

export const HABIT_QUESTIONS: { id: HabitId; label: string; options: { value: string; label: string }[] }[] = [
  {
    id: "sono",
    label: "Quantas horas você costuma dormir?",
    options: [
      { value: "lt5", label: "Menos de 5h" },
      { value: "5-6", label: "5 a 6h" },
      { value: "7-8", label: "7 a 8h" },
      { value: "gt8", label: "Mais de 8h" },
    ],
  },
  {
    id: "atividade",
    label: "Em quantos dias da semana você se movimenta por 30 min?",
    options: [
      { value: "0", label: "Nenhum" },
      { value: "1-2", label: "1 a 2" },
      { value: "3-4", label: "3 a 4" },
      { value: "5+", label: "5 ou mais" },
    ],
  },
  {
    id: "agua",
    label: "Como anda sua hidratação no trabalho?",
    options: [
      { value: "pouca", label: "Esqueço de beber" },
      { value: "media", label: "Bebo um pouco" },
      { value: "boa", label: "Bebo bem" },
    ],
  },
  {
    id: "pausas",
    label: "Você consegue fazer pausas durante o expediente?",
    options: [
      { value: "raramente", label: "Raramente" },
      { value: "as-vezes", label: "Às vezes" },
      { value: "sempre", label: "Sempre" },
    ],
  },
  {
    id: "preventivo",
    label: "Quando foi sua última consulta de rotina ou vacina?",
    options: [
      { value: "lt1", label: "Menos de 1 ano" },
      { value: "1-2", label: "1 a 2 anos" },
      { value: "gt2", label: "Mais de 2 anos" },
      { value: "nao-lembro", label: "Não lembro" },
    ],
  },
];

/** Friendly, non-medical recommendations derived from the initial questionnaire. */
export function recommendationsFor(a: HealthAnswers): { title: string; text: string; area: string }[] {
  const out: { title: string; text: string; area: string }[] = [];
  if (a.sono === "lt5" || a.sono === "5-6")
    out.push({ area: "Sono", title: "Um ritual para desacelerar", text: "Experimente guardar o celular 30 minutos antes de deitar por uma semana." });
  if (a.atividade === "0" || a.atividade === "1-2")
    out.push({ area: "Movimento", title: "Comece com 15 minutos", text: "Uma caminhada curta já conta. O importante é repetir, não a intensidade." });
  if (a.agua === "pouca")
    out.push({ area: "Hidratação", title: "Garrafa à vista", text: "Deixe água no campo de visão — ver lembra de beber." });
  if (a.pausas === "raramente")
    out.push({ area: "Pausas", title: "Micro-pausas contam", text: "1 minuto em pé a cada 2 horas alivia corpo e mente. Pausas também são direito no trabalho." });
  if (a.preventivo === "gt2" || a.preventivo === "nao-lembro")
    out.push({ area: "Prevenção", title: "Hora de visitar sua UBS", text: "Atualizar vacinas e fazer um acompanhamento de rotina é gratuito no SUS." });
  if (out.length === 0)
    out.push({ area: "Rotina", title: "Você está no caminho", text: "Manter o que já funciona é uma conquista. Que tal um desafio novo esta semana?" });
  return out;
}

/**
 * Demonstration health record simulating a future APS / prontuário integration.
 * Deterministic per user id; no real clinical data.
 */
export interface DemoRecord {
  lastVisits: { kind: string; date: string; place: string }[];
  vaccines: { name: string; lastDate: string | null; validYears: number | null }[];
  exam: { systolic: number; diastolic: number; weightKg: number; heightM: number; waistCm: number; glucose: number; date: string };
  lastDental: string | null;
}

function seed(id: string) {
  let h = 2166136261;
  for (const ch of id) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  return () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
}

function yearsAgo(today: string, years: number) {
  const d = new Date(today + "T12:00:00Z");
  d.setUTCDate(d.getUTCDate() - Math.round(years * 365));
  return d.toISOString().slice(0, 10);
}

export function demoRecord(userId: string, today: string): DemoRecord {
  const r = seed(userId);
  const pick = (a: number, b: number) => a + r() * (b - a);
  return {
    lastVisits: [
      { kind: "Consulta de enfermagem", date: yearsAgo(today, pick(0.3, 1.5)), place: "UBS de referência" },
      { kind: "Consulta médica de rotina", date: yearsAgo(today, pick(1, 2.8)), place: "UBS de referência" },
    ],
    vaccines: [
      { name: "Gripe (influenza)", lastDate: yearsAgo(today, pick(0.4, 1.6)), validYears: 1 },
      { name: "Difteria e tétano (dT)", lastDate: yearsAgo(today, pick(6, 11)), validYears: 10 },
      { name: "Hepatite B", lastDate: r() > 0.4 ? yearsAgo(today, pick(3, 10)) : null, validYears: null },
    ],
    exam: {
      systolic: Math.round(pick(112, 142)),
      diastolic: Math.round(pick(72, 92)),
      weightKg: Math.round(pick(58, 96)),
      heightM: Math.round(pick(1.55, 1.85) * 100) / 100,
      waistCm: Math.round(pick(76, 104)),
      glucose: Math.round(pick(82, 112)),
      date: yearsAgo(today, pick(0.2, 1.2)),
    },
    lastDental: r() > 0.3 ? yearsAgo(today, pick(0.8, 3.5)) : null,
  };
}

export function yearsSince(date: string, today: string): number {
  return (new Date(today).getTime() - new Date(date).getTime()) / (365 * 86400000);
}

export interface PreventiveAlert { id: string; title: string; text: string }

/** Preventive reminders from the record. Never a diagnosis — always points to the UBS. */
export function preventiveAlerts(rec: DemoRecord, today: string): PreventiveAlert[] {
  const out: PreventiveAlert[] = [];
  if (!rec.lastDental || yearsSince(rec.lastDental, today) >= 1)
    out.push({ id: "dental", title: "Hora de uma consulta odontológica", text: rec.lastDental ? `Sua última consulta foi há ${Math.floor(yearsSince(rec.lastDental, today))} ano(s). A equipe de Saúde Bucal da UBS atende pelo SUS.` : "Não encontramos registro de consulta odontológica. Que tal agendar na UBS?" });
  for (const v of rec.vaccines) {
    if (!v.lastDate) out.push({ id: `vac-${v.name}`, title: `Vacina: ${v.name}`, text: "Sem registro desta vacina. Leve sua carteirinha à UBS para conferir." });
    else if (v.validYears && yearsSince(v.lastDate, today) >= v.validYears - 0.5)
      out.push({ id: `vac-${v.name}`, title: `Vacina: ${v.name}`, text: "Está vencendo ou vencida. Converse na UBS sobre o reforço." });
  }
  const lastVisit = rec.lastVisits.map((v) => v.date).sort().at(-1);
  if (!lastVisit || yearsSince(lastVisit, today) >= 1)
    out.push({ id: "visit", title: "Acompanhamento de rotina", text: "Faz mais de um ano do seu último atendimento na UBS." });
  if (rec.exam.systolic >= 140 || rec.exam.diastolic >= 90)
    out.push({ id: "bp", title: "Vale medir a pressão de novo", text: "Sua última medida ficou acima do esperado. Medir de novo na UBS ajuda a entender melhor." });
  return out;
}

export function bmi(rec: DemoRecord) {
  return Math.round((rec.exam.weightKg / (rec.exam.heightM * rec.exam.heightM)) * 10) / 10;
}

/** Illustrative "what you are saving" estimate (R$), based on prevention actions logged. */
export const SAVINGS_PER_ACTION = { checkup: 180, dental: 250, vaccine: 120, habitDay: 3 } as const;
export function estimatedSavings(input: { preventiveDone: number; dentalDone: number; habitDays: number }) {
  return input.preventiveDone * SAVINGS_PER_ACTION.checkup + input.dentalDone * SAVINGS_PER_ACTION.dental + input.habitDays * SAVINGS_PER_ACTION.habitDay;
}

export function dependentReminders(d: { name: string; birth_year: number }, currentYear: number): string[] {
  const age = currentYear - d.birth_year;
  const out: string[] = [];
  if (age <= 6) out.push("Conferir a caderneta de vacinação infantil na UBS");
  if (age >= 9 && age <= 14) out.push("Vacina HPV (9 a 14 anos) disponível na UBS");
  if (age >= 60) out.push("Vacina da gripe anual e consulta de rotina");
  out.push(age < 18 ? "Consulta odontológica anual na UBS" : "Acompanhamento de rotina na UBS");
  return out;
}

export type WorkMode = "home_office" | "operacional" | "noturno" | "retorno";
export type FocusArea = "movimento" | "sono" | "mente" | "hidratacao" | "alimentacao" | "prevencao";

export interface Challenge {
  id: string;
  title: string;
  short: string;
  why: string;
  area: FocusArea;
  /** "daily" can be logged once per day; "once" is a single action for the week */
  cadence: "daily" | "once";
  modes?: WorkMode[];
}

export const CHALLENGES: Challenge[] = [
  {
    id: "caminhar-15",
    title: "Caminhar 15 minutos",
    short: "Pode ser no intervalo, indo ao ponto ou no fim do dia.",
    why: "Pequenas caminhadas melhoram o humor, o sono e a disposição.",
    area: "movimento",
    cadence: "daily",
  },
  {
    id: "pausas",
    title: "Pausa ativa a cada 2 horas",
    short: "Levante, mexa os ombros e respire por 1 minuto.",
    why: "Pausas curtas aliviam tensão muscular e cansaço mental.",
    area: "movimento",
    cadence: "daily",
  },
  {
    id: "alongar",
    title: "Alongar pescoço e ombros",
    short: "30 segundos de cada lado, sem forçar.",
    why: "Ajuda quem passa muito tempo na mesma posição.",
    area: "movimento",
    cadence: "daily",
    modes: ["home_office", "operacional", "retorno"],
  },
  {
    id: "olhos",
    title: "Regra 20-20-20 para os olhos",
    short: "A cada 20 min de tela, olhe 20 s para algo distante.",
    why: "Reduz a fadiga visual de quem trabalha com telas.",
    area: "movimento",
    cadence: "daily",
    modes: ["home_office"],
  },
  {
    id: "agua",
    title: "Rotina de hidratação",
    short: "Deixe uma garrafa por perto e beba ao longo do turno.",
    why: "A hidratação ajuda na concentração e na energia.",
    area: "hidratacao",
    cadence: "daily",
  },
  {
    id: "respirar",
    title: "2 minutos de respiração",
    short: "Use o exercício guiado da área Bem-estar.",
    why: "Respirar devagar acalma o corpo em momentos de pressão.",
    area: "mente",
    cadence: "daily",
  },
  {
    id: "sono",
    title: "Desacelerar antes de dormir",
    short: "Telas longe 30 minutos antes de deitar.",
    why: "Um ritual simples ajuda o corpo a entender que é hora de descansar.",
    area: "sono",
    cadence: "daily",
  },
  {
    id: "luz-natural",
    title: "Luz natural ao acordar",
    short: "Alguns minutos de claridade logo depois de acordar.",
    why: "Ajuda a organizar o relógio do corpo, especialmente em turnos.",
    area: "sono",
    cadence: "daily",
    modes: ["noturno"],
  },
  {
    id: "fruta",
    title: "Uma fruta no lanche",
    short: "Troque um lanche por uma fruta, quando der.",
    why: "Pequenas trocas somam muito ao longo da semana.",
    area: "alimentacao",
    cadence: "daily",
  },
  {
    id: "exames",
    title: "Agendar um cuidado preventivo",
    short: "Procure sua UBS para atualizar vacinas ou exames de rotina.",
    why: "A Atenção Primária acompanha você antes que algo vire problema.",
    area: "prevencao",
    cadence: "once",
  },
];

export const AREA_LABEL: Record<FocusArea, string> = {
  movimento: "Movimento",
  sono: "Sono",
  mente: "Mente",
  hidratacao: "Hidratação",
  alimentacao: "Alimentação",
  prevencao: "Prevenção",
};

export const WORK_MODES: { id: WorkMode; label: string; hint: string }[] = [
  { id: "home_office", label: "Home office", hint: "Trabalho em casa, muito tempo de tela" },
  { id: "operacional", label: "Operacional / fábrica", hint: "Em pé, em movimento ou com esforço físico" },
  { id: "noturno", label: "Turno da noite", hint: "Horários alternados ou noturnos" },
  { id: "retorno", label: "Retorno de afastamento", hint: "Voltando ao trabalho com calma" },
];

export function getChallenge(id: string): Challenge | undefined {
  return CHALLENGES.find((c) => c.id === id);
}

/** Suggest up to `limit` challenges for the chosen focus areas and work mode. */
export function suggestChallenges(focus: FocusArea[], mode: WorkMode, limit = 3): string[] {
  const fits = (c: Challenge) => !c.modes || c.modes.includes(mode);
  const picked: string[] = [];
  for (const area of focus) {
    const match = CHALLENGES.find((c) => c.area === area && fits(c) && !picked.includes(c.id));
    if (match) picked.push(match.id);
    if (picked.length >= limit) return picked;
  }
  for (const c of CHALLENGES) {
    if (picked.length >= limit) break;
    if (fits(c) && !picked.includes(c.id)) picked.push(c.id);
  }
  return picked;
}

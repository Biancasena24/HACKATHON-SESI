import type { HealthProfile } from "./types";
import { daysAgoStr } from "./dates";
import type { Checkin } from "./queries";

export const healthProfile: HealthProfile = {
  id: "profile-maria",
  name: "Maria Oliveira",
  role: "Auxiliar de produção · Metalúrgica Horizonte",
  riskClassification: 3,
  nextReturn: "Retorno em 3 meses · UBS Jardim Esperança",
  dependents: [
    {
      id: "dependent-lucas",
      name: "Lucas Oliveira",
      relation: "Filho(a)",
      healthStatus: "Em dia",
      age: 8,
      nextCare: "Vacinas e consulta odontológica em dia",
    },
    {
      id: "dependent-joao",
      name: "João Oliveira",
      relation: "Cônjuge",
      healthStatus: "Atenção",
      age: 41,
      nextCare: "Medir a pressão na UBS nos próximos 30 dias",
    },
  ],
  gamification: {
    teamName: "Time Bem Viver",
    currentPoints: 1450,
    rank: 2,
    badges: ["100% Preventivo", "Caminhada em Equipe", "30 dias de check-in"],
    weeklyGoal: 2000,
    prize: "Day off de autocuidado para o time",
  },
  insights: {
    futureRisksAvoided: [
      "Risco de lesão lombar reduzido em 38%",
      "Pressão alta identificada cedo e acompanhada",
      "Problemas na gengiva evitados com a consulta odontológica",
      "Vacinas em dia: menos faltas por gripe",
    ],
    savings: "R$ 1.240 e 18 horas de espera",
    savingsValue: 1240,
    avoidedVisits: 3,
    improvedPercent: 24,
    avoidedQueueHours: 18,
  },
  lastConsultations: [
    "Consulta de enfermagem · UBS Jardim Esperança · há 4 meses",
    "Consulta odontológica · UBS Jardim Esperança · há 7 meses",
    "Exames de rotina (pressão e glicemia) · há 5 meses",
    "Avaliação ergonômica do posto de trabalho · há 9 meses",
  ],
};

export interface ApsConsultation {
  id: string;
  type: "medica" | "enfermagem" | "odontologia" | "multiprofissional";
  title: string;
  date: string;
  unit: string;
  team: string;
  professional: string;
  summary: string;
  conduct: string;
  status: "Realizado" | "Agendado";
}

export const apsConsultations: ApsConsultation[] = [
  {
    id: "aps-1",
    type: "medica",
    title: "Consulta Médica de Família",
    date: "14/08/2026",
    unit: "UBS Jardim Esperança",
    team: "Equipe Saúde da Família 02 (ESF 02)",
    professional: "Dra. Camila Rocha · Médica de Família",
    summary:
      "Avaliação de rotina e acompanhamento de saúde do trabalhador. PA 120/80 mmHg, glicemia em jejum de 88 mg/dL. Exames preventivos dentro dos parâmetros de normalidade.",
    conduct:
      "Manter atividade física regular e pausas ativas. Retorno preventivo recomendado em 6 meses.",
    status: "Realizado",
  },
  {
    id: "aps-2",
    type: "enfermagem",
    title: "Consulta de Enfermagem e Imunização",
    date: "22/05/2026",
    unit: "UBS Jardim Esperança",
    team: "Equipe Saúde da Família 02 (ESF 02)",
    professional: "Enf. Marcos Lima · Enfermeiro de Família",
    summary:
      "Acolhimento preventivo e atualização da caderneta vacinal do adulto. Avaliação de hábitos de sono, alimentação e hidratação na rotina.",
    conduct:
      "Administrada dose da vacina Influenza e reforço de dT. Carteira de vacinas 100% em dia.",
    status: "Realizado",
  },
  {
    id: "aps-3",
    type: "odontologia",
    title: "Consulta Odontológica Preventiva",
    date: "10/02/2026",
    unit: "UBS Jardim Esperança",
    team: "Equipe de Saúde Bucal (ESB 01)",
    professional: "Dr. Lucas Mendes · Cirurgião-Dentista APS",
    summary:
      "Exame clínico bucal completo, gengivas saudáveis e ausência de cáries ativas. Profilaxia preventiva e aplicação tópica de flúor.",
    conduct:
      "Reforçadas orientações de escovação pós-refeição e fio dental diário. Agendamento de revisão preventiva semestral.",
    status: "Realizado",
  },
  {
    id: "aps-4",
    type: "multiprofissional",
    title: "Avaliação Postural e Ergonômica (eMulti)",
    date: "18/11/2025",
    unit: "UBS Jardim Esperança",
    team: "Equipe Multiprofissional (eMulti)",
    professional: "Juliana Prado · Fisioterapeuta da APS",
    summary:
      "Avaliação de queixas osteomusculares leves em região cervical e ombros. Análise da rotina de esforço repetitivo no trabalho.",
    conduct:
      "Prescrição de série de micro-pausas e exercícios de descompressão muscular. Participação no grupo de bem-estar corporal da UBS.",
    status: "Realizado",
  },
];

export interface CommunityGroup {
  id: string;
  name: string;
  sector: string;
  points: number;
  members: number;
  weeklyGrowth: number;
  badges: string[];
  highlight: string;
}

export const communityGroups: CommunityGroup[] = [
  {
    id: "team-coracao",
    name: "Time Coração em Movimento",
    sector: "Produção · Turno A",
    points: 1720,
    members: 24,
    weeklyGrowth: 14,
    badges: ["Caminhada em Equipe", "Hidratação em Dia"],
    highlight: "3 semanas seguidas em 1º lugar",
  },
  {
    id: "team-bem-viver",
    name: "Time Bem Viver",
    sector: "Administrativo",
    points: 1450,
    members: 18,
    weeklyGrowth: 21,
    badges: ["100% Preventivo", "30 dias de check-in"],
    highlight: "Time que mais cresceu nesta semana",
  },
  {
    id: "team-equilibrio",
    name: "Equipe Equilíbrio",
    sector: "Logística",
    points: 1180,
    members: 16,
    weeklyGrowth: 8,
    badges: ["Pausa Ativa", "Sono em Foco"],
    highlight: "Melhor adesão ao sono",
  },
  {
    id: "team-noturno",
    name: "Noite Saudável",
    sector: "Produção · Turno Noturno",
    points: 980,
    members: 21,
    weeklyGrowth: 11,
    badges: ["Luz Natural", "Respiração em Grupo"],
    highlight: "Time mais constante nos check-ins",
  },
  {
    id: "team-ativo",
    name: "Logística Ativa",
    sector: "Logística",
    points: 860,
    members: 14,
    weeklyGrowth: 5,
    badges: ["Alongamento em Equipe"],
    highlight: "Começou agora e já pontuou",
  },
];

export const communityRules = [
  { title: "Faça seu check-in", detail: "5 pontos por dia de cuidado registrado." },
  { title: "Conclua um desafio", detail: "10 pontos cada vez que marcar uma ação feita." },
  {
    title: "Cuide junto",
    detail: "Quando o time todo participa na semana, todos ganham um bônus.",
  },
  { title: "Compareça à prevenção", detail: "20 pontos extras ao registrar um cuidado na UBS." },
];

export const communityPrizes = [
  "1º lugar: day off de autocuidado para o time",
  "2º lugar: café da manhã saudável na empresa",
  "3º lugar: kit de alongamento para o setor",
];

export interface SavingsMetric {
  id: "visits" | "money" | "queue" | "health";
  label: string;
  value: string;
  detail: string;
}

export const savingsMetrics: SavingsMetric[] = [
  {
    id: "visits",
    label: "Idas ao pronto-socorro evitadas",
    value: "3",
    detail: "Cuidado na UBS antes de virar urgência",
  },
  {
    id: "money",
    label: "Economia estimada",
    value: "R$ 1.240",
    detail: "Transporte, remédios e dias sem trabalhar",
  },
  {
    id: "queue",
    label: "Horas de espera poupadas",
    value: "18 h",
    detail: "Menos tempo em fila de emergência",
  },
  {
    id: "health",
    label: "Sua saúde melhorou",
    value: "+24%",
    detail: "Comparado ao seu primeiro check-in",
  },
];

export interface StealthSource {
  id: string;
  label: string;
  lastCheck: string;
  status: "Em dia" | "Atenção";
  icon: "stethoscope" | "tooth" | "flask" | "hardhat";
}

export const stealthSources: StealthSource[] = [
  {
    id: "consultas",
    label: "Consultas na UBS",
    lastCheck: "há 4 meses",
    status: "Em dia",
    icon: "stethoscope",
  },
  {
    id: "odontologia",
    label: "Saúde bucal",
    lastCheck: "há 7 meses",
    status: "Em dia",
    icon: "tooth",
  },
  {
    id: "exames",
    label: "Exames de rotina",
    lastCheck: "há 5 meses",
    status: "Em dia",
    icon: "flask",
  },
  {
    id: "trabalho",
    label: "Riscos do trabalho",
    lastCheck: "há 9 meses",
    status: "Atenção",
    icon: "hardhat",
  },
];

export interface StealthInsight {
  id: string;
  tone: "info" | "attention" | "good";
  title: string;
  detail: string;
  recommendation: string;
}

export const stealthInsights: StealthInsight[] = [
  {
    id: "lombar",
    tone: "attention",
    title: "Um cuidado com suas costas",
    detail:
      "Nos últimos meses você registrou cansaço nas costas e fez uma avaliação ergonômica no trabalho. Juntas, essas informações merecem carinho.",
    recommendation: "Que tal incluir o alongamento de 30 segundos nos dias de turno mais pesado?",
  },
  {
    id: "pressao",
    tone: "info",
    title: "Sua pressão pede um novo olhar",
    detail:
      "Sua última medição ficou um pouco acima do esperado e já faz alguns meses. Medir de novo ajuda a entender melhor, sem susto.",
    recommendation: "Passe na UBS para medir a pressão quando puder. É rápido e gratuito.",
  },
  {
    id: "prevencao",
    tone: "good",
    title: "Você está no caminho certo",
    detail:
      "Vacinas, consulta odontológica e exames estão em dia. Isso reduz riscos futuros e poupa tempo em filas de emergência.",
    recommendation: "Continue assim. Seu próximo retorno está sugerido para daqui a 3 meses.",
  },
];

export const lastStealthCheck = "Hoje, às 6h40";

export function getMockCheckins(userId: string = "demo"): Checkin[] {
  const values = [
    { sleep: 3, mood: 4, energy: 3, stress: 2 },
    { sleep: 4, mood: 3, energy: 4, stress: 3 },
    { sleep: 3, mood: 4, energy: 3, stress: 2 },
    { sleep: 4, mood: 4, energy: 4, stress: 2 },
    { sleep: 5, mood: 5, energy: 4, stress: 1 },
    { sleep: 4, mood: 4, energy: 4, stress: 2 },
    { sleep: 3, mood: 3, energy: 3, stress: 3 },
    { sleep: 4, mood: 4, energy: 4, stress: 2 },
    { sleep: 4, mood: 4, energy: 3, stress: 2 },
    { sleep: 5, mood: 5, energy: 5, stress: 1 },
    { sleep: 4, mood: 4, energy: 4, stress: 2 },
    { sleep: 3, mood: 4, energy: 3, stress: 2 },
    { sleep: 4, mood: 4, energy: 4, stress: 2 },
    { sleep: 5, mood: 5, energy: 4, stress: 1 },
  ];
  return values.map((v, i) => {
    const day = daysAgoStr(13 - i);
    return {
      id: `mock-checkin-${i}`,
      user_id: userId,
      day,
      created_at: new Date().toISOString(),
      sleep: v.sleep,
      mood: v.mood,
      energy: v.energy,
      stress: v.stress,
      body_areas: [],
      note: null,
    };
  });
}

/** Fictitious, aggregated data for the corporate dashboard demo. No individual data. */
export const COMPANY = {
  name: "Metalúrgica Horizonte",
  employees: 420,
  enrolled: 312,
  minGroupSize: 10,
};

export const KPIS = [
  { label: "Participação ativa", value: "68%", delta: "+6 pts no mês" },
  { label: "Adesão aos desafios", value: "54%", delta: "+4 pts no mês" },
  { label: "Índice coletivo de bem-estar", value: "3,6 / 5", delta: "estável" },
  { label: "Check-ins na semana", value: "1.248", delta: "+11% vs. semana anterior" },
];

export const PARTICIPATION_WEEKS = [
  { week: "S1", participacao: 38, bemestar: 3.1 },
  { week: "S2", participacao: 41, bemestar: 3.2 },
  { week: "S3", participacao: 45, bemestar: 3.2 },
  { week: "S4", participacao: 47, bemestar: 3.3 },
  { week: "S5", participacao: 52, bemestar: 3.3 },
  { week: "S6", participacao: 55, bemestar: 3.4 },
  { week: "S7", participacao: 58, bemestar: 3.4 },
  { week: "S8", participacao: 61, bemestar: 3.5 },
  { week: "S9", participacao: 60, bemestar: 3.5 },
  { week: "S10", participacao: 64, bemestar: 3.5 },
  { week: "S11", participacao: 66, bemestar: 3.6 },
  { week: "S12", participacao: 68, bemestar: 3.6 },
];

export const CHALLENGE_ADHESION = [
  { name: "Hidratação", value: 71 },
  { name: "Pausa ativa", value: 63 },
  { name: "Caminhar 15 min", value: 58 },
  { name: "Respiração", value: 44 },
  { name: "Sono", value: 39 },
  { name: "Prevenção na UBS", value: 22 },
];

export const SIGNALS = ["Fadiga visual", "Dor lombar", "Estresse alto", "Sono ruim", "Dor nos ombros"];

/** Share (%) of check-ins in each sector reporting the signal this week. null = group too small to show. */
export const SECTOR_HEATMAP: { sector: string; people: number; values: (number | null)[] }[] = [
  { sector: "Desenvolvimento", people: 38, values: [46, 12, 31, 24, 28] },
  { sector: "Produção — turno A", people: 112, values: [9, 41, 22, 18, 35] },
  { sector: "Produção — turno noturno", people: 64, values: [11, 33, 29, 52, 21] },
  { sector: "Logística", people: 47, values: [7, 38, 18, 20, 26] },
  { sector: "Administrativo", people: 44, values: [34, 15, 27, 19, 22] },
  { sector: "Diretoria", people: 7, values: [null, null, null, null, null] },
];

export const INSIGHTS = [
  {
    tone: "alert" as const,
    title: "Fadiga visual subiu 40% em Desenvolvimento",
    action: "Sugestão: revisar iluminação e reforçar pausas de tela na rotina do time.",
  },
  {
    tone: "alert" as const,
    title: "Sono ruim em metade do turno noturno",
    action: "Sugestão: avaliar escalas e rodízio de folgas; divulgar orientações de sono para turnos.",
  },
  {
    tone: "info" as const,
    title: "Dor lombar frequente na Produção e Logística",
    action: "Sugestão: análise ergonômica dos postos e ginástica laboral no início do turno.",
  },
  {
    tone: "good" as const,
    title: "Hidratação é o hábito mais adotado",
    action: "Manter bebedouros acessíveis e garrafas reutilizáveis ajuda a sustentar o hábito.",
  },
];

export const COLLECTIVE_NEEDS = [
  { label: "Ergonomia e postura", share: 42 },
  { label: "Qualidade do sono", share: 35 },
  { label: "Estresse e sobrecarga", share: 31 },
  { label: "Vacinação em atraso", share: 18 },
];

/** Fictitious PGR (Programa de Gerenciamento de Riscos) data crossed with anonymous trends. */
export const PGR_CROSS = [
  { sector: "Produção — turno A", risk: "Ruído acima de 85 dB", trend: "28% relatam dor de cabeça", action: "Revisar protetores auriculares e pausas em área silenciosa." },
  { sector: "Logística", risk: "Levantamento de carga", trend: "38% relatam dor lombar", action: "Análise ergonômica e rodízio de tarefas." },
  { sector: "Desenvolvimento", risk: "Iluminação inadequada", trend: "46% relatam fadiga visual", action: "Ajustar iluminação e reforçar pausas de tela." },
  { sector: "Produção — turno noturno", risk: "Trabalho noturno contínuo", trend: "52% relatam sono ruim", action: "Rever escalas e folgas." },
];

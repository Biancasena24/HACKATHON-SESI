export type RiskClassification = 1 | 2 | 3 | 4;

export enum RiskClassificationLabel {
  Healthy = "Saudável",
  AtRisk = "Com risco",
  Compensated = "Compensado",
  Decompensated = "Descompensado",
}

export type DependentRelation = "Filho(a)" | "Cônjuge";
export type DependentHealthStatus = "Em dia" | "Atenção";

export interface Dependent {
  id: string;
  name: string;
  relation: DependentRelation;
  healthStatus: DependentHealthStatus;
  age?: number;
  nextCare?: string;
}

export interface Gamification {
  teamName: string;
  currentPoints: number;
  rank: number;
  badges: string[];
  weeklyGoal?: number;
  prize?: string;
}

export interface PreventiveInsights {
  futureRisksAvoided: string[];
  savings: string;
  savingsValue?: number;
  avoidedVisits?: number;
  improvedPercent?: number;
  avoidedQueueHours?: number;
}

export interface HealthProfile {
  id: string;
  name: string;
  role: string;
  riskClassification: RiskClassification;
  dependents: Dependent[];
  gamification: Gamification;
  insights: PreventiveInsights;
  lastConsultations: string[];
  nextReturn?: string;
}

export interface RiskRule {
  classification: RiskClassification;
  label: string;
  description: string;
  returnWindow: string;
  returnDetail: string;
  color: string;
  badgeClass: string;
  softClass: string;
}

export const RISK_RULES: Record<RiskClassification, RiskRule> = {
  1: {
    classification: 1,
    label: "Saudável",
    description: "Seus registros estão em dia e sem sinais de alerta.",
    returnWindow: "Retorno em 6 meses",
    returnDetail: "Continue com seus hábitos e faça o check-up na UBS.",
    color: "#7AFCD2",
    badgeClass: "bg-success text-success-foreground",
    softClass: "border-success/50 bg-success-soft text-indigo-deep",
  },
  2: {
    classification: 2,
    label: "Com risco",
    description: "Há um ponto de atenção que dá para acompanhar de perto.",
    returnWindow: "Retorno em 6 meses",
    returnDetail: "A equipe da UBS vai acompanhar sua evolução com você.",
    color: "#7AFCD2",
    badgeClass: "bg-success text-success-foreground",
    softClass: "border-success/50 bg-success-soft text-indigo-deep",
  },
  3: {
    classification: 3,
    label: "Compensado",
    description: "Seu cuidado está funcionando, mas pede retorno mais próximo.",
    returnWindow: "Retorno em 3 meses",
    returnDetail: "Marque sua consulta na UBS para manter o acompanhamento.",
    color: "#BA3D39",
    badgeClass: "bg-brick text-white",
    softClass: "border-brick/30 bg-brick-soft text-brick",
  },
  4: {
    classification: 4,
    label: "Descompensado",
    description: "É hora de atenção redobrada e acompanhamento contínuo.",
    returnWindow: "Monitoramento contínuo",
    returnDetail: "Fale com sua equipe de saúde da UBS o quanto antes.",
    color: "#F50903",
    badgeClass: "bg-destructive text-destructive-foreground",
    softClass: "border-destructive/30 bg-care-soft text-brick",
  },
};

export function riskRule(classification: RiskClassification): RiskRule {
  return RISK_RULES[classification];
}

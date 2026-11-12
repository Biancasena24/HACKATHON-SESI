export const POINTS = { checkin: 5, challenge: 10 } as const;
export const POINTS_PER_LEVEL = 100;

export function totalPoints(checkinCount: number, challengeLogCount: number): number {
  return checkinCount * POINTS.checkin + challengeLogCount * POINTS.challenge;
}

export function levelFor(points: number) {
  const level = Math.floor(points / POINTS_PER_LEVEL) + 1;
  const progress = points % POINTS_PER_LEVEL;
  return { level, progress, toNext: POINTS_PER_LEVEL - progress };
}

function shiftDay(day: string, delta: number): string {
  const [y, m, d] = day.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d + delta));
  return dt.toISOString().slice(0, 10);
}

/**
 * Consecutive days with at least one self-care action, ending today.
 * If today has nothing yet, a streak that ended yesterday still counts (no punishment for "not yet").
 */
export function currentStreak(activeDays: Iterable<string>, today: string): number {
  const set = new Set(activeDays);
  let cursor = set.has(today) ? today : shiftDay(today, -1);
  let streak = 0;
  while (set.has(cursor)) {
    streak++;
    cursor = shiftDay(cursor, -1);
  }
  return streak;
}

export interface AchievementInput {
  checkinCount: number;
  logs: { challenge_id: string }[];
  streak: number;
  points: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  unlocked: boolean;
}

export function achievements(input: AchievementInput): Achievement[] {
  const count = (id: string) => input.logs.filter((l) => l.challenge_id === id).length;
  const movement = ["caminhar-15", "pausas", "alongar"].reduce((n, id) => n + count(id), 0);
  return [
    { id: "primeiro-passo", title: "Primeiro passo", description: "Fez o primeiro check-in", unlocked: input.checkinCount >= 1 },
    { id: "semana-presente", title: "Semana presente", description: "7 dias seguidos de autocuidado", unlocked: input.streak >= 7 },
    { id: "corpo-em-movimento", title: "Corpo em movimento", description: "10 registros de movimento", unlocked: movement >= 10 },
    { id: "hidratado", title: "Bem hidratado", description: "7 dias de hidratação", unlocked: count("agua") >= 7 },
    { id: "prevencao", title: "Prevenção em dia", description: "Agendou um cuidado na UBS", unlocked: count("exames") >= 1 },
    { id: "cem-pontos", title: "100 pontos", description: "Somou 100 pontos de cuidado", unlocked: input.points >= 100 },
  ];
}

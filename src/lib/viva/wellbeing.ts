export interface CheckinSignal {
  day: string;
  mood: number;
  stress: number;
  sleep: number;
}

export const CARE_WINDOW_DAYS = 5;
export const CARE_MIN_HARD_DAYS = 3;

function shiftDay(day: string, delta: number): string {
  const [y = 1970, m = 1, d = 1] = day.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d + delta)).toISOString().slice(0, 10);
}

/** A "hard day" is high stress, very poor sleep or very low mood. Not a diagnosis. */
export function isHardDay(c: CheckinSignal): boolean {
  return c.stress >= 4 || c.sleep <= 2 || c.mood <= 2;
}

/**
 * Gentle support signal: 3 or more hard days within the last 5 days (today included).
 * Used only to offer an acolhimento option to the worker — never shared with the employer.
 */
export function needsCareSupport(checkins: CheckinSignal[], today: string): boolean {
  const start = shiftDay(today, -(CARE_WINDOW_DAYS - 1));
  const hard = checkins.filter((c) => c.day >= start && c.day <= today && isHardDay(c));
  return hard.length >= CARE_MIN_HARD_DAYS;
}

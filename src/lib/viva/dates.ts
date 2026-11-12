import { format, subDays } from "date-fns";

export function todayStr(): string {
  return format(new Date(), "yyyy-MM-dd");
}
export function daysAgoStr(n: number): string {
  return format(subDays(new Date(), n), "yyyy-MM-dd");
}

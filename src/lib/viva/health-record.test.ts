import { describe, expect, it } from "vitest";
import { dependentReminders, estimatedSavings, preventiveAlerts, type DemoRecord } from "./health-record";
import { needsCareSupport } from "./wellbeing";

const base: DemoRecord = {
  lastVisits: [{ kind: "x", date: "2026-06-01", place: "UBS" }],
  vaccines: [{ name: "dT", lastDate: "2017-01-01", validYears: 10 }],
  exam: { systolic: 120, diastolic: 80, weightKg: 70, heightM: 1.7, waistCm: 80, glucose: 90, date: "2026-06-01" },
  lastDental: "2024-01-01",
};

describe("preventive alerts", () => {
  it("flags dental visit older than 1 year and expiring dT", () => {
    const ids = preventiveAlerts(base, "2026-11-14").map((a) => a.id);
    expect(ids).toContain("dental");
    expect(ids).toContain("vac-dT");
    expect(ids).not.toContain("visit");
  });
  it("does not flag a recent dental visit", () => {
    const ids = preventiveAlerts({ ...base, lastDental: "2026-09-01" }, "2026-11-14").map((a) => a.id);
    expect(ids).not.toContain("dental");
  });
  it("savings estimate", () => {
    expect(estimatedSavings({ preventiveDone: 1, dentalDone: 1, habitDays: 10 })).toBe(460);
  });
  it("HPV reminder for 12-year-old", () => {
    expect(dependentReminders({ name: "a", birth_year: 2014 }, 2026)).toContain("Vacina HPV (9 a 14 anos) disponível na UBS");
  });
});

describe("care support", () => {
  it("needs 3 hard days in last 5", () => {
    const mk = (day: string, stress: number) => ({ day, mood: 3, sleep: 3, stress });
    expect(needsCareSupport([mk("2026-11-14", 5), mk("2026-11-13", 4)], "2026-11-14")).toBe(false);
    expect(needsCareSupport([mk("2026-11-14", 5), mk("2026-11-13", 4), mk("2026-11-11", 4)], "2026-11-14")).toBe(true);
    expect(needsCareSupport([mk("2026-11-14", 5), mk("2026-11-13", 4), mk("2026-11-09", 4)], "2026-11-14")).toBe(false);
  });
});

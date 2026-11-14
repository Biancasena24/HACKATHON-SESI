import { useMutation, useQueryClient, useSuspenseQuery, type QueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { checkinsQuery, logsQuery, myChallengesQuery, profileQuery } from "@/lib/viva/queries";
import { achievements, currentStreak, levelFor, totalPoints, POINTS } from "@/lib/viva/gamification";
import { needsCareSupport } from "@/lib/viva/wellbeing";
import { todayStr } from "@/lib/viva/dates";
import { useVivaUser } from "./use-viva-user";

export function ensureJourney(qc: QueryClient, userId: string) {
  return Promise.all([
    qc.ensureQueryData(profileQuery(userId)),
    qc.ensureQueryData(checkinsQuery(userId)),
    qc.ensureQueryData(logsQuery(userId)),
    qc.ensureQueryData(myChallengesQuery(userId)),
  ]);
}

export function useJourney() {
  const user = useVivaUser();
  const { data: profile } = useSuspenseQuery(profileQuery(user.id));
  const { data: checkins } = useSuspenseQuery(checkinsQuery(user.id));
  const { data: logs } = useSuspenseQuery(logsQuery(user.id));
  const { data: mine } = useSuspenseQuery(myChallengesQuery(user.id));

  return useMemo(() => {
    const today = todayStr();
    const points = totalPoints(checkins.length, logs.length);
    const activeDays = new Set<string>([...checkins.map((c) => c.day), ...logs.map((l) => l.day)]);
    const streak = currentStreak(activeDays, today);
    const todayCheckin = checkins.find((c) => c.day === today) ?? null;
    const doneToday = new Set(logs.filter((l) => l.day === today).map((l) => l.challenge_id));
    return {
      user,
      profile,
      checkins,
      logs,
      myChallengeIds: mine.map((m) => m.challenge_id),
      today,
      points,
      level: levelFor(points),
      streak,
      todayCheckin,
      doneToday,
      achievements: achievements({ checkinCount: checkins.length, logs, streak, points }),
      careSupport: needsCareSupport(checkins, today),
    };
  }, [user, profile, checkins, logs, mine]);
}

export function useToggleChallengeLog() {
  const user = useVivaUser();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ challengeId, done }: { challengeId: string; done: boolean }) => {
      const day = todayStr();
      if (done) {
        const { error } = await supabase.from("challenge_logs").delete().eq("user_id", user.id).eq("challenge_id", challengeId).eq("day", day);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("challenge_logs").insert({ user_id: user.id, challenge_id: challengeId, day });
        if (error) throw error;
      }
      return !done;
    },
    onSuccess: (nowDone) => {
      if (nowDone) toast.success("Desafio concluído com sucesso!");
      qc.invalidateQueries({ queryKey: ["challenge-logs", user.id] });
    },
    onError: () => toast.error("Não foi possível salvar. Tente de novo."),
  });
}

export function useToggleJoin() {
  const user = useVivaUser();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ challengeId, joined }: { challengeId: string; joined: boolean }) => {
      if (joined) {
        const { error } = await supabase.from("user_challenges").delete().eq("user_id", user.id).eq("challenge_id", challengeId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("user_challenges").insert({ user_id: user.id, challenge_id: challengeId });
        if (error) throw error;
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["my-challenges", user.id] }),
    onError: () => toast.error("Não foi possível salvar. Tente de novo."),
  });
}

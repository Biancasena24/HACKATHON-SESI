import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Checkin = Database["public"]["Tables"]["checkins"]["Row"];
export type ChallengeLog = Database["public"]["Tables"]["challenge_logs"]["Row"];

export const profileQuery = (userId: string) =>
  queryOptions({
    queryKey: ["profile", userId],
    queryFn: async () => {
      const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).maybeSingle();
      if (error) throw error;
      return data;
    },
  });

export const checkinsQuery = (userId: string) =>
  queryOptions({
    queryKey: ["checkins", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("checkins")
        .select("*")
        .eq("user_id", userId)
        .order("day", { ascending: true })
        .limit(1000);
      if (error) throw error;
      return data ?? [];
    },
  });

export const myChallengesQuery = (userId: string) =>
  queryOptions({
    queryKey: ["my-challenges", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_challenges")
        .select("challenge_id, joined_at")
        .eq("user_id", userId)
        .order("joined_at", { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
  });

export const logsQuery = (userId: string) =>
  queryOptions({
    queryKey: ["challenge-logs", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("challenge_logs")
        .select("id, challenge_id, day")
        .eq("user_id", userId)
        .order("day", { ascending: true })
        .limit(1000);
      if (error) throw error;
      return data ?? [];
    },
  });

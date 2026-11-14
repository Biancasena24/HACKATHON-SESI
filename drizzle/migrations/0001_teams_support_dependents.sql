ALTER TABLE public.profiles ADD COLUMN region text NOT NULL DEFAULT 'capital', ADD COLUMN simple_mode boolean NOT NULL DEFAULT false;

CREATE TABLE public.teams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL CHECK (char_length(name) BETWEEN 2 AND 60),
  code text NOT NULL UNIQUE DEFAULT upper(substr(md5(random()::text),1,6)),
  created_by uuid NOT NULL DEFAULT auth.uid(),
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.teams TO authenticated;
GRANT ALL ON public.teams TO service_role;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.team_members (
  team_id uuid NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  display_name text,
  joined_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (team_id, user_id)
);
GRANT SELECT, DELETE ON public.team_members TO authenticated;
GRANT ALL ON public.team_members TO service_role;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.is_team_member(_team uuid, _user uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.team_members WHERE team_id = _team AND user_id = _user)
$$;

CREATE POLICY "Members see team" ON public.teams FOR SELECT TO authenticated USING (public.is_team_member(id, auth.uid()) OR created_by = auth.uid());
CREATE POLICY "Create team" ON public.teams FOR INSERT TO authenticated WITH CHECK (created_by = auth.uid());
CREATE POLICY "Members see members" ON public.team_members FOR SELECT TO authenticated USING (public.is_team_member(team_id, auth.uid()));
CREATE POLICY "Leave team" ON public.team_members FOR DELETE TO authenticated USING (user_id = auth.uid());

CREATE OR REPLACE FUNCTION public.join_team(_code text)
RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE t uuid; n text;
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'not authenticated'; END IF;
  SELECT id INTO t FROM public.teams WHERE code = upper(trim(_code));
  IF t IS NULL THEN RAISE EXCEPTION 'team not found'; END IF;
  SELECT display_name INTO n FROM public.profiles WHERE id = auth.uid();
  INSERT INTO public.team_members(team_id, user_id, display_name) VALUES (t, auth.uid(), n) ON CONFLICT DO NOTHING;
  RETURN t;
END $$;
REVOKE ALL ON FUNCTION public.join_team(text) FROM public, anon;
GRANT EXECUTE ON FUNCTION public.join_team(text) TO authenticated;

-- Weekly ranking: aggregated engagement only (actions per member, last 7 days), teams with 3+ members
CREATE OR REPLACE FUNCTION public.team_ranking()
RETURNS TABLE(team_id uuid, name text, members int, score numeric) LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT t.id, t.name, count(DISTINCT m.user_id)::int,
    round((
      (SELECT count(*) FROM public.checkins c WHERE c.user_id IN (SELECT user_id FROM public.team_members WHERE team_id = t.id) AND c.day >= current_date - 6)
      + (SELECT count(*) FROM public.challenge_logs l WHERE l.user_id IN (SELECT user_id FROM public.team_members WHERE team_id = t.id) AND l.day >= current_date - 6)
    )::numeric / greatest(count(DISTINCT m.user_id),1), 1)
  FROM public.teams t JOIN public.team_members m ON m.team_id = t.id
  GROUP BY t.id, t.name
  HAVING count(DISTINCT m.user_id) >= 3
  ORDER BY 4 DESC
$$;
REVOKE ALL ON FUNCTION public.team_ranking() FROM public, anon;
GRANT EXECUTE ON FUNCTION public.team_ranking() TO authenticated;

-- Creator auto-joins
CREATE OR REPLACE FUNCTION public.team_creator_join()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.team_members(team_id, user_id, display_name)
  VALUES (NEW.id, NEW.created_by, (SELECT display_name FROM public.profiles WHERE id = NEW.created_by)) ON CONFLICT DO NOTHING;
  RETURN NEW;
END $$;
CREATE TRIGGER teams_creator_join AFTER INSERT ON public.teams FOR EACH ROW EXECUTE FUNCTION public.team_creator_join();

CREATE TABLE public.support_contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid(),
  name text NOT NULL CHECK (char_length(name) BETWEEN 1 AND 60),
  relation text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, DELETE ON public.support_contacts TO authenticated;
GRANT ALL ON public.support_contacts TO service_role;
ALTER TABLE public.support_contacts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Own support" ON public.support_contacts FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE TABLE public.dependents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid(),
  name text NOT NULL CHECK (char_length(name) BETWEEN 1 AND 60),
  birth_year int NOT NULL CHECK (birth_year BETWEEN 1900 AND 2100),
  relation text NOT NULL DEFAULT 'filho(a)',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, DELETE ON public.dependents TO authenticated;
GRANT ALL ON public.dependents TO service_role;
ALTER TABLE public.dependents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Own dependents" ON public.dependents FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

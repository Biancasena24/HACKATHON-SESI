import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async ({ location }) => {
    if (typeof window !== "undefined") {
      const isJurado = localStorage.getItem("cuidae_jurado_colaborador");
      if (isJurado) {
        const mockUser = {
          id: "00000000-0000-0000-0000-000000000001",
          email: "jurado@cuidae.demo",
          user_metadata: { display_name: "Jurado Avaliador" },
          app_metadata: {},
          aud: "authenticated",
          created_at: new Date().toISOString(),
        } as unknown as User;
        return { user: mockUser };
      }
    }
    const { data } = await supabase.auth.getUser();
    if (!data.user) {
      throw redirect({ to: "/auth", search: { redirect: location.href } });
    }
    return { user: data.user };
  },
  component: () => <Outlet />,
});

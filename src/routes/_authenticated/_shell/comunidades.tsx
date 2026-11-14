import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/_shell/comunidades")({
  beforeLoad: () => {
    throw redirect({
      to: "/engajamento",
      search: { tab: "comunidade" },
    });
  },
  component: () => null,
});

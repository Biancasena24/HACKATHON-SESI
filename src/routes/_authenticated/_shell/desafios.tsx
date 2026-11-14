import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/_shell/desafios")({
  beforeLoad: () => {
    throw redirect({
      to: "/engajamento",
      search: { tab: "desafios" },
    });
  },
  component: () => null,
});

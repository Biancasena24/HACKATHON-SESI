import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/_shell/bem-estar")({
  beforeLoad: () => {
    throw redirect({
      to: "/cuidado",
    });
  },
  component: () => null,
});

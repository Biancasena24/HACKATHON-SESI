import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/_shell/checkin")({
  beforeLoad: () => {
    throw redirect({
      to: "/engajamento",
      search: { tab: "checkin" },
    });
  },
  component: () => null,
});

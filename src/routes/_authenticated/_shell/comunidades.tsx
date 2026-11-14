import { createFileRoute } from "@tanstack/react-router";
import { CommunitiesPanel } from "@/components/viva/Communities";
import { healthProfile } from "@/lib/viva/mockData";

export const Route = createFileRoute("/_authenticated/_shell/comunidades")({
  head: () => ({
    meta: [
      { title: "Comunidades e ranking — VIVA+" },
      {
        name: "description",
        content:
          "Times da empresa competem de forma amigável pelo melhor engajamento em saúde, com ranking, medalhas e premiações coletivas.",
      },
      { property: "og:title", content: "Comunidades e ranking — VIVA+" },
      { property: "og:description", content: "Cuidado em grupo, ranking amigável e medalhas." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: CommunitiesPage,
});

function CommunitiesPage() {
  return <CommunitiesPanel gamification={healthProfile.gamification} />;
}

import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { CalendarCheck, ExternalLink, LocateFixed, MapPin, Search, ShieldCheck, Smartphone, Syringe, BellRing } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ensureJourney, useJourney, useToggleChallengeLog, useToggleJoin } from "@/hooks/use-journey";
import ubs from "@/assets/ubs-illustration.jpg";

export const Route = createFileRoute("/_authenticated/_shell/cuidado")({
  loader: ({ context }) => ensureJourney(context.queryClient, context.user.id),
  head: () => ({
    meta: [
      { title: "Conexão com o SUS — VIVA+" },
      { name: "description", content: "Encontre sua Unidade Básica de Saúde, veja vacinas e cuidados preventivos e mantenha o acompanhamento em dia." },
      { property: "og:title", content: "Conexão com o SUS — VIVA+" },
      { property: "og:description", content: "Sua ponte com a Atenção Primária à Saúde." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Care,
});

const UBS_OFFERS = [
  "Consultas com médico(a) e enfermeiro(a) de família",
  "Vacinas do calendário adulto",
  "Exames e acompanhamento preventivo",
  "Acolhimento em saúde mental",
  "Acompanhamento de pressão e diabetes",
  "Saúde bucal",
];

const VACCINES = [
  { name: "Gripe (influenza)", when: "Todo ano, nas campanhas" },
  { name: "Difteria e tétano (dT)", when: "Reforço a cada 10 anos" },
  { name: "Hepatite B", when: "3 doses, se ainda não tomou" },
  { name: "Tríplice viral", when: "Conforme a idade e histórico" },
  { name: "Febre amarela", when: "Conforme orientação da UBS" },
  { name: "COVID-19", when: "Conforme orientação vigente" },
];

type Place = { bairro: string; localidade: string; uf: string; logradouro: string };

function mapsUrl(query: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

function Care() {
  const j = useJourney();
  const join = useToggleJoin();
  const log = useToggleChallengeLog();
  const [cep, setCep] = useState("");
  const [place, setPlace] = useState<Place | null>(null);
  const [loading, setLoading] = useState(false);
  const joinedPrevention = j.myChallengeIds.includes("exames");
  const preventionDone = j.logs.some((l) => l.challenge_id === "exames");

  async function lookup(e: FormEvent) {
    e.preventDefault();
    const digits = cep.replace(/\D/g, "");
    if (digits.length !== 8) { toast.error("Digite um CEP com 8 números."); return; }
    setLoading(true);
    try {
      const res = await fetch(`https://viacep.com.br/ws/${digits}/json/`);
      const data = await res.json();
      if (data.erro) throw new Error("not found");
      setPlace(data);
    } catch {
      toast.error("Não encontramos esse CEP.");
      setPlace(null);
    } finally {
      setLoading(false);
    }
  }

  function nearMe() {
    if (!navigator.geolocation) { toast.error("Seu aparelho não permite localização."); return; }
    navigator.geolocation.getCurrentPosition(
      (pos) => window.open(`https://www.google.com/maps/search/UBS/@${pos.coords.latitude},${pos.coords.longitude},15z`, "_blank", "noreferrer"),
      () => toast.error("Não foi possível usar sua localização. Tente pelo CEP."),
    );
  }

  return (
    <div className="space-y-6">
      <section className="grid items-center gap-6 overflow-hidden rounded-3xl bg-sky-soft md:grid-cols-[1fr_1fr]">
        <div className="p-6 md:p-8">
          <p className="text-xs font-bold uppercase tracking-wider text-sky">Atenção Primária à Saúde</p>
          <h1 className="mt-1 text-3xl font-extrabold text-primary md:text-4xl">Sua UBS é sua parceira de cuidado</h1>
          <p className="mt-2 text-foreground/80">
            A Unidade Básica de Saúde é a porta de entrada do SUS: prevenção, vacinas, consultas e acolhimento perto de você — e de graça.
          </p>
        </div>
        <img src={ubs} alt="Profissional de saúde recebendo um trabalhador na porta de uma Unidade Básica de Saúde" width={1024} height={768} loading="lazy" className="h-full w-full object-cover" />
      </section>

      <section className="card-surface p-5">
        <h2 className="flex items-center gap-2 text-xl font-bold text-primary"><MapPin className="size-5 text-sky" /> Encontrar minha UBS de referência</h2>
        <p className="mt-1 text-sm text-muted-foreground">Sua UBS costuma ser a mais próxima de onde você mora. Leve documento com foto e Cartão SUS (ou CPF).</p>
        <form onSubmit={lookup} className="mt-4 flex flex-col gap-2 sm:flex-row">
          <Input inputMode="numeric" placeholder="Seu CEP (ex.: 01310-100)" value={cep} onChange={(e) => setCep(e.target.value)} className="h-12 rounded-xl" maxLength={9} />
          <Button type="submit" size="lg" disabled={loading}><Search /> {loading ? "Buscando..." : "Buscar"}</Button>
          <Button type="button" size="lg" variant="outline" onClick={nearMe}><LocateFixed /> Perto de mim</Button>
        </form>
        {place && (
          <div className="mt-4 rounded-2xl bg-muted p-4 animate-rise">
            <p className="text-sm text-muted-foreground">Região encontrada</p>
            <p className="font-bold text-primary">{[place.bairro, place.localidade, place.uf].filter(Boolean).join(" · ")}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button asChild variant="sky">
                <a href={mapsUrl(`UBS ${place.bairro} ${place.localidade} ${place.uf}`)} target="_blank" rel="noreferrer">
                  Ver UBS no mapa <ExternalLink />
                </a>
              </Button>
              <Button asChild variant="outline">
                <a href={mapsUrl(`Unidade Básica de Saúde ${place.localidade} ${place.uf}`)} target="_blank" rel="noreferrer">
                  Todas da cidade
                </a>
              </Button>
            </div>
          </div>
        )}
      </section>

      <div className="grid gap-6 md:grid-cols-2">
        <section className="card-surface p-5">
          <h2 className="flex items-center gap-2 text-xl font-bold text-primary"><ShieldCheck className="size-5 text-success" /> O que a UBS oferece</h2>
          <ul className="mt-3 space-y-2">
            {UBS_OFFERS.map((o) => (
              <li key={o} className="flex items-start gap-2"><span className="mt-2 size-2 shrink-0 rounded-full bg-sun" />{o}</li>
            ))}
          </ul>
        </section>
        <section className="card-surface p-5">
          <h2 className="flex items-center gap-2 text-xl font-bold text-primary"><Syringe className="size-5 text-sky" /> Vacinas para adultos</h2>
          <ul className="mt-3 divide-y divide-border">
            {VACCINES.map((v) => (
              <li key={v.name} className="flex justify-between gap-3 py-2">
                <span className="font-semibold">{v.name}</span>
                <span className="text-right text-sm text-muted-foreground">{v.when}</span>
              </li>
            ))}
          </ul>
          <p className="mt-2 text-xs text-muted-foreground">Confirme na UBS quais vacinas são indicadas para você.</p>
        </section>
      </div>

      <section className="rounded-3xl bg-gradient-primary p-6 text-primary-foreground shadow-lift">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="max-w-lg">
            <h2 className="flex items-center gap-2 text-xl font-bold"><CalendarCheck className="size-5" /> Desafio da prevenção</h2>
            <p className="mt-1 opacity-85">
              Ligar, ir ou agendar pelo app um cuidado de rotina na sua UBS. Medir a pressão e atualizar a carteirinha de vacinas já contam.
            </p>
          </div>
          {preventionDone ? (
            <span className="rounded-full bg-success px-4 py-2 font-bold text-success-foreground">Feito! Prevenção em dia ✓</span>
          ) : joinedPrevention ? (
            <Button variant="sun" size="lg" onClick={() => log.mutate({ challengeId: "exames", done: false })} disabled={log.isPending}>
              Marquei meu cuidado
            </Button>
          ) : (
            <Button variant="sun" size="lg" onClick={() => join.mutate({ challengeId: "exames", joined: false })} disabled={join.isPending}>
              Aceitar o desafio
            </Button>
          )}
        </div>
      </section>

      <div className="grid gap-6 md:grid-cols-2">
        <section className="card-surface p-5">
          <h2 className="flex items-center gap-2 text-xl font-bold text-primary"><Smartphone className="size-5 text-sky" /> Meu SUS Digital</h2>
          <p className="mt-1 text-muted-foreground">App oficial do Ministério da Saúde para ver vacinas, exames e seu histórico no SUS.</p>
          <Button asChild variant="outline" className="mt-4">
            <a href="https://www.gov.br/saude/pt-br/composicao/seidigi/meu-sus-digital" target="_blank" rel="noreferrer">Conhecer o app <ExternalLink /></a>
          </Button>
        </section>
        <section className="rounded-3xl border-2 border-dashed border-sky/40 p-5">
          <span className="rounded-full bg-sun px-2.5 py-1 text-xs font-bold text-sun-foreground">Em breve</span>
          <h2 className="mt-2 flex items-center gap-2 text-xl font-bold text-primary"><BellRing className="size-5 text-sky" /> Linha de cuidado contínua</h2>
          <p className="mt-1 text-muted-foreground">
            Integração futura com equipes da APS: depois de uma consulta, seu plano de cuidado e lembretes aparecem aqui — só com sua autorização.
          </p>
        </section>
      </div>
    </div>
  );
}

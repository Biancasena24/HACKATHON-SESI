import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import {
  CalendarCheck,
  ExternalLink,
  LocateFixed,
  MapPin,
  Search,
  ShieldCheck,
  Smartphone,
  Syringe,
  Phone,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ensureJourney,
  useJourney,
  useToggleChallengeLog,
  useToggleJoin,
} from "@/hooks/use-journey";
import { SUPPORT_CHANNELS } from "@/lib/viva/content";

export const Route = createFileRoute("/_authenticated/_shell/cuidado")({
  loader: ({ context }) => ensureJourney(context.queryClient, context.user.id),
  head: () => ({
    meta: [
      { title: "Atenção Primária à Saúde (APS) — Cuidaê+" },
      {
        name: "description",
        content:
          "Encontre sua Unidade Básica de Saúde, veja vacinas e acompanhe seus cuidados na Atenção Primária.",
      },
      { property: "og:title", content: "Atenção Primária à Saúde (APS) — Cuidaê+" },
      { property: "og:description", content: "Sua ponte com a Atenção Primária à Saúde (APS) e Unidades Básicas de Saúde." },
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
  const [coords, setCoords] = useState<{ lat: number; lng: number }>({
    lat: -23.55052,
    lng: -46.633308,
  });
  const [hasUserLocation, setHasUserLocation] = useState(false);
  const [geoLoading, setGeoLoading] = useState(false);

  const joinedPrevention = j.myChallengeIds.includes("exames");
  const preventionDone = j.logs.some((l) => l.challenge_id === "exames");

  useEffect(() => {
    if (typeof window !== "undefined" && "geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCoords({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
          setHasUserLocation(true);
        },
        () => {
          // Fallback location kept
        },
        { timeout: 7000 },
      );
    }
  }, []);

  async function lookup(e: FormEvent) {
    e.preventDefault();
    const digits = cep.replace(/\D/g, "");
    if (digits.length !== 8) {
      toast.error("Digite um CEP com 8 números.");
      return;
    }
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

  function requestLocation(openExternal = false) {
    if (typeof window === "undefined" || !navigator.geolocation) {
      toast.error("Seu aparelho não permite localização.");
      return;
    }
    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setCoords({ lat, lng });
        setHasUserLocation(true);
        setGeoLoading(false);
        toast.success("Localização atualizada com sucesso!");
        if (openExternal) {
          window.open(
            `https://www.google.com/maps/search/UBS/@${lat},${lng},15z`,
            "_blank",
            "noreferrer",
          );
        }
      },
      () => {
        setGeoLoading(false);
        toast.error("Não foi possível obter sua localização exata.");
        if (openExternal) {
          window.open("https://www.google.com/maps/search/UBS", "_blank", "noreferrer");
        }
      },
      { timeout: 10000, enableHighAccuracy: true },
    );
  }

  function nearMe() {
    requestLocation(true);
  }

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <p className="text-xs font-bold uppercase tracking-wider text-sky">
          Atenção Primária à Saúde
        </p>
        <h1 className="text-3xl font-extrabold text-primary md:text-4xl">
          APS — Conexão com sua UBS
        </h1>
      </header>

      <section className="card-surface p-5">
        <h2 className="flex items-center gap-2 text-xl font-bold text-primary">
          <MapPin className="size-5 text-sky" /> Encontrar minha UBS de referência
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Sua UBS costuma ser a mais próxima de onde você mora. Leve documento com foto e Cartão SUS
          (ou CPF).
        </p>
        <form onSubmit={lookup} className="mt-4 flex flex-col gap-2 sm:flex-row">
          <Input
            inputMode="numeric"
            placeholder="Seu CEP (ex.: 01310-100)"
            value={cep}
            onChange={(e) => setCep(e.target.value)}
            className="h-12 rounded-xl"
            maxLength={9}
          />
          <Button type="submit" size="lg" disabled={loading}>
            <Search /> {loading ? "Buscando..." : "Buscar"}
          </Button>
          <Button type="button" size="lg" variant="outline" onClick={nearMe} disabled={geoLoading}>
            <LocateFixed /> {geoLoading ? "Obtendo GPS..." : "Perto de mim"}
          </Button>
        </form>
        {place && (
          <div className="mt-4 rounded-2xl bg-muted p-4 animate-rise">
            <p className="text-sm text-muted-foreground">Região encontrada</p>
            <p className="font-bold text-primary">
              {[place.bairro, place.localidade, place.uf].filter(Boolean).join(" · ")}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button asChild variant="sky">
                <a
                  href={mapsUrl(`UBS ${place.bairro} ${place.localidade} ${place.uf}`)}
                  target="_blank"
                  rel="noreferrer"
                >
                  Ver UBS no mapa <ExternalLink />
                </a>
              </Button>
              <Button asChild variant="outline">
                <a
                  href={mapsUrl(`Unidade Básica de Saúde ${place.localidade} ${place.uf}`)}
                  target="_blank"
                  rel="noreferrer"
                >
                  Todas da cidade
                </a>
              </Button>
            </div>
          </div>
        )}
      </section>

      <section className="card-surface space-y-3 p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="grid size-9 place-items-center rounded-xl bg-sky-soft text-primary">
              <MapPin className="size-5" />
            </span>
            <div>
              <h2 className="text-lg font-bold text-primary">Sua localização no mapa</h2>
              <p className="text-xs text-muted-foreground">
                {hasUserLocation
                  ? "Localização atual identificada via GPS"
                  : "Localização de referência (clique em 'Usar meu GPS' para atualizar)"}
              </p>
            </div>
          </div>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => requestLocation(false)}
            disabled={geoLoading}
            className="gap-1.5"
          >
            <LocateFixed className="size-4" />
            {geoLoading ? "Obtendo GPS..." : "Usar meu GPS"}
          </Button>
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-border shadow-xs">
          <iframe
            title="Mapa da sua localização e UBS próximas"
            width="100%"
            height="340"
            className="w-full border-0"
            loading="lazy"
            src={`https://www.openstreetmap.org/export/embed.html?bbox=${coords.lng - 0.015}%2C${coords.lat - 0.015}%2C${coords.lng + 0.015}%2C${coords.lat + 0.015}&layer=mapnik&marker=${coords.lat}%2C${coords.lng}`}
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-1 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-sky animate-pulse" />
            Marcador indica sua posição aproximada
          </span>
          <Button asChild size="sm" variant="sky">
            <a
              href={`https://www.google.com/maps/search/UBS/@${coords.lat},${coords.lng},15z`}
              target="_blank"
              rel="noreferrer"
            >
              Ver UBSs próximas no Google Maps <ExternalLink className="ml-1 size-3.5" />
            </a>
          </Button>
        </div>
      </section>

      <div className="grid gap-6 md:grid-cols-2">
        <section className="card-surface p-5">
          <h2 className="flex items-center gap-2 text-xl font-bold text-primary">
            <ShieldCheck className="size-5 text-success" /> O que a UBS oferece
          </h2>
          <ul className="mt-3 space-y-2">
            {UBS_OFFERS.map((o) => (
              <li key={o} className="flex items-start gap-2">
                <span className="mt-2 size-2 shrink-0 rounded-full bg-sun" />
                {o}
              </li>
            ))}
          </ul>
        </section>
        <section className="card-surface p-5">
          <h2 className="flex items-center gap-2 text-xl font-bold text-primary">
            <Syringe className="size-5 text-sky" /> Vacinas para adultos
          </h2>
          <ul className="mt-3 divide-y divide-border">
            {VACCINES.map((v) => (
              <li key={v.name} className="flex justify-between gap-3 py-2">
                <span className="font-semibold">{v.name}</span>
                <span className="text-right text-sm text-muted-foreground">{v.when}</span>
              </li>
            ))}
          </ul>
          <p className="mt-2 text-xs text-muted-foreground">
            Confirme na UBS quais vacinas são indicadas para você.
          </p>
        </section>
      </div>

      <section className="rounded-3xl bg-gradient-primary p-6 text-primary-foreground shadow-lift">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="max-w-lg">
            <h2 className="flex items-center gap-2 text-xl font-bold">
              <CalendarCheck className="size-5" /> Desafio da prevenção
            </h2>
            <p className="mt-1 opacity-85">
              Ligar, ir ou agendar pelo app um cuidado de rotina na sua UBS. Medir a pressão e
              atualizar a carteirinha de vacinas já contam.
            </p>
          </div>
          {preventionDone ? (
            <span className="rounded-full bg-success px-4 py-2 font-bold text-success-foreground">
              Feito! Prevenção em dia ✓
            </span>
          ) : joinedPrevention ? (
            <Button
              variant="sun"
              size="lg"
              onClick={() => log.mutate({ challengeId: "exames", done: false })}
              disabled={log.isPending}
            >
              Marquei meu cuidado
            </Button>
          ) : (
            <Button
              variant="sun"
              size="lg"
              onClick={() => join.mutate({ challengeId: "exames", joined: false })}
              disabled={join.isPending}
            >
              Aceitar o desafio
            </Button>
          )}
        </div>
      </section>

      <section className="card-surface p-5">
        <h2 className="flex items-center gap-2 text-xl font-bold text-primary">
          <Smartphone className="size-5 text-sky" /> Meu SUS Digital
        </h2>
        <p className="mt-1 text-muted-foreground">
          App oficial do Ministério da Saúde para ver vacinas, exames e seu histórico no SUS.
        </p>
        <Button asChild variant="outline" className="mt-4">
          <a
            href="https://www.gov.br/saude/pt-br/composicao/seidigi/meu-sus-digital"
            target="_blank"
            rel="noreferrer"
          >
            Conhecer o app <ExternalLink />
          </a>
        </Button>
      </section>

      {/* Onde buscar acolhimento */}
      <section className="rounded-3xl bg-ink p-6 text-ink-foreground">
        <h2 className="text-xl font-bold">Onde buscar acolhimento</h2>
        <p className="mt-1 opacity-80">
          Você não precisa passar por isso sozinho(a). Estes canais são gratuitos.
        </p>
        <ul className="mt-4 grid gap-3 md:grid-cols-3">
          {SUPPORT_CHANNELS.map((s) => (
            <li
              key={s.name}
              className="rounded-2xl bg-ink-foreground/8 p-4 ring-1 ring-ink-foreground/15"
            >
              <p className="font-bold">{s.name}</p>
              <p className="mt-1 text-sm opacity-80">{s.detail}</p>
              <div className="mt-3 flex flex-wrap gap-2 text-sm font-semibold">
                {s.phone && (
                  <a
                    href={`tel:${s.phone}`}
                    className="inline-flex items-center gap-1 rounded-full bg-sun px-3 py-1.5 text-sun-foreground"
                  >
                    <Phone className="size-4" /> Ligar {s.phone}
                  </a>
                )}
                {s.href?.startsWith("http") && (
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 ring-1 ring-ink-foreground/30"
                  >
                    Abrir site <ExternalLink className="size-4" />
                  </a>
                )}
                {s.href === "/cuidado" && (
                  <button
                    type="button"
                    onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                    className="inline-flex items-center gap-1 rounded-full bg-sun px-3 py-1.5 text-sun-foreground"
                  >
                    Buscar minha UBS acima
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
        <p className="mt-4 flex items-start gap-2 text-sm opacity-80">
          <AlertCircle className="mt-0.5 size-4 shrink-0" /> O Cuidaê+ não faz diagnósticos e não
          substitui atendimento profissional.
        </p>
      </section>
    </div>
  );
}

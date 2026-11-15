import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { Building2, MailCheck, Sparkles, UserRound } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/viva/Logo";
import { cn } from "@/lib/utils";

type AuthSearch = {
  mode?: "login" | "signup" | undefined;
  redirect?: string | undefined;
  role?: "colaborador" | "empresa" | undefined;
};

export const Route = createFileRoute("/auth")({
  validateSearch: (s: Record<string, unknown>): AuthSearch => ({
    mode: s["mode"] === "signup" ? "signup" : s["mode"] === "login" ? "login" : undefined,
    redirect: typeof s["redirect"] === "string" ? s["redirect"] : undefined,
    role: s["role"] === "empresa" ? "empresa" : "colaborador",
  }),
  head: () => ({
    meta: [
      { title: "Entrar ou criar conta — Cuidaê+" },
      { name: "description", content: "Acesse sua jornada de autocuidado no Cuidaê+." },
      { property: "og:title", content: "Entrar no Cuidaê+" },
      { property: "og:description", content: "Acesse sua jornada de autocuidado ou painel corporativo." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AuthPage,
});

const emailSchema = z.string().trim().email("Informe um e-mail válido").max(255);
const passwordSchema = z.string().min(8, "A senha precisa ter pelo menos 8 caracteres").max(72);

function safePath(p?: string) {
  if (!p) return "/inicio";
  try {
    const u = new URL(p, window.location.origin);
    if (u.origin !== window.location.origin) return "/inicio";
    return u.pathname + u.search;
  } catch {
    return "/inicio";
  }
}

function GoogleIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18">
      <path
        fill="#4285F4"
        d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09C3.26 21.3 7.31 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.27 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.98-3.09z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96z"
      />
    </svg>
  );
}

function AuthPage() {
  const search = Route.useSearch();
  const navigate = useNavigate();
  const [role, setRole] = useState<"colaborador" | "empresa">(search.role ?? "colaborador");
  const [mode, setMode] = useState<"login" | "signup" | "forgot">(search.mode ?? "login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [companyPassword, setCompanyPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [sentTo, setSentTo] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session && role === "colaborador") {
        navigate({ to: safePath(search.redirect), replace: true });
      }
    });
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session && role === "colaborador") {
        navigate({ to: safePath(search.redirect), replace: true });
      }
    });
    return () => data.subscription.unsubscribe();
  }, [navigate, search.redirect, role]);

  async function handleJuradoAccess(targetRole: "colaborador" | "empresa") {
    if (targetRole === "empresa") {
      localStorage.setItem("cuidae_empresa_auth", "true");
      toast.success("Acesso como jurado (empresa) ativado!");
      navigate({ to: "/empresa", replace: true });
      return;
    }
    setBusy(true);
    localStorage.removeItem("cuidae_jurado_colaborador");
    const { error } = await supabase.auth.signInWithPassword({
      email: "hackathonsesisaude@gmail.com",
      password: "Hackathonsesisaude@123456",
    });
    setBusy(false);
    if (error) {
      localStorage.setItem("cuidae_jurado_colaborador", "true");
    }
    toast.success("Acesso como jurado (funcionário) ativado!");
    navigate({ to: safePath(search.redirect), replace: true });
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const em = emailSchema.safeParse(email);
    if (!em.success) {
      toast.error(em.error.issues[0]?.message ?? "Dados inválidos");
      return;
    }
    if (mode === "forgot") {
      setBusy(true);
      const { error } = await supabase.auth.resetPasswordForEmail(em.data, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      setBusy(false);
      if (error) {
        toast.error("Não foi possível enviar agora. Tente de novo.");
        return;
      }
      setSentTo(em.data);
      return;
    }
    const pw = passwordSchema.safeParse(password);
    if (!pw.success) {
      toast.error(pw.error.issues[0]?.message ?? "Dados inválidos");
      return;
    }
    setBusy(true);
    if (mode === "signup") {
      const { data, error } = await supabase.auth.signUp({
        email: em.data,
        password: pw.data,
        options: {
          emailRedirectTo: window.location.origin + "/inicio",
          data: { display_name: name.trim().slice(0, 60) || undefined },
        },
      });
      setBusy(false);
      if (error) {
        toast.error(
          error.message.includes("registered")
            ? "Este e-mail já tem conta. Tente entrar."
            : "Não foi possível criar a conta.",
        );
        return;
      }
      if (!data.session) setSentTo(em.data);
      return;
    }
    const { error } = await supabase.auth.signInWithPassword({ email: em.data, password: pw.data });
    setBusy(false);
    if (error) toast.error("E-mail ou senha não conferem.");
  }

  function onCompanySubmit(e: FormEvent) {
    e.preventDefault();
    if (!companyId.trim() || !companyPassword.trim()) {
      toast.error("Preencha o identificador (CNPJ ou e-mail) e a senha.");
      return;
    }
    localStorage.setItem("cuidae_empresa_auth", "true");
    toast.success("Login empresarial efetuado com sucesso!");
    navigate({ to: "/empresa", replace: true });
  }

  async function google() {
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin + "/auth",
    });
    if (result.error) toast.error("Não foi possível entrar com Google.");
  }

  return (
    <div className="grid min-h-screen bg-hero md:grid-cols-2">
      <div className="hidden flex-col justify-between bg-gradient-primary p-10 text-primary-foreground md:flex">
        <Logo className="text-primary-foreground [&_span:last-child]:text-sun" />
        <div>
          <h2 className="text-4xl font-extrabold">Um cuidado de cada vez.</h2>
          <p className="mt-4 max-w-sm text-lg opacity-85">
            {role === "empresa"
              ? "Indicadores de saúde ocupacional, prevenção e redução de afastamentos para sua organização."
              : "10 segundos por dia já ajudam você a entender como está — e a dar o próximo passo."}
          </p>
        </div>
        <p className="text-sm opacity-70">
          Seus dados individuais nunca são compartilhados de forma nominal com a empresa.
        </p>
      </div>

      <div className="flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">
          <div className="mb-6 md:hidden">
            <Logo />
          </div>

          <div className="mb-4 grid grid-cols-2 rounded-2xl bg-secondary/80 p-1">
            <button
              type="button"
              onClick={() => setRole("colaborador")}
              className={cn(
                "flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs sm:text-sm font-bold transition-all cursor-pointer",
                role === "colaborador"
                  ? "bg-primary text-white shadow-soft"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <UserRound className="size-4" /> Funcionário
            </button>
            <button
              type="button"
              onClick={() => setRole("empresa")}
              className={cn(
                "flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs sm:text-sm font-bold transition-all cursor-pointer",
                role === "empresa"
                  ? "bg-primary text-white shadow-soft"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Building2 className="size-4" /> Empresa
            </button>
          </div>

          {sentTo ? (
            <div className="card-surface p-8 text-center animate-rise">
              <MailCheck className="mx-auto size-12 text-sky" />
              <h1 className="mt-4 text-2xl font-bold text-primary">Confira seu e-mail</h1>
              <p className="mt-2 text-muted-foreground">
                Enviamos um link para <strong className="text-foreground">{sentTo}</strong>.{" "}
                {mode === "forgot"
                  ? "Abra o link para criar uma nova senha."
                  : "Clique nele para confirmar sua conta e começar."}
              </p>
              <Button
                variant="ghost"
                className="mt-6"
                onClick={() => {
                  setSentTo(null);
                  setMode("login");
                }}
              >
                Voltar para entrar
              </Button>
            </div>
          ) : role === "empresa" ? (
            /* ---------------- LOGIN EMPRESA ---------------- */
            <div className="card-surface p-6 sm:p-8 animate-rise">
              <div className="flex items-center gap-2">
                <span className="grid size-9 place-items-center rounded-xl bg-sky-soft text-primary">
                  <Building2 className="size-5" />
                </span>
                <div>
                  <h1 className="text-2xl font-bold text-primary">Acesso da Empresa</h1>
                  <p className="text-xs text-muted-foreground">Painel de saúde ocupacional</p>
                </div>
              </div>

              {/* Botão mockado "acesse como jurado" */}
              <div className="mt-5 rounded-2xl border border-sky/40 bg-sky-soft/60 p-3 text-center">
                <p className="text-xs text-muted-foreground">Demonstração para bancas avaliadoras</p>
                <button
                  type="button"
                  onClick={() => handleJuradoAccess("empresa")}
                  className="mt-1 inline-flex items-center gap-1.5 text-sm font-extrabold text-sky hover:underline cursor-pointer"
                >
                  <Sparkles className="size-4" /> Acesse como jurado
                </button>
              </div>

              <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
                <span className="h-px flex-1 bg-border" /> ou credenciais corporativas <span className="h-px flex-1 bg-border" />
              </div>

              <form onSubmit={onCompanySubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="companyId">CNPJ ou E-mail corporativo</Label>
                  <Input
                    id="companyId"
                    value={companyId}
                    onChange={(e) => setCompanyId(e.target.value)}
                    placeholder="Ex.: 12.345.678/0001-90 ou rh@empresa.com"
                    className="h-12 rounded-xl"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="companyPassword">Senha corporativa</Label>
                  <Input
                    id="companyPassword"
                    type="password"
                    value={companyPassword}
                    onChange={(e) => setCompanyPassword(e.target.value)}
                    className="h-12 rounded-xl"
                    required
                  />
                </div>
                <Button type="submit" variant="hero" size="lg" className="w-full">
                  Entrar no painel da empresa
                </Button>
              </form>
            </div>
          ) : (
            /* ---------------- LOGIN FUNCIONÁRIO ---------------- */
            <div className="card-surface p-6 sm:p-8 animate-rise">
              <h1 className="text-3xl font-bold text-primary">
                {mode === "signup"
                  ? "Criar sua conta"
                  : mode === "forgot"
                    ? "Recuperar senha"
                    : "Bem-vindo de volta"}
              </h1>
              <p className="mt-1 text-muted-foreground">
                {mode === "signup"
                  ? "Leva menos de um minuto."
                  : mode === "forgot"
                    ? "Enviaremos um link para o seu e-mail."
                    : "Entre para continuar sua jornada."}
              </p>

              {/* Botão mockado "acesse como jurado" */}
              <div className="mt-4 rounded-2xl border border-sky/40 bg-sky-soft/60 p-3 text-center">
                <p className="text-xs text-muted-foreground">Demonstração para bancas avaliadoras</p>
                <button
                  type="button"
                  onClick={() => handleJuradoAccess("colaborador")}
                  className="mt-1 inline-flex items-center gap-1.5 text-sm font-extrabold text-sky hover:underline cursor-pointer"
                >
                  <Sparkles className="size-4" /> Acesse como jurado
                </button>
              </div>

              {mode !== "forgot" && (
                <>
                  <Button
                    type="button"
                    variant="ghost"
                    size="lg"
                    className="btn-google mt-4 w-full"
                    onClick={google}
                  >
                    <GoogleIcon /> Continuar com Google
                  </Button>
                  <div className="my-4 flex items-center gap-3 text-sm text-muted-foreground">
                    <span className="h-px flex-1 bg-border" /> ou com e-mail{" "}
                    <span className="h-px flex-1 bg-border" />
                  </div>
                </>
              )}

              <form onSubmit={onSubmit} className="space-y-4">
                {mode === "signup" && (
                  <div className="space-y-1.5">
                    <Label htmlFor="name">Como quer ser chamado(a)?</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Seu nome ou apelido"
                      className="h-12 rounded-xl"
                      maxLength={60}
                    />
                  </div>
                )}
                <div className="space-y-1.5">
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12 rounded-xl"
                    required
                  />
                </div>
                {mode !== "forgot" && (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Senha</Label>
                      {mode === "login" && (
                        <button
                          type="button"
                          className="text-sm font-semibold text-sky hover:underline cursor-pointer"
                          onClick={() => setMode("forgot")}
                        >
                          Esqueci a senha
                        </button>
                      )}
                    </div>
                    <Input
                      id="password"
                      type="password"
                      autoComplete={mode === "signup" ? "new-password" : "current-password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-12 rounded-xl"
                      required
                    />
                  </div>
                )}
                <Button type="submit" variant="hero" size="lg" className="w-full" disabled={busy}>
                  {busy
                    ? "Aguarde..."
                    : mode === "signup"
                      ? "Criar conta"
                      : mode === "forgot"
                        ? "Enviar link"
                        : "Entrar"}
                </Button>
              </form>

              <p className="mt-6 text-center text-sm text-muted-foreground">
                {mode === "signup" ? (
                  <>
                    Já tem conta?{" "}
                    <button
                      className="font-semibold text-sky hover:underline cursor-pointer"
                      onClick={() => setMode("login")}
                    >
                      Entrar
                    </button>
                  </>
                ) : (
                  <>
                    Ainda não tem conta?{" "}
                    <button
                      className="font-semibold text-sky hover:underline cursor-pointer"
                      onClick={() => setMode("signup")}
                    >
                      Criar agora
                    </button>
                  </>
                )}
              </p>
            </div>
          )}
          <p className="mt-6 text-center text-sm">
            <Link to="/" className="text-muted-foreground hover:text-primary">
              ← Voltar para o início
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

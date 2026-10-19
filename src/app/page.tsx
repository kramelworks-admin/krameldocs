import Link from "next/link";
import { ArrowRight, BookOpen, Code2, GitBranch, Layers3 } from "lucide-react";

const features = [
  {
    icon: BookOpen,
    title: "Documentação organizada",
    description:
      "Navegue por guias, referências e conteúdos estruturados em uma única interface.",
  },
  {
    icon: GitBranch,
    title: "Conteúdo no GitHub",
    description:
      "Mantenha sua documentação em um repositório independente e versionado.",
  },
  {
    icon: Code2,
    title: "Feito para desenvolvedores",
    description:
      "Leia exemplos de código, tabelas e instruções em Markdown com clareza.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b border-[var(--border)]">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex size-9 items-center justify-center rounded-xl bg-indigo-600 text-white">
              <Layers3 size={20} />
            </span>
            <span className="text-lg font-semibold tracking-tight">
              krameldocs
            </span>
          </Link>

          <Link
            href="/docs"
            className="inline-flex items-center gap-2 rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-80"
          >
            Abrir documentação
            <ArrowRight size={16} />
          </Link>
        </div>
      </header>

      <section className="relative overflow-hidden border-b border-[var(--border)]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-transparent" />

        <div className="relative mx-auto max-w-5xl px-6 py-24 text-center sm:py-32 lg:px-8">
          <div className="mx-auto mb-8 inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--muted)] px-3.5 py-1.5 text-sm text-[var(--muted-foreground)]">
            <span className="size-2 rounded-full bg-emerald-500" />
            Seu conhecimento, organizado
          </div>

          <h1 className="mx-auto max-w-4xl text-4xl font-semibold tracking-tight sm:text-6xl sm:leading-[1.1]">
            Documentação técnica
            <span className="mt-2 block text-indigo-600 dark:text-indigo-400">
              simples e acessível.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-[var(--muted-foreground)]">
            Um espaço centralizado para guias, referências e conteúdo técnico,
            com documentação versionada no GitHub e uma experiência de leitura
            feita para desenvolvedores.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/docs"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 text-sm font-medium text-white transition-colors hover:bg-indigo-500"
            >
              Explorar documentação
              <ArrowRight size={17} />
            </Link>

            <a
              href="https://github.com/kramelworks/krameldocs-content"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-[var(--border)] px-6 text-sm font-medium transition-colors hover:bg-[var(--muted)]"
            >
              <GitBranch size={17} />
              Repositório de conteúdo
            </a>
          </div>

          <div className="mx-auto mt-16 max-w-3xl rounded-2xl border border-[var(--border)] bg-[var(--muted)]/60 p-3 text-left shadow-2xl shadow-indigo-950/5 sm:p-5">
            <div className="flex items-center gap-2 border-b border-[var(--border)] pb-3">
              <span className="size-2.5 rounded-full bg-red-400" />
              <span className="size-2.5 rounded-full bg-amber-400" />
              <span className="size-2.5 rounded-full bg-emerald-400" />
              <span className="ml-3 text-xs text-[var(--muted-foreground)]">
                krameldocs / documentação
              </span>
            </div>

            <div className="grid gap-5 py-5 sm:grid-cols-[180px_1fr]">
              <div className="hidden space-y-3 border-r border-[var(--border)] pr-4 sm:block">
                <div className="h-2.5 w-20 rounded bg-[var(--muted-foreground)]/25" />
                <div className="h-2 w-28 rounded bg-[var(--muted-foreground)]/15" />
                <div className="rounded-md bg-indigo-500/10 px-2 py-2 text-xs text-indigo-600 dark:text-indigo-300">
                  Instalação
                </div>
                <div className="h-2 w-24 rounded bg-[var(--muted-foreground)]/15" />
                <div className="h-2 w-20 rounded bg-[var(--muted-foreground)]/15" />
              </div>

              <div className="space-y-4">
                <div className="h-4 w-2/3 rounded bg-[var(--muted-foreground)]/30" />
                <div className="h-2.5 w-full rounded bg-[var(--muted-foreground)]/15" />
                <div className="h-2.5 w-5/6 rounded bg-[var(--muted-foreground)]/15" />
                <div className="rounded-lg border border-[var(--border)] bg-background p-4">
                  <div className="mb-3 h-2.5 w-24 rounded bg-indigo-500/40" />
                  <div className="space-y-2">
                    <div className="h-2 w-4/5 rounded bg-[var(--muted-foreground)]/20" />
                    <div className="h-2 w-3/5 rounded bg-[var(--muted-foreground)]/20" />
                    <div className="h-2 w-2/3 rounded bg-[var(--muted-foreground)]/20" />
                  </div>
                </div>
                <div className="h-2.5 w-3/4 rounded bg-[var(--muted-foreground)]/15" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20 lg:px-8">
        <div className="mb-10 max-w-xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
            Pensado para o dia a dia
          </p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
            Tudo o que você precisa para consultar e manter conhecimento.
          </h2>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <article
                key={feature.title}
                className="rounded-2xl border border-[var(--border)] p-6 transition-colors hover:bg-[var(--muted)]/60"
              >
                <span className="mb-5 flex size-11 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                  <Icon size={21} />
                </span>
                <h3 className="text-base font-semibold">{feature.title}</h3>
                <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                  {feature.description}
                </p>
              </article>
            );
          })}
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-5 rounded-2xl border border-[var(--border)] bg-[var(--muted)]/50 p-7 sm:flex-row sm:items-center sm:p-9">
          <div>
            <h2 className="text-xl font-semibold">Pronto para começar?</h2>
            <p className="mt-2 text-sm text-[var(--muted-foreground)]">
              Acesse os guias e encontre as informações de que precisa.
            </p>
          </div>

          <Link
            href="/docs"
            className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-indigo-600 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-indigo-500"
          >
            Ir para os guias
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      <footer className="border-t border-[var(--border)]">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-6 py-6 text-sm text-[var(--muted-foreground)] sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <span>© 2026 krameldocs</span>
          <span>Documentação técnica, organizada e versionada.</span>
        </div>
      </footer>
    </main>
  );
}

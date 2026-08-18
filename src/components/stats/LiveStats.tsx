import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { gsap } from "@/lib/gsap";
import { Container } from "@/components/layout/Container";
import { useReducedMotion } from "@/lib/useReducedMotion";

// Replace with your real usernames.
const USERNAMES = {
  github: "samratujjwal",
  leetcode: "samratujjwal",
};

interface GitHubStats {
  publicRepos: number;
  totalContributions: number;
  currentStreak: number;
}

interface LeetCodeStats {
  totalSolved: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  ranking: number;
}

type FetchState<T> =
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; profileUrl: string };

function useCachedFetch<T>(key: string, fetcher: () => Promise<T>, fallbackUrl: string): FetchState<T> {
  const [state, setState] = useState<FetchState<T>>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;

    const cached = sessionStorage.getItem(key);
    if (cached) {
      setState({ status: "success", data: JSON.parse(cached) as T });
      return;
    }

    fetcher()
      .then((data) => {
        if (cancelled) return;
        sessionStorage.setItem(key, JSON.stringify(data));
        setState({ status: "success", data });
      })
      .catch(() => {
        if (!cancelled) setState({ status: "error", profileUrl: fallbackUrl });
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return state;
}

async function fetchGitHubStats(username: string): Promise<GitHubStats> {
  const res = await fetch(`/api/github-stats?username=${encodeURIComponent(username)}`);
  if (!res.ok) throw new Error("GitHub fetch failed");
  return res.json();
}

async function fetchLeetCodeStats(username: string): Promise<LeetCodeStats> {
  const res = await fetch(`/api/leetcode-stats?username=${encodeURIComponent(username)}`);
  if (!res.ok) throw new Error("LeetCode fetch failed");
  return res.json();
}

export function LiveStats() {
  const rootRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const github = useCachedFetch(
    `stats:github:${USERNAMES.github}`,
    () => fetchGitHubStats(USERNAMES.github),
    `https://github.com/${USERNAMES.github}`,
  );
  const leetcode = useCachedFetch(
    `stats:leetcode:${USERNAMES.leetcode}`,
    () => fetchLeetCodeStats(USERNAMES.leetcode),
    `https://leetcode.com/${USERNAMES.leetcode}`,
  );

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.from("[data-stat-block]", {
        opacity: 0,
        y: 8,
        duration: 0.4,
        ease: "power2.out",
        stagger: 0.08,
        scrollTrigger: { trigger: root, start: "top 75%" },
      });
    }, root);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section id="stats" ref={rootRef} aria-labelledby="stats-heading" className="pt-24 md:pt-32">
      <Container className="max-w-2xl">
        <div className="mb-10 flex items-center justify-between md:mb-14">
          <p className="font-mono text-xs tracking-wide text-structure dark:text-structure-dark">
            05 / Live stats
          </p>
          <span className="flex items-center gap-1.5 font-mono text-xs text-signal dark:text-signal-dark">
            <span
              aria-hidden="true"
              className="h-1.5 w-1.5 animate-pulse rounded-full bg-signal dark:bg-signal-dark"
            />
            live
          </span>
        </div>

        <h2 id="stats-heading" className="sr-only">
          Live coding stats
        </h2>

        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2">
          <StatBlock
            title="LeetCode"
            state={leetcode}
            render={(data) => (
              <>
                <StatRow label="Total solved" value={String(data.totalSolved)} />
                <StatRow label="Easy" value={String(data.easySolved)} />
                <StatRow label="Medium" value={String(data.mediumSolved)} />
                <StatRow label="Hard" value={String(data.hardSolved)} />
                <StatRow label="Ranking" value={`#${data.ranking.toLocaleString()}`} />
              </>
            )}
          />

          <StatBlock
            title="GitHub"
            state={github}
            render={(data) => (
              <>
                <StatRow label="Public repos" value={String(data.publicRepos)} />
                <StatRow label="Contributions (1y)" value={data.totalContributions.toLocaleString()} />
                <StatRow label="Current streak" value={`${data.currentStreak} days`} />
              </>
            )}
          />
        </div>
      </Container>
    </section>
  );
}

interface StatBlockProps<T> {
  title: string;
  state: FetchState<T>;
  render: (data: T) => ReactNode;
}

function StatBlock<T>({ title, state, render }: StatBlockProps<T>) {
  return (
    <div data-stat-block>
      <h3 className="mb-3 border-b border-structure/20 pb-2 font-mono text-xs tracking-wide text-ink/60 dark:border-structure-dark/20 dark:text-ink-dark/60">
        {title}
      </h3>

      {state.status === "loading" && (
        <div className="space-y-2" aria-hidden="true">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-4 w-3/4 animate-pulse rounded-sm bg-structure/10 dark:bg-structure-dark/10" />
          ))}
        </div>
      )}

      {state.status === "success" && (
        <dl className="divide-y divide-structure/10 dark:divide-structure-dark/10">{render(state.data)}</dl>
      )}

      {state.status === "error" && (
        <p className="font-mono text-xs text-ink/50 dark:text-ink-dark/50">
          Live stats unavailable right now —{" "}
          <a
            href={state.profileUrl}
            target="_blank"
            rel="noreferrer"
            className="underline decoration-structure/40 hover:text-signal hover:decoration-signal dark:hover:text-signal-dark"
          >
            view profile ↗
          </a>
        </p>
      )}
    </div>
  );
}

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between py-2">
      <dt className="font-sans text-sm text-ink/70 dark:text-ink-dark/70">{label}</dt>
      <dd className="font-mono text-sm text-ink dark:text-ink-dark">{value}</dd>
    </div>
  );
}
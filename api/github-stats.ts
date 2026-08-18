import type { VercelRequest, VercelResponse } from "@vercel/node";

const QUERY = `
  query getUserStats($username: String!) {
    user(login: $username) {
      repositories(privacy: PUBLIC, ownerAffiliations: OWNER) {
        totalCount
      }
      contributionsCollection {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              date
              contributionCount
            }
          }
        }
      }
    }
  }
`;

interface ContributionDay {
  date: string;
  contributionCount: number;
}

function calculateCurrentStreak(days: ContributionDay[]): number {
  let streak = 0;
  let i = days.length - 1;

  // Today might not have a contribution yet — skip it once so an active
  // streak from yesterday still counts.
  if (days[i]?.contributionCount === 0) i--;

  while (i >= 0 && days[i].contributionCount > 0) {
    streak++;
    i--;
  }

  return streak;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { username } = req.query;

  if (!username || typeof username !== "string") {
    return res.status(400).json({ error: "username query param required" });
  }

  try {
    const response = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      },
      body: JSON.stringify({ query: QUERY, variables: { username } }),
    });

    if (!response.ok) throw new Error("GitHub GraphQL request failed");

    const json = await response.json();
    const user = json.data?.user;

    if (!user) {
      return res.status(404).json({ error: "GitHub user not found" });
    }

    const calendar = user.contributionsCollection.contributionCalendar;
    const days: ContributionDay[] = calendar.weeks.flatMap(
      (week: { contributionDays: ContributionDay[] }) => week.contributionDays,
    );

    res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate");
    return res.status(200).json({
      publicRepos: user.repositories.totalCount,
      totalContributions: calendar.totalContributions,
      currentStreak: calculateCurrentStreak(days),
    });
  } catch (error) {
    console.error("GitHub proxy error:", error);
    return res.status(500).json({ error: "Failed to fetch GitHub stats" });
  }
}

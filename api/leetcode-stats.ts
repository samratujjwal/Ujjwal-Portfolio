import type { VercelRequest, VercelResponse } from "@vercel/node";

const QUERY = `
  query getUserProfile($username: String!) {
    matchedUser(username: $username) {
      submitStatsGlobal {
        acSubmissionNum {
          difficulty
          count
        }
      }
      profile {
        ranking
      }
    }
  }
`;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { username } = req.query;

  if (!username || typeof username !== "string") {
    return res.status(400).json({ error: "username query param required" });
  }

  try {
    const response = await fetch("https://leetcode.com/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Referer: "https://leetcode.com",
      },
      body: JSON.stringify({ query: QUERY, variables: { username } }),
    });

    if (!response.ok) throw new Error("LeetCode GraphQL request failed");

    const json = await response.json();
    const user = json.data?.matchedUser;

    if (!user) {
      return res.status(404).json({ error: "LeetCode user not found" });
    }

    const counts = Object.fromEntries(
      user.submitStatsGlobal.acSubmissionNum.map(
        (entry: { difficulty: string; count: number }) => [
          entry.difficulty,
          entry.count,
        ],
      ),
    );

    res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate");
    return res.status(200).json({
      totalSolved: counts.All ?? 0,
      easySolved: counts.Easy ?? 0,
      mediumSolved: counts.Medium ?? 0,
      hardSolved: counts.Hard ?? 0,
      ranking: user.profile?.ranking ?? 0,
    });
  } catch (error) {
    console.error("LeetCode proxy error:", error);
    return res.status(500).json({ error: "Failed to fetch LeetCode stats" });
  }
}

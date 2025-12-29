import { redis } from "@/lib/redis";
import { now } from "@/lib/time";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const key = `paste:${id}`;

  const raw = await redis.hgetall<Record<string, string>>(key);

  // 1️⃣ Missing paste
  if (!raw || !raw.content) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  // 2️⃣ Convert Redis values (IMPORTANT)
  const content = raw.content;
  const expiresAt = raw.expiresAt ? Number(raw.expiresAt) : null;
  const maxViews = raw.maxViews ? Number(raw.maxViews) : null;
  const views = raw.views ? Number(raw.views) : 0;

  const currentTime = now(req);

  // 3️⃣ TTL check
  if (expiresAt && currentTime > expiresAt) {
    return Response.json({ error: "Expired" }, { status: 404 });
  }

  // 4️⃣ View limit check
  if (maxViews !== null && views >= maxViews) {
    return Response.json({ error: "View limit exceeded" }, { status: 404 });
  }

  // 5️⃣ Increment views (atomic)
  await redis.hincrby(key, "views", 1);

  // 6️⃣ Remaining views (never negative)
  const remainingViews =
    maxViews !== null ? Math.max(maxViews - views - 1, 0) : null;

  return Response.json({
    content,
    remaining_views: remainingViews,
    expires_at: expiresAt ? new Date(expiresAt).toISOString() : null,
  });
}

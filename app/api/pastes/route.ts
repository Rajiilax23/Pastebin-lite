import { redis } from "@/lib/redis";
import { nanoid } from "nanoid";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { content, ttl_seconds, max_views } = body;

    // 1️⃣ Validate content
    if (!content || typeof content !== "string" || content.trim() === "") {
      return Response.json(
        { error: "content must be a non-empty string" },
        { status: 400 }
      );
    }

    // 2️⃣ Validate ttl_seconds
    if (
      ttl_seconds !== undefined &&
      (!Number.isInteger(ttl_seconds) || ttl_seconds < 1)
    ) {
      return Response.json(
        { error: "ttl_seconds must be an integer >= 1" },
        { status: 400 }
      );
    }

    // 3️⃣ Validate max_views
    if (
      max_views !== undefined &&
      (!Number.isInteger(max_views) || max_views < 1)
    ) {
      return Response.json(
        { error: "max_views must be an integer >= 1" },
        { status: 400 }
      );
    }

    // 4️⃣ Create paste
    const id = nanoid(8);
    const expiresAt =
      ttl_seconds !== undefined ? Date.now() + ttl_seconds * 1000 : null;

    await redis.hset(`paste:${id}`, {
      content,
      expiresAt,
      maxViews: max_views ?? null,
      views: 0,
    });

    // 5️⃣ Return response
    return Response.json({
      id,
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/p/${id}`,
    });
  } catch {
    return Response.json(
      { error: "Invalid JSON body" },
      { status: 400 }
    );
  }
}

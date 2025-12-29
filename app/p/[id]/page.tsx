import { redis } from "@/lib/redis";

export default async function PastePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // ✅ Await params (required in latest Next.js)
  const { id } = await params;

  const paste = await redis.hgetall<{
    content?: string;
  }>(`paste:${id}`);

  // If paste does not exist
  if (!paste || !paste.content) {
    return (
      <h1 style={{ padding: "20px" }}>
        404 – Paste Not Found
      </h1>
    );
  }

  return (
    <main style={{ padding: "20px" }}>
      <h2>Paste</h2>
      <pre
        style={{
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          background: "#f4f4f4",
          padding: "16px",
          borderRadius: "6px",
        }}
      >
        {paste.content}
      </pre>
    </main>
  );
}

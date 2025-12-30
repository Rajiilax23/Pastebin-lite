import { redis } from "@/lib/redis";

export default async function PastePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Call the API endpoint that enforces TTL and view limits
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/pastes/${id}`);
  
  if (!res.ok) {
    const error = await res.json();
    return (
      <h1 style={{ padding: "20px" }}>
        404 – {error.error || "Paste Not Found"}
      </h1>
    );
  }

  const paste = await res.json();

  return (
    <main style={{ padding: "20px" }}>
      <h2>Paste</h2>
      {paste.remaining_views !== null && (
        <p style={{ fontSize: "12px", color: "#666" }}>
          Remaining views: {paste.remaining_views}
        </p>
      )}
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
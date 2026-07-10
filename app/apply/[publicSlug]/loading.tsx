export default function Loading() {
  return (
    <main className="min-h-screen bg-background px-4 py-8">
      <div className="mx-auto max-w-3xl space-y-4">
        <div className="h-28 animate-pulse rounded-lg bg-surface" />
        <div className="h-96 animate-pulse rounded-lg bg-surface" />
      </div>
    </main>
  );
}

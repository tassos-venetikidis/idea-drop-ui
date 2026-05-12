import { createFileRoute, Link } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import type { Idea } from "#/types";

async function fetchIdea(ideaId: string): Promise<Idea> {
  const base =
    typeof window !== "undefined"
      ? window.location.origin
      : "http://localhost:3000";
  const res = await fetch(`${base}/api/ideas/${ideaId}`);
  if (!res.ok) throw new Error("Failed to fetch idea details...");
  const data = await res.json();
  return data;
}

const ideaQueryOptions = (ideaId: string) =>
  queryOptions({
    queryKey: ["idea", ideaId],
    queryFn: () => fetchIdea(ideaId),
  });

export const Route = createFileRoute("/ideas/$ideaId/")({
  component: IdeaDetailsPage,
  loader: async ({ params, context: { queryClient } }) =>
    queryClient.ensureQueryData(ideaQueryOptions(params.ideaId)),
});

function IdeaDetailsPage() {
  const { ideaId } = Route.useParams();
  const { data: idea } = useSuspenseQuery(ideaQueryOptions(ideaId));
  return (
    <div className="p-4">
      <Link to="/ideas" className="text-blue-500 underline block mb-4">
        Back To Ideas
      </Link>
      <h2 className="text-2xl font-bold">{idea.title}</h2>
      <p className="mt-2">{idea.description}</p>
    </div>
  );
}

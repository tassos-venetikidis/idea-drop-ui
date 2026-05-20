import { createFileRoute, Link } from "@tanstack/react-router";
import { Lightbulb } from "lucide-react";
import { fetchIdeas } from "#/api/ideas";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import IdeaCard from "#/components/IdeaCard";

const ideasQueryOptions = () =>
  queryOptions({
    queryKey: ["ideas"],
    queryFn: () => fetchIdeas(),
  });

export const Route = createFileRoute("/")({
  component: HomePage,
  loader: async ({ context: { queryClient } }) =>
    queryClient.ensureQueryData(ideasQueryOptions()),
});

function HomePage() {
  const { data } = useSuspenseQuery(ideasQueryOptions());
  const ideas = [...data].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  return (
    <div className="flex flex-col md:flex-row items-start justify-between gap-10 p-6 text-blue-600">
      <div className="flex flex-col items-start gap-4">
        <Lightbulb className="w-16 h-16 text-yellow-400" />
        <h1 className="text-4xl font-bold text-gray-800">
          Welcome to IdeaDrop
        </h1>
        <p className="text-gray-600 max-w-xs">
          Share, explore, and build on the best startup ideas and side hustles.
        </p>
      </div>

      <section className="flex-1">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
          Latest Ideas
        </h2>
        <ul className="space-y-6">
          {ideas
            .map((idea) => (
              <li key={idea._id}>
                <IdeaCard idea={idea} button={false} />
              </li>
            ))
            .slice(0, 3)}
        </ul>

        <div className="mt-6">
          <Link
            to="/ideas"
            className="w-full text-center inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded-md transition"
          >
            View All Ideas
          </Link>
        </div>
      </section>
    </div>
  );
}

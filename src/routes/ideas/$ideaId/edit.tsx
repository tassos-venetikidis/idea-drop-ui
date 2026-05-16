import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  useSuspenseQuery,
  queryOptions,
  useMutation,
} from "@tanstack/react-query";
import { fetchIdea, editIdea } from "#/api/ideas";

const ideaQueryOptions = (ideaId: string) =>
  queryOptions({
    queryKey: ["idea", ideaId],
    queryFn: () => fetchIdea(ideaId),
  });

export const Route = createFileRoute("/ideas/$ideaId/edit")({
  component: EditPage,
  loader: async ({ params, context: { queryClient } }) =>
    queryClient.ensureQueryData(ideaQueryOptions(params.ideaId)),
});

function EditPage() {
  const navigate = useNavigate();
  const { ideaId } = Route.useParams();
  const { data: idea } = useSuspenseQuery(ideaQueryOptions(ideaId));
  const [title, setTitle] = useState(idea.title);
  const [summary, setSummary] = useState(idea.summary);
  const [description, setDescription] = useState(idea.description);
  const [tags, setTags] = useState(idea.tags.join(", "));

  let editedIdea = {
    title,
    summary,
    description,
    tags: tags
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag !== ""),
  };

  const { mutateAsync: editMutate, isPending } = useMutation({
    mutationFn: () => editIdea(ideaId, editedIdea),
    onSuccess: () => navigate({ to: `/ideas/${ideaId}` }),
  });

  async function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault();

    if (!title.trim() || !summary.trim() || !description.trim()) {
      alert("Please fill in all fields...");
      return;
    }

    editedIdea = {
      title: title.trim(),
      summary: summary.trim(),
      description: description.trim(),
      tags: tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag !== ""),
    };

    try {
      await editMutate();
    } catch (error) {
      console.error(error);
      alert("Something went wrong...");
    }
  }
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold mb-6">Edit Idea</h1>
        <Link
          to="/ideas/$ideaId"
          params={{ ideaId }}
          className="text-sm text-blue-600 hover:underline"
        >
          ⬅️ Back To Idea
        </Link>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="title"
            className="block text-gray-700 font-medium mb-1"
          >
            Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter idea title"
          />
        </div>

        <div>
          <label
            htmlFor="summary"
            className="block text-gray-700 font-medium mb-1"
          >
            Summary
          </label>
          <input
            id="summary"
            type="text"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter idea summary"
          />
        </div>

        <div>
          <label
            htmlFor="body"
            className="block text-gray-700 font-medium mb-1"
          >
            Description
          </label>
          <textarea
            id="body"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={6}
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Write out the description of your idea"
          />
        </div>

        <div>
          <label
            htmlFor="tags"
            className="block text-gray-700 font-medium mb-1"
          >
            Tags
          </label>
          <input
            id="tags"
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="optional tags, comma separated"
          />
        </div>

        <div className="mt-5">
          <button
            type="submit"
            disabled={isPending}
            className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? "Editing..." : "Edit Idea"}
          </button>
        </div>
      </form>
    </div>
  );
}

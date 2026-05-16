import type { Idea } from "#/types";
import api from "#/lib/axios";

export async function fetchIdea(ideaId: string): Promise<Idea> {
  const res = await api.get(`/ideas/${ideaId}`);
  return res.data;
}

export async function fetchIdeas(): Promise<Idea[]> {
  const res = await api.get("/ideas");
  return res.data;
}

export async function createIdea(newIdea: {
  title: string;
  summary: string;
  description: string;
  tags: string[];
}): Promise<Idea> {
  const res = await api.post("/ideas", {
    ...newIdea,
    createdAt: new Date().toISOString(),
  });

  return res.data;
}

export async function deleteIdea(ideaId: string): Promise<void> {
  await api.delete(`/ideas/${ideaId}`);
}

export async function editIdea(
  ideaId: string,
  editedIdea: {
    title: string;
    summary: string;
    description: string;
    tags: string[];
  },
): Promise<Idea> {
  const res = await api.patch(`/ideas/${ideaId}`, editedIdea);
  return res.data;
}

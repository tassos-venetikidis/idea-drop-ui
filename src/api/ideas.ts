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

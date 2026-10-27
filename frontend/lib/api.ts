import {
  Memory,
  ChatResponse,
  TimelineEvent,
  Collection,
  RemembranceItem,
  SystemStatus,
  SourceType
} from "./types";

const API_BASE = "";

export async function fetchSystemStatus(): Promise<SystemStatus> {
  const res = await fetch(`${API_BASE}/api/status`);
  if (!res.ok) throw new Error("Failed to fetch system status");
  return res.json();
}

export async function fetchMemories(params?: {
  q?: string;
  source_type?: SourceType;
  tag?: string;
  sort_by?: string;
  sort_order?: string;
}): Promise<Memory[]> {
  const searchParams = new URLSearchParams();
  if (params?.q) searchParams.set("q", params.q);
  if (params?.source_type) searchParams.set("source_type", params.source_type);
  if (params?.tag) searchParams.set("tag", params.tag);
  if (params?.sort_by) searchParams.set("sort_by", params.sort_by);
  if (params?.sort_order) searchParams.set("sort_order", params.sort_order);

  const res = await fetch(`${API_BASE}/api/memories?${searchParams.toString()}`);
  if (!res.ok) throw new Error("Failed to fetch memories");
  return res.json();
}

export async function fetchMemory(id: string): Promise<Memory> {
  const res = await fetch(`${API_BASE}/api/memories/${id}`);
  if (!res.ok) throw new Error("Memory not found");
  return res.json();
}

export async function createMemory(formData: FormData): Promise<Memory> {
  const res = await fetch(`${API_BASE}/api/memories`, {
    method: "POST",
    body: formData,
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || "Failed to create memory record");
  }
  return res.json();
}

export async function updateMemory(id: string, payload: Partial<Memory>): Promise<Memory> {
  const res = await fetch(`${API_BASE}/api/memories/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to update memory");
  return res.json();
}

export async function deleteMemory(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/api/memories/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete memory");
}

export async function chatWithArchive(query: string, conversation_id?: string): Promise<ChatResponse> {
  const res = await fetch(`${API_BASE}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, conversation_id }),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || "Error communicating with archive search");
  }
  return res.json();
}

export async function fetchTimeline(): Promise<TimelineEvent[]> {
  const res = await fetch(`${API_BASE}/api/timeline`);
  if (!res.ok) throw new Error("Failed to fetch timeline");
  return res.json();
}

export async function fetchCollections(): Promise<Collection[]> {
  const res = await fetch(`${API_BASE}/api/collections`);
  if (!res.ok) throw new Error("Failed to fetch collections");
  return res.json();
}

export async function createCollection(title: string, description?: string, memory_ids: string[] = []): Promise<Collection> {
  const res = await fetch(`${API_BASE}/api/collections`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, description, memory_ids }),
  });
  if (!res.ok) throw new Error("Failed to create collection");
  return res.json();
}

export async function deleteCollection(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/api/collections/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete collection");
}

export async function fetchRemembrance(): Promise<RemembranceItem[]> {
  const res = await fetch(`${API_BASE}/api/remembrance`);
  if (!res.ok) throw new Error("Failed to fetch remembrance tributes");
  return res.json();
}

export async function createRemembrance(item: Omit<RemembranceItem, "id" | "created_at">): Promise<RemembranceItem> {
  const res = await fetch(`${API_BASE}/api/remembrance`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(item),
  });
  if (!res.ok) throw new Error("Failed to create tribute");
  return res.json();
}

export async function seedSampleData(): Promise<{ message: string }> {
  const res = await fetch(`${API_BASE}/api/sample-data/seed`, {
    method: "POST",
  });
  if (!res.ok) throw new Error("Failed to seed sample data");
  return res.json();
}

export async function rebuildVectorIndex(): Promise<{ message: string; indexed_passages: number }> {
  const res = await fetch(`${API_BASE}/api/index/rebuild`, {
    method: "POST",
  });
  if (!res.ok) throw new Error("Failed to rebuild index");
  return res.json();
}

export async function resetVaultData(confirmPhrase: string): Promise<void> {
  const res = await fetch(`${API_BASE}/api/data/reset`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ confirm_phrase: confirmPhrase }),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || "Reset rejected");
  }
}

export async function fetchSettings(): Promise<any> {
  const res = await fetch(`${API_BASE}/api/settings`);
  if (!res.ok) throw new Error("Failed to fetch settings");
  return res.json();
}

export async function updateSettings(data: any): Promise<any> {
  const res = await fetch(`${API_BASE}/api/settings`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update settings");
  return res.json();
}

export function getExportArchiveUrl(): string {
  return `${API_BASE}/api/export`;
}

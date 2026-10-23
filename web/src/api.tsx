import type { CreateWidgetInput, UpdateWidgetInput, Widget } from "./types";

const API_BASE = "http://localhost:8000/api";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
    const res = await fetch(`${API_BASE}${path}`, {
        headers: { "Content-Type": "application/json" },
        ...init,
    });
    if (!res.ok) {
        throw new Error(`Request failed: ${res.status} ${res.statusText}`);
    }
    // DELETE returns 204 with no body.
    if (res.status === 204) return undefined as T;
    return (await res.json()) as T;
}

export const fetchWidgets = () => request<Widget[]>("/widgets");

export const createWidget = (input: CreateWidgetInput) =>
    request<Widget>("/widgets", {
        method: "POST",
        body: JSON.stringify(input),
    });

export const updateWidget = ({ id, text }: UpdateWidgetInput) =>
    request<Widget>(`/widgets/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ text }),
    });

export const deleteWidget = (id: string) =>
    request<void>(`/widgets/${id}`, { method: "DELETE" });
import { delay, http, HttpResponse } from "msw";

const STORAGE_KEY = "trumpet-widgets";
const LATENCY_MS = import.meta.env.MODE === "test" ? 0 : 150;

export type StoredWidget = {
    id: string;
    text: string;
    createdAt: string;
    updatedAt: string;
};

function load(): StoredWidget[] {
    if (typeof localStorage === "undefined") return [];
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? (JSON.parse(raw) as StoredWidget[]) : [];
    } catch {
        return [];
    }
}

function persist(items: StoredWidget[]) {
    if (typeof localStorage === "undefined") return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

let items: StoredWidget[] = load();

export const store = {
    list: () => items,

    create: (text: string): StoredWidget => {
        const now = new Date().toISOString();
        const widget: StoredWidget = {
            id: crypto.randomUUID(),
            text,
            createdAt: now,
            updatedAt: now,
        };
        items = [...items, widget];
        persist(items);
        return widget;
    },

    update: (id: string, text: string): StoredWidget | null => {
        const idx = items.findIndex((w) => w.id === id);
        if (idx === -1) return null;
        const updated: StoredWidget = {
            ...items[idx],
            text,
            updatedAt: new Date().toISOString(),
        };
        items = items.map((w, i) => (i === idx ? updated : w));
        persist(items);
        return updated;
    },

    remove: (id: string): boolean => {
        const next = items.filter((w) => w.id !== id);
        const removed = next.length < items.length;
        items = next;
        persist(items);
        return removed;
    },

    reset: () => {
        items = [];
        if (typeof localStorage !== "undefined") {
            localStorage.removeItem(STORAGE_KEY);
        }
    },
};

export const handlers = [
    http.get("/api/widgets", async () => {
        if (LATENCY_MS) await delay(LATENCY_MS);
        return HttpResponse.json(store.list());
    }),

    http.post("/api/widgets", async ({ request }) => {
        if (LATENCY_MS) await delay(LATENCY_MS);
        const body = (await request.json()) as { text: string };
        return HttpResponse.json(store.create(body.text), { status: 201 });
    }),

    http.patch("/api/widgets/:id", async ({ params, request }) => {
        if (LATENCY_MS) await delay(LATENCY_MS);
        const body = (await request.json()) as { text: string };
        const updated = store.update(String(params.id), body.text);
        if (!updated) {
            return HttpResponse.json({ error: "Not found" }, { status: 404 });
        }
        return HttpResponse.json(updated);
    }),

    http.delete("/api/widgets/:id", async ({ params }) => {
        if (LATENCY_MS) await delay(LATENCY_MS);
        const ok = store.remove(String(params.id));
        if (!ok) {
            return HttpResponse.json({ error: "Not found" }, { status: 404 });
        }
        return new HttpResponse(null, { status: 204 });
    }),
];
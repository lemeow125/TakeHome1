import { useEffect, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Container, TextInput } from "./components";
import { createWidget, deleteWidget, fetchWidgets, updateWidget } from "./api";
import type { Widget } from "./types";

const SAVE_DEBOUNCE_MS = import.meta.env.VITEST ? 50 : 2000;
const WIDGETS_KEY = ["widgets"] as const;

type EphemeralNote = {
  localId: string;
  text: string;
};

export default function App() {
  const queryClient = useQueryClient();
  const { data: widgets = [], isLoading } = useQuery({
    queryKey: WIDGETS_KEY,
    queryFn: fetchWidgets,
  });

  const [ephemeral, setEphemeral] = useState<EphemeralNote[]>([]);

  const addNote = () => {
    setEphemeral((prev) => [
      ...prev,
      { localId: crypto.randomUUID(), text: "" },
    ]);
  };

  const removeEphemeral = (localId: string) => {
    setEphemeral((prev) => prev.filter((note) => note.localId !== localId));
  };

  const isEmpty =
    !isLoading && widgets.length === 0 && ephemeral.length === 0;

  return (
    <div
      style={{
        fontFamily:
          'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
        background: "#f7f7f5",
        color: "#1f1f1d",
        minHeight: "100vh",
        padding: "48px 24px",
        WebkitFontSmoothing: "antialiased",
        MozOsxFontSmoothing: "grayscale",
      }}
    >
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: 28,
          }}
        >
          <div>
            <h1
              style={{
                margin: 0,
                fontSize: 26,
                fontWeight: 600,
                letterSpacing: "-0.02em",
              }}
            >
              Notes
            </h1>
            <p style={{ margin: "4px 0 0", fontSize: 14, color: "#6b6b68" }}>
              Notes save automatically.
            </p>
          </div>
          <Button onClick={addNote}>+ Add note</Button>
        </header>

        {isLoading ? (
          <p style={{ color: "#8a8a86", fontSize: 14 }}>Loading…</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {isEmpty && (
              <div
                style={{
                  padding: "48px 24px",
                  textAlign: "center",
                  color: "#8a8a86",
                  fontSize: 14,
                  border: "1px dashed #e0e0dc",
                  borderRadius: 10,
                }}
              >
                No notes yet. Click “Add note” to create your first one.
              </div>
            )}

            {widgets.map((widget) => (
              <NoteWidget
                key={widget.id}
                initialId={widget.id}
                initialText={widget.text}
                onRemove={() => { }}
              />
            ))}
            {ephemeral.map((note) => (
              <NoteWidget
                key={note.localId}
                initialId={null}
                initialText={note.text}
                onCreated={() => removeEphemeral(note.localId)}
                onRemove={() => removeEphemeral(note.localId)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

type NoteWidgetProps = {
  initialId: string | null;
  initialText: string;
  onCreated?: () => void;
  onRemove?: () => void;
};

function NoteWidget({
  initialId,
  initialText,
  onCreated,
  onRemove,
}: NoteWidgetProps) {
  const queryClient = useQueryClient();
  const [id, setId] = useState<string | null>(initialId);
  const [text, setText] = useState(initialText);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const create = useMutation({
    mutationFn: createWidget,
    onSuccess: (created) => {
      setId(created.id);
      queryClient.setQueryData<Widget[]>(WIDGETS_KEY, (old) => [
        ...(old ?? []),
        created,
      ]);
      queryClient.invalidateQueries({ queryKey: WIDGETS_KEY });
      onCreated?.();
    },
  });

  const update = useMutation({
    mutationFn: updateWidget,
  });

  const remove = useMutation({
    mutationFn: deleteWidget,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WIDGETS_KEY });
    },
  });

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const schedulePersist = (value: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      if (id) {
        update.mutate({ id, text: value });
      } else {
        create.mutate({ text: value });
      }
    }, SAVE_DEBOUNCE_MS);
  };

  const handleChange = (value: string) => {
    setText(value);
    schedulePersist(value);
  };

  const handleRemove = () => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (id) {
      remove.mutate(id);
    } else {
      onRemove?.();
    }
  };

  const isBusy = create.isPending || update.isPending || remove.isPending;

  return (
    <Container>
      <TextInput
        value={text}
        onChange={handleChange}
        placeholder="Type your note…"
      />
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          padding: "2px 6px 4px 4px",
        }}
      >
        <Button onClick={handleRemove} disabled={isBusy} variant="ghost">
          Remove
        </Button>
      </div>
    </Container>
  );
}
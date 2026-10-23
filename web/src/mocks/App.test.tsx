import { describe, it, expect } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "../App";
import { store } from "./handlers";

function renderApp() {
    const queryClient = new QueryClient({
        defaultOptions: { queries: { retry: false } },
    });
    return render(
        <QueryClientProvider client={queryClient}>
            <App />
        </QueryClientProvider>
    );
}

describe("Notes app", () => {
    it("renders the empty state when there are no widgets", async () => {
        renderApp();
        expect(
            await screen.findByText(/no notes yet/i)
        ).toBeInTheDocument();
    });

    it("adds a new note card when the Add note button is clicked", async () => {
        const user = userEvent.setup();
        renderApp();
        await screen.findByText(/no notes yet/i);

        await user.click(screen.getByRole("button", { name: /add note/i }));

        expect(screen.getAllByPlaceholderText(/type your note/i)).toHaveLength(1);
    });

    it("keeps text independent between widgets", async () => {
        const user = userEvent.setup();
        renderApp();
        await screen.findByText(/no notes yet/i);

        await user.click(screen.getByRole("button", { name: /add note/i }));
        await user.click(screen.getByRole("button", { name: /add note/i }));

        const [first, second] = screen.getAllByPlaceholderText(/type your note/i);
        await user.type(first, "hello");

        await waitFor(() => expect(store.list()).toHaveLength(1));
        expect(store.list()[0].text).toBe("hello");
        expect((second as HTMLTextAreaElement).value).toBe("");
    });

    it("debounces saves — nothing is persisted before the timer fires", async () => {
        const user = userEvent.setup();
        renderApp();
        await screen.findByText(/no notes yet/i);

        await user.click(screen.getByRole("button", { name: /add note/i }));
        await user.type(
            screen.getByPlaceholderText(/type your note/i),
            "typing fast"
        );

        // Immediately after typing, the debounce hasn't fired yet.
        expect(store.list()).toHaveLength(0);

        await waitFor(() => expect(store.list()).toHaveLength(1));
        expect(store.list()[0].text).toBe("typing fast");
    });

    it("handles a 1000-character string end to end", async () => {
        const user = userEvent.setup();
        renderApp();
        await screen.findByText(/no notes yet/i);

        await user.click(screen.getByRole("button", { name: /add note/i }));
        const textarea = screen.getByPlaceholderText(/type your note/i);
        const big = "a".repeat(1000);

        // fireEvent bypasses per-keystroke typing; faster and still exercises onChange.
        fireEvent.change(textarea, { target: { value: big } });

        await waitFor(() => expect(store.list()).toHaveLength(1));
        expect(store.list()[0].text).toHaveLength(1000);
    });

    it("renders persisted widgets with their own text on load", async () => {
        store.create("first note");
        store.create("second note");

        renderApp();

        await waitFor(() =>
            expect(screen.getAllByPlaceholderText(/type your note/i)).toHaveLength(2)
        );
        const textareas = screen.getAllByPlaceholderText(
            /type your note/i
        ) as HTMLTextAreaElement[];
        expect(textareas[0].value).toBe("first note");
        expect(textareas[1].value).toBe("second note");
    });

    it("deletes a persisted widget via the Remove button", async () => {
        const user = userEvent.setup();
        store.create("to be deleted");

        renderApp();
        await waitFor(() =>
            expect(screen.getAllByPlaceholderText(/type your note/i)).toHaveLength(1)
        );

        await user.click(screen.getByRole("button", { name: /remove/i }));

        await waitFor(() => expect(store.list()).toHaveLength(0));
    });

    it("discards an ephemeral widget without hitting the API", async () => {
        const user = userEvent.setup();
        renderApp();
        await screen.findByText(/no notes yet/i);

        await user.click(screen.getByRole("button", { name: /add note/i }));
        await user.type(
            screen.getByPlaceholderText(/type your note/i),
            "never saved"
        );

        // Remove before the 50ms debounce fires.
        await user.click(screen.getByRole("button", { name: /remove/i }));

        // Give the debounce window a chance to (incorrectly) fire.
        await new Promise((r) => setTimeout(r, 120));

        expect(store.list()).toHaveLength(0);
        expect(
            screen.queryByPlaceholderText(/type your note/i)
        ).not.toBeInTheDocument();
    });
});
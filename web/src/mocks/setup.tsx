import { afterAll, afterEach, beforeAll } from "vitest";
import { cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { server } from "../mocks/server";
import { store } from "./handlers";

beforeAll(() => server.listen({ onUnhandledFrame: "error" }));

afterEach(() => {
    server.resetHandlers();
    store.reset();
    cleanup();
});

afterAll(() => server.close());
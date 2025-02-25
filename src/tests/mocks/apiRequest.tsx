import { vi } from "vitest";

export const url = import.meta.env.VITE_API_URL;

export const mockFetch = {
  success: (data = { success: true }) => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        statusText: "OK",
        headers: new Headers(),
        json: () => Promise.resolve(data),
        text: () => Promise.resolve(""),
      } as Response)
    );
  },

  failure: (status = 500, statusText = "Server Error", message = "Test error") => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: false,
        status,
        statusText,
        json: () => Promise.resolve({ message }),
        text: () => Promise.resolve(""),
      } as Response)
    );
  },

  error: (errorMessage = "Fetch failed") => {
    global.fetch = vi.fn(() => Promise.reject(new Error(errorMessage)));
  },

  invalidJson: () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.reject(new Error("Invalid JSON")),
        text: () => Promise.resolve("Invalid response"),
      } as Response)
    );
  },
};
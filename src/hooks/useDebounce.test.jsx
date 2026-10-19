// @vitest-environment jsdom
import { StrictMode } from "react";
import { act, cleanup, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useDebounce } from "./useDebounce";

beforeEach(() => vi.useFakeTimers());
afterEach(() => {
  cleanup();
  vi.clearAllTimers();
  vi.useRealTimers();
});

describe("useDebounce", () => {
  it("returns the initial value immediately and delays subsequent values", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: "" } },
    );
    expect(result.current).toBe("");
    rerender({ value: "Петров" });
    act(() => vi.advanceTimersByTime(299));
    expect(result.current).toBe("");
    act(() => vi.advanceTimersByTime(1));
    expect(result.current).toBe("Петров");
  });

  it("cancels obsolete values and waits for a pause after the last change", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: "" } },
    );
    rerender({ value: "П" });
    act(() => vi.advanceTimersByTime(200));
    rerender({ value: "Пе" });
    act(() => vi.advanceTimersByTime(200));
    rerender({ value: "Петров" });
    act(() => vi.advanceTimersByTime(299));
    expect(result.current).toBe("");
    act(() => vi.advanceTimersByTime(1));
    expect(result.current).toBe("Петров");
  });

  it("accepts non-string values and reschedules when the delay changes", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 0, delay: 300 } },
    );
    rerender({ value: 42, delay: 300 });
    act(() => vi.advanceTimersByTime(200));
    rerender({ value: 42, delay: 500 });
    act(() => vi.advanceTimersByTime(499));
    expect(result.current).toBe(0);
    act(() => vi.advanceTimersByTime(1));
    expect(result.current).toBe(42);
  });

  it("keeps one timer in Strict Mode and clears it on unmount", () => {
    const { rerender, unmount } = renderHook(
      ({ value }) => useDebounce(value, 300),
      {
        initialProps: { value: "" },
        wrapper: ({ children }) => <StrictMode>{children}</StrictMode>,
      },
    );
    expect(vi.getTimerCount()).toBe(1);
    rerender({ value: "Петров" });
    expect(vi.getTimerCount()).toBe(1);
    unmount();
    expect(vi.getTimerCount()).toBe(0);
  });
});

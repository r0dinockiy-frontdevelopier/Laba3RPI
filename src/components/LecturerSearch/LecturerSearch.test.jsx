// @vitest-environment jsdom
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import LecturerSearch from "./LecturerSearch";

function makeLecturers() {
  return [
    { id: 1, name: "Петров Дмитрий Сергеевич", degree: "Кандидат наук", photo: "/petrov.png" },
    { id: 2, name: "Соколов Андрей Владимирович", degree: "Доктор наук", photo: "/sokolov.png" },
  ];
}

function renderSearch(lecturers) {
  return render(
    <MemoryRouter>
      <LecturerSearch lecturers={lecturers} />
    </MemoryRouter>,
  );
}

beforeEach(() => vi.useFakeTimers());
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.clearAllTimers();
  vi.useRealTimers();
});

describe("LecturerSearch", () => {
  it("updates the input immediately but filters only once after rapid typing", () => {
    const lecturers = makeLecturers();
    const filter = vi.spyOn(lecturers, "filter");
    renderSearch(lecturers);
    const input = screen.getByRole("searchbox", { name: "Поиск лекторов по ФИО" });
    filter.mockClear();

    for (const value of ["П", "Пе", " ПеТров "]) {
      fireEvent.change(input, { target: { value } });
      act(() => vi.advanceTimersByTime(100));
    }
    expect(input.value).toBe(" ПеТров ");
    act(() => vi.advanceTimersByTime(199));
    expect(filter).not.toHaveBeenCalled();
    expect(screen.queryByRole("heading", { name: lecturers[1].name })).not.toBeNull();

    act(() => vi.advanceTimersByTime(1));
    expect(filter).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole("heading", { name: lecturers[0].name })).not.toBeNull();
    expect(screen.queryByRole("heading", { name: lecturers[1].name })).toBeNull();
  });

  it("shows an empty result and restores every lecturer when the query is cleared", () => {
    renderSearch(makeLecturers());
    const input = screen.getByRole("searchbox");
    fireEvent.change(input, { target: { value: "Несуществующее имя" } });
    act(() => vi.advanceTimersByTime(300));
    expect(screen.getByRole("status").textContent).toContain("Лекторы не найдены");
    expect(screen.queryAllByRole("heading")).toHaveLength(0);

    fireEvent.change(input, { target: { value: "" } });
    act(() => vi.advanceTimersByTime(300));
    expect(screen.getAllByRole("heading")).toHaveLength(2);
    expect(screen.getByRole("status").textContent).toContain("2");
  });

  it("renders each result as a link to the lecturer page", () => {
    renderSearch(makeLecturers());
    const links = screen.getAllByRole("link");

    expect(links).toHaveLength(2);
    expect(links[0].getAttribute("href")).toBe("/lecturers/1");
    expect(links[1].getAttribute("href")).toBe("/lecturers/2");
    expect(links[0].textContent).toContain("Подробнее");
  });
});

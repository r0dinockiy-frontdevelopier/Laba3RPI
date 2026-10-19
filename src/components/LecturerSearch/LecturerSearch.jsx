import { useId, useMemo, useState } from "react";
import { useDebounce } from "../../hooks/useDebounce";
import LecturerCard from "../LecturerCard/LecturerCard";
import styles from "./LecturerSearch.module.css";

export const SEARCH_DELAY_MS = 300;

/**
 * Поиск лекторов по ФИО с задержкой ввода (useDebounce).
 * Карточки — ссылки на страницу лектора, поэтому навигацией занимается роутер.
 */
export default function LecturerSearch({ lecturers }) {
  const inputId = useId();
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, SEARCH_DELAY_MS);

  const filteredLecturers = useMemo(() => {
    const search = debouncedQuery.trim().toLowerCase();
    if (search === "") {
      return lecturers;
    }

    return lecturers.filter((lecturer) =>
      lecturer.name.toLowerCase().includes(search),
    );
  }, [lecturers, debouncedQuery]);

  return (
    <>
      <div className={styles.search}>
        <label htmlFor={inputId}>Поиск лекторов по ФИО</label>
        <input
          id={inputId}
          type="search"
          placeholder="Например, Петров"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          aria-describedby={`${inputId}-hint`}
        />
        <p id={`${inputId}-hint`} className={styles.hint}>
          Результаты обновляются через {SEARCH_DELAY_MS} мс после окончания ввода.
        </p>
      </div>
      <p className={styles.results} role="status" aria-live="polite">
        {filteredLecturers.length
          ? `Найдено лекторов: ${filteredLecturers.length} из ${lecturers.length}`
          : "Лекторы не найдены. Попробуйте другое имя."}
      </p>
      <div className={styles.grid}>
        {filteredLecturers.map((lecturer) => (
          <LecturerCard key={lecturer.id} lecturer={lecturer} />
        ))}
      </div>
    </>
  );
}

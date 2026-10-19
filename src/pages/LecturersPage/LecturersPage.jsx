import { useState } from 'react';
import { lecturers } from '../../data/lecturersData';
import LecturerCard from '../../components/LecturerCard/LecturerCard';
import styles from './LecturersPage.module.css';

const matches = (lecturer, query) => {
  const haystack = [
    lecturer.name,
    lecturer.degree,
    lecturer.education,
    ...lecturer.disciplines.map((discipline) => discipline.title),
  ]
    .join(' ')
    .toLowerCase();

  return haystack.includes(query);
};

const LecturersPage = () => {
  const [query, setQuery] = useState('');

  const normalizedQuery = query.trim().toLowerCase();
  const visibleLecturers =
    normalizedQuery === ''
      ? lecturers
      : lecturers.filter((lecturer) => matches(lecturer, normalizedQuery));

  return (
    <section className={styles.section}>
      <h1 className={styles.title}>Наши лекторы</h1>
      <p className={styles.subtitle}>
        Выберите специалиста, чтобы посмотреть дисциплины, тарифы и достижения.
      </p>

      <div className={styles.searchRow}>
        <input
          type="search"
          className={styles.search}
          placeholder="Поиск по ФИО, степени или дисциплине"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          aria-label="Поиск лектора"
        />
        <span className={styles.counter}>
          Найдено: {visibleLecturers.length} из {lecturers.length}
        </span>
      </div>

      {visibleLecturers.length > 0 ? (
        <div className={styles.grid}>
          {visibleLecturers.map((lecturer) => (
            <LecturerCard key={lecturer.id} lecturer={lecturer} />
          ))}
        </div>
      ) : (
        <p className={styles.empty}>
          По запросу «{query}» ничего не найдено. Попробуйте другое имя или дисциплину.
        </p>
      )}
    </section>
  );
};

export default LecturersPage;

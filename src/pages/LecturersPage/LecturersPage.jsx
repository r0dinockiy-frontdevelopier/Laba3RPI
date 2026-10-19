import { lecturers } from '../../data/lecturersData';
import LecturerSearch from '../../components/LecturerSearch/LecturerSearch';
import styles from './LecturersPage.module.css';

const LecturersPage = () => {
  return (
    <section className={styles.section}>
      <h1 className={styles.title}>Наши лекторы</h1>
      <p className={styles.subtitle}>
        Выберите специалиста, чтобы посмотреть дисциплины, тарифы и достижения.
        Карточка открывается по своему адресу — ссылку можно скопировать.
      </p>

      <LecturerSearch lecturers={lecturers} />
    </section>
  );
};

export default LecturersPage;

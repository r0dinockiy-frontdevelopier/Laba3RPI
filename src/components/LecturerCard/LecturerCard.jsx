import { Link } from 'react-router-dom';
import styles from './LecturerCard.module.css';

/**
 * Карточка лектора в списке.
 * Вся карточка — это <Link> на страницу /lecturers/:id,
 * поэтому переход работает и кликом, и средней кнопкой мыши (новая вкладка).
 */
const LecturerCard = ({ lecturer }) => {
  // Счётчик рендеров для замера лишних перерисовок (см. отчёт по производительности)
  console.log("Рендер карточки: " + lecturer.name);

  return (
    <Link to={`/lecturers/${lecturer.id}`} className={styles.card}>
      <img src={lecturer.photo} alt={lecturer.name} className={styles.photo} />
      <h3 className={styles.name}>{lecturer.name}</h3>
      <p className={styles.degree}>{lecturer.degree}</p>
      <span className={styles.btn}>Подробнее</span>
    </Link>
  );
};

export default LecturerCard;

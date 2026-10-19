import { Link, useNavigate, useParams } from 'react-router-dom';
import { lecturers } from '../../data/lecturersData';
import PersonInfo from '../../components/PersonInfo/PersonInfo';
import Disciplines from '../../components/profile/Disciplines/Disciplines';
import Tariffs from '../../components/profile/Tariffs/Tariffs';
import Achievements from '../../components/profile/Achievements/Achievements';
import styles from './LecturerDetailPage.module.css';

const LecturerDetailPage = () => {
  // id берём из адреса: /lecturers/:id
  const { id } = useParams();
  const navigate = useNavigate();

  // В данных id — число, а из URL приходит строка, поэтому сравниваем как строки
  const lecturer = lecturers.find((item) => String(item.id) === id);

  if (!lecturer) {
    return (
      <section className={styles.wrapper}>
        <h1 className={styles.notFoundTitle}>Лектор не найден</h1>
        <p className={styles.notFoundText}>
          В адресе указан id «{id}», но лектора с таким номером в базе нет.
        </p>
        <div className={styles.actions}>
          <button
            type="button"
            className={styles.backBtn}
            onClick={() => navigate('/lecturers')}
          >
            ← Назад к списку
          </button>
          <Link to="/lecturers" className={styles.allLink}>
            Открыть всех лекторов
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.wrapper}>
      <button
        type="button"
        className={styles.backBtn}
        onClick={() => navigate('/lecturers')}
      >
        ← Назад к списку
      </button>

      <PersonInfo lecturer={lecturer} />

      <div className={styles.pagesWrapper}>
        <Disciplines disciplines={lecturer.disciplines} />
        <Tariffs tariffs={lecturer.tariffs} />
        <Achievements achievements={lecturer.achievements} />
      </div>
    </section>
  );
};

export default LecturerDetailPage;

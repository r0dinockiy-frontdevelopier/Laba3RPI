import { Link, useLocation } from 'react-router-dom';
import styles from './NotFound.module.css';

const NotFound = () => {
  const { pathname } = useLocation();

  return (
    <section className={styles.wrapper}>
      <p className={styles.code}>404</p>
      <h1 className={styles.title}>Страница не найдена</h1>
      <p className={styles.text}>
        По адресу <code className={styles.path}>{pathname}</code> ничего нет.
        Возможно, ссылка устарела или в адресе опечатка.
      </p>

      <div className={styles.actions}>
        <Link to="/" className={styles.homeLink}>
          На главную
        </Link>
        <Link to="/lecturers" className={styles.listLink}>
          К списку лекторов
        </Link>
      </div>
    </section>
  );
};

export default NotFound;

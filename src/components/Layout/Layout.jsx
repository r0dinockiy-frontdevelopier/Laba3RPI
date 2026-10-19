import { Link } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import styles from './Layout.module.css';

/**
 * Общий каркас приложения: меню отображается на всех страницах,
 * а внутрь (children) подставляется страница, выбранная маршрутом.
 */
const Layout = ({ children }) => {
  return (
    <div className={styles.layout}>
      <Navbar />

      <main className={styles.main}>{children}</main>

      <footer className={styles.footer}>
        <p className={styles.footerText}>
          © {new Date().getFullYear()} Учебная платформа «Лекторы»
        </p>
        <nav className={styles.footerLinks}>
          <Link to="/">Главная</Link>
          <Link to="/lecturers">Лекторы</Link>
          <Link to="/about">О нас</Link>
        </nav>
      </footer>
    </div>
  );
};

export default Layout;

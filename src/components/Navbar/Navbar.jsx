import { Link, NavLink } from 'react-router-dom';
import styles from './Navbar.module.css';

const navItems = [
  { to: '/', label: 'Главная', end: true },
  { to: '/lecturers', label: 'Лекторы' },
  { to: '/about', label: 'О нас' },
];

/**
 * Меню приложения. Пункты меню — это <NavLink> (расширение <Link>),
 * поэтому переходы выполняются без перезагрузки страницы.
 */
const Navbar = () => {
  return (
    <header className={styles.header}>
      <Link to="/" className={styles.logo}>
        Лекторы<span className={styles.dot}>.</span>
      </Link>

      <nav className={styles.navLinks}>
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              isActive ? `${styles.link} ${styles.active}` : styles.link
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className={styles.authSection}>
        <button type="button" className={styles.loginBtn}>
          Войти
        </button>
      </div>
    </header>
  );
};

export default Navbar;

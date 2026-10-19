import styles from './Header.module.css';

const Header = () => {
  return (
    <header className={styles.header}>
      <nav className={styles.navLinks}>
        <a href="#home">Главная</a>
        <a href="#partners">Партнеры</a>
        <a href="#about">О нас</a>
        <a href="#lecturers">Лекторы</a>
      </nav>

      <div className={styles.authSection}>
        <a href="#login" className={styles.loginBtn}>Войти</a>
      </div>
    </header>
  );
};

export default Header;
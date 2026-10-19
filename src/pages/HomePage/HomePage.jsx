import { Link } from 'react-router-dom';
import Hero from '../../components/Hero/Hero';
import Partners from '../../components/Partners/Partners';
import styles from './HomePage.module.css';

const HomePage = () => {
  return (
    <>
      <Hero />

      <section className={styles.intro}>
        <h2 className={styles.title}>Лекции, которые меняют взгляд на профессию</h2>
        <p className={styles.text}>
          Мы соединяем компании, вузы и НКО с практикующими специалистами: от
          инженеров и аналитиков данных до экспертов нефтегазовой отрасли.
          Выберите лектора в каталоге, посмотрите его дисциплины, тарифы и
          достижения — и бронируйте выступление.
        </p>

        <div className={styles.actions}>
          <Link to="/lecturers" className={styles.primaryBtn}>
            Смотреть лекторов
          </Link>
          <Link to="/about" className={styles.secondaryBtn}>
            Подробнее о платформе
          </Link>
        </div>
      </section>

      <Partners />
    </>
  );
};

export default HomePage;

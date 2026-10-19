import { Link } from 'react-router-dom';
import styles from './Hero.module.css';

const Hero = () => {
  return (
    <section className={styles.hero}>
      <div className={styles.textContainer}>
        <h1>Наши лекторы — признанные специалисты в своих областях, готовые делиться опытом и знаниями.</h1>
        <Link to="/lecturers" className={styles.btn}>Найти лектора</Link>
      </div>
    </section>
  );
};

export default Hero;

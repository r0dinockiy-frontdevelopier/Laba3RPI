import styles from './Hero.module.css';

const Hero = () => {
  return (
    <section id="home" className={styles.hero}>
      <div className={styles.textContainer}>
        <h1>Наши лекторы — признанные специалисты в своих областях, готовые делиться опытом и знаниями.</h1>
        <a href="#lecturers" className={styles.btn}>Найти лектора</a>
      </div>
    </section>
  );
};

export default Hero;
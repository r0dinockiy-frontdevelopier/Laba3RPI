import styles from './About.module.css';

const About = () => {
  return (
    <section id="about" className={styles.about}>
      <div className={styles.card}>
        
        <div className={styles.accentBar}></div>

        <h2 className={styles.title}>О нас</h2>
        
        <p className={styles.description}>
          Наша учебная платформа соединяет компании, образовательные учреждения и НКО 
          с профессиональными лекторами, спикерами и тренерами. Мы упрощаем процесс 
          подбора, бронирования и организации лекций, помогая находить экспертов, 
          которые не просто делятся знаниями, но и вдохновляют аудиторию.
        </p>

        <div className={styles.features}>
          <div className={styles.feature}>
            <div className={styles.featureIcon}>🎯</div>
            <h3>Точный подбор</h3>
            <p>Находим лектора под вашу задачу за считанные минуты</p>
          </div>

          <div className={styles.feature}>
            <div className={styles.featureIcon}>⚡</div>
            <h3>Быстрое бронирование</h3>
            <p>Оформляем заявку и организуем лекцию без лишней бюрократии</p>
          </div>

          <div className={styles.feature}>
            <div className={styles.featureIcon}>🌟</div>
            <h3>Проверенные эксперты</h3>
            <p>Только специалисты с реальным опытом и подтверждённой квалификацией</p>
          </div>
        </div>

      </div>
    </section>
  );
};

export default About;
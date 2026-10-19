import About from '../../components/About/About';
import styles from './AboutPage.module.css';

const steps = [
  {
    title: '1. Выбираете лектора',
    text: 'В каталоге есть фильтр по имени и дисциплине, а в карточке — образование, стаж и степень.',
  },
  {
    title: '2. Смотрите программу',
    text: 'На странице лектора собраны дисциплины с темами занятий, тарифы и достижения.',
  },
  {
    title: '3. Оставляете заявку',
    text: 'Мы согласуем дату, формат и стоимость — и лекция состоится без лишней бюрократии.',
  },
];

const AboutPage = () => {
  return (
    <>
      <About />

      <section className={styles.workflow}>
        <h2 className={styles.title}>Как это работает</h2>
        <div className={styles.cards}>
          {steps.map((step) => (
            <article key={step.title} className={styles.card}>
              <h3 className={styles.cardTitle}>{step.title}</h3>
              <p className={styles.cardText}>{step.text}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
};

export default AboutPage;

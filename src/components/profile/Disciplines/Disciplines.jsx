import styles from './Disciplines.module.css';

const Disciplines = ({ disciplines }) => (
  <div className={styles.container}>
    <h3>Преподаваемые дисциплины</h3>
    {disciplines.map((disc, idx) => (
      <div key={idx} className={styles.discipline}>
        <h4>{disc.title}</h4>
        <ul>{disc.topics.map((topic, i) => <li key={i}>{topic}</li>)}</ul>
      </div>
    ))}
  </div>
);

export default Disciplines;

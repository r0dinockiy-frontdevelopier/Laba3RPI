import styles from './Achievements.module.css';

const Achievements = ({ achievements }) => (
  <div className={styles.container}>
    <h3>Достижения</h3>
    <ul>{achievements.map((ach, idx) => <li key={idx}>{ach}</li>)}</ul>
  </div>
);

export default Achievements;

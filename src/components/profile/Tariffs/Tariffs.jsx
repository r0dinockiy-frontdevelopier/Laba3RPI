import styles from './Tariffs.module.css';

const Tariffs = ({ tariffs }) => (
  <div className={styles.container}>
    <h3>Тарифы</h3>
    <ul className={styles.list}>
      {tariffs.map((tariff, idx) => (
        <li key={idx} className={styles.item}>
          <span>{tariff.type}</span>
          <strong>{tariff.price}</strong>
        </li>
      ))}
    </ul>
  </div>
);

export default Tariffs;

import styles from './Partners.module.css';
import iclLogo from '../../assets/ICL.jpg';
import tatneftLogo from '../../assets/tatneft.png';

const Partners = () => {
  return (
    <section id="partners" className={styles.partners}>
      <h2 className={styles.title}>Партнёры</h2>
      <p className={styles.subtitle}>
        Компании, с которыми мы вместе делаем образование доступнее
      </p>

      <div className={styles.grid}>
        
        {/* Карточка ICL */}
        <div className={styles.card}>
          <div className={styles.badge}>IT-компания</div>
          <div className={styles.logoWrapper}>
            <img src={iclLogo} alt="ICL" className={styles.logo} />
          </div>
          <p className={styles.text}>
            ICL — высокотехнологичная, динамично развивающаяся группа компаний, 
            входящая в число крупнейших ИТ-компаний России, предоставляющая 
            весь спектр ИТ-услуг, проектов, решений и продуктов. Компания 
            была основана в 1991 году на базе завода ЭВМ Казанским 
            производственным объединением вычислительных систем (КПО ВС).
          </p>
          <a 
            href="https://icl.ru/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className={styles.link}
          >
            На сайт компании
            <span className={styles.arrow}>→</span>
          </a>
        </div>

        {/* Карточка Татнефть */}
        <div className={styles.card}>
          <div className={styles.badge}>Нефтегазовая отрасль</div>
          <div className={styles.logoWrapper}>
            <img src={tatneftLogo} alt="Татнефть" className={styles.logo} />
          </div>
          <p className={styles.text}>
            «Татнефть» — одна из крупнейших российских вертикально-интегрированных 
            компаний, в составе которой динамично развиваются нефтегазодобыча, 
            нефтепереработка, нефтегазохимия, сеть АЗС, композитный кластер, 
            электроэнергетика, разработка и производство оборудования для 
            нефтегазовой отрасли и блок сервисных структур.
          </p>
          <a 
            href="https://www.tatneft.ru/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className={styles.link}
          >
            На сайт компании
            <span className={styles.arrow}>→</span>
          </a>
        </div>

      </div>
    </section>
  );
};

export default Partners;
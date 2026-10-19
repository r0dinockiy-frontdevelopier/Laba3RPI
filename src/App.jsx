import { useState } from "react";
import { lecturers } from "./data/lecturersData";
import Header from "./components/Header/Header";
import Hero from "./components/Hero/Hero";
import About from "./components/About/About";
import Partners from "./components/Partners/Partners";
import LecturerSearch from "./components/LecturerSearch/LecturerSearch";
import PersonInfo from "./components/PersonInfo/PersonInfo";
import Disciplines from "./pages/Disciplines/Disciplines";
import Tariffs from "./pages/Tariffs/Tariffs";
import Achievements from "./pages/Achievements/Achievements";
import styles from "./App.module.css";

function App() {
  const [selectedLecturer, setSelectedLecturer] = useState(null);

  return (
    <div className={styles.app}>
      <Header />

      {!selectedLecturer ? (
        <main>
          <Hero />
          <About />
          <Partners />
          <section id="lecturers" className={styles.lecturersSection}>
            <h2 className={styles.sectionTitle}>Наши лекторы</h2>
            <LecturerSearch
              lecturers={lecturers}
              onSelect={setSelectedLecturer}
            />
          </section>
        </main>
      ) : (
        <main className={styles.profile}>
          <button
            className={styles.backBtn}
            onClick={() => setSelectedLecturer(null)}
          >
            ← Назад к списку
          </button>
          <PersonInfo lecturer={selectedLecturer} />
          <div className={styles.pagesWrapper}>
            <Disciplines disciplines={selectedLecturer.disciplines} />
            <Tariffs tariffs={selectedLecturer.tariffs} />
            <Achievements achievements={selectedLecturer.achievements} />
          </div>
        </main>
      )}
    </div>
  );
}

export default App;

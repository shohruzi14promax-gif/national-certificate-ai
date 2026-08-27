const subjects = [
  { name: "Matematika", icon: "∑", color: "blue" },
  { name: "Tarix", icon: "⌘", color: "amber" },
  { name: "Kimyo", icon: "⚗", color: "violet" },
  { name: "Biologiya", icon: "⌬", color: "green" },
  { name: "Ona tili va adabiyot", icon: "Aa", color: "rose" },
];

export default function Home() {
  return (
    <main className="page-shell">
      <nav className="nav">
        <div className="brand"><span className="brand-mark">N</span> National Certificate AI</div>
        <div className="nav-links"><a href="#subjects">Fanlar</a><a href="#how">Qanday ishlaydi?</a><a href="#pricing">Tariflar</a></div>
        <button className="nav-button">Boshlash</button>
      </nav>

      <section className="hero">
        <div className="eyebrow">MILLIY SERTIFIKAT UCHUN AI PLATFORMASI</div>
        <h1>Imtihonga tayyorlanishning <span>aqlli yo‘li.</span></h1>
        <p className="hero-copy">Darajangizni aniqlang, imtihon sanangizni kiriting va AI siz uchun har bir fan bo‘yicha individual tayyorgarlik rejasini tuzsin.</p>
        <div className="hero-actions"><button className="primary">Bepul boshlash <span>→</span></button><button className="secondary">Platformani ko‘rish</button></div>
        <div className="trust-row"><span>✓ 5 ta fan</span><span>✓ AI Study Plan</span><span>✓ Diagnostic & Mock</span></div>
      </section>

      <section id="subjects" className="section">
        <div className="section-heading"><div><div className="kicker">BARCHA FANLAR</div><h2>Har bir fan. Alohida reja.</h2></div><p>Diagnostic natijalaringiz asosida har bir fan uchun alohida yo‘l xaritasi.</p></div>
        <div className="subject-grid">
          {subjects.map((subject) => <article className={`subject-card ${subject.color}`} key={subject.name}><div className="subject-icon">{subject.icon}</div><h3>{subject.name}</h3><p>Diagnostic · Practice · Study Plan · Mock</p><span className="arrow">→</span></article>)}
        </div>
      </section>

      <section id="how" className="workflow section">
        <div className="kicker">QANDAY ISHLAYDI?</div><h2>Imtihongacha siz bilan birga.</h2>
        <div className="steps">
          <div><b>01</b><h3>Diagnostic</h3><p>Hozirgi darajangizni aniqlaymiz.</p></div>
          <div><b>02</b><h3>AI Study Plan</h3><p>Imtihon sanangizgacha individual reja.</p></div>
          <div><b>03</b><h3>Practice</h3><p>Zaif mavzularingizga mos savollar.</p></div>
          <div><b>04</b><h3>Mock Exam</h3><p>Haqiqiy imtihonga yaqin sinov.</p></div>
        </div>
      </section>

      <section className="cta"><div><div className="kicker">TAYYORMISIZ?</div><h2>Bugun boshlang.<br/>Imtihongacha tayyor bo‘ling.</h2></div><button className="primary">Bepul boshlash →</button></section>
      <footer><span>National Certificate AI</span><span>© 2026</span></footer>
    </main>
  );
}

import Link from 'next/link';

const subjects = [
  ['Matematika', '∑', 'matematika'],
  ['Tarix', '⌘', 'tarix'],
  ['Kimyo', '⚗', 'kimyo'],
  ['Biologiya', '⌬', 'biologiya'],
  ['Ona tili va adabiyot', 'Aa', 'ona-tili-adabiyot'],
];

export default function Home() {
  return (
    <main className="page-shell">
      <nav className="nav">
        <Link href="/" className="brand" aria-label="National Certificate AI home">
          <span className="brand-mark">N</span>
          <span>National Certificate AI</span>
        </Link>

        <div className="nav-links">
          <Link href="/">Home</Link>
          <a href="#subjects">Features</a>
          <a href="#how">How it works</a>
          <a href="#subjects">Subjects</a>
        </div>

        <Link href="/register" className="nav-button">
          Start for free <span aria-hidden="true">→</span>
        </Link>
      </nav>

      <section className="hero">
        <div className="eyebrow">MILLIY SERTIFIKAT UCHUN TAYYORGARLIK PLATFORMASI</div>
        <h1>
          Imtihonga tayyorlanishning <span>tizimli yo‘li.</span>
        </h1>
        <p className="hero-copy">
          Diagnostic natijalar, mavzu bo‘yicha practice, progress tahlili va imtihon
          sanasiga mos shaxsiy study plan — bitta platformada.
        </p>
        <div className="hero-actions">
          <Link href="/register" className="primary">
            Start for free →
          </Link>
          <a href="#how" className="secondary">
            Platformani ko‘rish
          </a>
        </div>
        <div className="trust-row">
          <span>✓ 5 ta fan</span>
          <span>✓ Real progress</span>
          <span>✓ Timed Practice</span>
          <span>✓ AI Tutor</span>
        </div>
      </section>

      <section id="subjects" className="section">
        <div className="section-heading">
          <div>
            <div className="kicker">BARCHA FANLAR</div>
            <h2>Har bir fan. Alohida yo‘l.</h2>
          </div>
          <p>
            Fanlar va mavzular database orqali boshqariladi, shuning uchun platforma yangi
            kontent bilan kengayadi.
          </p>
        </div>
        <div className="subject-grid">
          {subjects.map(([name, icon, slug]) => (
            <Link href={`/subjects/${slug}`} className="subject-card" key={slug}>
              <div className="subject-icon">{icon}</div>
              <h3>{name}</h3>
              <p>Topics · Practice · Progress</p>
              <span className="arrow">→</span>
            </Link>
          ))}
        </div>
      </section>

      <section id="how" className="workflow section">
        <div className="kicker">QANDAY ISHLAYDI?</div>
        <h2>Natijadan keyingi qadam ham ma’lum.</h2>
        <div className="steps">
          <div>
            <b>01</b>
            <h3>Diagnostic</h3>
            <p>Hozirgi darajangizni real natijalar bilan ko‘ring.</p>
          </div>
          <div>
            <b>02</b>
            <h3>Practice</h3>
            <p>Fan va mavzu bo‘yicha kerakli savollarni ishlang.</p>
          </div>
          <div>
            <b>03</b>
            <h3>Analysis</h3>
            <p>Zaif va kuchli mavzularingizni ajrating.</p>
          </div>
          <div>
            <b>04</b>
            <h3>Study Plan</h3>
            <p>Imtihon sanasigacha aniq keyingi qadamlarni oling.</p>
          </div>
        </div>
      </section>

      <section className="cta">
        <div>
          <div className="kicker">TAYYORMISIZ?</div>
          <h2>
            Bugun boshlang.
            <br />
            Natijani kuzatib boring.
          </h2>
        </div>
        <Link href="/register" className="primary">
          Start for free →
        </Link>
      </section>

      <footer>
        <span>National Certificate AI</span>
        <span>Rasmiy davlat tashkiloti bilan bog‘liqligi da’vo qilinmaydi.</span>
        <span>© 2026</span>
      </footer>
    </main>
  );
}

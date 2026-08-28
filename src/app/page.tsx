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
      <style>{`
        .page-shell{min-height:100vh;overflow:hidden;background:linear-gradient(180deg,#f8fafc 0%,#fff 45%,#f7f9fc 100%);color:#101828}
        .page-shell .nav{width:min(1180px,calc(100% - 48px));height:72px;margin:14px auto 0;padding:0 22px;border:1px solid #e6eaf0;border-radius:16px;background:rgba(255,255,255,.9);box-shadow:0 8px 28px rgba(16,24,40,.07);backdrop-filter:blur(16px);position:sticky;top:14px;z-index:20}
        .page-shell .brand{font-size:16px;color:#101828}
        .page-shell .nav-links{gap:28px;color:#667085;font-size:13px;font-weight:600}
        .page-shell .nav-links a:hover{color:#101828}
        .page-shell .nav-button{border:1px solid #cfd6df;background:#fff;color:#101828;padding:11px 18px;border-radius:11px;font-size:13px;font-weight:800;box-shadow:0 2px 8px rgba(16,24,40,.04)}
        .page-shell .nav-button:hover{background:#101828;color:#fff;border-color:#101828}
        .page-shell .hero{position:relative;width:min(1180px,calc(100% - 48px));margin:0 auto;padding:125px 20px 105px;text-align:center}
        .page-shell .hero:before{content:"";position:absolute;width:760px;height:520px;left:50%;top:70px;transform:translateX(-50%);background:radial-gradient(circle,rgba(219,226,236,.72),transparent 67%);filter:blur(8px);z-index:-1}
        .page-shell .eyebrow{display:inline-flex;padding:8px 13px;border:1px solid #e1e6ed;border-radius:999px;background:rgba(255,255,255,.82);color:#667085;font-size:10px;font-weight:850;letter-spacing:.12em;box-shadow:0 5px 16px rgba(16,24,40,.04)}
        .page-shell .hero h1{max-width:920px;margin:25px auto 20px;font-size:clamp(52px,7vw,84px);line-height:.96;letter-spacing:-.07em;color:#0b1220}
        .page-shell .hero h1 span{display:block;color:#475467}
        .page-shell .hero-copy{max-width:720px;margin:0 auto;color:#667085;font-size:17px;line-height:1.7}
        .page-shell .hero-actions{display:flex;justify-content:center;gap:10px;margin-top:32px}
        .page-shell .hero-actions .primary{min-width:155px;padding:14px 20px;border-radius:12px}
        .page-shell .hero-actions .secondary{padding:13px 20px;border-radius:12px}
        .page-shell .trust-row{display:flex;justify-content:center;flex-wrap:wrap;gap:8px;margin-top:24px}
        .page-shell .trust-row span{padding:7px 11px;border:1px solid #e8ecf1;border-radius:999px;background:#fff;color:#667085;font-size:11px;font-weight:650}
        .page-shell .section{width:min(1180px,calc(100% - 48px));margin:0 auto;padding:78px 20px}
        .page-shell .section-heading{display:flex;align-items:end;justify-content:space-between;gap:35px;margin-bottom:28px}
        .page-shell .section-heading h2,.page-shell .workflow h2{font-size:clamp(34px,4.2vw,52px);line-height:1;letter-spacing:-.06em;color:#101828}
        .page-shell .section-heading>p{max-width:410px;color:#667085;font-size:14px;line-height:1.65;margin:0}
        .page-shell .subject-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}
        .page-shell .subject-card{position:relative;display:block;min-height:205px;padding:24px;border:1px solid #e3e8ee;border-radius:20px;background:rgba(255,255,255,.94);box-shadow:0 6px 20px rgba(16,24,40,.035);transition:all .2s ease}
        .page-shell .subject-card:hover{transform:translateY(-5px);border-color:#cbd3dd;box-shadow:0 20px 40px rgba(16,24,40,.1)}
        .page-shell .subject-card .subject-icon{margin-bottom:35px;background:#f1f4f8;width:46px;height:46px;border-radius:13px;font-size:18px}
        .page-shell .subject-card h3{margin:0;font-size:20px;letter-spacing:-.03em}
        .page-shell .subject-card p{margin:7px 0 0;color:#98a2b3;font-size:12px}
        .page-shell .subject-card .arrow{position:absolute;right:24px;bottom:23px;color:#667085;font-size:18px;transition:.2s}
        .page-shell .subject-card:hover .arrow{transform:translateX(5px);color:#101828}
        .page-shell .workflow{padding-top:55px}
        .page-shell .steps{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-top:28px}
        .page-shell .steps>div{min-height:205px;padding:25px;border:1px solid #e3e8ee;border-radius:18px;background:#fff;box-shadow:0 5px 17px rgba(16,24,40,.03);transition:.18s}
        .page-shell .steps>div:hover{transform:translateY(-3px);box-shadow:0 14px 30px rgba(16,24,40,.07)}
        .page-shell .steps>div b{font-size:11px;color:#98a2b3}
        .page-shell .steps>div h3{font-size:20px;letter-spacing:-.03em;margin:50px 0 9px}
        .page-shell .steps>div p{margin:0;color:#667085;font-size:13px;line-height:1.6}
        .page-shell .cta{width:min(1124px,calc(100% - 48px));margin:30px auto 70px;padding:38px;border-radius:24px;display:flex;align-items:center;justify-content:space-between;gap:25px;background:#101828;color:#fff;box-shadow:0 20px 50px rgba(16,24,40,.16)}
        .page-shell .cta .kicker{color:#98a2b3}
        .page-shell .cta h2{font-size:40px;line-height:1;letter-spacing:-.055em;margin:10px 0 0}
        .page-shell .cta .primary{background:#fff;color:#101828;box-shadow:none}
        .page-shell .cta .primary:hover{background:#f2f4f7}
        .page-shell footer{width:min(1124px,calc(100% - 48px));margin:0 auto;padding:25px 0 40px;display:flex;justify-content:space-between;gap:20px;border-top:1px solid #e6eaf0;color:#98a2b3;font-size:11px}
        .page-shell footer span:first-child{font-weight:800;color:#475467}
        @media(max-width:900px){.page-shell .nav-links{display:none}.page-shell .subject-grid{grid-template-columns:repeat(2,1fr)}.page-shell .steps{grid-template-columns:repeat(2,1fr)}}
        @media(max-width:640px){.page-shell .nav{width:calc(100% - 24px);margin-top:8px;top:8px;padding:0 12px}.page-shell .nav-button{padding:9px 12px;font-size:11px}.page-shell .brand{font-size:13px}.page-shell .brand-mark{width:32px;height:32px}.page-shell .hero{width:100%;padding:92px 18px 70px}.page-shell .hero h1{font-size:48px}.page-shell .hero-copy{font-size:15px}.page-shell .hero-actions{flex-direction:column;align-items:stretch}.page-shell .hero-actions .primary,.page-shell .hero-actions .secondary{width:100%}.page-shell .section{width:100%;padding:60px 18px}.page-shell .section-heading{display:block}.page-shell .section-heading>p{margin-top:18px}.page-shell .subject-grid,.page-shell .steps{grid-template-columns:1fr}.page-shell .cta{width:calc(100% - 36px);margin:15px 18px 50px;padding:30px 22px;text-align:center;display:grid;justify-items:center}.page-shell .cta h2{font-size:32px}.page-shell .cta .primary{width:100%}.page-shell footer{width:calc(100% - 36px);display:grid;padding-bottom:45px}}
      `}</style>

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
          <div><b>01</b><h3>Diagnostic</h3><p>Hozirgi darajangizni real natijalar bilan ko‘ring.</p></div>
          <div><b>02</b><h3>Practice</h3><p>Fan va mavzu bo‘yicha kerakli savollarni ishlang.</p></div>
          <div><b>03</b><h3>Analysis</h3><p>Zaif va kuchli mavzularingizni ajrating.</p></div>
          <div><b>04</b><h3>Study Plan</h3><p>Imtihon sanasigacha aniq keyingi qadamlarni oling.</p></div>
        </div>
      </section>

      <section className="cta">
        <div>
          <div className="kicker">TAYYORMISIZ?</div>
          <h2>Bugun boshlang.<br />Natijani kuzatib boring.</h2>
        </div>
        <Link href="/register" className="primary">Start for free →</Link>
      </section>

      <footer>
        <span>National Certificate AI</span>
        <span>Rasmiy davlat tashkiloti bilan bog‘liqligi da’vo qilinmaydi.</span>
        <span>© 2026</span>
      </footer>
    </main>
  );
}

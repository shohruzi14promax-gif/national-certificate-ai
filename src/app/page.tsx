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
        .page-shell{min-height:100vh;overflow:hidden;background:#fff;color:#0f172a}
        .page-shell .nav{width:min(1180px,calc(100% - 48px));height:72px;margin:14px auto 0;padding:0 22px;border:1px solid #e2e8f0;border-radius:16px;background:rgba(255,255,255,.92);box-shadow:0 8px 28px rgba(15,23,42,.07);backdrop-filter:blur(16px);position:sticky;top:14px;z-index:20}
        .page-shell .brand{font-size:16px;color:#0f172a;font-weight:800}
        .page-shell .nav-links{gap:28px;color:#64748b;font-size:13px;font-weight:600}
        .page-shell .nav-links a:hover{color:#16a34a}
        .page-shell .nav-button{border:1px solid #16a34a;background:#16a34a;color:#fff;padding:11px 18px;border-radius:11px;font-size:13px;font-weight:800;box-shadow:0 7px 18px rgba(22,163,74,.18)}
        .page-shell .nav-button:hover{background:#15803d;border-color:#15803d;transform:translateY(-1px)}
        .page-shell .hero{position:relative;width:min(1180px,calc(100% - 48px));margin:0 auto;padding:110px 20px 85px;text-align:center}
        .page-shell .hero:before{content:"";position:absolute;width:900px;height:560px;left:50%;top:45px;transform:translateX(-50%);background:radial-gradient(circle at 42% 48%,rgba(187,247,208,.55),transparent 34%),radial-gradient(circle at 65% 52%,rgba(221,214,254,.48),transparent 34%);filter:blur(10px);z-index:-1}
        .page-shell .hero:after{content:"";position:absolute;inset:0;z-index:-2;opacity:.5;background-image:linear-gradient(#e2e8f0 1px,transparent 1px),linear-gradient(90deg,#e2e8f0 1px,transparent 1px);background-size:48px 48px;mask-image:linear-gradient(to bottom,black,transparent 75%)}
        .page-shell .eyebrow{display:inline-flex;padding:8px 14px;border:1px solid #dbe4dd;border-radius:999px;background:rgba(255,255,255,.86);color:#475569;font-size:10px;font-weight:850;letter-spacing:.08em;box-shadow:0 5px 16px rgba(15,23,42,.05)}
        .page-shell .eyebrow:before{content:"";width:7px;height:7px;margin:2px 8px 0 0;border-radius:50%;background:#16a34a}
        .page-shell .hero h1{max-width:950px;margin:25px auto 20px;font-size:clamp(52px,7vw,84px);line-height:.96;letter-spacing:-.07em;color:#0b1220}
        .page-shell .hero h1 span{display:block;color:#16a34a}
        .page-shell .hero-copy{max-width:720px;margin:0 auto;color:#64748b;font-size:17px;line-height:1.7}
        .page-shell .hero-actions{display:flex;justify-content:center;gap:10px;margin-top:32px}
        .page-shell .hero-actions .primary{min-width:155px;padding:14px 20px;border-radius:12px;background:#16a34a;color:#fff;box-shadow:0 10px 24px rgba(22,163,74,.2)}
        .page-shell .hero-actions .primary:hover{background:#15803d;transform:translateY(-2px)}
        .page-shell .hero-actions .secondary{padding:13px 20px;border-radius:12px;border:1px solid #dbe3ea;background:#fff;color:#0f172a}
        .page-shell .hero-actions .secondary:hover{border-color:#16a34a;color:#15803d}
        .page-shell .trust-row{display:flex;justify-content:center;flex-wrap:wrap;gap:8px;margin-top:24px}
        .page-shell .trust-row span{padding:7px 11px;border:1px solid #e2e8f0;border-radius:999px;background:#fff;color:#64748b;font-size:11px;font-weight:650;box-shadow:0 4px 12px rgba(15,23,42,.03)}
        .page-shell .section{width:min(1180px,calc(100% - 48px));margin:0 auto;padding:78px 20px}
        .page-shell .section-heading{display:flex;align-items:end;justify-content:space-between;gap:35px;margin-bottom:28px}
        .page-shell .kicker{color:#16a34a;font-size:10px;font-weight:850;letter-spacing:.14em}
        .page-shell .section-heading h2,.page-shell .workflow h2{font-size:clamp(34px,4.2vw,52px);line-height:1;letter-spacing:-.06em;color:#0f172a}
        .page-shell .section-heading>p{max-width:410px;color:#64748b;font-size:14px;line-height:1.65;margin:0}
        .page-shell .subject-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}
        .page-shell .subject-card{position:relative;display:block;min-height:205px;padding:24px;border:1px solid #e2e8f0;border-radius:20px;background:rgba(255,255,255,.96);box-shadow:0 6px 20px rgba(15,23,42,.035);transition:all .2s ease}
        .page-shell .subject-card:hover{transform:translateY(-5px);border-color:#86efac;box-shadow:0 20px 40px rgba(15,23,42,.1)}
        .page-shell .subject-card .subject-icon{margin-bottom:35px;background:#ecfdf3;color:#16a34a;width:46px;height:46px;border-radius:13px;font-size:18px}
        .page-shell .subject-card h3{margin:0;font-size:20px;letter-spacing:-.03em}
        .page-shell .subject-card p{margin:7px 0 0;color:#94a3b8;font-size:12px}
        .page-shell .subject-card .arrow{position:absolute;right:24px;bottom:23px;color:#64748b;font-size:18px;transition:.2s}
        .page-shell .subject-card:hover .arrow{transform:translateX(5px);color:#16a34a}
        .page-shell .workflow{padding-top:55px}
        .page-shell .steps{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-top:28px}
        .page-shell .steps>div{min-height:205px;padding:25px;border:1px solid #e2e8f0;border-radius:18px;background:#fff;box-shadow:0 5px 17px rgba(15,23,42,.03);transition:.18s}
        .page-shell .steps>div:hover{transform:translateY(-3px);box-shadow:0 14px 30px rgba(15,23,42,.07);border-color:#bbf7d0}
        .page-shell .steps>div b{font-size:11px;color:#16a34a}
        .page-shell .steps>div h3{font-size:20px;letter-spacing:-.03em;margin:50px 0 9px}
        .page-shell .steps>div p{margin:0;color:#64748b;font-size:13px;line-height:1.6}
        .page-shell .cta{width:min(1124px,calc(100% - 48px));margin:30px auto 70px;padding:38px;border-radius:24px;display:flex;align-items:center;justify-content:space-between;gap:25px;background:#0f172a;color:#fff;box-shadow:0 20px 50px rgba(15,23,42,.16)}
        .page-shell .cta .kicker{color:#86efac}
        .page-shell .cta h2{font-size:40px;line-height:1;letter-spacing:-.055em;margin:10px 0 0}
        .page-shell .cta .primary{background:#16a34a;color:#fff;box-shadow:none}
        .page-shell .cta .primary:hover{background:#15803d}
        .page-shell footer{width:min(1124px,calc(100% - 48px));margin:0 auto;padding:25px 0 40px;display:flex;justify-content:space-between;gap:20px;border-top:1px solid #e2e8f0;color:#94a3b8;font-size:11px}
        .page-shell footer span:first-child{font-weight:800;color:#475569}
        @media(max-width:900px){.page-shell .nav-links{display:none}.page-shell .subject-grid{grid-template-columns:repeat(2,1fr)}.page-shell .steps{grid-template-columns:repeat(2,1fr)}}
        @media(max-width:640px){.page-shell .nav{width:calc(100% - 24px);margin-top:8px;top:8px;padding:0 12px}.page-shell .nav-button{padding:9px 12px;font-size:11px}.page-shell .brand{font-size:13px}.page-shell .brand-mark{width:32px;height:32px}.page-shell .hero{width:100%;padding:92px 18px 70px}.page-shell .hero h1{font-size:48px}.page-shell .hero-copy{font-size:15px}.page-shell .hero-actions{flex-direction:column;align-items:stretch}.page-shell .hero-actions .primary,.page-shell .hero-actions .secondary{width:100%}.page-shell .section{width:100%;padding:60px 18px}.page-shell .section-heading{display:block}.page-shell .section-heading>p{margin-top:18px}.page-shell .subject-grid,.page-shell .steps{grid-template-columns:1fr}.page-shell .cta{width:calc(100% - 36px);margin:15px 18px 50px;padding:30px 22px;text-align:center;display:grid;justify-items:center}.page-shell .cta h2{font-size:32px}.page-shell .cta .primary{width:100%}.page-shell footer{width:calc(100% - 36px);display:grid;padding-bottom:45px}}
      `}</style>

      <nav className="nav">
        <Link href="/" className="brand" aria-label="MilliyTest home">
          <span className="brand-mark">M</span>
          <span>MilliyTest</span>
        </Link>

        <div className="nav-links">
          <Link href="/">Bosh sahifa</Link>
          <a href="#subjects">Imkoniyatlar</a>
          <a href="#how">Qanday ishlaydi?</a>
          <a href="#subjects">Fanlar</a>
        </div>

        <Link href="/register" className="nav-button">
          Boshlash <span aria-hidden="true">→</span>
        </Link>
      </nav>

      <section className="hero">
        <div className="eyebrow">MILLIY SERTIFIKAT UCHUN TAYYORGARLIK PLATFORMASI</div>
        <h1>
          Imtihonga tayyorlanishning <span>eng aqlli yo‘li.</span>
        </h1>
        <p className="hero-copy">
          Diagnostik natijalar, mavzu bo‘yicha practice, progress tahlili va imtihon
          sanasiga mos shaxsiy study plan — bitta platformada.
        </p>
        <div className="hero-actions">
          <Link href="/register" className="primary">
            Bepul boshlash →
          </Link>
          <a href="#how" className="secondary">
            Platformani ko‘rish
          </a>
        </div>
        <div className="trust-row">
          <span>✓ 5 ta fan</span>
          <span>✓ Real progress</span>
          <span>✓ Timed Practice</span>
          <span>✓ Shaxsiy reja</span>
        </div>
      </section>

      <section id="subjects" className="section">
        <div className="section-heading">
          <div>
            <div className="kicker">BARCHA FANLAR</div>
            <h2>Har bir fan. Alohida yo‘l.</h2>
          </div>
          <p>
            Fanlar va mavzular bazasi orqali boshqariladi, shuning uchun platforma yangi
            kontent bilan kengayib boradi.
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
          <div><b>01</b><h3>Darajani aniqlang</h3><p>Hozirgi darajangizni real natijalar bilan ko‘ring.</p></div>
          <div><b>02</b><h3>Practice qiling</h3><p>Fan va mavzu bo‘yicha kerakli savollarni ishlang.</p></div>
          <div><b>03</b><h3>Natijani tahlil qiling</h3><p>Zaif va kuchli mavzularingizni ajrating.</p></div>
          <div><b>04</b><h3>Reja bo‘yicha boring</h3><p>Imtihon sanasigacha aniq keyingi qadamlarni bajaring.</p></div>
        </div>
      </section>

      <section className="cta">
        <div>
          <div className="kicker">TAYYORMISIZ?</div>
          <h2>Bugun boshlang.<br />Natijani kuzatib boring.</h2>
        </div>
        <Link href="/register" className="primary">Bepul boshlash →</Link>
      </section>

      <footer>
        <span>MilliyTest</span>
        <span>Rasmiy davlat tashkiloti bilan bog‘liqligi da’vo qilinmaydi.</span>
        <span>© 2026</span>
      </footer>
    </main>
  );
}

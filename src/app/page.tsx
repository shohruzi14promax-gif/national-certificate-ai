import Link from 'next/link';

const subjects = [
  ['Matematika', '∑', 'matematika', 'Aniq fanlar'],
  ['Tarix', '⌘', 'tarix', 'Ijtimoiy fanlar'],
  ['Kimyo', '⚗', 'kimyo', 'Tabiiy fanlar'],
  ['Biologiya', '⌬', 'biologiya', 'Tabiiy fanlar'],
  ['Ona tili va adabiyot', 'Aa', 'ona-tili-adabiyot', 'Til va adabiyot'],
];

const features = [
  ['01', 'Practice', 'Fan va mavzuni tanlang, vaqtni belgilang va o‘zingizga qulay tempda ishlang.'],
  ['02', 'Question Bank', 'Savollarni fan, mavzu va Oson / O‘rta / Qiyin daraja bo‘yicha toping.'],
  ['03', 'Progress', 'Natijalaringizni kuzating, kuchli va ustida ishlash kerak bo‘lgan mavzularni ko‘ring.'],
  ['04', 'Study Plan', 'Imtihon sanasi va maqsadingizga mos kunlik tayyorgarlik rejasini tuzing.'],
];

export default function Home() {
  return (
    <main className="landing">
      <style>{`
        .landing{--ink:#211b17;--muted:#766d65;--bronze:#b8894a;--bronze-dark:#8e6737;--cream:#faf8f3;--soft:#f3eadc;--line:#e8dfd2;min-height:100vh;background:var(--cream);color:var(--ink);overflow:hidden}
        .landing *{box-sizing:border-box}
        .landing .nav{width:min(1180px,calc(100% - 40px));height:72px;margin:16px auto 0;padding:0 18px 0 12px;border:1px solid rgba(184,137,74,.18);border-radius:18px;background:rgba(250,248,243,.86);backdrop-filter:blur(18px);display:flex;align-items:center;justify-content:space-between;position:sticky;top:12px;z-index:30;box-shadow:0 10px 35px rgba(53,42,31,.06)}
        .landing .brand{display:flex;align-items:center;gap:10px;font-size:16px;font-weight:850;letter-spacing:-.035em}
        .landing .brand-mark{width:38px;height:38px;display:grid;place-items:center;border-radius:12px;background:var(--ink);color:#f7ead7;font-family:Georgia,serif;font-size:19px;box-shadow:0 7px 18px rgba(33,27,23,.16)}
        .landing .nav-links{display:flex;align-items:center;gap:30px;color:#6e665f;font-size:13px;font-weight:650}
        .landing .nav-links a{transition:.2s}.landing .nav-links a:hover{color:var(--bronze-dark)}
        .landing .nav-button,.landing .primary{display:inline-flex;align-items:center;justify-content:center;gap:8px;border:0;background:var(--ink);color:#fff;padding:12px 18px;border-radius:11px;font-size:13px;font-weight:800;box-shadow:0 9px 20px rgba(33,27,23,.14);transition:.2s}
        .landing .nav-button:hover,.landing .primary:hover{background:#342b25;transform:translateY(-2px);box-shadow:0 13px 25px rgba(33,27,23,.18)}
        .landing .hero{width:min(1180px,calc(100% - 40px));margin:auto;min-height:700px;padding:100px 20px 70px;text-align:center;position:relative;display:flex;flex-direction:column;align-items:center;justify-content:center}
        .landing .hero:before{content:"";position:absolute;width:780px;height:580px;top:35px;left:50%;transform:translateX(-50%);background:radial-gradient(circle at 50% 45%,rgba(184,137,74,.19),transparent 48%),radial-gradient(circle at 25% 65%,rgba(221,202,174,.32),transparent 32%);filter:blur(8px);z-index:0}
        .landing .hero:after{content:"";position:absolute;inset:0;background-image:linear-gradient(rgba(184,137,74,.07) 1px,transparent 1px),linear-gradient(90deg,rgba(184,137,74,.07) 1px,transparent 1px);background-size:52px 52px;mask-image:linear-gradient(to bottom,black 5%,transparent 72%);z-index:0}
        .landing .hero>*{position:relative;z-index:1}
        .landing .eyebrow{display:inline-flex;align-items:center;gap:8px;border:1px solid #e2d5c2;background:rgba(255,253,249,.82);border-radius:999px;padding:8px 13px;color:#71675e;font-size:10px;font-weight:850;letter-spacing:.11em;box-shadow:0 7px 20px rgba(75,55,36,.05)}
        .landing .eyebrow i{width:6px;height:6px;border-radius:50%;background:var(--bronze);display:block}
        .landing h1{max-width:980px;margin:25px auto 20px;font-family:Georgia,'Times New Roman',serif;font-size:clamp(50px,7.5vw,88px);line-height:.96;letter-spacing:-.065em;font-weight:600}
        .landing h1 span{display:block;color:var(--bronze-dark);font-style:italic}
        .landing .hero-copy{max-width:690px;color:var(--muted);font-size:16px;line-height:1.75;margin:0}
        .landing .hero-actions{display:flex;gap:10px;margin-top:30px}
        .landing .hero-actions .primary{padding:14px 22px;background:var(--bronze-dark)}
        .landing .hero-actions .primary:hover{background:#76542d}
        .landing .secondary{display:inline-flex;align-items:center;justify-content:center;padding:13px 20px;border:1px solid #dcd1c3;border-radius:11px;background:rgba(255,255,255,.65);color:var(--ink);font-size:13px;font-weight:750;transition:.2s}
        .landing .secondary:hover{border-color:#bfa27d;background:#fff}
        .landing .trust{display:flex;flex-wrap:wrap;justify-content:center;gap:9px;margin-top:23px}
        .landing .trust span{padding:7px 11px;border:1px solid rgba(184,137,74,.16);background:rgba(255,255,255,.55);border-radius:999px;color:#82776d;font-size:10px;font-weight:700}
        .landing .scroll{margin-top:55px;color:#a1978e;font-size:9px;font-weight:800;letter-spacing:.16em;display:flex;flex-direction:column;gap:8px;align-items:center}.landing .scroll b{font-size:16px;font-weight:400}
        .landing .section{width:min(1180px,calc(100% - 40px));margin:auto;padding:92px 20px}
        .landing .section-head{display:flex;justify-content:space-between;align-items:end;gap:40px;margin-bottom:30px}.landing .section-head>div{max-width:650px}
        .landing .kicker{font-size:10px;letter-spacing:.16em;font-weight:900;color:var(--bronze-dark)}
        .landing h2{font-family:Georgia,'Times New Roman',serif;font-size:clamp(36px,5vw,58px);line-height:1;letter-spacing:-.055em;font-weight:600;margin:11px 0 0}
        .landing .section-head p{max-width:400px;margin:0;color:var(--muted);font-size:13px;line-height:1.7}
        .landing .subject-grid{display:grid;grid-template-columns:repeat(6,1fr);gap:13px}
        .landing .subject-card{grid-column:span 2;min-height:210px;padding:23px;border:1px solid var(--line);border-radius:20px;background:#fffdf9;position:relative;box-shadow:0 8px 25px rgba(58,43,28,.035);transition:.25s}
        .landing .subject-card:nth-child(4){grid-column:2 / span 2}.landing .subject-card:nth-child(5){grid-column:4 / span 2}
        .landing .subject-card:hover{transform:translateY(-6px);border-color:#cfb38b;box-shadow:0 22px 42px rgba(58,43,28,.1)}
        .landing .subject-icon{width:48px;height:48px;display:grid;place-items:center;border-radius:14px;background:var(--soft);color:var(--bronze-dark);font-family:Georgia,serif;font-size:20px;margin-bottom:31px}
        .landing .subject-card small{color:#a09285;font-size:10px;font-weight:750}.landing .subject-card h3{margin:7px 0 0;font-size:19px;letter-spacing:-.035em}.landing .subject-card .arrow{position:absolute;right:22px;bottom:20px;font-size:18px;color:#9b8b7a;transition:.2s}.landing .subject-card:hover .arrow{transform:translateX(5px);color:var(--bronze-dark)}
        .landing .features{background:#f3ede4;border-top:1px solid var(--line);border-bottom:1px solid var(--line);width:100%}.landing .features-inner{width:min(1180px,calc(100% - 40px));margin:auto;padding:92px 20px}
        .landing .feature-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-top:32px}.landing .feature{min-height:235px;padding:24px;border:1px solid #e1d5c5;border-radius:18px;background:rgba(255,255,255,.58);transition:.2s}.landing .feature:hover{background:#fff;transform:translateY(-3px);box-shadow:0 14px 30px rgba(58,43,28,.07)}.landing .feature b{color:var(--bronze-dark);font-size:11px}.landing .feature h3{font-size:20px;margin:58px 0 9px;letter-spacing:-.035em}.landing .feature p{margin:0;color:var(--muted);font-size:12px;line-height:1.65}
        .landing .journey{display:grid;grid-template-columns:1fr 1.25fr;gap:55px;align-items:center}.landing .journey-copy p{color:var(--muted);font-size:14px;line-height:1.75;max-width:470px}.landing .journey-list{display:grid;gap:10px}.landing .journey-row{display:flex;gap:15px;padding:18px;border:1px solid var(--line);border-radius:15px;background:#fffdf9}.landing .journey-num{width:30px;height:30px;flex:none;display:grid;place-items:center;border-radius:9px;background:var(--ink);color:#f6e8d5;font-size:10px;font-weight:800}.landing .journey-row h3{margin:0 0 4px;font-size:15px}.landing .journey-row p{margin:0!important;font-size:11px!important;line-height:1.55!important}
        .landing .cta{width:min(1120px,calc(100% - 40px));margin:0 auto 72px;padding:52px;border-radius:26px;background:var(--ink);color:#fff;display:flex;align-items:center;justify-content:space-between;gap:30px;position:relative;overflow:hidden}.landing .cta:after{content:"";position:absolute;width:430px;height:430px;right:-130px;top:-200px;background:radial-gradient(circle,rgba(184,137,74,.3),transparent 66%)}.landing .cta>*{position:relative;z-index:1}.landing .cta .kicker{color:#d8b57f}.landing .cta h2{font-size:clamp(34px,4.5vw,54px);margin-top:9px}.landing .cta .primary{background:#c0965e}.landing .cta .primary:hover{background:#d1aa76}
        .landing footer{width:min(1120px,calc(100% - 40px));margin:auto;border-top:1px solid var(--line);padding:25px 0 38px;display:flex;justify-content:space-between;gap:20px;color:#958a7f;font-size:10px}.landing footer strong{color:#5c5147;font-size:12px}
        @media(max-width:900px){.landing .nav-links{display:none}.landing .subject-grid{grid-template-columns:repeat(2,1fr)}.landing .subject-card,.landing .subject-card:nth-child(4),.landing .subject-card:nth-child(5){grid-column:auto}.landing .feature-grid{grid-template-columns:repeat(2,1fr)}.landing .journey{grid-template-columns:1fr}}
        @media(max-width:620px){.landing .nav{width:calc(100% - 20px);margin-top:8px;top:8px;height:62px}.landing .brand{font-size:14px}.landing .brand-mark{width:34px;height:34px}.landing .nav-button{padding:10px 13px;font-size:11px}.landing .hero{width:100%;min-height:650px;padding:85px 18px 55px}.landing h1{font-size:47px}.landing .hero-copy{font-size:14px}.landing .hero-actions{width:100%;flex-direction:column}.landing .hero-actions>*{width:100%}.landing .section,.landing .features-inner{width:100%;padding:68px 18px}.landing .section-head{display:block}.landing .section-head p{margin-top:17px}.landing .subject-grid,.landing .feature-grid{grid-template-columns:1fr}.landing .subject-card,.landing .subject-card:nth-child(4),.landing .subject-card:nth-child(5){grid-column:auto}.landing .feature{min-height:190px}.landing .feature h3{margin-top:35px}.landing .cta{width:calc(100% - 36px);padding:32px 24px;display:grid;text-align:center;justify-items:center;margin-bottom:50px}.landing .cta .primary{width:100%}.landing footer{width:calc(100% - 36px);display:grid}}
      `}</style>

      <nav className="nav">
        <Link href="/" className="brand" aria-label="MilliyTest">
          <span className="brand-mark">M</span><span>MilliyTest</span>
        </Link>
        <div className="nav-links">
          <a href="#subjects">Fanlar</a>
          <a href="#features">Imkoniyatlar</a>
          <a href="#how">Qanday ishlaydi?</a>
        </div>
        <Link href="/register" className="nav-button">Boshlash <span>→</span></Link>
      </nav>

      <section className="hero">
        <div className="eyebrow"><i /> MILLIY SERTIFIKAT UCHUN TAYYORGARLIK</div>
        <h1>Imtihonga tayyorlanishning <span>yaxshiroq yo‘li.</span></h1>
        <p className="hero-copy">Kerakli fanni tanlang, savollarni ishlang, natijangizni kuzating va imtihon kunigacha aniq reja asosida tayyorlaning.</p>
        <div className="hero-actions">
          <Link href="/register" className="primary">Bepul boshlash <span>→</span></Link>
          <a href="#how" className="secondary">Qanday ishlaydi?</a>
        </div>
        <div className="trust"><span>✓ 5 ta fan</span><span>✓ Oson / O‘rta / Qiyin</span><span>✓ Timed Practice</span><span>✓ Progress</span></div>
        <div className="scroll">PASTGA <b>↓</b></div>
      </section>

      <section id="subjects" className="section">
        <div className="section-head"><div><div className="kicker">FANLAR</div><h2>O‘zingizga kerakli fanni tanlang.</h2></div><p>Har bir fan o‘z mavzulari, practice savollari va natijalarini alohida boshqarish uchun yaratilgan.</p></div>
        <div className="subject-grid">
          {subjects.map(([name, icon, slug, category]) => <Link href={`/subjects/${slug}`} className="subject-card" key={slug}><div className="subject-icon">{icon}</div><small>{category}</small><h3>{name}</h3><span className="arrow">→</span></Link>)}
        </div>
      </section>

      <section id="features" className="features"><div className="features-inner"><div className="section-head"><div><div className="kicker">PLATFORMA</div><h2>Hammasi bir joyda.</h2></div><p>Tayyorgarlik jarayonini ortiqcha murakkablashtirmasdan, kerakli vositalarni bitta joyga jamlaymiz.</p></div><div className="feature-grid">{features.map(([num,title,text]) => <div className="feature" key={num}><b>{num}</b><h3>{title}</h3><p>{text}</p></div>)}</div></div></section>

      <section id="how" className="section"><div className="journey"><div className="journey-copy"><div className="kicker">QANDAY ISHLAYDI?</div><h2>Bugungi mashg‘ulotdan imtihongacha.</h2><p>MilliyTest sizga faqat savol ishlash emas, tayyorgarlik jarayonini tartibli olib borish imkonini beradi.</p><Link href="/register" className="primary">Bepul boshlash →</Link></div><div className="journey-list"><div className="journey-row"><span className="journey-num">01</span><div><h3>Hisob yarating</h3><p>Platformaga kiring va o‘zingizga kerakli fanlarni tanlang.</p></div></div><div className="journey-row"><span className="journey-num">02</span><div><h3>Practice va Question Bank</h3><p>Mavzu va qiyinlik darajasini tanlab savollarni ishlang.</p></div></div><div className="journey-row"><span className="journey-num">03</span><div><h3>Natijangizni ko‘ring</h3><p>To‘g‘ri javoblar, aniqlik va mavzular bo‘yicha progressni kuzating.</p></div></div><div className="journey-row"><span className="journey-num">04</span><div><h3>Study Plan tuzing</h3><p>Imtihon sanasigacha kunlik reja bilan tayyorgarlikni davom ettiring.</p></div></div></div></div></section>

      <section className="cta"><div><div className="kicker">TAYYORMISIZ?</div><h2>Tayyorgarlikni bugun boshlang.</h2></div><Link href="/register" className="primary">Bepul boshlash →</Link></section>

      <footer><strong>MilliyTest</strong><span>Milliy sertifikat imtihonlariga tayyorgarlik platformasi</span><span>© 2026</span></footer>
    </main>
  );
}

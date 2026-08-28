import Link from 'next/link';

const subjects = [
  ['Matematika', '∑', 'matematika', 'Aniq fanlar'],
  ['Tarix', '◈', 'tarix', 'Ijtimoiy fanlar'],
  ['Kimyo', '⚗', 'kimyo', 'Tabiiy fanlar'],
  ['Biologiya', '⌬', 'biologiya', 'Tabiiy fanlar'],
  ['Ona tili va adabiyot', 'Aa', 'ona-tili-adabiyot', 'Til va adabiyot'],
];

const features = [
  ['01', 'Practice', 'Fan va mavzuni tanlang, vaqtni belgilang va o‘zingizga qulay tempda ishlang.'],
  ['02', 'Question Bank', 'Savollarni fan, mavzu va Oson / O‘rta / Qiyin daraja bo‘yicha toping.'],
  ['03', 'Progress', 'Natijalaringizni kuzating va ustida ishlash kerak bo‘lgan mavzularni aniqlang.'],
  ['04', 'Study Plan', 'Imtihon sanasi va maqsadingizga mos tayyorgarlik rejasini tuzing.'],
];

const steps = [
  ['01', 'Maqsadingizni belgilang', 'Imtihon sanasi va kerakli natijani tanlang.'],
  ['02', 'Practice qiling', 'Fan, mavzu va qiyinlik darajasi bo‘yicha ishlang.'],
  ['03', 'Natijani ko‘ring', 'Kuchli va zaif mavzularingizni real natijalar orqali kuzating.'],
  ['04', 'Reja asosida davom eting', 'Har kuni aniq keyingi qadamni bajaring.'],
];

export default function Home() {
  return (
    <main className="landing">
      <style>{`
        .landing{--ink:#211b17;--muted:#766d65;--bronze:#b8894a;--bronze-dark:#8e6737;--cream:#faf8f3;--soft:#f3eadc;--line:#e7ded1;min-height:100vh;background:var(--cream);color:var(--ink);overflow:hidden}
        .landing *{box-sizing:border-box}.landing a{text-decoration:none;color:inherit}
        .landing .nav{width:min(1180px,calc(100% - 40px));height:70px;margin:16px auto 0;padding:0 18px 0 12px;display:flex;align-items:center;justify-content:space-between;gap:24px;border:1px solid rgba(184,137,74,.18);border-radius:18px;background:rgba(250,248,243,.88);backdrop-filter:blur(18px);position:sticky;top:12px;z-index:50;box-shadow:0 10px 35px rgba(53,42,31,.06)}
        .landing .brand{display:flex;align-items:center;gap:10px;font-size:16px;font-weight:850;letter-spacing:-.035em;white-space:nowrap}.landing .brand-mark{width:38px;height:38px;display:grid;place-items:center;border-radius:12px;background:var(--ink);color:#f7ead7;font-family:Georgia,serif;font-size:19px;box-shadow:0 7px 18px rgba(33,27,23,.16)}
        .landing .nav-links{display:flex;gap:30px;color:#6e665f;font-size:12px;font-weight:700}.landing .nav-links a{transition:.2s}.landing .nav-links a:hover{color:var(--bronze-dark)}
        .landing .nav-button,.landing .primary{display:inline-flex;align-items:center;justify-content:center;gap:8px;background:var(--ink);color:#fff;border-radius:11px;font-size:12px;font-weight:850;transition:.2s}.landing .nav-button{padding:11px 16px}.landing .nav-button:hover,.landing .primary:hover{background:#382f29;transform:translateY(-2px)}
        .landing .hero{width:min(1180px,calc(100% - 40px));min-height:700px;margin:auto;padding:90px 20px 55px;text-align:center;position:relative;display:flex;flex-direction:column;align-items:center;justify-content:center}.landing .hero:before{content:"";position:absolute;width:800px;height:600px;top:25px;left:50%;transform:translateX(-50%);background:radial-gradient(circle at 50% 43%,rgba(184,137,74,.19),transparent 48%),radial-gradient(circle at 23% 68%,rgba(221,202,174,.3),transparent 32%);filter:blur(7px)}.landing .hero:after{content:"";position:absolute;inset:0;background-image:linear-gradient(rgba(184,137,74,.07) 1px,transparent 1px),linear-gradient(90deg,rgba(184,137,74,.07) 1px,transparent 1px);background-size:52px 52px;mask-image:linear-gradient(to bottom,black 5%,transparent 72%)}.landing .hero>*{position:relative;z-index:1}
        .landing .eyebrow{display:inline-flex;align-items:center;gap:8px;padding:8px 13px;border:1px solid #e2d5c2;border-radius:999px;background:rgba(255,253,249,.84);color:#71675e;font-size:9px;font-weight:900;letter-spacing:.13em;box-shadow:0 7px 20px rgba(75,55,36,.05)}.landing .eyebrow i{width:6px;height:6px;border-radius:50%;background:var(--bronze);box-shadow:0 0 0 4px var(--soft)}
        .landing h1{max-width:980px;margin:25px auto 20px;font-family:Georgia,'Times New Roman',serif;font-size:clamp(50px,7.4vw,88px);line-height:.95;letter-spacing:-.065em;font-weight:600}.landing h1 span{display:block;color:var(--bronze-dark);font-style:italic}.landing .hero-copy{max-width:690px;margin:0;color:var(--muted);font-size:16px;line-height:1.75}.landing .hero-actions{display:flex;gap:10px;margin-top:31px}.landing .hero-actions .primary{padding:14px 22px;background:var(--bronze-dark);box-shadow:0 12px 28px rgba(142,103,55,.22)}.landing .hero-actions .primary:hover{background:#76542d}.landing .secondary{display:inline-flex;align-items:center;justify-content:center;padding:13px 20px;border:1px solid #dcd1c3;border-radius:11px;background:rgba(255,255,255,.68);font-size:12px;font-weight:800;transition:.2s}.landing .secondary:hover{border-color:#bfa27d;background:#fff}.landing .trust{display:flex;flex-wrap:wrap;justify-content:center;gap:8px;margin-top:23px}.landing .trust span{padding:7px 11px;border:1px solid rgba(184,137,74,.17);border-radius:999px;background:rgba(255,255,255,.55);color:#82776d;font-size:10px;font-weight:700}.landing .scroll{margin-top:48px;color:#a1978e;font-size:8px;font-weight:850;letter-spacing:.16em;display:flex;flex-direction:column;gap:6px;align-items:center}.landing .scroll b{font-size:15px;font-weight:400}
        .landing .section{width:min(1180px,calc(100% - 40px));margin:auto;padding:88px 20px}.landing .section-head{display:flex;justify-content:space-between;align-items:end;gap:40px;margin-bottom:30px}.landing .section-head>div{max-width:670px}.landing .kicker{font-size:9px;letter-spacing:.17em;font-weight:900;color:var(--bronze-dark)}.landing h2{font-family:Georgia,'Times New Roman',serif;font-size:clamp(36px,4.7vw,57px);line-height:1;letter-spacing:-.055em;font-weight:600;margin:11px 0 0}.landing .section-head p{max-width:400px;margin:0;color:var(--muted);font-size:13px;line-height:1.7}
        .landing .subject-grid{display:grid;grid-template-columns:repeat(6,1fr);gap:13px}.landing .subject-card{grid-column:span 2;min-height:205px;padding:23px;border:1px solid var(--line);border-radius:20px;background:#fffdf9;position:relative;box-shadow:0 8px 25px rgba(58,43,28,.035);transition:.25s;overflow:hidden}.landing .subject-card:nth-child(4){grid-column:2/span 2}.landing .subject-card:nth-child(5){grid-column:4/span 2}.landing .subject-card:after{content:"";position:absolute;width:120px;height:120px;right:-55px;top:-55px;border-radius:50%;background:var(--soft);opacity:.65}.landing .subject-card:hover{transform:translateY(-6px);border-color:#cfb38b;box-shadow:0 22px 42px rgba(58,43,28,.1)}.landing .subject-icon{width:48px;height:48px;display:grid;place-items:center;border-radius:14px;background:var(--soft);color:var(--bronze-dark);font-family:Georgia,serif;font-size:20px;margin-bottom:31px;position:relative;z-index:1}.landing .subject-card small{color:#a09285;font-size:10px;font-weight:750}.landing .subject-card h3{margin:7px 0 0;font-size:18px;letter-spacing:-.035em;position:relative;z-index:1}.landing .subject-card .arrow{position:absolute;right:22px;bottom:20px;color:#9b8b7a;font-size:18px;transition:.2s;z-index:2}.landing .subject-card:hover .arrow{transform:translateX(5px);color:var(--bronze-dark)}
        .landing .feature-band{width:100%;background:#f3ede4;border-top:1px solid var(--line);border-bottom:1px solid var(--line)}.landing .features-inner{width:min(1180px,calc(100% - 40px));margin:auto;padding:88px 20px}.landing .feature-head{display:flex;justify-content:space-between;align-items:end;gap:30px}.landing .feature-head>div{max-width:650px}.landing .feature-head p{max-width:390px;margin:0;color:var(--muted);font-size:13px;line-height:1.7}.landing .feature-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-top:32px}.landing .feature{min-height:225px;padding:24px;border:1px solid #e1d5c5;border-radius:18px;background:rgba(255,255,255,.6);transition:.2s}.landing .feature:hover{background:#fff;transform:translateY(-4px);box-shadow:0 14px 30px rgba(58,43,28,.07)}.landing .feature b{color:var(--bronze-dark);font-size:10px}.landing .feature h3{font-size:19px;margin:57px 0 9px;letter-spacing:-.035em}.landing .feature p{margin:0;color:var(--muted);font-size:12px;line-height:1.65}
        .landing .journey{display:grid;grid-template-columns:.9fr 1.25fr;gap:65px;align-items:center}.landing .journey-copy p{max-width:470px;color:var(--muted);font-size:14px;line-height:1.8}.landing .journey-list{display:grid;gap:10px}.landing .journey-row{display:flex;gap:15px;padding:18px;border:1px solid var(--line);border-radius:15px;background:#fffdf9}.landing .journey-num{width:31px;height:31px;flex:none;display:grid;place-items:center;border-radius:9px;background:var(--ink);color:#f6e8d5;font-size:9px;font-weight:850}.landing .journey-row h3{margin:0 0 4px;font-size:15px}.landing .journey-row p{margin:0;color:#857b72;font-size:11px;line-height:1.55}
        .landing .cta{width:min(1120px,calc(100% - 40px));margin:0 auto 70px;padding:50px;border-radius:26px;background:var(--ink);color:#fff;display:flex;align-items:center;justify-content:space-between;gap:30px;position:relative;overflow:hidden;box-shadow:0 25px 60px rgba(33,29,24,.16)}.landing .cta:after{content:"";position:absolute;width:420px;height:420px;right:-130px;top:-210px;border-radius:50%;border:1px solid rgba(255,255,255,.08);box-shadow:0 0 0 45px rgba(255,255,255,.025),0 0 0 90px rgba(255,255,255,.018)}.landing .cta>*{position:relative;z-index:1}.landing .cta .kicker{color:#d8b57f}.landing .cta h2{font-size:clamp(34px,4.5vw,54px);margin-top:9px}.landing .cta .primary{padding:14px 22px;background:#c0965e}.landing .cta .primary:hover{background:#d1aa76}
        .landing footer{width:min(1120px,calc(100% - 40px));margin:auto;border-top:1px solid var(--line);padding:25px 0 38px;display:flex;justify-content:space-between;gap:20px;color:#958a7f;font-size:10px}.landing footer strong{color:#5c5147;font-size:12px}
        @media(max-width:900px){.landing .nav-links{display:none}.landing .subject-grid{grid-template-columns:repeat(2,1fr)}.landing .subject-card,.landing .subject-card:nth-child(4),.landing .subject-card:nth-child(5){grid-column:auto}.landing .feature-grid{grid-template-columns:repeat(2,1fr)}.landing .journey{grid-template-columns:1fr}}
        @media(max-width:620px){.landing .nav{width:calc(100% - 20px);height:62px;margin-top:8px;top:8px}.landing .brand{font-size:14px}.landing .brand-mark{width:34px;height:34px}.landing .nav-button{padding:10px 13px;font-size:11px}.landing .hero{width:100%;min-height:650px;padding:80px 18px 50px}.landing h1{font-size:46px}.landing .hero-copy{font-size:14px}.landing .hero-actions{width:100%;flex-direction:column}.landing .hero-actions>*{width:100%}.landing .section,.landing .features-inner{width:100%;padding:66px 18px}.landing .section-head,.landing .feature-head{display:block}.landing .section-head p,.landing .feature-head p{margin-top:17px}.landing .subject-grid,.landing .feature-grid{grid-template-columns:1fr}.landing .subject-card,.landing .subject-card:nth-child(4),.landing .subject-card:nth-child(5){grid-column:auto}.landing .feature{min-height:190px}.landing .feature h3{margin-top:35px}.landing .cta{width:calc(100% - 36px);padding:33px 24px;display:grid;text-align:center;justify-items:center;margin-bottom:50px}.landing .cta .primary{width:100%}.landing footer{width:calc(100% - 36px);display:grid}}
      `}</style>

      <nav className="nav">
        <Link href="/" className="brand"><span className="brand-mark">M</span><span>MilliyTest</span></Link>
        <div className="nav-links"><a href="#subjects">Fanlar</a><a href="#features">Imkoniyatlar</a><a href="#how">Qanday ishlaydi?</a></div>
        <Link href="/register" className="nav-button">Boshlash <span>→</span></Link>
      </nav>

      <section className="hero">
        <div className="eyebrow"><i /> MILLIY SERTIFIKAT UCHUN TAYYORGARLIK</div>
        <h1>Imtihonga tayyorlanishning <span>yaxshiroq yo‘li.</span></h1>
        <p className="hero-copy">Kerakli fanni tanlang, savollarni ishlang, natijangizni kuzating va imtihon kunigacha aniq reja asosida tayyorlaning.</p>
        <div className="hero-actions"><Link href="/register" className="primary">Bepul boshlash <span>→</span></Link><a href="#features" className="secondary">Platformani ko‘rish</a></div>
        <div className="trust"><span>✓ 5 ta fan</span><span>✓ Oson / O‘rta / Qiyin</span><span>✓ Timed Practice</span><span>✓ Progress</span></div>
        <div className="scroll">PASTGA <b>↓</b></div>
      </section>

      <section id="subjects" className="section">
        <div className="section-head"><div><div className="kicker">FANLAR</div><h2>O‘zingizga kerakli fanni tanlang.</h2></div><p>Har bir fan o‘z mavzulari, practice savollari va natijalarini alohida boshqarishga yordam beradi.</p></div>
        <div className="subject-grid">{subjects.map(([name,icon,slug,type])=><Link href={`/subjects/${slug}`} className="subject-card" key={slug}><div className="subject-icon">{icon}</div><small>{type}</small><h3>{name}</h3><span className="arrow">→</span></Link>)}</div>
      </section>

      <section id="features" className="feature-band"><div className="features-inner"><div className="feature-head"><div><div className="kicker">ASOSIY IMKONIYATLAR</div><h2>Tayyorgarlikni tartibli qiling.</h2></div><p>Vaqtingizni to‘g‘ri taqsimlang, natijangizni ko‘ring va keyingi qadamni aniq biling.</p></div><div className="feature-grid">{features.map(([number,title,description])=><div className="feature" key={number}><b>{number}</b><h3>{title}</h3><p>{description}</p></div>)}</div></div></section>

      <section id="how" className="section"><div className="journey"><div className="journey-copy"><div className="kicker">QANDAY ISHLAYDI?</div><h2>Bir joyda. To‘rt oddiy qadam.</h2><p>MilliyTest tayyorgarlikni murakkablashtirmaydi. Maqsadni belgilang, mashq qiling, natijani kuzating va rejangiz bo‘yicha davom eting.</p></div><div className="journey-list">{steps.map(([number,title,description])=><div className="journey-row" key={number}><div className="journey-num">{number}</div><div><h3>{title}</h3><p>{description}</p></div></div>)}</div></div></section>

      <section className="cta"><div><div className="kicker">TAYYORMISIZ?</div><h2>Bugun boshlang.<br/>Har kuni bir qadam.</h2></div><Link href="/register" className="primary">Bepul boshlash →</Link></section>

      <footer><strong>MilliyTest</strong><span>Rasmiy davlat tashkiloti bilan bog‘liqligi da’vo qilinmaydi.</span><span>© 2026</span></footer>
    </main>
  );
}

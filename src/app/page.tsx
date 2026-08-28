import Link from 'next/link';

const subjects = [
  ['Matematika', '∑', 'Aniq fanlar', '/subjects/matematika'],
  ['Tarix', '◈', 'Ijtimoiy fanlar', '/subjects/tarix'],
  ['Kimyo', '⚗', 'Tabiiy fanlar', '/subjects/kimyo'],
  ['Biologiya', '⌬', 'Tabiiy fanlar', '/subjects/biologiya'],
  ['Ona tili va adabiyot', 'Aa', 'Til va adabiyot', '/subjects/ona-tili-adabiyot'],
];

const features = [
  ['01', 'Practice', 'Fan va mavzuni tanlang, vaqt belgilang va mashqni boshlang.'],
  ['02', 'Question Bank', 'Savollarni fan, mavzu va Oson / O‘rta / Qiyin daraja bo‘yicha saralang.'],
  ['03', 'Natijalar', 'Aniqlik, yechilgan savollar va mavzular bo‘yicha rivojlanishingizni ko‘ring.'],
  ['04', 'Study Plan', 'Imtihon sanasi va maqsadli darajangizga mos tayyorgarlik rejasini tuzing.'],
];

const steps = [
  ['01', 'Maqsadni belgilang', 'Imtihon sanasi va C dan A+ gacha maqsadli natijani tanlang.'],
  ['02', 'Fanni tanlang', 'Kerakli faningizni ochib, Practice yoki Question Bank orqali boshlang.'],
  ['03', 'Mashq qiling', 'Vaqt bilan ishlang, savollarni yeching va xatolaringizni tahlil qiling.'],
  ['04', 'Natijani oshiring', 'Progressni kuzating va Study Plan asosida muntazam tayyorlaning.'],
];

export default function Home() {
  return (
    <main className="landing">
      <style>{`
        .landing{--ink:#211b17;--ink2:#3a3029;--muted:#756c64;--bronze:#b8894a;--bronze2:#8e6737;--cream:#faf8f3;--paper:#fffdf9;--soft:#f3eadc;--line:#e5dbce;min-height:100vh;background:var(--cream);color:var(--ink);overflow:hidden;font-family:Inter,Arial,sans-serif}.landing *{box-sizing:border-box}.landing a{text-decoration:none;color:inherit}
        .nav{width:min(1180px,calc(100% - 32px));height:70px;margin:14px auto 0;padding:0 12px 0 18px;border:1px solid rgba(184,137,74,.2);border-radius:20px;background:rgba(250,248,243,.82);backdrop-filter:blur(20px);display:flex;align-items:center;justify-content:space-between;gap:25px;position:sticky;top:10px;z-index:20;box-shadow:0 12px 40px rgba(54,42,29,.06)}.brand{display:flex;align-items:center;gap:10px;font-size:17px;font-weight:850;letter-spacing:-.04em;white-space:nowrap}.brand-mark{width:39px;height:39px;border-radius:12px;display:grid;place-items:center;background:var(--ink);color:#f5e5cf;font:600 20px Georgia,serif;box-shadow:0 8px 18px rgba(33,27,23,.15)}.nav-links{display:flex;gap:32px;color:#71685f;font-size:12px;font-weight:700}.nav-links a{transition:.2s}.nav-links a:hover{color:var(--bronze2)}.nav-cta{padding:12px 18px;border-radius:12px;background:var(--ink);color:white!important;font-size:12px;font-weight:850;transition:.2s}.nav-cta:hover{background:var(--ink2);transform:translateY(-2px)}
        .hero{width:min(1180px,calc(100% - 32px));min-height:710px;margin:auto;padding:90px 20px 55px;display:flex;flex-direction:column;align-items:center;text-align:center;justify-content:center;position:relative}.hero:before{content:"";position:absolute;width:980px;height:650px;top:15px;left:50%;transform:translateX(-50%);background:radial-gradient(circle at 50% 42%,rgba(184,137,74,.2),transparent 43%),radial-gradient(circle at 15% 65%,rgba(226,207,180,.32),transparent 30%),radial-gradient(circle at 85% 55%,rgba(246,232,211,.55),transparent 30%);filter:blur(7px)}.hero:after{content:"";position:absolute;inset:0;background-image:linear-gradient(rgba(184,137,74,.055) 1px,transparent 1px),linear-gradient(90deg,rgba(184,137,74,.055) 1px,transparent 1px);background-size:56px 56px;mask-image:linear-gradient(to bottom,#000 0%,transparent 76%)}.hero>*{position:relative;z-index:1}.eyebrow{display:inline-flex;align-items:center;gap:9px;padding:9px 14px;border:1px solid #ded2c1;border-radius:999px;background:rgba(255,253,249,.9);color:#776c62;font-size:9px;font-weight:900;letter-spacing:.15em;box-shadow:0 8px 22px rgba(65,48,31,.05)}.eyebrow i{width:6px;height:6px;border-radius:50%;background:var(--bronze);box-shadow:0 0 0 4px var(--soft)}h1{max-width:1000px;margin:25px auto 20px;font:600 clamp(52px,7.2vw,92px)/.93 Georgia,'Times New Roman',serif;letter-spacing:-.065em}h1 em{display:block;color:var(--bronze2);font-style:italic}.hero-copy{max-width:650px;margin:0;color:var(--muted);font-size:15px;line-height:1.8}.hero-actions{display:flex;gap:11px;margin-top:31px}.primary,.secondary{display:inline-flex;align-items:center;justify-content:center;border-radius:12px;font-size:12px;font-weight:850;transition:.22s}.primary{padding:15px 23px;background:var(--bronze2);color:white!important;box-shadow:0 14px 30px rgba(142,103,55,.2)}.primary:hover{background:#76562f;transform:translateY(-3px)}.secondary{padding:14px 20px;border:1px solid #d8cbbd;background:rgba(255,255,255,.68)}.secondary:hover{background:white;border-color:#bda37f;transform:translateY(-3px)}.trust{display:flex;gap:8px;flex-wrap:wrap;justify-content:center;margin-top:23px}.trust span{padding:7px 11px;border:1px solid rgba(184,137,74,.18);border-radius:999px;background:rgba(255,255,255,.52);color:#81766b;font-size:10px;font-weight:700}.scroll{margin-top:39px;color:#a0978d;font-size:8px;letter-spacing:.17em;font-weight:850;display:flex;flex-direction:column;gap:5px}.scroll b{font:400 17px Arial}
        .section{width:min(1180px,calc(100% - 32px));margin:auto;padding:96px 20px}.section-head{display:flex;justify-content:space-between;align-items:end;gap:50px;margin-bottom:34px}.kicker{font-size:9px;letter-spacing:.18em;font-weight:900;color:var(--bronze2)}h2{margin:10px 0 0;max-width:700px;font:600 clamp(37px,4.8vw,59px)/1 Georgia,serif;letter-spacing:-.055em}.section-head p{max-width:400px;margin:0;color:var(--muted);font-size:13px;line-height:1.8}.subject-grid{display:grid;grid-template-columns:repeat(6,1fr);gap:14px}.subject-card{grid-column:span 2;min-height:215px;padding:24px;border:1px solid var(--line);border-radius:21px;background:var(--paper);position:relative;overflow:hidden;transition:.25s;box-shadow:0 9px 28px rgba(58,43,28,.035)}.subject-card:nth-child(4){grid-column:2/span 2}.subject-card:nth-child(5){grid-column:4/span 2}.subject-card:after{content:"";position:absolute;width:150px;height:150px;right:-75px;top:-75px;border-radius:50%;background:var(--soft)}.subject-card:hover{transform:translateY(-7px);border-color:#ceb18a;box-shadow:0 25px 48px rgba(58,43,28,.1)}.subject-icon{width:50px;height:50px;border-radius:15px;display:grid;place-items:center;background:var(--soft);color:var(--bronze2);font:21px Georgia,serif;margin-bottom:31px;position:relative;z-index:1}.subject-card small{color:#998c80;font-size:10px;font-weight:750}.subject-card h3{margin:7px 0 0;font-size:18px;letter-spacing:-.035em;position:relative;z-index:1}.arrow{position:absolute;right:21px;bottom:19px;color:#9b8c7b;font-size:19px;z-index:2;transition:.2s}.subject-card:hover .arrow{transform:translateX(6px);color:var(--bronze2)}
        .band{background:#f1ebe2;border-top:1px solid var(--line);border-bottom:1px solid var(--line)}.band-inner{width:min(1180px,calc(100% - 32px));margin:auto;padding:96px 20px}.feature-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:13px;margin-top:34px}.feature{min-height:235px;padding:25px;border:1px solid #ded3c5;border-radius:19px;background:rgba(255,255,255,.63);transition:.23s}.feature:hover{background:#fff;transform:translateY(-6px);box-shadow:0 18px 36px rgba(58,43,28,.08)}.feature b{color:var(--bronze2);font-size:10px}.feature h3{margin:61px 0 10px;font-size:19px;letter-spacing:-.035em}.feature p{margin:0;color:var(--muted);font-size:12px;line-height:1.75}
        .journey{display:grid;grid-template-columns:.88fr 1.25fr;gap:75px;align-items:center}.journey-copy p{max-width:480px;color:var(--muted);font-size:14px;line-height:1.9}.journey-list{display:grid;gap:11px}.journey-row{display:flex;gap:15px;padding:19px;border:1px solid var(--line);border-radius:17px;background:var(--paper);transition:.2s}.journey-row:hover{transform:translateX(5px);border-color:#ceb18a;box-shadow:0 12px 28px rgba(58,43,28,.05)}.journey-num{width:32px;height:32px;flex:none;border-radius:10px;display:grid;place-items:center;background:var(--ink);color:#f5e6d1;font-size:9px;font-weight:850}.journey-row h3{margin:0 0 4px;font-size:15px}.journey-row p{margin:0;color:#857a70;font-size:11px;line-height:1.65}
        .stats{display:grid;grid-template-columns:repeat(3,1fr);gap:13px;margin-top:34px}.stat{padding:25px;border:1px solid var(--line);border-radius:18px;background:var(--paper)}.stat strong{display:block;font:600 34px Georgia,serif;color:var(--ink)}.stat span{display:block;margin-top:7px;color:var(--muted);font-size:11px;line-height:1.6}
        .cta{width:min(1140px,calc(100% - 32px));margin:0 auto 75px;padding:56px;border-radius:29px;background:var(--ink);color:white;display:flex;align-items:center;justify-content:space-between;gap:35px;position:relative;overflow:hidden;box-shadow:0 28px 65px rgba(33,29,24,.16)}.cta:before{content:"";position:absolute;width:560px;height:560px;right:-220px;top:-290px;border-radius:50%;border:1px solid rgba(255,255,255,.08);box-shadow:0 0 0 55px rgba(255,255,255,.025),0 0 0 110px rgba(255,255,255,.015)}.cta>*{position:relative;z-index:1}.cta .kicker{color:#d7b67f}.cta h2{color:white}.cta .primary{background:#bf965d}.cta .primary:hover{background:#d0a870}
        footer{width:min(1140px,calc(100% - 32px));margin:auto;padding:26px 0 40px;border-top:1px solid var(--line);display:flex;justify-content:space-between;gap:25px;color:#958a7f;font-size:10px}footer strong{color:#5c5147;font-size:12px}footer div:last-child{display:flex;gap:20px}footer a:hover{color:var(--bronze2)}
        @media(max-width:900px){.nav-links{display:none}.subject-grid{grid-template-columns:repeat(2,1fr)}.subject-card,.subject-card:nth-child(4),.subject-card:nth-child(5){grid-column:auto}.feature-grid{grid-template-columns:repeat(2,1fr)}.journey{grid-template-columns:1fr}.section-head{display:block}.section-head p{margin-top:17px}}
        @media(max-width:620px){.nav{width:calc(100% - 18px);height:62px;margin-top:7px;top:7px}.brand{font-size:14px}.brand-mark{width:34px;height:34px}.nav-cta{padding:10px 13px}.hero{width:100%;min-height:660px;padding:76px 18px 48px}.eyebrow{font-size:8px}h1{font-size:47px}.hero-copy{font-size:14px}.hero-actions{width:100%;flex-direction:column}.hero-actions>*{width:100%}.section,.band-inner{width:100%;padding:70px 18px}.subject-grid,.feature-grid,.stats{grid-template-columns:1fr}.subject-card,.subject-card:nth-child(4),.subject-card:nth-child(5){grid-column:auto}.feature{min-height:195px}.feature h3{margin-top:37px}.cta{width:calc(100% - 36px);padding:38px 25px;display:grid;text-align:center;justify-items:center;margin-bottom:50px}.cta .primary{width:100%}footer{width:calc(100% - 36px);display:grid}footer div:last-child{display:flex;flex-wrap:wrap}}
      `}</style>

      <nav className="nav">
        <Link href="/" className="brand"><span className="brand-mark">M</span><span>MilliyTest</span></Link>
        <div className="nav-links"><a href="#subjects">Fanlar</a><a href="#features">Imkoniyatlar</a><a href="#how">Qanday ishlaydi?</a></div>
        <Link href="/register" className="nav-cta">Boshlash <span>→</span></Link>
      </nav>

      <section className="hero">
        <div className="eyebrow"><i /> MILLIY SERTIFIKAT UCHUN TAYYORGARLIK</div>
        <h1>Imtihonga tayyorlanishning <em>yaxshiroq yo‘li.</em></h1>
        <p className="hero-copy">Kerakli fanni tanlang, savollarni ishlang, natijangizni kuzating va imtihon kunigacha puxta tayyorlaning.</p>
        <div className="hero-actions"><Link href="/register" className="primary">Bepul boshlash <span>→</span></Link><a href="#subjects" className="secondary">Fanlarni ko‘rish</a></div>
        <div className="trust"><span>✓ Real savollar</span><span>✓ Oson / O‘rta / Qiyin</span><span>✓ Natijalar</span><span>✓ Shaxsiy reja</span></div>
        <div className="scroll">PASTGA SCROLL <b>↓</b></div>
      </section>

      <section id="subjects" className="section">
        <div className="section-head"><div><div className="kicker">FANLAR</div><h2>Kerakli faningizdan boshlang.</h2></div><p>Har bir fan uchun Practice, savollar bazasi va tayyorgarlik vositalari bir joyda.</p></div>
        <div className="subject-grid">{subjects.map(([name,icon,group,href])=><Link href={href} className="subject-card" key={name}><div className="subject-icon">{icon}</div><small>{group}</small><h3>{name}</h3><span className="arrow">→</span></Link>)}</div>
      </section>

      <section id="features" className="band"><div className="band-inner"><div className="section-head"><div><div className="kicker">BIR JOYDA</div><h2>Tayyorgarlikni tartibli olib boring.</h2></div><p>Ortiqcha murakkabliksiz: ishlang, natijani ko‘ring va keyingi qadamni biling.</p></div><div className="feature-grid">{features.map(([n,t,d])=><article className="feature" key={n}><b>{n}</b><h3>{t}</h3><p>{d}</p></article>)}</div></div></section>

      <section id="how" className="section"><div className="journey"><div className="journey-copy"><div className="kicker">QANDAY ISHLAYDI?</div><h2>Bugun boshlang. Har kuni yaxshilaning.</h2><p>MilliyTest sizga tayyorgarlikni bitta oddiy oqimga yig‘ishga yordam beradi: maqsad → mashq → natija → reja.</p><div className="stats"><div className="stat"><strong>5</strong><span>asosiy fan</span></div><div className="stat"><strong>A+</strong><span>maqsadli daraja</span></div><div className="stat"><strong>3</strong><span>qiyinlik darajasi</span></div></div></div><div className="journey-list">{steps.map(([n,t,d])=><div className="journey-row" key={n}><span className="journey-num">{n}</span><div><h3>{t}</h3><p>{d}</p></div></div>)}</div></div></section>

      <section className="cta"><div><div className="kicker">TAYYORMISIZ?</div><h2>Imtihonga tayyorgarlikni bugun boshlang.</h2></div><Link href="/register" className="primary">Bepul hisob yaratish →</Link></section>

      <footer><strong>MilliyTest</strong><span>Milliy sertifikat imtihonlariga tayyorgarlik platformasi.</span><div><Link href="/login">Kirish</Link><Link href="/register">Ro‘yxatdan o‘tish</Link></div></footer>
    </main>
  );
}

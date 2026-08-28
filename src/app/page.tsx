import Link from 'next/link';

const subjects = [
  ['Matematika', '∑', 'Aniq fanlar', '/subjects/matematika'],
  ['Tarix', '◈', 'Ijtimoiy fanlar', '/subjects/tarix'],
  ['Kimyo', '⚗', 'Tabiiy fanlar', '/subjects/kimyo'],
  ['Biologiya', '⌬', 'Tabiiy fanlar', '/subjects/biologiya'],
  ['Ona tili va adabiyot', 'Aa', 'Til va adabiyot', '/subjects/ona-tili-adabiyot'],
];

const features = [
  ['01', 'Practice', 'Vaqtni belgilang, fan va mavzuni tanlang va haqiqiy tayyorgarlik rejimida ishlang.'],
  ['02', 'Question Bank', 'Savollarni fan, mavzu va Oson / O‘rta / Qiyin daraja bo‘yicha toping.'],
  ['03', 'Natijalar', 'To‘g‘ri javoblar, aniqlik va mavzular bo‘yicha o‘z rivojlanishingizni kuzating.'],
  ['04', 'Study Plan', 'Imtihon sanasi va maqsadli natijangiz asosida kundalik tayyorgarlik rejasini tuzing.'],
];

const steps = [
  ['01', 'Maqsadni belgilang', 'Imtihon sanasi va maqsadli sertifikat darajasini tanlang.'],
  ['02', 'Fanni tanlang', 'Kerakli fanga o‘ting va Practice yoki Question Bank orqali boshlang.'],
  ['03', 'Muntazam ishlang', 'Savollarni yeching, vaqt bilan ishlang va xatolaringizni ko‘rib chiqing.'],
  ['04', 'Natijani oshiring', 'Progressni kuzating va Study Plan asosida tayyorgarlikni davom ettiring.'],
];

export default function Home() {
  return (
    <main className="landing">
      <style>{`
        .landing{--ink:#211b17;--ink-2:#332a24;--muted:#756c64;--bronze:#b8894a;--bronze-dark:#8e6737;--cream:#faf8f3;--paper:#fffdf9;--soft:#f3eadc;--line:#e6ddd1;min-height:100vh;background:var(--cream);color:var(--ink);overflow:hidden;font-family:Arial,Helvetica,sans-serif}
        .landing *{box-sizing:border-box}.landing a{text-decoration:none;color:inherit}
        .nav{width:min(1160px,calc(100% - 40px));height:68px;margin:16px auto 0;padding:0 12px;border:1px solid rgba(184,137,74,.2);border-radius:18px;background:rgba(250,248,243,.9);backdrop-filter:blur(18px);display:flex;align-items:center;justify-content:space-between;gap:25px;position:sticky;top:12px;z-index:50;box-shadow:0 12px 38px rgba(50,39,28,.06)}
        .brand{display:flex;align-items:center;gap:10px;font-size:16px;font-weight:900;letter-spacing:-.04em;white-space:nowrap}.brand-mark{width:38px;height:38px;border-radius:12px;display:grid;place-items:center;background:var(--ink);color:#f5e5cf;font:600 20px Georgia,serif;box-shadow:0 8px 18px rgba(33,27,23,.16)}
        .nav-links{display:flex;gap:30px;color:#6e655d;font-size:12px;font-weight:750}.nav-links a{transition:.2s}.nav-links a:hover{color:var(--bronze-dark)}
        .nav-cta{padding:11px 17px;border-radius:11px;background:var(--ink);color:#fff!important;font-size:12px;font-weight:850;transition:.2s}.nav-cta:hover{background:#3a3029;transform:translateY(-2px)}
        .hero{width:min(1160px,calc(100% - 40px));min-height:700px;margin:auto;padding:82px 20px 60px;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;position:relative}.hero:before{content:"";position:absolute;width:900px;height:650px;top:0;left:50%;transform:translateX(-50%);background:radial-gradient(circle at 50% 42%,rgba(184,137,74,.18),transparent 45%),radial-gradient(circle at 20% 70%,rgba(226,207,180,.28),transparent 30%);filter:blur(8px)}.hero:after{content:"";position:absolute;inset:0;background-image:linear-gradient(rgba(184,137,74,.065) 1px,transparent 1px),linear-gradient(90deg,rgba(184,137,74,.065) 1px,transparent 1px);background-size:52px 52px;mask-image:linear-gradient(to bottom,#000 0%,transparent 78%)}.hero>*{position:relative;z-index:1}
        .eyebrow{display:inline-flex;align-items:center;gap:9px;padding:8px 13px;border:1px solid #e1d5c5;border-radius:999px;background:rgba(255,253,249,.9);color:#756a60;font-size:9px;font-weight:900;letter-spacing:.14em;box-shadow:0 7px 20px rgba(75,55,36,.05)}.eyebrow i{width:6px;height:6px;border-radius:50%;background:var(--bronze);box-shadow:0 0 0 4px var(--soft)}
        h1{max-width:960px;margin:25px auto 19px;font:600 clamp(50px,7.4vw,88px)/.94 Georgia,'Times New Roman',serif;letter-spacing:-.065em}h1 em{display:block;color:var(--bronze-dark);font-style:italic}.hero-copy{max-width:650px;margin:0;color:var(--muted);font-size:15px;line-height:1.8}.hero-actions{display:flex;gap:10px;margin-top:30px}.primary,.secondary{display:inline-flex;align-items:center;justify-content:center;border-radius:11px;font-size:12px;font-weight:850;transition:.2s}.primary{padding:14px 22px;background:var(--bronze-dark);color:#fff!important;box-shadow:0 12px 28px rgba(142,103,55,.22)}.primary:hover{background:#75542e;transform:translateY(-2px)}.secondary{padding:13px 20px;border:1px solid #d9cec0;background:rgba(255,255,255,.7)}.secondary:hover{background:#fff;border-color:#bea27e;transform:translateY(-2px)}
        .trust{display:flex;gap:8px;flex-wrap:wrap;justify-content:center;margin-top:22px}.trust span{padding:7px 11px;border:1px solid rgba(184,137,74,.18);border-radius:999px;background:rgba(255,255,255,.55);color:#81766c;font-size:10px;font-weight:700}.scroll{margin-top:42px;color:#a0978e;font-size:8px;letter-spacing:.16em;font-weight:850;display:flex;flex-direction:column;gap:5px}.scroll b{font:400 16px Arial}
        .section{width:min(1160px,calc(100% - 40px));margin:auto;padding:92px 20px}.section-head{display:flex;justify-content:space-between;align-items:end;gap:40px;margin-bottom:30px}.kicker{font-size:9px;letter-spacing:.17em;font-weight:900;color:var(--bronze-dark)}h2{margin:10px 0 0;max-width:690px;font:600 clamp(37px,4.7vw,57px)/1 Georgia,'Times New Roman',serif;letter-spacing:-.055em}.section-head p{max-width:390px;margin:0;color:var(--muted);font-size:13px;line-height:1.75}
        .subject-grid{display:grid;grid-template-columns:repeat(6,1fr);gap:13px}.subject-card{grid-column:span 2;min-height:208px;padding:23px;border:1px solid var(--line);border-radius:20px;background:var(--paper);position:relative;overflow:hidden;transition:.25s;box-shadow:0 8px 25px rgba(58,43,28,.035)}.subject-card:nth-child(4){grid-column:2/span 2}.subject-card:nth-child(5){grid-column:4/span 2}.subject-card:after{content:"";position:absolute;width:130px;height:130px;right:-65px;top:-65px;border-radius:50%;background:var(--soft)}.subject-card:hover{transform:translateY(-6px);border-color:#ceb18a;box-shadow:0 22px 42px rgba(58,43,28,.1)}.subject-icon{width:48px;height:48px;border-radius:14px;display:grid;place-items:center;background:var(--soft);color:var(--bronze-dark);font:20px Georgia,serif;margin-bottom:30px;position:relative;z-index:1}.subject-card small{color:#9a8d80;font-size:10px;font-weight:750}.subject-card h3{margin:7px 0 0;font-size:18px;letter-spacing:-.035em;position:relative;z-index:1}.arrow{position:absolute;right:21px;bottom:18px;color:#9a8b7b;font-size:18px;z-index:2;transition:.2s}.subject-card:hover .arrow{transform:translateX(5px);color:var(--bronze-dark)}
        .band{background:#f2ece3;border-top:1px solid var(--line);border-bottom:1px solid var(--line)}.band-inner{width:min(1160px,calc(100% - 40px));margin:auto;padding:92px 20px}.feature-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-top:32px}.feature{min-height:225px;padding:24px;border:1px solid #dfd4c5;border-radius:18px;background:rgba(255,255,255,.62);transition:.2s}.feature:hover{background:#fff;transform:translateY(-5px);box-shadow:0 15px 30px rgba(58,43,28,.07)}.feature b{color:var(--bronze-dark);font-size:10px}.feature h3{margin:56px 0 9px;font-size:19px;letter-spacing:-.035em}.feature p{margin:0;color:var(--muted);font-size:12px;line-height:1.7}
        .journey{display:grid;grid-template-columns:.9fr 1.25fr;gap:70px;align-items:center}.journey-copy p{max-width:470px;color:var(--muted);font-size:14px;line-height:1.85}.journey-list{display:grid;gap:10px}.journey-row{display:flex;gap:15px;padding:18px;border:1px solid var(--line);border-radius:16px;background:var(--paper);transition:.2s}.journey-row:hover{transform:translateX(4px);border-color:#d0b48c}.journey-num{width:31px;height:31px;flex:none;border-radius:9px;display:grid;place-items:center;background:var(--ink);color:#f5e6d1;font-size:9px;font-weight:850}.journey-row h3{margin:0 0 4px;font-size:15px}.journey-row p{margin:0;color:#857a70;font-size:11px;line-height:1.6}
        .cta{width:min(1120px,calc(100% - 40px));margin:0 auto 72px;padding:52px;border-radius:27px;background:var(--ink);color:#fff;display:flex;align-items:center;justify-content:space-between;gap:30px;position:relative;overflow:hidden;box-shadow:0 26px 60px rgba(33,29,24,.16)}.cta:after{content:"";position:absolute;width:430px;height:430px;right:-145px;top:-215px;border-radius:50%;border:1px solid rgba(255,255,255,.08);box-shadow:0 0 0 45px rgba(255,255,255,.025),0 0 0 90px rgba(255,255,255,.018)}.cta>*{position:relative;z-index:1}.cta .kicker{color:#d6b27b}.cta h2{color:#fff}.cta .primary{background:#bf965d}.cta .primary:hover{background:#d1aa75}
        footer{width:min(1120px,calc(100% - 40px));margin:auto;padding:25px 0 38px;border-top:1px solid var(--line);display:flex;justify-content:space-between;gap:20px;color:#958a7f;font-size:10px}footer strong{color:#5c5147;font-size:12px}
        @media(max-width:900px){.nav-links{display:none}.subject-grid{grid-template-columns:repeat(2,1fr)}.subject-card,.subject-card:nth-child(4),.subject-card:nth-child(5){grid-column:auto}.feature-grid{grid-template-columns:repeat(2,1fr)}.journey{grid-template-columns:1fr}}
        @media(max-width:620px){.nav{width:calc(100% - 20px);height:62px;margin-top:8px;top:8px}.brand{font-size:14px}.brand-mark{width:34px;height:34px}.nav-cta{padding:10px 13px}.hero{width:100%;min-height:650px;padding:75px 18px 50px}h1{font-size:46px}.hero-copy{font-size:14px}.hero-actions{width:100%;flex-direction:column}.hero-actions>*{width:100%}.section,.band-inner{width:100%;padding:68px 18px}.section-head{display:block}.section-head p{margin-top:17px}.subject-grid,.feature-grid{grid-template-columns:1fr}.subject-card,.subject-card:nth-child(4),.subject-card:nth-child(5){grid-column:auto}.feature{min-height:190px}.feature h3{margin-top:35px}.cta{width:calc(100% - 36px);padding:35px 24px;display:grid;text-align:center;justify-items:center;margin-bottom:50px}.cta .primary{width:100%}footer{width:calc(100% - 36px);display:grid}}
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
        <div className="section-head"><div><div className="kicker">FANLAR</div><h2>Kerakli faningizdan boshlang.</h2></div><p>Har bir fan uchun alohida Practice, savollar bazasi va tayyorgarlik vositalari mavjud.</p></div>
        <div className="subject-grid">{subjects.map(([name,icon,type,href])=><Link href={href} className="subject-card" key={name}><div className="subject-icon">{icon}</div><small>{type}</small><h3>{name}</h3><span className="arrow">→</span></Link>)}</div>
      </section>

      <section id="features" className="band"><div className="band-inner"><div className="feature-head"><div><div className="kicker">IMKONIYATLAR</div><h2>Tayyorgarlik uchun kerak bo‘lgan hammasi bir joyda.</h2></div><p>Oddiy interfeys, aniq natijalar va har kuni foydalanish uchun qulay vositalar.</p></div><div className="feature-grid">{features.map(([num,title,text])=><article className="feature" key={title}><b>{num}</b><h3>{title}</h3><p>{text}</p></article>)}</div></div></section>

      <section id="how" className="section"><div className="journey"><div className="journey-copy"><div className="kicker">QANDAY ISHLAYDI?</div><h2>Bugun boshlang. Har kuni yaxshilaning.</h2><p>MilliyTest tayyorgarlikni bir nechta oddiy qadamga ajratadi. Siz natijangizni ko‘rib borasiz va keyingi mashg‘ulotni aniq bilasiz.</p><Link href="/register" className="primary">Bepul hisob yaratish →</Link></div><div className="journey-list">{steps.map(([num,title,text])=><div className="journey-row" key={num}><span className="journey-num">{num}</span><div><h3>{title}</h3><p>{text}</p></div></div>)}</div></div></section>

      <section className="cta"><div><div className="kicker">TAYYOR MISIZ?</div><h2>Natijangiz uchun ishlashni bugun boshlang.</h2></div><Link href="/register" className="primary">Boshlash <span>→</span></Link></section>

      <footer><strong>MilliyTest</strong><span>© 2026 MilliyTest. Milliy sertifikatga tayyorgarlik.</span></footer>
    </main>
  );
}

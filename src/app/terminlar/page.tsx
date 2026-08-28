import Link from 'next/link';
import AppSidebar from '@/components/AppSidebar';

const groups=[
  {name:'Matematika',desc:'Matematika bo‘yicha asosiy terminlar va ta’riflar.'},
  {name:'Fizika',desc:'Fizika bo‘yicha asosiy terminlar va formulalarda ishlatiladigan tushunchalar.'},
  {name:'Ona tili',desc:'Tilshunoslik va grammatika bo‘yicha asosiy terminlar.'},
  {name:'Tarix',desc:'Tarixiy mavzular uchun muhim tushunchalar.'},
  {name:'Biologiya',desc:'Biologiya bo‘yicha muhim ilmiy terminlar.'},
];
export default function Terminlar(){return <main className="dashboard-layout"><AppSidebar/><div className="dashboard-content"><header className="dashboard-topbar"><div className="dashboard-mobile-brand"><span className="brand-mark">N</span> National Certificate AI</div><nav><Link href="/dashboard">Home</Link><Link href="/practice">Practice</Link><Link href="/subjects">Question Bank</Link></nav></header><section className="subject-wrap"><div className="section-heading"><div><div className="kicker">TERMINLAR</div><h1>Terminlarni o‘rganing.</h1><p>Har bir fan bo‘yicha kerakli tushunchalarni bir joyda toping.</p></div></div><div className="topic-grid">{groups.map(g=><article className="panel topic-card" key={g.name}><div><div className="kicker">FAN</div><h2>{g.name}</h2><p>{g.desc}</p></div><span className="chip">Tez orada</span></article>)}</div><div className="result-card"><h2>Terminlar bazasi tayyorlanmoqda</h2><p>Hozircha bu bo‘limning interfeysi tayyor. Tasdiqlangan o‘quv materiallari qo‘shilganda terminlar, izohlar va takrorlash rejimi shu yerda ishlaydi.</p></div></section></div></main>}

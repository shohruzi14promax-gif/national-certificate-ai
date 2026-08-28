'use client';
export default function ErrorPage({reset}:{error:Error&{digest?:string};reset:()=>void}){return <main className="state-page"><div><div className="kicker">XATO</div><h1>Biror narsa ishlamadi.</h1><p>Qayta urinib ko‘ring. Muammo davom etsa, keyinroq yana tekshiring.</p><button className="primary" onClick={()=>reset()}>Qayta urinish</button></div></main>}

import {Suspense} from 'react'; import PracticeClient from './client';
export default function PracticePage(){return <Suspense fallback={<main className="state-page">Yuklanmoqda…</main>}><PracticeClient/></Suspense>}

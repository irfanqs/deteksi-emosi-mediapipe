'use client';

import { useState, useMemo } from 'react';
import { useSession } from 'next-auth/react';

interface DzikirItem {
  text: string;
  latin: string;
  arti: string;
  count: number;
}

const DZIKIR_PAGI: DzikirItem[] = [
  {
    text: 'أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ — بِسْمِ اللَّهِ الرَّحْمٰنِ الرَّحِيمِ',
    latin: "A'ūdzu billāhi minasy-syaithānir-rajīm, Bismillāhir-rahmānir-rahīm",
    arti: 'Aku berlindung kepada Allah dari setan yang terkutuk. Dengan nama Allah Yang Maha Pengasih lagi Maha Penyayang.',
    count: 1,
  },
  {
    text: 'اَللّٰهُمَّ بِكَ أَصْبَحْنَا وَبِكَ أَمْسَيْنَا وَبِكَ نَحْيَا وَبِكَ نَمُوتُ وَإِلَيْكَ النُّشُورُ',
    latin: "Allāhumma bika ashbahnā, wa bika amsainā, wa bika nahyā, wa bika namūtu, wa ilaikannusyūr",
    arti: 'Ya Allah, dengan-Mu kami memasuki waktu pagi, dengan-Mu kami memasuki waktu petang, dengan-Mu kami hidup, dengan-Mu kami mati, dan kepada-Mu kami kembali.',
    count: 1,
  },
  {
    text: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ وَالْحَمْدُ لِلَّهِ',
    latin: "Ashbahnā wa ashbahal-mulku lillāh walhamdulillāh",
    arti: 'Kami memasuki waktu pagi dan segala kerajaan adalah milik Allah, segala puji bagi Allah.',
    count: 1,
  },
  {
    text: 'أَشْهَدُ أَنْ لاَ إِلَهَ إِلاَّ اللَّهُ وَحْدَهُ لاَ شَرِيكَ لَهُ، وَأَشْهَدُ أَنَّ مُحَمَّداً عَبْدُهُ وَرَسُولُهُ',
    latin: "Asyhadu allā ilāha illallāhu wahdahu lā syarīkalah, wa asyhadu anna Muhammadan 'abduhū wa rasūluh",
    arti: 'Aku bersaksi bahwa tidak ada tuhan selain Allah yang Maha Esa, tiada sekutu bagi-Nya, dan aku bersaksi bahwa Muhammad adalah hamba dan rasul-Nya.',
    count: 3,
  },
  {
    text: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ عَدَدَ خَلْقِهِ وَرِضَا نَفْسِهِ وَزِنَةَ عَرْشِهِ وَمِدَادَ كَلِمَاتِهِ',
    latin: "Subhānallāhi wa bihamdihī 'adada khalqihī wa ridhā nafsihī wa zinata 'arsyihī wa midāda kalimātih",
    arti: "Maha Suci Allah, aku memuji-Nya sebanyak jumlah makhluk-Nya, sesuai dengan kerelaan-Nya, seberat timbangan 'Arsy-Nya, dan sebanyak tinta tulisan kalimat-Nya.",
    count: 3,
  },
  {
    text: 'اَللّٰهُمَّ عَافِنِي فِي بَدَنِي، اَللّٰهُمَّ عَافِنِي فِي سَمْعِي، اَللّٰهُمَّ عَافِنِي فِي بَصَرِي',
    latin: "Allāhumma 'āfinī fī badanī, Allāhumma 'āfinī fī sam'ī, Allāhumma 'āfinī fī basharī",
    arti: 'Ya Allah, berilah aku kesehatan pada tubuhku. Ya Allah, berilah aku kesehatan pada pendengaranku. Ya Allah, berilah aku kesehatan pada penglihatanku.',
    count: 3,
  },
  {
    text: 'اَللّٰهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا وَرِزْقًا طَيِّبًا وَعَمَلًا مُتَقَبَّلًا',
    latin: "Allāhumma innī as'aluka 'ilman nāfi'an, wa rizqan thayyiban, wa 'amalan mutaqabbalan",
    arti: 'Ya Allah, aku memohon kepada-Mu ilmu yang bermanfaat, rezeki yang baik, dan amal yang diterima.',
    count: 1,
  },
  {
    text: 'اَللّٰهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ',
    latin: "Allāhumma anta rabbī lā ilāha illā anta, khalaqtanī wa ana 'abduk, wa ana 'alā 'ahdika wa wa'dika mastatha'tu",
    arti: 'Ya Allah, Engkaulah Tuhanku. Tidak ada tuhan selain Engkau. Engkau telah menciptakanku dan aku adalah hamba-Mu. Aku berada dalam janji dan ikatan-Mu semampu aku.',
    count: 1,
  },
];

const DZIKIR_PETANG: DzikirItem[] = [
  {
    text: 'اَللّٰهُمَّ بِكَ أَمْسَيْنَا وَبِكَ أَصْبَحْنَا وَبِكَ نَحْيَا وَبِكَ نَمُوتُ وَإِلَيْكَ الْمَصِيرُ',
    latin: "Allāhumma bika amsainā, wa bika ashbahnā, wa bika nahyā, wa bika namūtu, wa ilaical-mashīr",
    arti: 'Ya Allah, dengan-Mu kami memasuki waktu petang, dengan-Mu kami memasuki waktu pagi, dengan-Mu kami hidup, dengan-Mu kami mati, dan kepada-Mu tempat kembali.',
    count: 1,
  },
  {
    text: 'أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ وَالْحَمْدُ لِلَّهِ',
    latin: "Amsainā wa amsal-mulku lillāh walhamdulillāh",
    arti: 'Kami memasuki waktu petang dan segala kerajaan adalah milik Allah, segala puji bagi Allah.',
    count: 1,
  },
  {
    text: 'أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ',
    latin: "A'ūdzu bikalimatillāhit-tāmmāti min syarri mā khalaq",
    arti: 'Aku berlindung dengan kalimat-kalimat Allah yang sempurna dari keburukan apa yang Dia ciptakan.',
    count: 3,
  },
  {
    text: 'بِسْمِ اللَّهِ الَّذِي لاَ يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الأَرْضِ وَلاَ فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ',
    latin: "Bismillāhil-ladzī lā yadurru ma'asmihi syai'un fil-ardhi wa lā fis-samā'i wa huwas-samī'ul-'alīm",
    arti: 'Dengan nama Allah yang tidak ada sesuatu pun yang membahayakan bersama nama-Nya, baik di bumi maupun di langit. Dialah Yang Maha Mendengar lagi Maha Mengetahui.',
    count: 3,
  },
  {
    text: 'اَللّٰهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ، وَأَعُوذُ بِكَ مِنَ الْعَجْزِ وَالْكَسَلِ',
    latin: "Allāhumma innī a'ūdzu bika minal-hammi wal-hazan, wa a'ūdzu bika minal-'ajzi wal-kasal",
    arti: 'Ya Allah, aku berlindung kepada-Mu dari rasa gundah dan sedih. Aku berlindung kepada-Mu dari kelemahan dan kemalasan.',
    count: 1,
  },
  {
    text: 'اَللّٰهُمَّ إِنِّي أَسْأَلُكَ الْعَافِيَةَ فِي الدُّنْيَا وَالآخِرَةِ',
    latin: "Allāhumma innī as'alukas-salāmata fid-dunyā wal-ākhirah",
    arti: 'Ya Allah, aku memohon kepada-Mu kesehatan dan keselamatan di dunia dan akhirat.',
    count: 1,
  },
  {
    text: 'أَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ',
    latin: "Astaghfirullāha wa atūbu ilaih",
    arti: 'Aku memohon ampun kepada Allah dan bertaubat kepada-Nya.',
    count: 100,
  },
  {
    text: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ',
    latin: "Subhānallāhi wa bihamdih",
    arti: 'Maha Suci Allah dan segala puji bagi-Nya.',
    count: 100,
  },
];

interface CounterState {
  istighfar: number;
  sholawat: number;
}

const TARGET = 100;

export default function IslamicDzikir() {
  const { status } = useSession();
  const defaultTab = useMemo(() => {
    const h = new Date().getHours();
    return h >= 5 && h < 16 ? 'pagi' : 'petang';
  }, []);

  const [tab, setTab] = useState<'pagi' | 'petang'>(defaultTab);
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [counter, setCounter] = useState<CounterState>({ istighfar: 0, sholawat: 0 });

  const list = tab === 'pagi' ? DZIKIR_PAGI : DZIKIR_PETANG;
  const doneCount = list.filter((_, i) => checked[`${tab}-${i}`]).length;
  const progressPct = Math.round((doneCount / list.length) * 100);

  const checkAuth = () => {
    if (status !== 'authenticated') {
      alert('Agar progress tersimpan, Anda harus login terlebih dahulu.');
      return false;
    }
    return true;
  };

  const toggle = (i: number) => {
    if (!checkAuth()) return;
    const key = `${tab}-${i}`;
    setChecked(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const increment = (key: keyof CounterState) => {
    if (!checkAuth()) return;
    setCounter(prev => ({ ...prev, [key]: Math.min(TARGET, prev[key] + 1) }));
  };
  const reset = (key: keyof CounterState) => {
    if (!checkAuth()) return;
    setCounter(prev => ({ ...prev, [key]: 0 }));
  };

  return (
    <div className="rounded-[2rem] border border-white bg-white/70 backdrop-blur-xl shadow-lg shadow-slate-200/40 overflow-hidden">
      {/* Header */}
      <div className="px-6 pt-6 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-2xl">📿</span>
          <h2 className="text-xl font-extrabold text-slate-800">Dzikir Harian</h2>
        </div>
        <p className="text-slate-500 text-sm font-medium">Wirid pagi & petang untuk ketenangan hati</p>
      </div>

      {/* Tab Switcher */}
      <div className="px-6 pt-4 pb-2 flex gap-2">
        {(['pagi', 'petang'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-2 rounded-xl font-bold text-sm transition-all ${
              tab === t
                ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-white shadow-md shadow-amber-200'
                : 'bg-slate-100 text-slate-500 hover:bg-amber-50 hover:text-amber-700'
            }`}
          >
            {t === 'pagi' ? '🌅 Dzikir Pagi' : '🌆 Dzikir Petang'}
          </button>
        ))}
      </div>

      {/* Progress bar */}
      <div className="px-6 py-3">
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Progress {tab}</span>
          <span className="text-xs font-extrabold text-amber-600">{doneCount}/{list.length} selesai</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-amber-400 to-yellow-400 transition-all duration-500"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Dzikir List */}
      <div className="px-6 pb-2 max-h-[360px] overflow-y-auto space-y-3 pr-4">
        {list.map((item, i) => {
          const key = `${tab}-${i}`;
          const done = !!checked[key];
          return (
            <div
              key={i}
              onClick={() => toggle(i)}
              className={`cursor-pointer rounded-2xl p-4 border transition-all duration-200 ${
                done
                  ? 'bg-emerald-50 border-emerald-200 opacity-70'
                  : 'bg-white border-slate-100 hover:border-amber-200 hover:bg-amber-50/40'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                  done ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300'
                }`}>
                  {done && <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/></svg>}
                </div>
                <div className="flex-1 min-w-0">
                  <div
                    className="text-right text-lg leading-loose text-slate-800 mb-1"
                    style={{ fontFamily: "'Amiri', serif", direction: 'rtl' }}
                  >
                    {item.text}
                  </div>
                  <p className="text-xs italic text-amber-700 mb-1 font-medium">{item.latin}</p>
                  <p className="text-xs text-slate-500 leading-relaxed">{item.arti}</p>
                  {item.count > 1 && (
                    <span className="mt-1.5 inline-block text-[10px] font-extrabold bg-amber-100 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-md">
                      {item.count}×
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Counter Section */}
      <div className="px-6 pt-4 pb-6 border-t border-slate-100 mt-3">
        <h3 className="text-sm font-extrabold text-slate-700 uppercase tracking-widest mb-3">Penghitung Ibadah</h3>
        <div className="grid grid-cols-2 gap-3">
          {/* Istighfar */}
          <div className="rounded-2xl border border-teal-100 bg-teal-50 p-4 flex flex-col items-center gap-2">
            <span className="text-xs font-bold text-teal-700 uppercase tracking-widest">Istighfar</span>
            <div className="text-3xl font-black text-teal-700 tabular-nums">{counter.istighfar}</div>
            <div className="w-full bg-teal-100 rounded-full h-1.5 overflow-hidden">
              <div className="h-full bg-teal-600 rounded-full transition-all" style={{ width: `${(counter.istighfar / TARGET) * 100}%` }} />
            </div>
            <span className="text-[10px] text-teal-500 font-semibold">Target: {TARGET}×</span>
            <div className="flex gap-2 w-full">
              <button
                onClick={() => increment('istighfar')}
                disabled={counter.istighfar >= TARGET}
                className="flex-1 py-2 bg-teal-700 hover:bg-teal-600 disabled:bg-teal-200 disabled:cursor-not-allowed text-white text-sm font-bold rounded-xl transition-all active:scale-95"
              >
                {counter.istighfar >= TARGET ? '✅' : '+1'}
              </button>
              <button onClick={() => reset('istighfar')} className="px-3 py-2 bg-white border border-teal-200 text-teal-600 text-xs rounded-xl hover:bg-teal-50 transition-all">↺</button>
            </div>
          </div>
          {/* Sholawat */}
          <div className="rounded-2xl border border-yellow-200 bg-yellow-50 p-4 flex flex-col items-center gap-2">
            <span className="text-xs font-bold text-yellow-600 uppercase tracking-widest">Sholawat</span>
            <div className="text-3xl font-black text-yellow-600 tabular-nums">{counter.sholawat}</div>
            <div className="w-full bg-yellow-100 rounded-full h-1.5 overflow-hidden">
              <div className="h-full bg-yellow-400 rounded-full transition-all" style={{ width: `${(counter.sholawat / TARGET) * 100}%` }} />
            </div>
            <span className="text-[10px] text-yellow-500 font-semibold">Target: {TARGET}×</span>
            <div className="flex gap-2 w-full">
              <button
                onClick={() => increment('sholawat')}
                disabled={counter.sholawat >= TARGET}
                className="flex-1 py-2 bg-yellow-400 hover:bg-yellow-300 disabled:bg-yellow-100 disabled:cursor-not-allowed text-yellow-900 text-sm font-bold rounded-xl transition-all active:scale-95"
              >
                {counter.sholawat >= TARGET ? '✅' : '+1'}
              </button>
              <button onClick={() => reset('sholawat')} className="px-3 py-2 bg-white border border-yellow-200 text-yellow-600 text-xs rounded-xl hover:bg-yellow-50 transition-all">↺</button>
            </div>
          </div>
        </div>
        {/* Sholawat Text */}
        <div className="mt-3 p-3 rounded-xl bg-slate-50 border border-slate-100 text-center">
          <p
            className="text-lg text-slate-700 leading-loose mb-1"
            style={{ fontFamily: "'Amiri', serif", direction: 'rtl' }}
          >
            اَللّٰهُمَّ صَلِّ وَسَلِّمْ وَبَارِكْ عَلَى سَيِّدِنَا مُحَمَّدٍ
          </p>
          <p className="text-xs italic text-slate-500">Allāhumma shalli wa sallim wa bārik &apos;alā sayyidinā Muhammad</p>
        </div>
      </div>
    </div>
  );
}

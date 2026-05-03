'use client';

import { useMemo } from 'react';

const HIJRI_MONTHS = [
  'Muharram', 'Safar', 'Rabiul Awal', 'Rabiul Akhir',
  'Jumadil Awal', 'Jumadil Akhir', 'Rajab', "Sya'ban",
  'Ramadhan', 'Syawal', "Dzulqa'dah", 'Dzulhijjah',
];

function getHijriDate(date: Date) {
  const JD = Math.floor(date.getTime() / 86400000) + 2440588;
  const l = JD - 1948440 + 10632;
  const n = Math.floor((l - 1) / 10631);
  const l2 = l - 10631 * n + 354;
  const j =
    Math.floor((10985 - l2) / 5316) * Math.floor((50 * l2) / 17719) +
    Math.floor(l2 / 5670) * Math.floor((43 * l2) / 15238);
  const l3 =
    l2 -
    Math.floor((30 - j) / 15) * Math.floor((17719 * j) / 50) -
    Math.floor(j / 16) * Math.floor((15238 * j) / 43) +
    29;
  const m = Math.floor((24 * l3) / 709);
  const d = l3 - Math.floor((709 * m) / 24);
  const y = 30 * n + j - 30;
  return { year: y, month: m - 1, day: d };
}

const AYAT_LIST = [
  {
    arabic: 'أَلَا بِذِكْرِ ٱللَّهِ تَطْمَئِنُّ ٱلْقُلُوبُ',
    transliteration: "Alā bidzikrillāhi tathmainnul-qulūb",
    translation: "Ingatlah, hanya dengan mengingat Allah hati menjadi tentram.",
    source: "QS. Ar-Ra'd: 28",
  },
  {
    arabic: 'لَا يُكَلِّفُ ٱللَّهُ نَفْسًا إِلَّا وُسْعَهَا',
    transliteration: "Lā yukallifullāhu nafsan illā wus'ahā",
    translation: "Allah tidak membebani seseorang melainkan sesuai dengan kesanggupannya.",
    source: "QS. Al-Baqarah: 286",
  },
  {
    arabic: 'فَإِنَّ مَعَ ٱلْعُسْرِ يُسْرًا ۝ إِنَّ مَعَ ٱلْعُسْرِ يُسْرًا',
    transliteration: "Fa inna ma'al-'usri yusrā, inna ma'al-'usri yusrā",
    translation: "Maka sesungguhnya bersama kesulitan ada kemudahan. Sesungguhnya bersama kesulitan ada kemudahan.",
    source: "QS. Al-Insyirah: 5-6",
  },
  {
    arabic: 'لَا تَقْنَطُوا۟ مِن رَّحْمَةِ ٱللَّهِ ۚ إِنَّ ٱللَّهَ يَغْفِرُ ٱلذُّنُوبَ جَمِيعًا',
    transliteration: "Lā taqnatū min rahmatillāh, innallāha yaghfirudz-dzunūba jamī'ā",
    translation: "Janganlah kamu berputus asa dari rahmat Allah. Sesungguhnya Allah mengampuni semua dosa.",
    source: "QS. Az-Zumar: 53",
  },
  {
    arabic: 'إِنَّ ٱللَّهَ مَعَ ٱلصَّٰبِرِينَ',
    transliteration: "Innallāha ma'ash-shābirīn",
    translation: "Sesungguhnya Allah bersama orang-orang yang sabar.",
    source: "QS. Al-Baqarah: 153",
  },
  {
    arabic: 'وَلَا تَهِنُوا۟ وَلَا تَحْزَنُوا۟ وَأَنتُمُ ٱلْأَعْلَوْنَ إِن كُنتُم مُّؤْمِنِينَ',
    transliteration: "Wa lā tahinū wa lā tahzanū wa antumul-a'lawna in kuntum mu'minīn",
    translation: "Janganlah kamu lemah dan jangan pula bersedih. Kamulah orang-orang yang paling tinggi derajatnya, jika kamu beriman.",
    source: "QS. Ali Imran: 139",
  },
  {
    arabic: 'وَمَن يَتَوَكَّلْ عَلَى ٱللَّهِ فَهُوَ حَسْبُهُۥ',
    transliteration: "Wa man yatawakkal 'alallāhi fa huwa hasbuh",
    translation: "Barangsiapa bertawakkal kepada Allah, niscaya Allah akan mencukupkan keperluannya.",
    source: "QS. At-Talaq: 3",
  },
  {
    arabic: 'وَعَسَىٰٓ أَن تَكْرَهُوا۟ شَيْـًٔا وَهُوَ خَيْرٌ لَّكُمْ',
    transliteration: "Wa 'asā an takrahū syai'an wa huwa khairun lakum",
    translation: "Dan boleh jadi kamu membenci sesuatu, padahal ia amat baik bagimu.",
    source: "QS. Al-Baqarah: 216",
  },
  {
    arabic: 'وَٱسْتَعِينُوا۟ بِٱلصَّبْرِ وَٱلصَّلَوٰةِ ۚ وَإِنَّهَا لَكَبِيرَةٌ إِلَّا عَلَى ٱلْخَٰشِعِينَ',
    transliteration: "Wasta'īnū bish-shabri wash-shalāh",
    translation: "Jadikanlah sabar dan shalat sebagai penolongmu. Sesungguhnya yang demikian itu sungguh berat, kecuali bagi orang-orang yang khusyu'.",
    source: "QS. Al-Baqarah: 45",
  },
  {
    arabic: 'إِنَّهُۥ لَا يَا۟يْـَٔسُ مِن رَّوْحِ ٱللَّهِ إِلَّا ٱلْقَوْمُ ٱلْكَٰفِرُونَ',
    transliteration: "Innahu lā yaiyasu mir-rawhillāhi illal-qawmul-kāfirūn",
    translation: "Sesungguhnya tiada yang berputus asa dari rahmat Allah kecuali kaum yang kafir.",
    source: "QS. Yusuf: 87",
  },
  {
    arabic: 'يَٰٓأَيَّتُهَا ٱلنَّفْسُ ٱلْمُطْمَئِنَّةُ ٱرْجِعِىٓ إِلَىٰ رَبِّكِ رَاضِيَةً مَّرْضِيَّةً',
    transliteration: "Yā ayyatuhan-nafsul-muthmainnah, irji'ī ilā rabbiki rādhiyatan mardhiyyah",
    translation: "Wahai jiwa yang tenang, kembalilah kepada Tuhanmu dengan hati yang ridha lagi diridhai-Nya.",
    source: "QS. Al-Fajr: 27-28",
  },
  {
    arabic: 'حَسْبُنَا ٱللَّهُ وَنِعْمَ ٱلْوَكِيلُ',
    transliteration: "Hasbunallāhu wa ni'mal-wakīl",
    translation: "Cukuplah Allah menjadi Penolong kami dan Allah adalah sebaik-baik Pelindung.",
    source: "QS. Ali Imran: 173",
  },
  {
    arabic: 'ٱدْعُونِىٓ أَسْتَجِبْ لَكُمْ',
    transliteration: "Ud'ūnī astajib lakum",
    translation: "Berdoalah kepada-Ku, niscaya akan Aku perkenankan bagimu.",
    source: "QS. Ghafir: 60",
  },
  {
    arabic: 'وَإِذَا سَأَلَكَ عِبَادِى عَنِّى فَإِنِّى قَرِيبٌ ۖ أُجِيبُ دَعْوَةَ ٱلدَّاعِ إِذَا دَعَانِ',
    transliteration: "Wa idzā sa'alaka 'ibādī 'annī fa innī qarīb, ujību da'watad-dā'i idzā da'ān",
    translation: "Apabila hamba-hamba-Ku bertanya kepadamu tentang Aku, maka sesungguhnya Aku dekat. Aku mengabulkan doa orang yang berdoa apabila dia berdoa kepada-Ku.",
    source: "QS. Al-Baqarah: 186",
  },
  {
    arabic: 'يُرِيدُ ٱللَّهُ بِكُمُ ٱلْيُسْرَ وَلَا يُرِيدُ بِكُمُ ٱلْعُسْرَ',
    transliteration: "Yurīdullāhu bikumul-yusra wa lā yurīdu bikumul-'usr",
    translation: "Allah menghendaki kemudahan bagimu, dan tidak menghendaki kesukaran bagimu.",
    source: "QS. Al-Baqarah: 185",
  },
  {
    arabic: 'رَبَّنَا لَا تُزِغْ قُلُوبَنَا بَعْدَ إِذْ هَدَيْتَنَا وَهَبْ لَنَا مِن لَّدُنكَ رَحْمَةً',
    transliteration: "Rabbanā lā tuzigh qulūbanā ba'da idz hadaitanā wa hab lanā mil-ladunka rahmah",
    translation: "Ya Tuhan kami, janganlah Engkau jadikan hati kami condong kepada kesesatan sesudah Engkau beri petunjuk, dan karuniakanlah kepada kami rahmat dari sisi-Mu.",
    source: "QS. Ali Imran: 8",
  },
  {
    arabic: 'وَبَشِّرِ ٱلصَّٰبِرِينَ ٱلَّذِينَ إِذَآ أَصَٰبَتْهُم مُّصِيبَةٌ قَالُوٓا۟ إِنَّا لِلَّهِ وَإِنَّآ إِلَيْهِ رَٰجِعُونَ',
    transliteration: "Wa bashshirish-shābirīn, alladhīna idzā ashābathum mushībatun qālū innā lillāhi wa innā ilaihi rāji'ūn",
    translation: "Dan berikanlah berita gembira kepada orang-orang yang sabar, yaitu orang-orang yang apabila ditimpa musibah berkata: Inna lillahi wa inna ilaihi raji'un.",
    source: "QS. Al-Baqarah: 155-156",
  },
  {
    arabic: 'فَٱصْبِرْ إِنَّ وَعْدَ ٱللَّهِ حَقٌّ',
    transliteration: "Fashbir, inna wa'dallāhi haqq",
    translation: "Maka bersabarlah kamu, sesungguhnya janji Allah itu adalah benar.",
    source: "QS. Ar-Rum: 60",
  },
  {
    arabic: 'وَٱللَّهُ يُحِبُّ ٱلصَّٰبِرِينَ',
    transliteration: "Wallāhu yuhibbush-shābirīn",
    translation: "Dan Allah mencintai orang-orang yang sabar.",
    source: "QS. Ali Imran: 146",
  },
  {
    arabic: 'إِنَّ ٱللَّهَ لَا يُضِيعُ أَجْرَ ٱلْمُحْسِنِينَ',
    transliteration: "Innallāha lā yudī'u ajral-muhsinīn",
    translation: "Sesungguhnya Allah tidak menyia-nyiakan pahala orang-orang yang berbuat kebaikan.",
    source: "QS. At-Taubah: 120",
  },
];

export default function AyatOfTheDay() {
  const today = new Date();
  const hijri = getHijriDate(today);
  const ayat = AYAT_LIST[today.getDate() % AYAT_LIST.length];

  const greeting = useMemo(() => {
    const h = today.getHours();
    if (h < 10) return 'Selamat Pagi';
    if (h < 15) return 'Selamat Siang';
    if (h < 18) return 'Selamat Sore';
    return 'Selamat Malam';
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const gregorianStr = today.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const hijriStr = `${hijri.day} ${HIJRI_MONTHS[Math.max(0, Math.min(11, hijri.month))]} ${hijri.year} H`;

  return (
    <div className="relative rounded-[2rem] overflow-hidden border border-amber-200/60 shadow-lg shadow-amber-100/40">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-yellow-50 to-emerald-50" />
      {/* Arabesque ornament top-right */}
      <div className="absolute top-0 right-0 w-40 h-40 opacity-10 pointer-events-none select-none" aria-hidden>
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M50 0 L61 35 L97 35 L68 57 L79 91 L50 70 L21 91 L32 57 L3 35 L39 35 Z" fill="#92400e" />
          <circle cx="50" cy="50" r="48" stroke="#92400e" strokeWidth="1" />
          <circle cx="50" cy="50" r="38" stroke="#92400e" strokeWidth="0.5" />
        </svg>
      </div>
      {/* Ornament bottom-left */}
      <div className="absolute bottom-0 left-0 w-28 h-28 opacity-[0.07] pointer-events-none select-none rotate-180" aria-hidden>
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M50 0 L61 35 L97 35 L68 57 L79 91 L50 70 L21 91 L32 57 L3 35 L39 35 Z" fill="#065f46" />
        </svg>
      </div>

      <div className="relative z-10 p-5 md:p-7">
        <div className="flex flex-row gap-5 md:gap-7 items-stretch">

          {/* Left column: meta info */}
          <div className="flex-shrink-0 w-24 md:w-28 flex flex-col items-center justify-center gap-3 text-center">
            {/* Star ornament */}
            <div className="w-12 h-12 opacity-60" aria-hidden>
              <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M50 5 L61 38 L96 38 L68 58 L79 92 L50 72 L21 92 L32 58 L4 38 L39 38 Z" fill="#92400e" />
              </svg>
            </div>
            {/* Hijri date */}
            <div>
              <div className="text-[10px] font-extrabold text-amber-700 uppercase tracking-widest leading-tight mb-1">Ayat Hari Ini</div>
              <div className="text-[11px] text-amber-600 font-semibold leading-snug">{hijriStr}</div>
            </div>
            {/* Greeting badge */}
            <div className="text-[10px] text-emerald-700 font-bold bg-emerald-100/80 border border-emerald-200 px-2 py-1 rounded-lg leading-tight text-center">
              {greeting}
            </div>
            {/* Source badge */}
            <div className="inline-flex items-center gap-1 bg-white/80 border border-amber-200 text-amber-800 text-[10px] font-bold px-2 py-1 rounded-lg leading-tight text-center">
              <span>📖</span>
              <span>{ayat.source}</span>
            </div>
          </div>

          {/* Divider */}
          <div className="w-px self-stretch bg-gradient-to-b from-transparent via-amber-300/50 to-transparent flex-shrink-0" />

          {/* Right column: ayat content */}
          <div className="flex-1 min-w-0 flex flex-col justify-center gap-3">
            {/* Arabic text */}
            <div
              className="text-right text-xl sm:text-2xl md:text-3xl leading-loose text-slate-800"
              style={{ fontFamily: "'Amiri', 'Scheherazade New', serif", direction: 'rtl' }}
            >
              {ayat.arabic}
            </div>
            {/* Transliteration */}
            <p className="text-xs sm:text-sm italic text-amber-700 font-medium">
              &ldquo;{ayat.transliteration}&rdquo;
            </p>
            {/* Translation */}
            <p className="text-sm text-slate-700 font-semibold leading-relaxed">
              {ayat.translation}
            </p>
            {/* Gregorian date */}
            <div className="text-[10px] text-slate-400 font-medium">{gregorianStr}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

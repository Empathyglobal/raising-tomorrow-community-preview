import { getSpokenLanguagesForCountry } from './countriesData';

export const LANGUAGE_BY_COUNTRY = {
  USA: "English",
  GBR: "English",
  AUS: "English",
  CAN: "English",
  FRA: "French",
  DEU: "German",
  ESP: "Spanish",
  ITA: "Italian",
  CHN: "Mandarin",
  JPN: "Japanese",
  KOR: "Korean",
  IDN: "Indonesian",
  BRA: "Portuguese",
  MEX: "Spanish",
  IND: "Hindi",
  RUS: "Russian",
  THA: "Thai",
  VNM: "Vietnamese",
  NLD: "Dutch",
  POL: "Polish",
  TUR: "Turkish",
  SAU: "Arabic",
  ARE: "Arabic",
  SWE: "Swedish",
  NOR: "Norwegian",
  DNK: "Danish",
  FIN: "Finnish",
  GRC: "Greek",
  PRT: "Portuguese",
  CHE: "German",
  AUT: "German",
  BEL: "French",
  ISR: "Hebrew",
  ARG: "Spanish",
  CHL: "Spanish",
  COL: "Spanish",
  
  // EUROPE PACK 2
  ISL: "Icelandic",
  CZE: "Czech",
  HUN: "Hungarian",
  ROU: "Romanian",
  HRV: "Croatian",
  SRB: "Serbian",

  // MIDDLE EAST PACK 2
  QAT: "Arabic",
  KWT: "Arabic",
  OMN: "Arabic",
  JOR: "Arabic",
  LBN: "Arabic",

  // AMERICAS PACK 2
  DOM: "Spanish",
  JAM: "English",
  CRI: "Spanish",
  PAN: "Spanish",
  ECU: "Spanish",

  // AFRICA PACK 2
  GHA: "English",
  RWA: "English",
  SEN: "French"
};

export const ALL_LANGUAGES = [
  "English",
  "Spanish",
  "French",
  "German",
  "Italian",
  "Portuguese",
  "Mandarin",
  "Japanese",
  "Korean",
  "Indonesian",
  "Hindi",
  "Russian",
  "Thai",
  "Vietnamese",
  "Dutch",
  "Polish",
  "Turkish",
  "Arabic",
  "Swedish",
  "Norwegian",
  "Danish",
  "Finnish",
  "Greek",
  "Hebrew",
  "Icelandic",
  "Czech",
  "Hungarian",
  "Romanian",
  "Croatian",
  "Serbian"
];

export function getLanguageForCountry(iso3) {
  const code = String(iso3 || '').toUpperCase();
  const direct = LANGUAGE_BY_COUNTRY[code];
  if (direct) return direct;
  try {
    const langs = getSpokenLanguagesForCountry(code);
    if (Array.isArray(langs) && langs.length) {
      const supported = langs.find(l => ALL_LANGUAGES.includes(l));
      if (supported) return supported;
    }
  } catch {}
  return "English";
}

export function isFluentInLanguage(gameState, language, who = 'parent') {
  const known = gameState.languages?.known || {};
  const personLangs = known[who] || {};
  return personLangs[language]?.fluent === true;
}

export function getLanguageProgress(gameState, language, who = 'parent') {
  const known = gameState.languages?.known || {};
  const personLangs = known[who] || {};
  return personLangs[language]?.progress || 0;
}

export function canStudyLanguage(gameState, language, who = 'parent') {
  const currentCountry = gameState.countryIso3 || "USA";
  const defaultLanguage = getLanguageForCountry(currentCountry);
  
  // Cannot study the default language of current country
  if (language === defaultLanguage) return false;
  
  // Cannot study if already fluent
  if (isFluentInLanguage(gameState, language, who)) return false;
  
  return true;
}

export function getAvailableLanguages(gameState, who = 'parent') {
  const currentCountry = gameState.countryIso3 || "USA";
  const defaultLanguage = getLanguageForCountry(currentCountry);
  
  return ALL_LANGUAGES.filter(lang => {
    if (lang === defaultLanguage) return false;
    if (isFluentInLanguage(gameState, lang, who)) return false;
    return true;
  });
}

export function getFluentLanguages(gameState, who = 'parent') {
  const known = gameState.languages?.known || {};
  const personLangs = known[who] || {};
  
  return Object.entries(personLangs)
    .filter(([_, data]) => data.fluent === true)
    .map(([lang, _]) => lang);
}

function hashToInt(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function pick(list, seedStr) {
  if (!Array.isArray(list) || list.length === 0) return null;
  const n = hashToInt(String(seedStr || "seed"));
  return list[n % list.length];
}

export const LANGUAGE_STUDY_LINES = {
  English: [
    ["Hi! I’m learning a new language.", "Today felt easy and fun."],
    ["I’m getting better every day.", "I can follow simple conversations now."],
    ["I’m proud of my progress.", "Learning this is calming me down."],
    ["I can explain my thoughts more clearly.", "I’m starting to think in this language."],
    ["I’m fluent now—this opens doors.", "I can live in this language."]
  ],
  Spanish: [
    ["¡Hola! Estoy aprendiendo español.", "Me gusta aprender idiomas."],
    ["Cada día entiendo un poco más.", "Puedo hablar frases simples ahora."],
    ["Estoy orgulloso/a de mi progreso.", "Aprender esto me calma."],
    ["Puedo expresar ideas más complejas.", "Empiezo a pensar en español."],
    ["¡Ya soy fluido/a! Se abre el mundo.", "Puedo vivir en español."]
  ],
  French: [
    ["Bonjour ! J’apprends le français.", "J’aime apprendre des langues."],
    ["Je comprends un peu plus chaque jour.", "Je peux parler de choses simples."],
    ["Je suis fier/fière de mes progrès.", "Apprendre me détend."],
    ["Je peux expliquer mes idées clairement.", "Je commence à penser en français."],
    ["Je suis fluent(e) maintenant !", "Le monde s’ouvre à moi."]
  ],
  German: [
    ["Hallo! Ich lerne Deutsch.", "Sprachenlernen macht Spaß."],
    ["Jeden Tag verstehe ich mehr.", "Ich kann einfache Sätze sagen."],
    ["Ich bin stolz auf meinen Fortschritt.", "Das Lernen beruhigt mich."],
    ["Ich kann komplexere Gedanken ausdrücken.", "Ich denke langsam auf Deutsch."],
    ["Ich bin jetzt fließend!", "Neue Türen öffnen sich."]
  ],
  Italian: [
    ["Ciao! Sto imparando l’italiano.", "Mi piace imparare le lingue."],
    ["Ogni giorno capisco di più.", "Posso dire frasi semplici."],
    ["Sono orgoglioso/a dei miei progressi.", "Imparare mi rilassa."],
    ["Posso esprimere idee più complesse.", "Inizio a pensare in italiano."],
    ["Ora sono fluente!", "Il mondo è più grande."]
  ],
  Portuguese: [
    ["Olá! Estou aprendendo português.", "Eu gosto de aprender idiomas."],
    ["Cada dia eu entendo mais.", "Eu consigo falar frases simples."],
    ["Estou orgulhoso/a do meu progresso.", "Aprender me acalma."],
    ["Posso explicar ideias mais complexas.", "Começo a pensar em português."],
    ["Agora sou fluente!", "Isso abre portas."]
  ],
  Mandarin: [
    ["你好！(Nǐ hǎo!) 我在学中文。", "我喜欢学语言。(Wǒ xǐhuān xué yǔyán.)"],
    ["我每天都进步。(Wǒ měitiān dōu jìnbù.)", "我能说简单的话。(Wǒ néng shuō jiǎndān de huà.)"],
    ["我为自己骄傲。(Wǒ wèi zìjǐ jiāo’ào.)", "学习让我放松。(Xuéxí ràng wǒ fàngsōng.)"],
    ["我可以表达更复杂的想法。(Wǒ kěyǐ biǎodá gèng fùzá de xiǎngfǎ.)", "我开始用中文思考。(Wǒ kāishǐ yòng zhōngwén sīkǎo.)"],
    ["我已经流利了！(Wǒ yǐjīng liúlì le!)", "我可以用中文生活。(Wǒ kěyǐ yòng zhōngwén shēnghuó.)"]
  ],
  Japanese: [
    ["こんにちは！日本語を勉強しています。", "言語を学ぶのが好きです。"],
    ["毎日少しずつ分かります。", "簡単な文が話せます。"],
    ["進歩がうれしいです。", "勉強すると落ち着きます。"],
    ["もっと複雑に話せます。", "日本語で考え始めています。"],
    ["もう流暢です！", "日本語で生活できます。"]
  ],
  Korean: [
    ["안녕하세요! 한국어를 배우고 있어요.", "언어 배우는 게 좋아요."],
    ["매일 조금씩 더 이해해요.", "간단한 문장은 말할 수 있어요."],
    ["제가 자랑스러워요.", "공부하면 마음이 편해져요."],
    ["더 복잡한 생각도 말할 수 있어요.", "한국어로 생각하기 시작했어요."],
    ["이제 유창해요!", "한국어로 살 수 있어요."]
  ],
  Indonesian: [
    ["Halo! Aku sedang belajar bahasa Indonesia.", "Aku suka belajar bahasa."],
    ["Setiap hari aku makin paham.", "Aku bisa bilang kalimat sederhana."],
    ["Aku bangga dengan kemajuanku.", "Belajar bikin aku lebih tenang."],
    ["Aku bisa jelaskan ide yang lebih rumit.", "Aku mulai berpikir dalam bahasa ini."],
    ["Aku sudah fasih!", "Banyak kesempatan terbuka."]
  ],
  Hindi: [
    ["नमस्ते! मैं हिन्दी सीख रहा/रही हूँ।", "मुझे भाषाएँ सीखना पसंद है।"],
    ["मैं हर दिन बेहतर हो रहा/रही हूँ।", "मैं सरल वाक्य बोल सकता/सकती हूँ।"],
    ["मुझे अपने प्रगति पर गर्व है।", "सीखने से मेरा मन शांत होता है।"],
    ["मैं जटिल बात भी समझा सकता/सकती हूँ।", "मैं हिन्दी में सोचने लगा/लगी हूँ।"],
    ["मैं अब धाराप्रवाह हूँ!", "अब दुनिया बड़ी लगती है।"]
  ],
  Russian: [
    ["Привет! Я учу русский язык.", "Мне нравится учить языки."],
    ["Каждый день я понимаю больше.", "Я могу говорить простые фразы."],
    ["Я горжусь своим прогрессом.", "Учёба меня успокаивает."],
    ["Я могу выражать сложные мысли.", "Я начинаю думать по-русски."],
    ["Теперь я свободно говорю!", "Открываются новые возможности."]
  ],
  Thai: [
    ["สวัสดี! ฉันกำลังเรียนภาษาไทย", "ฉันชอบเรียนภาษา"],
    ["ทุกวันฉันเข้าใจมากขึ้น", "ฉันพูดประโยคง่าย ๆ ได้"],
    ["ฉันภูมิใจกับความก้าวหน้า", "การเรียนทำให้ฉันสบายใจ"],
    ["ฉันอธิบายความคิดที่ซับซ้อนได้", "ฉันเริ่มคิดเป็นภาษาไทย"],
    ["ตอนนี้ฉันพูดได้คล่องแล้ว!", "โอกาสใหม่ ๆ เปิดขึ้น"]
  ],
  Vietnamese: [
    ["Xin chào! Tôi đang học tiếng Việt.", "Tôi thích học ngôn ngữ."],
    ["Mỗi ngày tôi hiểu hơn một chút.", "Tôi có thể nói câu đơn giản."],
    ["Tôi tự hào về tiến bộ của mình.", "Học làm tôi bình tĩnh hơn."],
    ["Tôi có thể diễn đạt ý phức tạp hơn.", "Tôi bắt đầu nghĩ bằng tiếng Việt."],
    ["Bây giờ tôi đã nói trôi chảy!", "Nhiều cơ hội mở ra."]
  ],
  Dutch: [
    ["Hoi! Ik leer Nederlands.", "Ik vind talen leren leuk."],
    ["Elke dag begrijp ik meer.", "Ik kan simpele zinnen zeggen."],
    ["Ik ben trots op mijn vooruitgang.", "Leren maakt me rustiger."],
    ["Ik kan complexere ideeën uitleggen.", "Ik begin in het Nederlands te denken."],
    ["Ik ben nu vloeiend!", "Nieuwe deuren gaan open."]
  ],
  Polish: [
    ["Cześć! Uczę się polskiego.", "Lubię uczyć się języków."],
    ["Codziennie rozumiem więcej.", "Potrafię mówić proste zdania."],
    ["Jestem dumny/dumna z postępów.", "Nauka mnie uspokaja."],
    ["Umę wyrażać bardziej złożone myśli.", "Zaczynam myśleć po polsku."],
    ["Teraz mówię płynnie!", "Pojawiają się nowe możliwości."]
  ],
  Turkish: [
    ["Merhaba! Türkçe öğreniyorum.", "Dil öğrenmeyi seviyorum."],
    ["Her gün biraz daha anlıyorum.", "Basit cümleler kurabiliyorum."],
    ["İlerlememle gurur duyuyorum.", "Öğrenmek beni rahatlatıyor."],
    ["Daha karmaşık fikirleri anlatabiliyorum.", "Türkçe düşünmeye başlıyorum."],
    ["Artık akıcı konuşuyorum!", "Yeni kapılar açılıyor."]
  ],
  Arabic: [
    ["مرحباً! أنا أتعلم العربية.", "أحب تعلم اللغات."],
    ["كل يوم أفهم أكثر.", "أستطيع قول جمل بسيطة."],
    ["أنا فخور/فخورة بتقدمي.", "التعلم يهدئني."],
    ["أستطيع التعبير عن أفكار أكثر تعقيداً.", "أبدأ بالتفكير بالعربية."],
    ["أصبحتُ طليقاً/طليقة!", "العالم صار أوسع."]
  ],
  Swedish: [
    ["Hej! Jag lär mig svenska.", "Jag gillar att lära mig språk."],
    ["Varje dag förstår jag mer.", "Jag kan säga enkla meningar."],
    ["Jag är stolt över mina framsteg.", "Att plugga gör mig lugnare."],
    ["Jag kan uttrycka mer komplexa idéer.", "Jag börjar tänka på svenska."],
    ["Nu är jag flytande!", "Nya dörrar öppnas."]
  ],
  Norwegian: [
    ["Hei! Jeg lærer norsk.", "Jeg liker å lære språk."],
    ["Hver dag forstår jeg mer.", "Jeg kan si enkle setninger."],
    ["Jeg er stolt av framgangen min.", "Å lære gjør meg roligere."],
    ["Jeg kan forklare mer komplekse ideer.", "Jeg begynner å tenke på norsk."],
    ["Nå snakker jeg flytende!", "Nye muligheter åpner seg."]
  ],
  Danish: [
    ["Hej! Jeg lærer dansk.", "Jeg kan lide at lære sprog."],
    ["Hver dag forstår jeg mere.", "Jeg kan sige enkle sætninger."],
    ["Jeg er stolt af mine fremskridt.", "At lære gør mig rolig."],
    ["Jeg kan udtrykke mere komplekse tanker.", "Jeg begynder at tænke på dansk."],
    ["Nu taler jeg flydende!", "Nye døre åbner sig."]
  ],
  Finnish: [
    ["Hei! Opiskelen suomea.", "Pidän kielten oppimisesta."],
    ["Ymmärrän joka päivä enemmän.", "Osaan sanoa yksinkertaisia lauseita."],
    ["Olen ylpeä edistymisestäni.", "Opiskeleminen rauhoittaa minua."],
    ["Voin ilmaista monimutkaisempia ajatuksia.", "Alan ajatella suomeksi."],
    ["Puhun nyt sujuvasti!", "Uusia ovia avautuu."]
  ],
  Greek: [
    ["Γεια σου! Μαθαίνω ελληνικά.", "Μου αρέσει να μαθαίνω γλώσσες."],
    ["Κάθε μέρα καταλαβαίνω περισσότερο.", "Μπορώ να πω απλές προτάσεις."],
    ["Είμαι περήφανος/περήφανη για την πρόοδό μου.", "Η μάθηση με ηρεμεί."],
    ["Μπορώ να εκφράσω πιο σύνθετες ιδέες.", "Αρχίζω να σκέφτομαι στα ελληνικά."],
    ["Τώρα μιλάω άπταιστα!", "Ανοίγονται νέες ευκαιρίες."]
  ],
  Hebrew: [
    ["שלום! אני לומד/ת עברית.", "אני אוהב/ת ללמוד שפות."],
    ["כל יום אני מבין/ה יותר.", "אני יכול/ה לומר משפטים פשוטים."],
    ["אני גאה בהתקדמות שלי.", "הלמידה מרגיעה אותי."],
    ["אני יכול/ה לבטא רעיונות מורכבים יותר.", "אני מתחיל/ה לחשוב בעברית."],
    ["עכשיו אני שוטף/ת!", "נפתחות דלתות חדשות."]
  ],
  Serbian: [
    ["Zdravo! Učim srpski.", "Volim da učim jezike."],
    ["Svakim danom razumem više.", "Mogu da kažem jednostavne rečenice."],
    ["Ponosan/ponosna sam na svoj napredak.", "Učenje me smiruje."],
    ["Mogu da izrazim složenije misli.", "Počinjem da razmišljam na srpskom."],
    ["Sada tečno govorim!", "Otvaraju se nove mogućnosti."]
  ],
  Croatian: [
    ["Bok! Učim hrvatski.", "Volim učiti jezike."],
    ["Svaki dan razumijem više.", "Mogu reći jednostavne rečenice."],
    ["Ponosan/ponosna sam na svoj napredak.", "Učenje me smiruje."],
    ["Mogu izraziti složenije misli.", "Počinjem razmišljati na hrvatskom."],
    ["Sada tečno govorim!", "Otvaraju se nove mogućnosti."]
  ],
  Romanian: [
    ["Salut! Învăț limba română.", "Îmi place să învăț limbi."],
    ["În fiecare zi înțeleg mai mult.", "Pot spune propoziții simple."],
    ["Sunt mândru/mândră de progresul meu.", "Învățarea mă liniștește."],
    ["Pot exprima idei mai complexe.", "Încep să gândesc în română."],
    ["Acum vorbesc fluent!", "Se deschid uși noi."]
  ],
  Hungarian: [
    ["Szia! Magyarul tanulok.", "Szeretek nyelveket tanulni."],
    ["Minden nap többet értek.", "Tudok egyszerű mondatokat mondani."],
    ["Büszke vagyok a haladásomra.", "A tanulás megnyugtat."],
    ["Bonyolultabb gondolatokat is ki tudok fejezni.", "Kezdek magyarul gondolkodni."],
    ["Most már folyékonyan beszélek!", "Új lehetőségek nyílnak meg."]
  ],
  Czech: [
    ["Ahoj! Učím se česky.", "Rád/ráda se učím jazyky."],
    ["Každý den rozumím víc.", "Umím říct jednoduché věty."],
    ["Jsem hrdý/hrdá na svůj pokrok.", "Učení mě uklidňuje."],
    ["Umím vyjádřit složitější myšlenky.", "Začínám přemýšlet česky."],
    ["Teď mluvím plynně!", "Otevírají se nové možnosti."]
  ],
  Icelandic: [
    ["Halló! Ég er að læra íslensku.", "Mér finnst gaman að læra tungumál."],
    ["Á hverjum degi skil ég meira.", "Ég get sagt einfaldar setningar."],
    ["Ég er stoltur/stolt af framförum mínum.", "Að læra róar mig."],
    ["Ég get tjáð flóknari hugmyndir.", "Ég er að byrja að hugsa á íslensku."],
    ["Núna tala ég reiprennandi!", "Nýir möguleikar opnast."]
  ]
};

export function getLanguageStudyLine(language, progress, seedStr) {
  const levels = LANGUAGE_STUDY_LINES[language] || LANGUAGE_STUDY_LINES["English"];
  const idx = Math.max(1, Math.min(5, Number(progress || 1))) - 1;
  const list = levels?.[idx] || levels?.[0] || ["Nice."];
  return pick(list, `${seedStr || "seed"}|${language}|lvl:${idx}`);
}

// DEV-only integrity check: warn if any language in ALL_LANGUAGES lacks study lines
if (import.meta?.env?.DEV) {
  const missingLines = ALL_LANGUAGES.filter(lang => !LANGUAGE_STUDY_LINES[lang]);
  if (missingLines.length > 0) {
    console.warn('[DEV] Missing LANGUAGE_STUDY_LINES for:', missingLines);
  }
}

export function getAllLanguagesWithProgress(gameState, who = 'parent') {
  const available = getAvailableLanguages(gameState, who);
  const fluent = getFluentLanguages(gameState, who);
  const currentCountry = gameState.countryIso3 || "USA";
  const defaultLanguage = getLanguageForCountry(currentCountry);
  
  const known = gameState.languages?.known || {};
  const personLangs = known[who] || {};
  
  return ALL_LANGUAGES.map(lang => {
    const isDefault = lang === defaultLanguage;
    const isFluent = fluent.includes(lang);
    const progress = personLangs[lang]?.progress || 0;
    const canStudy = available.includes(lang);
    
    return {
      language: lang,
      progress,
      fluent: isFluent,
      isDefault,
      canStudy
    };
  });
}

export function getParentLanguageComfortBonus(gameState, spokenLanguages) {
  const langs = Array.isArray(spokenLanguages) ? spokenLanguages : [];
  const known = gameState?.languages?.known?.parent || {};
  let bestProgress = 0;

  for (const lang of langs) {
    const p = Number(known?.[lang]?.progress || 0);
    if (p > bestProgress) bestProgress = p;
  }

  // 0 points => no bonus
  if (bestProgress <= 0) return { stressDelta: 0, bestProgress: 0, bestLanguage: null };

  // 1–2 points => -1 stress, 3–5 => -2 stress
  const stressDelta = bestProgress >= 3 ? -2 : -1;

  // pick the best language for messaging (first that matches bestProgress)
  let bestLanguage = null;
  for (const lang of langs) {
    const p = Number(known?.[lang]?.progress || 0);
    if (p === bestProgress) { bestLanguage = lang; break; }
  }

  return { stressDelta, bestProgress, bestLanguage };
}
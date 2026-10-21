import type { NounWord, AdjectiveWord, PhraseItem } from '../types';

export const PLURAL_RULES_SHORT = [
  {
    category: '1. Средний род (Rodzaj nijaki)',
    ending: '-a',
    badge: '-a',
    color: 'amber',
    target: 'Существительные среднего рода на -o, -e, -ę, -um',
    rule: 'Любое существительное среднего рода во множественном числе принимает окончание -a (вытесняя гласную единственного числа).',
    caution: 'Важно: средний род имеет абсолютный приоритет над согласным основы. Даже если основа на k или g (jabłko, biurko, lusterko), окончание строго -a: jabłka, biurka, lusterka (а не -i)!',
    examples: [
      { sg: 'okno', pl: 'okna' },
      { sg: 'morze', pl: 'morza' },
      { sg: 'zdjęcie', pl: 'zdjęcia' },
      { sg: 'auto', pl: 'auta' },
      { sg: 'jabłko', pl: 'jabłka' },
      { sg: 'muzeum', pl: 'muzea' },
    ],
  },
  {
    category: '2. Основы на K и G (требуют смягчения)',
    ending: '-i',
    badge: '-i',
    color: 'purple',
    target: 'Женский род на -ka, -ga и мужской неодушевленный на -k, -g',
    rule: 'В польском языке согласные k и g всегда требуют окончания -i. Сочетания «ky» и «gy» фонетически невозможны в польской орфографии.',
    caution: 'У мужских слов на -ek гласная «e» беглая и выпадает: kubek → kubk- + -i = kubki, ołówek → ołówki.',
    examples: [
      { sg: 'książka', pl: 'książki' },
      { sg: 'droga', pl: 'drogi' },
      { sg: 'butelka', pl: 'butelki' },
      { sg: 'kubek', pl: 'kubki' },
      { sg: 'ptak', pl: 'ptaki' },
      { sg: 'pociąg', pl: 'pociągi' },
    ],
  },
  {
    category: '3. Мягкие и функционально мягкие (шипящие)',
    ending: '-e',
    badge: '-e',
    color: 'emerald',
    target: 'Основы на шипящие (c, dz, cz, dż, sz, ż, rz) и мягкие (l, j, ń, ś, ć, ź, -ia, -ja)',
    rule: 'Окончание -e получают слова женского и мужского неодушевленного рода с мягкой или отвердевшей шипящей основой.',
    caution: 'Помните: в польском языке буква «l» считается мягкой (koszula → koszule, hotel → hotele), а «c» — отвердевшей (ulica → ulice, noc → noce).',
    examples: [
      { sg: 'ulica', pl: 'ulice' },
      { sg: 'noc', pl: 'noce' },
      { sg: 'klucz', pl: 'klucze' },
      { sg: 'talerz', pl: 'talerze' },
      { sg: 'koszula', pl: 'koszule' },
      { sg: 'kawiarnia', pl: 'kawiarnie' },
    ],
  },
  {
    category: '4. Твердые согласные основы',
    ending: '-y',
    badge: '-y',
    color: 'sky',
    target: 'Основы на твердые: b, d, f, ł, m, n, p, r, s, t, w, z, ch/h',
    rule: 'После обычных твердых согласных существительные женского и мужского неодушевленного рода получают окончание -y.',
    caution: 'Примеры твердых: szkoła (ł → szkoły), herbata (t → herbaty), dom (m → domy), pies (s → psy).',
    examples: [
      { sg: 'szkoła', pl: 'szkoły' },
      { sg: 'kobieta', pl: 'kobiety' },
      { sg: 'woda', pl: 'wody' },
      { sg: 'dom', pl: 'domy' },
      { sg: 'stół', pl: 'stoły' },
      { sg: 'pies', pl: 'psy' },
    ],
  },
  {
    category: '5. Прилагательные (rodzaj niemęskoosobowy)',
    ending: '-e / -ie',
    badge: '-e / -ie',
    color: 'pink',
    target: 'Универсальное окончание -e для всех объектов нелично-мужского рода',
    rule: 'Во множественном числе niemęskoosobowy все прилагательные имеют окончание -e (после k и g пишется -ie из-за обязательного смягчения).',
    caution: 'После k и g: drogi → drogie, wysoki → wysokie, polski → polskie. Все остальные основы: nowy → nowe, duży → duże, mały → małe.',
    examples: [
      { sg: 'nowy / nowa', pl: 'nowe' },
      { sg: 'duży / duża', pl: 'duże' },
      { sg: 'drogi / droga', pl: 'drogie' },
      { sg: 'wysoki / wysoka', pl: 'wysokie' },
    ],
  },
  {
    category: '6. Базовые исключения (Двойственное число)',
    ending: 'Искл.',
    badge: 'Исключения',
    color: 'yellow',
    target: 'Исторические формы парных предметов и частые нерегулярные слова',
    rule: 'Эти формы происходят из древнеславянского двойственного числа (liczba podwójna) и запоминаются наизусть:',
    caution: 'Все 4 слова относятся к форме niemęskoosobowy (te małe dzieci, te duże oczy)!',
    examples: [
      { sg: 'dziecko', pl: 'dzieci' },
      { sg: 'oko', pl: 'oczy' },
      { sg: 'ucho', pl: 'uszy' },
      { sg: 'ręka', pl: 'ręce' },
    ],
  },
];

export const PLURAL_RULES_LONG = [
  {
    title: '1. Категория «Rodzaj niemęskoosobowy» (Нелично-мужской род)',
    content:
      'В польском языке во множественном числе (Mianownik l. mn. — Именительный падеж) грамматика делит все слова ровно на ДВЕ категории:\n\n' +
      '1) Rodzaj męskoosobowy (лично-мужской, местоимение «oni / ci») — группы людей, в составе которых есть хотя бы один взрослый мужчина (panowie, studenci, Polacy, nauczyciele).\n\n' +
      '2) Rodzaj niemęskoosobowy (нелично-мужской, местоимение «one / te») — абсолютно ВСЕ остальные объекты мира:\n' +
      '  • неодушевленные предметы (okna, stoły, telefony, domy);\n' +
      '  • животные и птицы (psy, koty, konie, ptaki);\n' +
      '  • группы женщин и девушек (kobiety, dziewczyny, studentki);\n' +
      '  • дети (dzieci);\n' +
      '  • растения и абстрактные понятия (drzewa, kwiaty, sprawy, myśli).\n\n' +
      'В этом тренажере отрабатывается категория niemęskoosobowy, объединяющая женский, средний и мужской неодушевленный род.',
  },
  {
    title: '2. Алгоритм выбора окончания существительного (-a, -i, -e, -y)',
    content:
      'Окончание существительного в форме niemęskoosobowy определяется по строгому алгоритму:\n\n' +
      '• ШАГ 1: Если слово СРЕДНЕГО РОДА (в ед. ч. на -o, -e, -ę, -um) → ВСЕГДА окончание «-a»:\n' +
      '  — okno → okna, auto → auta, kino → kina\n' +
      '  — zdjęcie → zdjęcia, morze → morza, mieszkanie → mieszkania\n' +
      '  — muzeum → muzea, centrum → centra, liceum → licea\n' +
      '  — zwierzę → zwierzęta, imię → imiona\n' +
      '  Внимание: даже если основа среднего рода на k или g (jabłko, biurko), средний род имеет приоритет: jabłka, biurka (НЕ -i!).\n\n' +
      '• ШАГ 2: Если слово ЖЕНСКОГО РОДА или МУЖСКОГО НЕОДУШЕВЛЕННОГО, смотрим на согласный основы:\n\n' +
      '  А) Основа на K или G → ВСЕГДА окончание «-i»:\n' +
      '  В польской фонетике сочетания «ky» и «gy» невозможны — только «ki» и «gi»:\n' +
      '    — książka → książki, droga → drogi, butelka → butelki\n' +
      '    — kubek → kubki (беглое e выпадает), budynek → budynki, róg → rogi\n\n' +
      '  Б) Основа на МЯГКИЙ или ШИПЯЩИЙ / ОТВЕРДЕВШИЙ согласный → окончание «-e»:\n' +
      '    — шипящие и отвердевшие (c, dz, cz, dż, sz, ż, rz): ulica → ulice, noc → noce, klucz → klucze, kosz → kosze, wieża → wieże, talerz → talerze, twarz → twarze\n' +
      '    — мягкие (l, j, ń, ś, ć, ź, -ia, -ja): koszula → koszule (буква l — мягкая!), hotel → hotele, pokój → pokoje, kawiarnia → kawiarnie, restauracja → restauracje, babcia → babcie, koń → konie\n\n' +
      '  В) Основа на ТВЕРДЫЙ согласный (b, d, f, ł, m, n, p, r, s, t, w, z, ch) → окончание «-y»:\n' +
      '    — szkoła → szkoły, herbata → herbaty, woda → wody, torba → torby, szafa → szafy\n' +
      '    — dom → domy, stół → stoły, kot → koty, pies → psy, samochód → samochody, telefon → telefony',
  },
  {
    title: '3. Прилагательные во множественном числе: правило окончаний -e и -ie',
    content:
      'Для категории niemęskoosobowy все прилагательные имеют единое общее окончание «-e»:\n\n' +
      '1) Стандартное окончание «-e» (после большинства согласных):\n' +
      '  — nowy dom / nowa szkoła / nowe okno → NOWE domy, NOWE szkoły, NOWE okna\n' +
      '  — duży / duża / duże → DUŻE pokoje, DUŻE szafy, DUŻE miasta\n' +
      '  — mały / mała / małe → MAŁE koty, MAŁE książki, MAŁE jabłka\n' +
      '  — biały → białe, stary → stare, ładny → ładne, zimny → zimne\n\n' +
      '2) Орфографическое окончание «-ie» (после букв k и g):\n' +
      'Согласные k и g требуют обязательного графического смягчения буквой «i» перед гласной «e»:\n' +
      '  — drogi / droga / drogie → DROGIE samochody, DROGIE torebki, DROGIE hotele\n' +
      '  — wysoki / wysoka / wysokie → WYSOKIE budynki, WYSOKIE wieże, WYSOKIE drzewa\n' +
      '  — polski / polska / polskie → POLSKIE miasta, POLSKIE książki, POLSKIE ulice\n' +
      '  — krótki → krótkie, długi → długie, szybki → szybkie',
  },
  {
    title: '4. Чередования и исторические исключения (Liczba podwójna)',
    content:
      'В древнепольском языке существовало «двойственное число» для парных органов человека. В современном языке 4 важнейших слова сохранили эти древние формы:\n\n' +
      '• dziecko → dzieci (ребенок → дети). Относится к категории niemęskoosobowy (te małe dzieci). Смягчение основы ck → ci, окончание -i.\n\n' +
      '• oko → oczy (глаз → глаза). Парный орган. Историческое чередование согласного k → cz, окончание -y (te piękne oczy).\n\n' +
      '• ucho → uszy (ухо → уши). Парный орган. Историческое чередование согласного ch → sz, окончание -y (te duże uszy).\n\n' +
      '• ręka → ręce (рука → руки). Парный орган. Историческое чередование согласного k → c, окончание -e (te czyste ręce).\n\n' +
      'Другие полезные формы:\n' +
      '• rok → lata (год → годы / лета, супплетивная форма);\n' +
      '• dzień → dni (день → дни, беглая гласная).',
  },
];

export const NOUNS_DATA: NounWord[] = [
  // Средний род: -a
  {
    id: 'n-okno',
    singular: 'okno',
    plural: 'okna',
    correctEnding: '-a',
    translation: 'окно',
    ruleExplanation: 'Средний род на -o во мн. числе всегда получает окончание -a.',
    detail: 'Слово okno — среднего рода (to okno). В польском языке абсолютно все существительные среднего рода во множественном числе оканчиваются на -a: okno → okna.',
  },
  {
    id: 'n-zdjecie',
    singular: 'zdjęcie',
    plural: 'zdjęcia',
    correctEnding: '-a',
    translation: 'фотография',
    ruleExplanation: 'Средний род на -e во мн. числе всегда получает окончание -a.',
    detail: 'Слово zdjęcie — среднего рода (to zdjęcie). Все слова среднего рода на -e во множественном числе принимают окончание -a: zdjęcie → zdjęcia.',
  },
  {
    id: 'n-lusterko',
    singular: 'lusterko',
    plural: 'lusterka',
    correctEnding: '-a',
    translation: 'зеркальце',
    ruleExplanation: 'Средний род на -o: приоритет рода над основой на k.',
    detail: 'Слово lusterko — среднего рода (to lusterko). Хотя основа оканчивается на «k», средний род имеет абсолютный приоритет над согласным: lusterko → lusterka (а не lusterki!).',
  },
  {
    id: 'n-mleko',
    singular: 'mleko',
    plural: 'mleka',
    correctEnding: '-a',
    translation: 'молоко',
    ruleExplanation: 'Средний род на -o получает окончание -a.',
    detail: 'Слово mleko — среднего рода (to mleko). Окончание среднего рода во множественном числе — строго -a: mleko → mleka.',
  },
  {
    id: 'n-morze',
    singular: 'morze',
    plural: 'morza',
    correctEnding: '-a',
    translation: 'море',
    ruleExplanation: 'Средний род на -e во мн. числе всегда получает окончание -a.',
    detail: 'Слово morze — среднего рода (to morze). Окончание среднего рода на -e заменяется на -a во множественном числе: morze → morza.',
  },
  {
    id: 'n-ciasto',
    singular: 'ciasto',
    plural: 'ciasta',
    correctEnding: '-a',
    translation: 'пирог / тесто',
    ruleExplanation: 'Средний род на -o во мн. числе всегда получает окончание -a.',
    detail: 'Слово ciasto — среднего рода (to ciasto). Окончание -o заменяется на -a: ciasto → ciasta.',
  },
  {
    id: 'n-jablko',
    singular: 'jabłko',
    plural: 'jabłka',
    correctEnding: '-a',
    translation: 'яблоко',
    ruleExplanation: 'Средний род на -o: приоритет рода над основой на k.',
    detail: 'Слово jabłko — среднего рода (to jabłko). Буква «k» не меняет правила среднего рода: окончание всегда строго -a: jabłko → jabłka.',
  },
  {
    id: 'n-krzeslo',
    singular: 'krzesło',
    plural: 'krzesła',
    correctEnding: '-a',
    translation: 'стул',
    ruleExplanation: 'Средний род на -o во мн. числе всегда получает окончание -a.',
    detail: 'Слово krzesło — среднего рода (to krzesło). Окончание во множественном числе: krzesło → krzesła.',
  },
  {
    id: 'n-auto',
    singular: 'auto',
    plural: 'auta',
    correctEnding: '-a',
    translation: 'автомобиль',
    ruleExplanation: 'Средний род на -o во мн. числе всегда получает окончание -a.',
    detail: 'Слово auto — среднего рода (to auto). Во множественном числе принимает окончание -a: auto → auta.',
  },
  {
    id: 'n-mieszkanie',
    singular: 'mieszkanie',
    plural: 'mieszkania',
    correctEnding: '-a',
    translation: 'квартира',
    ruleExplanation: 'Средний род на -e во мн. числе всегда получает окончание -a.',
    detail: 'Слово mieszkanie — среднего рода (to mieszkanie). Окончание -e переходит в -a: mieszkanie → mieszkania.',
  },

  // Мягкие, шипящие и отвердевшие основы: -e
  {
    id: 'n-ulica',
    singular: 'ulica',
    plural: 'ulice',
    correctEnding: '-e',
    translation: 'улица',
    ruleExplanation: 'Основа на отвердевший согласный «c» получает окончание -e.',
    detail: 'Слово ulica — женского рода. Основа оканчивается на отвердевший согласный «c». После шипящих и отвердевших пишется окончание -e: ulica → ulice.',
  },
  {
    id: 'n-kawiarnia',
    singular: 'kawiarnia',
    plural: 'kawiarnie',
    correctEnding: '-e',
    translation: 'кофейня',
    ruleExplanation: 'Основа на мягкое «-ia» получает окончание -e.',
    detail: 'Слово kawiarnia — женского рода с основой на мягкий слог «-ia». Все подобные основы требуют окончания -e: kawiarnia → kawiarnie.',
  },
  {
    id: 'n-wieza',
    singular: 'wieża',
    plural: 'wieże',
    correctEnding: '-e',
    translation: 'башня',
    ruleExplanation: 'Основа на шипящий «ż» получает окончание -e.',
    detail: 'Слово wieża — женского рода с основой на шипящий согласный «ż». Шипящие согласные во мн. ч. получают окончание -e: wieża → wieże.',
  },
  {
    id: 'n-smycz',
    singular: 'smycz',
    plural: 'smycze',
    correctEnding: '-e',
    translation: 'поводок',
    ruleExplanation: 'Основа на шипящий «cz» получает окончание -e.',
    detail: 'Слово smycz оканчивается на шипящий «cz». Существительные на шипящий согласный принимают окончание -e: smycz → smycze.',
  },
  {
    id: 'n-restauracja',
    singular: 'restauracja',
    plural: 'restauracje',
    correctEnding: '-e',
    translation: 'ресторан',
    ruleExplanation: 'Основа на «-ja» получает окончание -e.',
    detail: 'Слово restauracja — женского рода на «-ja». Существительные на -ja / -ia во множественном числе оканчиваются на -e: restauracja → restauracje.',
  },
  {
    id: 'n-talerz',
    singular: 'talerz',
    plural: 'talerze',
    correctEnding: '-e',
    translation: 'тарелка',
    ruleExplanation: 'Основа на шипящий диграф «rz» получает окончание -e.',
    detail: 'Слово talerz — мужского рода. Основа оканчивается на шипящий звук «rz». Все шипящие требуют окончания -e: talerz → talerze.',
  },
  {
    id: 'n-kosz',
    singular: 'kosz',
    plural: 'kosze',
    correctEnding: '-e',
    translation: 'корзина',
    ruleExplanation: 'Основа на шипящий «sz» получает окончание -e.',
    detail: 'Слово kosz — мужского рода на шипящий «sz». После шипящих окончание множественного числа niemęskoosobowy — строго -e: kosz → kosze.',
  },
  {
    id: 'n-koszula',
    singular: 'koszula',
    plural: 'koszule',
    correctEnding: '-e',
    translation: 'рубашка',
    ruleExplanation: 'Основа на мягкий «l» получает окончание -e.',
    detail: 'Слово koszula — женского рода. В польском языке согласный «l» исторически является мягким, поэтому требует окончания -e: koszula → koszule.',
  },

  // Основы на K и G: -i
  {
    id: 'n-ksiazka',
    singular: 'książka',
    plural: 'książki',
    correctEnding: '-i',
    translation: 'книга',
    ruleExplanation: 'Основа на «k» всегда требует смягчения буквой -i.',
    detail: 'Слово książka — женского рода. Основа оканчивается на «k». В польской орфографии после k и g никогда не пишется «y», только -i: książka → książki.',
  },
  {
    id: 'n-kubek',
    singular: 'kubek',
    plural: 'kubki',
    correctEnding: '-i',
    translation: 'кружка',
    ruleExplanation: 'Основа на «k» требует окончания -i (беглая «e» выпадает).',
    detail: 'Слово kubek — мужского рода. При образовании множественного числа беглая гласная «e» выпадает, а согласный «k» требует окончания -i: kubek → kubki.',
  },
  {
    id: 'n-bulka',
    singular: 'bułka',
    plural: 'bułki',
    correctEnding: '-i',
    translation: 'булочка',
    ruleExplanation: 'Основа на «k» всегда требует окончания -i.',
    detail: 'Слово bułka — женского рода с основой на «k». Согласный k не сочетается с y, поэтому пишется -i: bułka → bułki.',
  },
  {
    id: 'n-droga',
    singular: 'droga',
    plural: 'drogi',
    correctEnding: '-i',
    translation: 'дорога',
    ruleExplanation: 'Основа на «g» всегда требует окончания -i.',
    detail: 'Слово droga — женского рода с основой на «g». После буквы «g» в польском языке всегда ставится окончание -i: droga → drogi.',
  },
  {
    id: 'n-polka',
    singular: 'półka',
    plural: 'półki',
    correctEnding: '-i',
    translation: 'полка',
    ruleExplanation: 'Основа на «k» требует окончания -i.',
    detail: 'Слово półka — основа на «k». В польском языке согласный k требует окончания -i: półka → półki.',
  },
  {
    id: 'n-lodowka',
    singular: 'lodówka',
    plural: 'lodówki',
    correctEnding: '-i',
    translation: 'холодильник',
    ruleExplanation: 'Основа на «k» требует окончания -i.',
    detail: 'Слово lodówka оканчивается на «k». После k пишется окончание -i: lodówka → lodówki.',
  },

  // Обычные твердые согласные основы: -y
  {
    id: 'n-szkola',
    singular: 'szkoła',
    plural: 'szkoły',
    correctEnding: '-y',
    translation: 'школа',
    ruleExplanation: 'Основа на твердый согласный «ł» требует окончания -y.',
    detail: 'Слово szkoła — женского рода. Основа оканчивается на твердый согласный «ł». После твердых согласных ставится окончание -y: szkoła → szkoły.',
  },
  {
    id: 'n-herbata',
    singular: 'herbata',
    plural: 'herbaty',
    correctEnding: '-y',
    translation: 'чай',
    ruleExplanation: 'Основа на твердый согласный «t» требует окончания -y.',
    detail: 'Слово herbata оканчивается на твердый согласный «t». После твердых согласных существительные получают окончание -y: herbata → herbaty.',
  },
  {
    id: 'n-kobieta',
    singular: 'kobieta',
    plural: 'kobiety',
    correctEnding: '-y',
    translation: 'женщина',
    ruleExplanation: 'Основа на твердый согласный «t» требует окончания -y.',
    detail: 'Слово kobieta — основа на твердый согласный «t». Во множественном числе niemęskoosobowy получает окончание -y: kobieta → kobiety.',
  },
  {
    id: 'n-torba',
    singular: 'torba',
    plural: 'torby',
    correctEnding: '-y',
    translation: 'сумка',
    ruleExplanation: 'Основа на твердый согласный «b» требует окончания -y.',
    detail: 'Слово torba — основа оканчивается на твердый согласный «b». Требует окончания -y: torba → torby.',
  },
  {
    id: 'n-woda',
    singular: 'woda',
    plural: 'wody',
    correctEnding: '-y',
    translation: 'вода',
    ruleExplanation: 'Основа на твердый согласный «d» требует окончания -y.',
    detail: 'Слово woda — основа оканчивается на твердый «d». После твердых согласных пишется окончание -y: woda → wody.',
  },
  {
    id: 'n-kawa',
    singular: 'kawa',
    plural: 'kawy',
    correctEnding: '-y',
    translation: 'кофе',
    ruleExplanation: 'Основа на твердый согласный «w» требует окончания -y.',
    detail: 'Слово kawa — в польском языке женского рода с основой на твердый «w». Окончание множественного числа -y: kawa → kawy.',
  },

  // Базовые исключения
  {
    id: 'n-dziecko',
    singular: 'dziecko',
    plural: 'dzieci',
    correctEnding: '-i',
    translation: 'ребенок → дети',
    ruleExplanation: 'Базовое исключение: историческое чередование ck → ci, окончание -i.',
    detail: 'Слово dziecko — грамматически среднего рода (to dziecko). Во множественном числе niemęskoosobowy имеет особую историческую форму: dzieci (окончание -i).',
    isException: true,
  },
  {
    id: 'n-oko',
    singular: 'oko',
    plural: 'oczy',
    correctEnding: '-y',
    translation: 'глаз → глаза',
    ruleExplanation: 'Базовое исключение: древнее двойственное число, k → cz, окончание -y.',
    detail: 'Слово oko — историческая форма парного органа из древнеславянского двойственного числа. Чередование k → cz и окончание -y: oko → oczy.',
    isException: true,
  },
  {
    id: 'n-ucho',
    singular: 'ucho',
    plural: 'uszy',
    correctEnding: '-y',
    translation: 'ухо → уши',
    ruleExplanation: 'Базовое исключение: древнее двойственное число, ch → sz, окончание -y.',
    detail: 'Слово ucho — форма парного органа из двойственного числа. Чередование ch → sz и окончание -y: ucho → uszy.',
    isException: true,
  },
  {
    id: 'n-reka',
    singular: 'ręka',
    plural: 'ręce',
    correctEnding: '-e',
    translation: 'рука → руки',
    ruleExplanation: 'Базовое исключение: древнее двойственное число, k → c, окончание -e.',
    detail: 'Слово ręka — форма парного органа из двойственного числа. Чередование k → c и окончание -e: ręka → ręce.',
    isException: true,
  },
];

export const ADJECTIVES_DATA: AdjectiveWord[] = [
  {
    id: 'a-nowy',
    singular: 'nowy / nowa',
    plural: 'nowe',
    correctEnding: '-e',
    translation: 'новый / новая → новые',
    ruleExplanation: 'Обычная основа прилагательного требует универсального окончания -e.',
    detail: 'Прилагательное nowy / nowa имеет стандартную твердую основу на «w». Во множественном числе niemęskoosobowy получает окончание -e: nowy/nowa → nowe.',
  },
  {
    id: 'a-duzy',
    singular: 'duży / duża',
    plural: 'duże',
    correctEnding: '-e',
    translation: 'большой / большая → большие',
    ruleExplanation: 'Шипящая основа прилагательного требует окончания -e.',
    detail: 'Основа оканчивается на шипящий «ż». Все прилагательные с основой не на k/g во мн. числе niemęskoosobowy получают окончание -e: duży/duża → duże.',
  },
  {
    id: 'a-maly',
    singular: 'mały / mała',
    plural: 'małe',
    correctEnding: '-e',
    translation: 'маленький / маленькая → маленькие',
    ruleExplanation: 'Твердая основа на «ł» требует окончания -e.',
    detail: 'Основа оканчивается на «ł». Во множественном числе niemęskoosobowy окончание строго -e: mały/mała → małe.',
  },
  {
    id: 'a-dobry',
    singular: 'dobry / dobra',
    plural: 'dobre',
    correctEnding: '-e',
    translation: 'хороший / хорошая → хорошие',
    ruleExplanation: 'Твердая основа на «r» требует окончания -e.',
    detail: 'Основа на согласный «r». Во множественном числе niemęskoosobowy прилагательное принимает окончание -e: dobry/dobra → dobre.',
  },
  {
    id: 'a-stary',
    singular: 'stary / stara',
    plural: 'stare',
    correctEnding: '-e',
    translation: 'старый / старая → старые',
    ruleExplanation: 'Твердая основа на «r» требует окончания -e.',
    detail: 'Основа оканчивается на твердый «r». Окончание во множественном числе -e: stary/stara → stare.',
  },
  {
    id: 'a-ladny',
    singular: 'ładny / ładna',
    plural: 'ładne',
    correctEnding: '-e',
    translation: 'красивый / красивая → красивые',
    ruleExplanation: 'Твердая основа на «n» требует окончания -e.',
    detail: 'Основа на согласный «n». Во множественном числе niemęskoosobowy окончание строго -e: ładny/ładna → ładne.',
  },
  {
    id: 'a-cieply',
    singular: 'ciepły / ciepła',
    plural: 'ciepłe',
    correctEnding: '-e',
    translation: 'теплый / теплая → теплые',
    ruleExplanation: 'Твердая основа на «ł» требует окончания -e.',
    detail: 'Основа на «ł». Окончание множественного числа -e: ciepły/ciepła → ciepłe.',
  },
  {
    id: 'a-zimny',
    singular: 'zimny / zimna',
    plural: 'zimne',
    correctEnding: '-e',
    translation: 'холодный / холодная → холодные',
    ruleExplanation: 'Твердая основа на «n» требует окончания -e.',
    detail: 'Основа на «n». Окончание множественного числа -e: zimny/zimna → zimne.',
  },
  {
    id: 'a-drogi',
    singular: 'drogi / droga',
    plural: 'drogie',
    correctEnding: '-ie',
    translation: 'дорогой / дорогая → дорогие',
    ruleExplanation: 'Основа на согласный «g» требует смягчения через -ie.',
    detail: 'Основа прилагательного оканчивается на букву «g». В польском языке k и g требуют обязательного графического смягчения перед e, поэтому пишется -ie: drogi/droga → drogie.',
  },
  {
    id: 'a-wysoki',
    singular: 'wysoki / wysoka',
    plural: 'wysokie',
    correctEnding: '-ie',
    translation: 'высокий / высокая → высокие',
    ruleExplanation: 'Основа на согласный «k» требует смягчения через -ie.',
    detail: 'Основа оканчивается на «k». Согласный k перед гласной e всегда смягчается буквой i, образуя окончание -ie: wysoki/wysoka → wysokie.',
  },
  {
    id: 'a-polski',
    singular: 'polski / polska',
    plural: 'polskie',
    correctEnding: '-ie',
    translation: 'польский / польская → польские',
    ruleExplanation: 'Основа на согласный «k» требует окончания -ie.',
    detail: 'Прилагательное polski оканчивается на «k». Требует обязательного смягчения через -ie: polski/polska → polskie.',
  },
  {
    id: 'a-krotki',
    singular: 'krótki / krótka',
    plural: 'krótkie',
    correctEnding: '-ie',
    translation: 'короткий / короткая → короткие',
    ruleExplanation: 'Основа на «k» требует смягчения через -ie.',
    detail: 'Основа оканчивается на согласный «k». Во множественном числе niemęskoosobowy пишется окончание -ie: krótki/krótka → krótkie.',
  },
  {
    id: 'a-dlugi',
    singular: 'długi / długa',
    plural: 'długie',
    correctEnding: '-ie',
    translation: 'длинный / длинная → длинные',
    ruleExplanation: 'Основа на «g» требует смягчения через -ie.',
    detail: 'Основа оканчивается на букву «g». Требует окончания -ie: długi/długa → długie.',
  },
  {
    id: 'a-szybki',
    singular: 'szybki / szybka',
    plural: 'szybkie',
    correctEnding: '-ie',
    translation: 'быстрый / быстрая → быстрые',
    ruleExplanation: 'Основа на «k» требует окончания -ie.',
    detail: 'Основа оканчивается на согласный «k». Все прилагательные на -ki во мн. числе niemęskoosobowy имеют окончание -kie: szybki/szybka → szybkie.',
  },
];

export const PHRASES_DATA: PhraseItem[] = [
  {
    id: 'p-1',
    adjSingular: 'nowa',
    adjEnding: '-e',
    adjExplanation: 'nowa → nowe (основа на твердый «w» получает окончание -e)',
    nounSingular: 'szkoła',
    nounEnding: '-y',
    nounExplanation: 'szkoła → szkoły (женский род, основа на твердый «ł» получает окончание -y)',
    translation: 'новая школа → новые школы',
    fullPlural: 'nowe szkoły',
  },
  {
    id: 'p-2',
    adjSingular: 'droga',
    adjEnding: '-ie',
    adjExplanation: 'droga → drogie (основа на «g» требует смягчения через -ie)',
    nounSingular: 'książka',
    nounEnding: '-i',
    nounExplanation: 'książka → książki (женский род, основа на «k» требует окончания -i)',
    translation: 'дорогая книга → дорогие книги',
    fullPlural: 'drogie książki',
  },
  {
    id: 'p-3',
    adjSingular: 'duże',
    adjEnding: '-e',
    adjExplanation: 'duże → duże (шипящая основа «ż» получает окончание -e)',
    nounSingular: 'okno',
    nounEnding: '-a',
    nounExplanation: 'okno → okna (средний род на -o во мн. числе всегда получает окончание -a)',
    translation: 'большое окно → большие окна',
    fullPlural: 'duże okna',
  },
  {
    id: 'p-4',
    adjSingular: 'długa',
    adjEnding: '-ie',
    adjExplanation: 'długa → długie (основа на «g» требует окончания -ie)',
    nounSingular: 'ulica',
    nounEnding: '-e',
    nounExplanation: 'ulica → ulice (основа на отвердевший «c» получает окончание -e)',
    translation: 'длинная улица → длинные улицы',
    fullPlural: 'długie ulice',
  },
  {
    id: 'p-5',
    adjSingular: 'mały',
    adjEnding: '-e',
    adjExplanation: 'mały → małe (основа на «ł» получает окончание -e)',
    nounSingular: 'kubek',
    nounEnding: '-i',
    nounExplanation: 'kubek → kubki (мужской род на «k» требует окончания -i, беглое e выпадает)',
    translation: 'маленькая кружка → маленькие кружки',
    fullPlural: 'małe kubki',
  },
  {
    id: 'p-6',
    adjSingular: 'ładne',
    adjEnding: '-e',
    adjExplanation: 'ładne → ładne (основа на «n» получает окончание -e)',
    nounSingular: 'zdjęcie',
    nounEnding: '-a',
    nounExplanation: 'zdjęcie → zdjęcia (средний род на -e во мн. числе всегда получает окончание -a)',
    translation: 'красивая фотография → красивые фотографии',
    fullPlural: 'ładne zdjęcia',
  },
  {
    id: 'p-7',
    adjSingular: 'ciepła',
    adjEnding: '-e',
    adjExplanation: 'ciepła → ciepłe (основа на «ł» получает окончание -e)',
    nounSingular: 'kurtka',
    nounEnding: '-i',
    nounExplanation: 'kurtka → kurtki (основа на «k» требует окончания -i)',
    translation: 'теплая куртка → теплые куртки',
    fullPlural: 'ciepłe kurtki',
  },
  {
    id: 'p-8',
    adjSingular: 'smaczne',
    adjEnding: '-e',
    adjExplanation: 'smaczne → smaczne (основа на «n» получает окончание -e)',
    nounSingular: 'jabłko',
    nounEnding: '-a',
    nounExplanation: 'jabłko → jabłka (средний род имеет приоритет над k, окончание -a)',
    translation: 'вкусное яблоко → вкусные яблоки',
    fullPlural: 'smaczne jabłka',
  },
  {
    id: 'p-9',
    adjSingular: 'wysoka',
    adjEnding: '-ie',
    adjExplanation: 'wysoka → wysokie (основа на «k» требует окончания -ie)',
    nounSingular: 'wieża',
    nounEnding: '-e',
    nounExplanation: 'wieża → wieże (шипящая основа «ż» требует окончания -e)',
    translation: 'высокая башня → высокие башни',
    fullPlural: 'wysokie wieże',
  },
  {
    id: 'p-10',
    adjSingular: 'polskie',
    adjEnding: '-ie',
    adjExplanation: 'polskie → polskie (основа на «k» требует окончания -ie)',
    nounSingular: 'morze',
    nounEnding: '-a',
    nounExplanation: 'morze → morza (средний род на -e всегда получает окончание -a)',
    translation: 'польское море → польские моря',
    fullPlural: 'polskie morza',
  },
];

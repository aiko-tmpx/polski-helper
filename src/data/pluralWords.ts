import type { NounWord, AdjectiveWord, PhraseItem } from '../types';

export const PLURAL_RULES_SHORT = [
  {
    category: 'Существительные: Средний род',
    ending: '-a',
    badge: '🟡 [-a]',
    color: 'amber',
    target: 'Слова на -o, -e, -ę в ед. числе ВСЕГДА получают -a',
    rule: 'Любое существительное среднего рода во множественном числе оканчивается на -a.',
    caution: 'Важно: даже если основа на k/g (jabłko, lusterko), средний род имеет приоритет: jabłka, lusterka!',
    examples: [
      { sg: 'okno', pl: 'okna', ru: 'окна' },
      { sg: 'zdjęcie', pl: 'zdjęcia', ru: 'фотографии' },
      { sg: 'morze', pl: 'morza', ru: 'моря' },
      { sg: 'auto', pl: 'auta', ru: 'автомобили' },
      { sg: 'jabłko', pl: 'jabłka', ru: 'яблоки' },
    ],
  },
  {
    category: 'Существительные: Шипящие, отвердевшие и мягкие',
    ending: '-e',
    badge: '🟢 [-e]',
    color: 'emerald',
    target: 'Основы на sz, cz, rz, ż, c, dz, l или на -ia / -ja',
    rule: 'Шипящие, отвердевшие согласные и мягкие основы требуют окончания -e.',
    caution: 'Помните: буква «l» в польском — мягкая (koszula -> koszule), а «c» — отвердевшая (ulica -> ulice).',
    examples: [
      { sg: 'ulica', pl: 'ulice', ru: 'улицы (на c)' },
      { sg: 'kawiarnia', pl: 'kawiarnie', ru: 'кофейни (на -ia)' },
      { sg: 'wieża', pl: 'wieże', ru: 'башни (на ż)' },
      { sg: 'smycz', pl: 'smycze', ru: 'поводки (на cz)' },
      { sg: 'koszula', pl: 'koszule', ru: 'рубашки (на l)' },
      { sg: 'talerz', pl: 'talerze', ru: 'тарелки (на rz)' },
    ],
  },
  {
    category: 'Существительные: Основы на K и G',
    ending: '-i',
    badge: '🟣 [-i]',
    color: 'purple',
    target: 'Основы на согласные k и g (требуют смягчения)',
    rule: 'В польском языке сочетания «ky» и «gy» невозможны — k и g всегда требуют окончания -i.',
    caution: 'Смягчение: książka -> książki, kubek -> kubki (гласная «e» выпадает, корень на k).',
    examples: [
      { sg: 'książka', pl: 'książki', ru: 'книги' },
      { sg: 'kubek', pl: 'kubki', ru: 'кружки' },
      { sg: 'droga', pl: 'drogi', ru: 'дороги' },
      { sg: 'bułka', pl: 'bułki', ru: 'булочки' },
      { sg: 'półka', pl: 'półki', ru: 'полки' },
    ],
  },
  {
    category: 'Существительные: Обычные твердые согласные',
    ending: '-y',
    badge: '🔵 [-y]',
    color: 'sky',
    target: 'Основы на твердые: b, d, f, ł, m, n, p, r, s, t, w, z',
    rule: 'После стандартных твердых согласных существительные получают окончание -y.',
    caution: 'Твердые: szkoła (ł -> szkoły), herbata (t -> herbaty), torba (b -> torby).',
    examples: [
      { sg: 'szkoła', pl: 'szkoły', ru: 'школы' },
      { sg: 'herbata', pl: 'herbaty', ru: 'чаи' },
      { sg: 'kobieta', pl: 'kobiety', ru: 'женщины' },
      { sg: 'woda', pl: 'wody', ru: 'воды' },
      { sg: 'torba', pl: 'torby', ru: 'сумки' },
      { sg: 'szafa', pl: 'szafy', ru: 'шкафы' },
    ],
  },
  {
    category: 'Прилагательные (rodzaj niemęskoosobowy)',
    ending: '-e / -ie',
    badge: '🌸 [-e / -ie]',
    color: 'pink',
    target: 'Только 2 окончания: -ie (после k/g) и -e (во всех остальных случаях)',
    rule: 'Прилагательные имеют простейшую логику во мн. ч. niemęskoosobowy:',
    caution: 'После k и g: drogi -> drogie, wysoki -> wysokie. Все остальные: nowy -> nowe, duży -> duże.',
    examples: [
      { sg: 'drogi', pl: 'drogie', ru: 'дорогие (после g)' },
      { sg: 'wysoki', pl: 'wysokie', ru: 'высокие (после k)' },
      { sg: 'nowy', pl: 'nowe', ru: 'новые (дефолт)' },
      { sg: 'duży', pl: 'duże', ru: 'большие (дефолт)' },
      { sg: 'mały', pl: 'małe', ru: 'маленькие (дефолт)' },
    ],
  },
  {
    category: '4 Базовых исключения',
    ending: 'Искл.',
    badge: '⚠️ [Исключения]',
    color: 'yellow',
    target: 'Исторические формы и остатки двойственного числа парных органов',
    rule: 'Эти четыре слова нужно просто запомнить наизусть:',
    caution: 'Все 4 слова относятся к форме niemęskoosobowy!',
    examples: [
      { sg: 'dziecko', pl: 'dzieci', ru: 'ребенок -> дети (окончание -i)' },
      { sg: 'oko', pl: 'oczy', ru: 'глаз -> глаза (k -> cz, окончание -y)' },
      { sg: 'ucho', pl: 'uszy', ru: 'ухо -> уши (ch -> sz, окончание -y)' },
      { sg: 'ręka', pl: 'ręce', ru: 'рука -> руки (k -> c, окончание -e)' },
    ],
  },
];

export const PLURAL_RULES_LONG = [
  {
    title: '1. Понятие «Rodzaj niemęskoosobowy» (Нелично-мужской род)',
    content:
      'В польском языке во множественном числе нет привычного деления на мужской, женский и средний род. ' +
      'Вместо этого грамматика делит все слова ровно на ДВЕ категории:\n\n' +
      '1) Rodzaj męskoosobowy (мужсколичностный) — группы, где есть хотя бы один взрослый мужчина (panowie, studenci, nauczyciele).\n' +
      '2) Rodzaj niemęskoosobowy (нелично-мужской) — абсолютно ВСЕ остальные объекты мира: ' +
      'неодушевленные предметы (okna, stoły, telefony), животные (psy, koty, konie), растения (drzewa, róże), ' +
      'группы женщин (kobiety, dziewczyny) и дети (dzieci).\n\n' +
      'В этом тренажере мы доводим до автоматизма образование формы niemęskoosobowy.',
  },
  {
    title: '2. Прилагательные: железное правило 2 окончаний',
    content:
      'Во множественном числе niemęskoosobowy прилагательные образуются невероятно просто — здесь существует всего ДВА окончания:\n\n' +
      '• Окончание «-ie» (после k и g):\n' +
      'Буквы k и g не терпят твердого гласного звука «e» после себя, поэтому требуют смягчения через «i»:\n' +
      '  — drogi / droga -> drogie (дорогие)\n' +
      '  — wysoki / wysoka -> wysokie (высокие)\n' +
      '  — polski / polska -> polskie (польские)\n' +
      '  — długi / długa -> długie (длинные)\n' +
      '  — krótki / krótka -> krótkie (короткие)\n' +
      '  — szybki / szybka -> szybkie (быстрые)\n' +
      '  — tani / tania -> tanie (корень на мягкий n -> просто -e)\n\n' +
      '• Окончание «-e» (во всех остальных случаях):\n' +
      'Абсолютно все остальные основы (твердые, шипящие, отвердевшие):\n' +
      '  — nowy / nowa -> nowe\n' +
      '  — duży / duża -> duże\n' +
      '  — mały / mała -> małe\n' +
      '  — biały / biała -> białe\n' +
      '  — ciepły / ciepła -> ciepłe\n' +
      '  — stary / stara -> stare',
  },
  {
    title: '3. Существительные: 4 регулярных окончания',
    content:
      'Окончание существительного зависит от двух факторов: исходного рода в единственном числе и типа согласного основы:\n\n' +
      '1. СРЕДНИЙ РОД: всегда окончание «-a»\n' +
      'Все существительные на -o, -e, -ę в ед. ч. получают во мн. числе окончание -a:\n' +
      '  — okno -> okna\n' +
      '  — zdjęcie -> zdjęcia\n' +
      '  — morze -> morza\n' +
      '  — danie -> dania\n' +
      '  — auto -> auta\n' +
      '  — jabłko -> jabłka (внимание: средний род сильнее k, поэтому jabłka, а не jabłki!)\n' +
      '  — zwierzę -> zwierzęta (расширение основы, но окончание -a)\n\n' +
      '2. ШИПЯЩИЕ, ОТВЕРДЕВШИЕ И МЯГКИЕ: окончание «-e»\n' +
      'Слова женского и мужского неодушевленного рода на:\n' +
      '  — c: ulica -> ulice, tablica -> tablice, noc -> noce\n' +
      '  — cz: smycz -> smycze, klucz -> klucze\n' +
      '  — rz: talerz -> talerze, twarz -> twarze\n' +
      '  — ż: wieża -> wieże, plaża -> plaże, róża -> róże\n' +
      '  — sz: kosz -> kosze\n' +
      '  — l (в польском l мягкий): koszula -> koszule, butelka (на k -> butelki)\n' +
      '  — мягкие на -ia: kawiarnia -> kawiarnie, piekarnia -> piekarnie\n' +
      '  — мягкие на -ja: restauracja -> restauracje, stacja -> stacje, lekcja -> lekcje\n\n' +
      '3. ОСНОВЫ НА K И G: всегда окончание «-i»\n' +
      'В польском языке согласные k и g требуют смягчения:\n' +
      '  — książka -> książki\n' +
      '  — kubek -> kubki (выпадает беглое e: kubk- + -i)\n' +
      '  — droga -> drogi\n' +
      '  — bułka -> bułki\n' +
      '  — półka -> półki\n' +
      '  — lodówka -> lodówki\n' +
      '  — sukienka -> sukienki\n\n' +
      '4. ОБЫЧНЫЕ ТВЕРДЫЕ СОГЛАСНЫЕ: окончание «-y»\n' +
      'Основы на согласные b, d, f, ł, m, n, p, r, s, t, w, z:\n' +
      '  — szkoła -> szkoły (твердый ł)\n' +
      '  — herbata -> herbaty (твердый t)\n' +
      '  — kobieta -> kobiety (твердый t)\n' +
      '  — woda -> wody (твердый d)\n' +
      '  — torba -> torby (твердый b)\n' +
      '  — szafa -> szafy (твердый f)\n' +
      '  — kawa -> kawy (твердый w)',
  },
  {
    title: '4. Базовые исключения (Остатки двойственного числа)',
    content:
      'В древнеславянских языках кроме единственного и множественного числа существовало «двойственное число» (liczba podwójna) ' +
      'для парных предметов (глаза, уши, руки). В современном польском языке эти 4 слова сохранили свои уникальные формы:\n\n' +
      '• dziecko -> dzieci (ребенок -> дети). Относится к категории niemęskoosobowy (małe dzieci, grzeczne dzieci). Окончание -i с чередованием ck -> ci.\n' +
      '• oko -> oczy (глаз -> глаза). Парный орган. Историческое чередование k -> cz с окончанием -y (duże oczy, niebieskie oczy).\n' +
      '• ucho -> uszy (ухо -> уши). Парный орган. Историческое чередование ch -> sz с окончанием -y (małe uszy).\n' +
      '• ręka -> ręce (рука -> руки). Парный орган. Историческое чередование k -> c с окончанием -e (czyste ręce, ciepłe ręce).',
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
    detail: 'Слово okno — среднего рода (to okno). В польском языке абсолютно все существительные среднего рода во множественном числе оканчиваются на -a (okno -> okna).',
  },
  {
    id: 'n-zdjecie',
    singular: 'zdjęcie',
    plural: 'zdjęcia',
    correctEnding: '-a',
    translation: 'фотография',
    ruleExplanation: 'Средний род на -e во мн. числе всегда получает окончание -a.',
    detail: 'Слово zdjęcie — среднего рода (to zdjęcie). Все существительные среднего рода получают во множественном числе окончание -a (zdjęcie -> zdjęcia).',
  },
  {
    id: 'n-lusterko',
    singular: 'lusterko',
    plural: 'lusterka',
    correctEnding: '-a',
    translation: 'зеркальце',
    ruleExplanation: 'Средний род на -o во мн. числе всегда получает окончание -a.',
    detail: 'Несмотря на основу «k», это слово среднего рода (to lusterko), поэтому действует главенствующее правило среднего рода: окончание -a (lusterka), а не -i.',
  },
  {
    id: 'n-mleko',
    singular: 'mleko',
    plural: 'mleka',
    correctEnding: '-a',
    translation: 'молоко / сорта молока',
    ruleExplanation: 'Средний род на -o во мн. числе всегда получает окончание -a.',
    detail: 'Средний род (to mleko) во множественном числе принимает окончание -a (mleka).',
  },
  {
    id: 'n-morze',
    singular: 'morze',
    plural: 'morza',
    correctEnding: '-a',
    translation: 'море',
    ruleExplanation: 'Средний род на -e во мн. числе всегда получает окончание -a.',
    detail: 'Существительное среднего рода (to morze) во множественном числе получает окончание -a (morza).',
  },
  {
    id: 'n-ciasto',
    singular: 'ciasto',
    plural: 'ciasta',
    correctEnding: '-a',
    translation: 'пирог / пирожное',
    ruleExplanation: 'Средний род на -o во мн. числе всегда получает окончание -a.',
    detail: 'Средний род на -o (to ciasto) образует форму множественного числа с окончанием -a (ciasta).',
  },
  {
    id: 'n-jablko',
    singular: 'jabłko',
    plural: 'jabłka',
    correctEnding: '-a',
    translation: 'яблоко',
    ruleExplanation: 'Средний род на -o во мн. числе всегда получает окончание -a.',
    detail: 'Слово среднего рода (to jabłko). Для среднего рода окончание -a всегда имеет приоритет над основой «k» (jabłka, а не jabłki).',
  },
  {
    id: 'n-krzeslo',
    singular: 'krzesło',
    plural: 'krzesła',
    correctEnding: '-a',
    translation: 'стул',
    ruleExplanation: 'Средний род на -o во мн. числе всегда получает окончание -a.',
    detail: 'Слово среднего рода (to krzesło) во множественном числе получает окончание -a (krzesła).',
  },
  {
    id: 'n-auto',
    singular: 'auto',
    plural: 'auta',
    correctEnding: '-a',
    translation: 'автомобиль',
    ruleExplanation: 'Средний род на -o во мн. числе всегда получает окончание -a.',
    detail: 'Слово среднего рода (to auto) во множественном числе получает регулярное окончание -a (auta).',
  },
  {
    id: 'n-mieszkanie',
    singular: 'mieszkanie',
    plural: 'mieszkania',
    correctEnding: '-a',
    translation: 'квартира',
    ruleExplanation: 'Средний род на -e во мн. числе всегда получает окончание -a.',
    detail: 'Отглагольное существительное среднего рода на -e (to mieszkanie). Во множественном числе принимает окончание -a (mieszkania).',
  },

  // Шипящие, отвердевшие и мягкие: -e
  {
    id: 'n-ulica',
    singular: 'ulica',
    plural: 'ulice',
    correctEnding: '-e',
    translation: 'улица',
    ruleExplanation: 'Основа на отвердевший согласный "c" получает окончание -e.',
    detail: 'Буква «c» в польском языке относится к отвердевшим согласным звукам (sz, cz, rz, ż, c, dz). Существительные с такими основами во мн. числе получают окончание -e (ulica -> ulice).',
  },
  {
    id: 'n-kawiarnia',
    singular: 'kawiarnia',
    plural: 'kawiarnie',
    correctEnding: '-e',
    translation: 'кофейня',
    ruleExplanation: 'Основа на мягкое "-ia" получает окончание -e.',
    detail: 'Существительные с мягкими основами на «-ia» во множественном числе niemęskoosobowy получают окончание -e (kawiarnia -> kawiarnie).',
  },
  {
    id: 'n-wieza',
    singular: 'wieża',
    plural: 'wieże',
    correctEnding: '-e',
    translation: 'башня',
    ruleExplanation: 'Основа на шипящий "ż" получает окончание -e.',
    detail: 'Звук «ż» — исторический шипящий. После sz, cz, rz, ż существительные всегда принимают окончание -e (wieża -> wieże).',
  },
  {
    id: 'n-smycz',
    singular: 'smycz',
    plural: 'smycze',
    correctEnding: '-e',
    translation: 'поводок',
    ruleExplanation: 'Основа на шипящий "cz" получает окончание -e.',
    detail: 'Основа оканчивается на шипящий «cz». По правилу после sz, cz, rz, ż пишется окончание -e (smycz -> smycze).',
  },
  {
    id: 'n-restauracja',
    singular: 'restauracja',
    plural: 'restauracje',
    correctEnding: '-e',
    translation: 'ресторан',
    ruleExplanation: 'Основа на "-ja" получает окончание -e.',
    detail: 'Слова на «-ja» во множественном числе принимают окончание -e (restauracja -> restauracje, stacja -> stacje).',
  },
  {
    id: 'n-talerz',
    singular: 'talerz',
    plural: 'talerze',
    correctEnding: '-e',
    translation: 'тарелка',
    ruleExplanation: 'Основа на шипящий диграф "rz" получает окончание -e.',
    detail: 'Диграф «rz» произносится как шипящий [ж/ш]. Существительные мужского рода на шипящие во мн. ч. niemęskoosobowy получают окончание -e (talerz -> talerze).',
  },
  {
    id: 'n-kosz',
    singular: 'kosz',
    plural: 'kosze',
    correctEnding: '-e',
    translation: 'корзина',
    ruleExplanation: 'Основа на шипящий "sz" получает окончание -e.',
    detail: 'Основа слова оканчивается на шипящий «sz». По правилу такие основы получают окончание -e (kosz -> kosze).',
  },
  {
    id: 'n-koszula',
    singular: 'koszula',
    plural: 'koszule',
    correctEnding: '-e',
    translation: 'рубашка',
    ruleExplanation: 'Основа на мягкий "l" получает окончание -e.',
    detail: 'В польском языке согласный «l» исторически является мягким (в отличие от твердого «ł»). Поэтому слова на «l» получают окончание -e (koszula -> koszule).',
  },

  // Основы на K и G: -i
  {
    id: 'n-ksiazka',
    singular: 'książka',
    plural: 'książki',
    correctEnding: '-i',
    translation: 'книга',
    ruleExplanation: 'Основа на "k" всегда требует смягчения буквой -i.',
    detail: 'В польском языке согласные «k» и «g» не сочетаются с твердым «y». Поэтому они всегда получают смягчающее окончание -i (książka -> książki).',
  },
  {
    id: 'n-kubek',
    singular: 'kubek',
    plural: 'kubki',
    correctEnding: '-i',
    translation: 'кружка',
    ruleExplanation: 'Основа на "k" всегда требует смягчения буквой -i.',
    detail: 'Основа слова оканчивается на «k» (беглая гласная «e» выпадает: kubek -> kubk-). Основы на «k» во мн. ч. всегда требуют окончания -i (kubki).',
  },
  {
    id: 'n-bulka',
    singular: 'bułka',
    plural: 'bułki',
    correctEnding: '-i',
    translation: 'булочка',
    ruleExplanation: 'Основа на "k" всегда требует смягчения буквой -i.',
    detail: 'Корень оканчивается на букву «k». Согласные k и g требуют окончания -i (bułka -> bułki).',
  },
  {
    id: 'n-droga',
    singular: 'droga',
    plural: 'drogi',
    correctEnding: '-i',
    translation: 'дорога',
    ruleExplanation: 'Основа на "g" всегда требует смягчения буквой -i.',
    detail: 'Основа оканчивается на заднеязычный согласный «g». В польском языке «g» всегда требует окончания -i (droga -> drogi, noga -> nogi).',
  },
  {
    id: 'n-polka',
    singular: 'półka',
    plural: 'półki',
    correctEnding: '-i',
    translation: 'полка',
    ruleExplanation: 'Основа на "k" требует окончания -i.',
    detail: 'Основа на «k» требует смягчения и окончания -i (półka -> półki).',
  },
  {
    id: 'n-lodowka',
    singular: 'lodówka',
    plural: 'lodówki',
    correctEnding: '-i',
    translation: 'холодильник',
    ruleExplanation: 'Основа на "k" требует окончания -i.',
    detail: 'Суффикс «-ka» оканчивается на букву «k». Поэтому во множественном числе пишется окончание -i (lodówka -> lodówki).',
  },

  // Обычные твердые согласные: -y
  {
    id: 'n-szkola',
    singular: 'szkoła',
    plural: 'szkoły',
    correctEnding: '-y',
    translation: 'школа',
    ruleExplanation: 'Основа на твердый согласный "ł" требует окончания -y.',
    detail: 'Буква «ł» — обычный твердый согласный звук. Все обычные твердые согласные (b, d, f, ł, m, n, p, r, s, t, w, z) получают окончание -y (szkoła -> szkoły).',
  },
  {
    id: 'n-herbata',
    singular: 'herbata',
    plural: 'herbaty',
    correctEnding: '-y',
    translation: 'чай',
    ruleExplanation: 'Основа на твердый согласный "t" требует окончания -y.',
    detail: 'Основа оканчивается на твердый согласный «t». Существительные с твердыми согласными основами во мн. числе получают окончание -y (herbata -> herbaty).',
  },
  {
    id: 'n-kobieta',
    singular: 'kobieta',
    plural: 'kobiety',
    correctEnding: '-y',
    translation: 'женщина',
    ruleExplanation: 'Основа на твердый согласный "t" требует окончания -y.',
    detail: 'Основа оканчивается на твердый звук «t». Обычные твердые согласные принимают окончание -y (kobieta -> kobiety).',
  },
  {
    id: 'n-torba',
    singular: 'torba',
    plural: 'torby',
    correctEnding: '-y',
    translation: 'сумка',
    ruleExplanation: 'Основа на твердый согласный "b" требует окончания -y.',
    detail: 'Основа на обычный твердый согласный «b» получает окончание -y (torba -> torby).',
  },
  {
    id: 'n-woda',
    singular: 'woda',
    plural: 'wody',
    correctEnding: '-y',
    translation: 'вода',
    ruleExplanation: 'Основа на твердый согласный "d" требует окончания -y.',
    detail: 'Основа слова оканчивается на твердый согласный «d». По правилу пишется окончание -y (woda -> wody).',
  },
  {
    id: 'n-kawa',
    singular: 'kawa',
    plural: 'kawy',
    correctEnding: '-y',
    translation: 'кофе (чашки / порции)',
    ruleExplanation: 'Основа на твердый согласный "w" требует окончания -y.',
    detail: 'Основа оканчивается на твердый согласный «w». Твердые согласные получают окончание -y (kawa -> kawy).',
  },

  // Исключения
  {
    id: 'n-dziecko',
    singular: 'dziecko',
    plural: 'dzieci',
    correctEnding: '-i',
    translation: 'ребенок -> дети',
    ruleExplanation: 'Базовое исключение: историческое чередование ck -> ci, окончание -i.',
    detail: 'Слово dziecko образует множественное число dzieci (историческое палатализованное чередование ck -> ci, окончание -i). Грамматически относится к niemęskoosobowy (małe dzieci).',
    isException: true,
  },
  {
    id: 'n-oko',
    singular: 'oko',
    plural: 'oczy',
    correctEnding: '-y',
    translation: 'глаз -> глаза',
    ruleExplanation: 'Базовое исключение: древнее двойственное число, k -> cz, окончание -y.',
    detail: 'Форма oczy — остаток древнеславянского двойственного числа для парных органов. Произошло чередование k -> cz и закрепилось окончание -y (duże oczy, niebieskie oczy).',
    isException: true,
  },
  {
    id: 'n-ucho',
    singular: 'ucho',
    plural: 'uszy',
    correctEnding: '-y',
    translation: 'ухо -> уши',
    ruleExplanation: 'Базовое исключение: древнее двойственное число, ch -> sz, окончание -y.',
    detail: 'Форма uszy — остаток древнеславянского двойственного числа парных органов с переходом согласного ch -> sz и окончанием -y (małe uszy).',
    isException: true,
  },
  {
    id: 'n-reka',
    singular: 'ręka',
    plural: 'ręce',
    correctEnding: '-e',
    translation: 'рука -> руки',
    ruleExplanation: 'Базовое исключение: древнее двойственное число, k -> c, окончание -e.',
    detail: 'Форма ręce — остаток двойственного числа для парных органов. Произошло чередование k -> c с окончанием -e (czyste ręce, ciepłe ręce).',
    isException: true,
  },
];

export const ADJECTIVES_DATA: AdjectiveWord[] = [
  // Дефолт: -e
  {
    id: 'a-nowy',
    singular: 'nowy / nowa',
    plural: 'nowe',
    correctEnding: '-e',
    translation: 'новый / новая',
    ruleExplanation: 'Обычная основа прилагательного получает окончание -e.',
    detail: 'Основа оканчивается на обычный согласный «w». Во множественном числе niemęskoosobowy прилагательные по умолчанию получают окончание -e (nowe szkoły, nowe okna).',
  },
  {
    id: 'a-duzy',
    singular: 'duży / duża',
    plural: 'duże',
    correctEnding: '-e',
    translation: 'большой / большая',
    ruleExplanation: 'Основа на "ż" получает окончание -e.',
    detail: 'Основа прилагательного оканчивается на «ż». По общему правилу прилагательные во мн. ч. niemęskoosobowy принимают окончание -e (duże miasta, duże szafy).',
  },
  {
    id: 'a-maly',
    singular: 'mały / mała',
    plural: 'małe',
    correctEnding: '-e',
    translation: 'маленький / маленькая',
    ruleExplanation: 'Обычная основа на "ł" получает окончание -e.',
    detail: 'Обычная основа на твердый звук «ł». Прилагательное получает дефолтное окончание -e (małe dzieci, małe lusterka).',
  },
  {
    id: 'a-stary',
    singular: 'stary / stara',
    plural: 'stare',
    correctEnding: '-e',
    translation: 'старый / старая',
    ruleExplanation: 'Обычная основа на "r" получает окончание -e.',
    detail: 'Основа на обычный твердый согласный «r». Прилагательное получает окончание -e (stare zdjęcia, stare książki).',
  },
  {
    id: 'a-dobry',
    singular: 'dobry / dobra',
    plural: 'dobre',
    correctEnding: '-e',
    translation: 'хороший / хорошая',
    ruleExplanation: 'Обычная основа получает окончание -e.',
    detail: 'Основа на «r». Прилагательные niemęskoosobowy по умолчанию оканчиваются на -e (dobre restauracje, dobre kawy).',
  },
  {
    id: 'a-bialy',
    singular: 'biały / biała',
    plural: 'białe',
    correctEnding: '-e',
    translation: 'белый / белая',
    ruleExplanation: 'Обычная основа на "ł" получает окончание -e.',
    detail: 'Обычная основа на согласный «ł». Прилагательное получает стандартное окончание -e (białe koszule, białe róże).',
  },
  {
    id: 'a-czarny',
    singular: 'czarny / czarna',
    plural: 'czarne',
    correctEnding: '-e',
    translation: 'черный / черная',
    ruleExplanation: 'Обычная основа на "n" получает окончание -e.',
    detail: 'Основа на обычный согласный «n». Прилагательное принимает регулярное окончание -e (czarne kawy, czarne koty).',
  },
  {
    id: 'a-cieply',
    singular: 'ciepły / ciepła',
    plural: 'ciepłe',
    correctEnding: '-e',
    translation: 'теплый / теплая',
    ruleExplanation: 'Обычная основа получает окончание -e.',
    detail: 'Основа на «ł». Прилагательное принимает дефолтное окончание -e (ciepłe herbaty, ciepłe ręce).',
  },
  {
    id: 'a-zimny',
    singular: 'zimny / zimna',
    plural: 'zimne',
    correctEnding: '-e',
    translation: 'холодный / холодная',
    ruleExplanation: 'Обычная основа получает окончание -e.',
    detail: 'Основа на «n». Прилагательное принимает регулярное окончание -e (zimne воды, zimne zupy).',
  },
  {
    id: 'a-smaczny',
    singular: 'smaczny / smaczna',
    plural: 'smaczne',
    correctEnding: '-e',
    translation: 'вкусный / вкусная',
    ruleExplanation: 'Обычная основа получает окончание -e.',
    detail: 'Основа на «n». Прилагательное niemęskoosobowy получает окончание -e (smaczne jabłka, smaczne bułki).',
  },
  {
    id: 'a-piekny',
    singular: 'piękny / piękna',
    plural: 'piękne',
    correctEnding: '-e',
    translation: 'красивый / красивая',
    ruleExplanation: 'Обычная основа получает окончание -e.',
    detail: 'Основа на «n». Прилагательное принимает стандартное окончание -e (piękne kawiarnie, piękne miasta).',
  },

  // После k и g: -ie
  {
    id: 'a-drogi',
    singular: 'drogi / droga',
    plural: 'drogie',
    correctEnding: '-ie',
    translation: 'дорогой / дорогая',
    ruleExplanation: 'Основа на "g" требует окончания -ie.',
    detail: 'Корень прилагательного оканчивается на «g». В польском языке буквы k и g перед окончанием множественного числа всегда требуют «i» (drogie książki, drogie ubrania).',
  },
  {
    id: 'a-wysoki',
    singular: 'wysoki / wysoka',
    plural: 'wysokie',
    correctEnding: '-ie',
    translation: 'высокий / высокая',
    ruleExplanation: 'Основа на "k" требует окончания -ie.',
    detail: 'Корень оканчивается на «k». В форме множественного числа niemęskoosobowy после k пишется окончание -ie (wysokie wieże, wysokie góry).',
  },
  {
    id: 'a-niski',
    singular: 'niski / niska',
    plural: 'niskie',
    correctEnding: '-ie',
    translation: 'низкий / низкая',
    ruleExplanation: 'Основа на "k" требует окончания -ie.',
    detail: 'Корень на «k». Прилагательные с основой на k получают окончание -ie (niskie półki, niskie ceny).',
  },
  {
    id: 'a-polski',
    singular: 'polski / polska',
    plural: 'polskie',
    correctEnding: '-ie',
    translation: 'польский / польская',
    ruleExplanation: 'Основа на "k" требует окончания -ie.',
    detail: 'Суффикс «-sk-» оканчивается на «k». Прилагательные на -ski получают окончание -skie (polskie miasta, polskie piosenki).',
  },
  {
    id: 'a-dlugi',
    singular: 'długi / długa',
    plural: 'długie',
    correctEnding: '-ie',
    translation: 'длинный / длинная',
    ruleExplanation: 'Основа на "g" требует окончания -ie.',
    detail: 'Основа оканчивается на «g». После k и g пишется окончание -ie (długie ulice, długie drogi).',
  },
  {
    id: 'a-krotki',
    singular: 'krótki / krótka',
    plural: 'krótkie',
    correctEnding: '-ie',
    translation: 'короткий / короткая',
    ruleExplanation: 'Основа на "k" требует окончания -ie.',
    detail: 'Основа оканчивается на «k». Обязательно пишется окончание -ie (krótkie lekcje, krótkie spódnice).',
  },
  {
    id: 'a-szybki',
    singular: 'szybki / szybka',
    plural: 'szybkie',
    correctEnding: '-ie',
    translation: 'быстрый / быстрая',
    ruleExplanation: 'Основа на "k" требует окончания -ie.',
    detail: 'Основа оканчивается на «k». После k пишется окончание -ie (szybkie auta, szybkie pociągi).',
  },
  {
    id: 'a-szeroki',
    singular: 'szeroki / szeroka',
    plural: 'szerokie',
    correctEnding: '-ie',
    translation: 'широкий / широкая',
    ruleExplanation: 'Основа на "k" требует окончания -ie.',
    detail: 'Основа на «k» требует окончания -ie (szerokie drogi, szerokie ulice).',
  },
];

export const PHRASES_DATA: PhraseItem[] = [
  {
    id: 'p-nowa-szkola',
    adjSingular: 'nowa',
    adjEnding: '-e',
    adjExplanation: 'nowa: обычная основа прил. на "w" -> -e',
    nounSingular: 'szkoła',
    nounEnding: '-y',
    nounExplanation: 'szkoła: твердая согласная основа "ł" -> -y',
    translation: 'новая школа',
    fullPlural: 'nowe szkoły',
  },
  {
    id: 'p-dluga-ulica',
    adjSingular: 'długa',
    adjEnding: '-ie',
    adjExplanation: 'długa: основа прил. на "g" требует -ie',
    nounSingular: 'ulica',
    nounEnding: '-e',
    nounExplanation: 'ulica: основа сущ. на отвердевший "c" -> -e',
    translation: 'длинная улица',
    fullPlural: 'długie ulice',
  },
  {
    id: 'p-duze-okno',
    adjSingular: 'duże',
    adjEnding: '-e',
    adjExplanation: 'duże: основа прил. на "ż" -> -e',
    nounSingular: 'okno',
    nounEnding: '-a',
    nounExplanation: 'okno: средний род на -o во мн. ч. всегда получает -a',
    translation: 'большое окно',
    fullPlural: 'duże okna',
  },
  {
    id: 'p-ciepla-herbata',
    adjSingular: 'ciepła',
    adjEnding: '-e',
    adjExplanation: 'ciepła: обычная основа прил. -> -e',
    nounSingular: 'herbata',
    nounEnding: '-y',
    nounExplanation: 'herbata: твердая основа "t" -> -y',
    translation: 'горячий чай',
    fullPlural: 'ciepłe herbaty',
  },
  {
    id: 'p-droga-ksiazka',
    adjSingular: 'droga',
    adjEnding: '-ie',
    adjExplanation: 'droga: основа прил. на "g" требует -ie',
    nounSingular: 'książka',
    nounEnding: '-i',
    nounExplanation: 'książka: основа сущ. на "k" требует смягчения -i',
    translation: 'дорогая книга',
    fullPlural: 'drogie książki',
  },
  {
    id: 'p-smaczne-jablko',
    adjSingular: 'smaczne',
    adjEnding: '-e',
    adjExplanation: 'smaczne: обычная основа прил. -> -e',
    nounSingular: 'jabłko',
    nounEnding: '-a',
    nounExplanation: 'jabłko: средний род на -o во мн. ч. всегда получает -a',
    translation: 'вкусное яблоко',
    fullPlural: 'smaczne jabłka',
  },
  {
    id: 'p-czarna-kawa',
    adjSingular: 'czarna',
    adjEnding: '-e',
    adjExplanation: 'czarna: обычная основа прил. -> -e',
    nounSingular: 'kawa',
    nounEnding: '-y',
    nounExplanation: 'kawa: твердая основа "w" -> -y',
    translation: 'черный кофе',
    fullPlural: 'czarne kawy',
  },
  {
    id: 'p-wysoka-wieza',
    adjSingular: 'wysoka',
    adjEnding: '-ie',
    adjExplanation: 'wysoka: основа прил. на "k" требует -ie',
    nounSingular: 'wieża',
    nounEnding: '-e',
    nounExplanation: 'wieża: шипящая основа "ż" -> -e',
    translation: 'высокая башня',
    fullPlural: 'wysokie wieże',
  },
  {
    id: 'p-piekna-kawiarnia',
    adjSingular: 'piękna',
    adjEnding: '-e',
    adjExplanation: 'piękna: обычная основа прил. -> -e',
    nounSingular: 'kawiarnia',
    nounEnding: '-e',
    nounExplanation: 'kawiarnia: мягкая основа на "-ia" -> -e',
    translation: 'красивая кофейня',
    fullPlural: 'piękne kawiarnie',
  },
  {
    id: 'p-swieza-bulka',
    adjSingular: 'świeża',
    adjEnding: '-e',
    adjExplanation: 'świeża: основа прил. на "ż" -> -e',
    nounSingular: 'bułka',
    nounEnding: '-i',
    nounExplanation: 'bułka: основа сущ. на "k" требует смягчения -i',
    translation: 'свежая булочка',
    fullPlural: 'świeże bułki',
  },
  {
    id: 'p-male-dziecko',
    adjSingular: 'małe',
    adjEnding: '-e',
    adjExplanation: 'małe: обычная основа прил. -> -e',
    nounSingular: 'dziecko',
    nounEnding: '-i',
    nounExplanation: 'dziecko -> dzieci: базовое исключение (окончание -i)',
    translation: 'маленький ребенок',
    fullPlural: 'małe dzieci',
    isException: true,
  },
  {
    id: 'p-niebieskie-oko',
    adjSingular: 'niebieskie',
    adjEnding: '-ie',
    adjExplanation: 'niebieskie: основа прил. на "k" требует -ie',
    nounSingular: 'oko',
    nounEnding: '-y',
    nounExplanation: 'oko -> oczy: базовое исключение (двойственное число, k -> cz, окончание -y)',
    translation: 'голубой глаз',
    fullPlural: 'niebieskie oczy',
    isException: true,
  },
];

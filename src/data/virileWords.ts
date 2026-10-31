import type { VirileNounWord } from '../types';

export interface VirileAlgorithmStep {
  step: number;
  condition: string;
  ending: '-owie' | '-e' | '-y' | '-i';
  ruleHint?: string;
  examples: { sg: string; pl: string }[];
}

export const VIRILE_ALGORITHM_STEPS: VirileAlgorithmStep[] = [
  {
    step: 1,
    condition: 'Семья, титулы и статус',
    ending: '-owie',
    ruleHint: 'Корень не меняется',
    examples: [
      { sg: 'pan', pl: 'panowie' },
      { sg: 'ojciec', pl: 'ojcowie' },
      { sg: 'król', pl: 'królowie' },
      { sg: 'profesor', pl: 'profesorowie' },
    ],
  },
  {
    step: 2,
    condition: 'Шипящие, мягкие (l, j, ć, ń) и -anin',
    ending: '-e',
    ruleHint: 'Корень не меняется (просто +e)',
    examples: [
      { sg: 'lekarz', pl: 'lekarze' },
      { sg: 'nauczyciel', pl: 'nauczyciele' },
      { sg: 'gość', pl: 'goście' },
      { sg: 'Amerykanin', pl: 'Amerykanie' },
    ],
  },
  {
    step: 3,
    condition: 'Четверка k, g, r, c (суффиксы -ec, -ca)',
    ending: '-y',
    ruleHint: 'k → cy • g → dzy • r → rzy • -ec/-ca → -cy',
    examples: [
      { sg: 'Polak', pl: 'Polacy' },
      { sg: 'kolega', pl: 'koledzy' },
      { sg: 'aktor', pl: 'aktorzy' },
      { sg: 'chłopiec', pl: 'chłopcy' },
    ],
  },
  {
    step: 4,
    condition: 'Все остальные твердые согласные',
    ending: '-i',
    ruleHint: 't → ci • d → dzi • st → ści • ch → si • z → zi',
    examples: [
      { sg: 'student', pl: 'studenci' },
      { sg: 'sąsiad', pl: 'sąsiedzi' },
      { sg: 'artysta', pl: 'artyści' },
      { sg: 'Włoch', pl: 'Włosi' },
    ],
  },
];

export const VIRILE_TRAPS = [
  {
    title: '3 главных исключения',
    description:
      'człowiek → ludzie (полная смена корня), brat → bracia (окончание -a), ksiądz → księża.',
  },
  {
    title: 'Двойные варианты званий',
    description:
      'У многих титулов и профессий допустимы оба окончания: profesorowie / profesorzy, doktorowie / doktorzy, inżynierowie / inżynierzy.',
  },
];

export const VIRILE_RULES_SHORT = [
  {
    category: '1. Окончание -owie (Родство, титулы, почет)',
    ending: '-owie',
    badge: '-owie',
    color: 'amber',
    target: 'Степени родства, звания, почетные должности, фамилии',
    rule: 'Окончание -owie определяется значением слова: семейные узы, почетные статусы и звания.',
    caution: 'Примеры: pan → panowie, ojciec → ojcowie, syn → synowie, mąż → mężowie, król → królowie, profesor → profesorowie.',
    examples: [
      { sg: 'pan', pl: 'panowie' },
      { sg: 'ojciec', pl: 'ojcowie' },
      { sg: 'syn', pl: 'synowie' },
      { sg: 'mąż', pl: 'mężowie' },
      { sg: 'profesor', pl: 'profesorowie' },
      { sg: 'król', pl: 'królowie' },
    ],
  },
  {
    category: '2. Окончание -i (Смягчение твердых согласных)',
    ending: '-i',
    badge: '-i',
    color: 'purple',
    target: 'Основы на твердые согласные (t, d, st, ch, z, n, s, ł)',
    rule: 'Твердые согласные перед окончанием -i смягчаются: t → ci, d → dzi, st → ści, ch → si, z → zi, n → ni, ł → li.',
    caution: 'Чередования: student → studenci (t → ci), sąsiad → sąsiedzi (d → dzi), artysta → artyści (st → ści), Włoch → Włosi (ch → si).',
    examples: [
      { sg: 'student', pl: 'studenci' },
      { sg: 'sąsiad', pl: 'sąsiedzi' },
      { sg: 'artysta', pl: 'artyści' },
      { sg: 'programista', pl: 'programiści' },
      { sg: 'Włoch', pl: 'Włosi' },
      { sg: 'Francuz', pl: 'Francuzi' },
    ],
  },
  {
    category: '3. Окончание -y (Чередования k, g, r и суффиксы -ec, -ca)',
    ending: '-y',
    badge: '-y',
    color: 'sky',
    target: 'Основы на k (→ cy), g (→ dzy), r (→ rzy) и слова на -ec, -ca',
    rule: 'Буквы k, g, r чередуются: k → cy, g → dzy, r → rzy. Суффиксы: -ec → -cy (беглое e выпадает), -ca → -cy.',
    caution: 'Примеры: Polak → Polacy (k → cy), kolega → koledzy (g → dzy), aktor → aktorzy (r → rzy), chłopiec → chłopcy, kierowca → kierowcy.',
    examples: [
      { sg: 'Polak', pl: 'Polacy' },
      { sg: 'muzyk', pl: 'muzycy' },
      { sg: 'kolega', pl: 'koledzy' },
      { sg: 'aktor', pl: 'aktorzy' },
      { sg: 'chłopiec', pl: 'chłopcy' },
      { sg: 'kierowca', pl: 'kierowcy' },
    ],
  },
  {
    category: '4. Окончание -e (Мягкие, шипящие и суффикс -anin)',
    ending: '-e',
    badge: '-e',
    color: 'emerald',
    target: 'Основы на мягкие (l, j, ć, ń), шипящие (rz, sz, cz, ż) и жители/нации на -anin',
    rule: 'Мягкие и шипящие согласные не требуют чередований и получают окончание -e. Суффикс -anin переходит в -anie.',
    caution: 'Примеры: nauczyciel → nauczyciele (l), lekarz → lekarze (rz), złodziej → złodzieje (j), Amerykanin → Amerykanie (-anin → -anie).',
    examples: [
      { sg: 'nauczyciel', pl: 'nauczyciele' },
      { sg: 'lekarz', pl: 'lekarze' },
      { sg: 'pisarz', pl: 'pisarze' },
      { sg: 'listonosz', pl: 'listonosze' },
      { sg: 'gracz', pl: 'gracze' },
      { sg: 'Amerykanin', pl: 'Amerykanie' },
    ],
  },
  {
    category: '5. Исключения (Nieregularne)',
    ending: 'Искл.',
    badge: 'Исключения',
    color: 'yellow',
    target: 'Супплетивные и исторические формы',
    rule: 'Несколько базовых слов меняют основу или имеют уникальные исторические формы:',
    caution: 'człowiek → ludzie (полная замена корня), brat → bracia (особое окончание -a), ksiądz → księża.',
    examples: [
      { sg: 'człowiek', pl: 'ludzie' },
      { sg: 'brat', pl: 'bracia' },
      { sg: 'ksiądz', pl: 'księża' },
    ],
  },
];

export const VIRILE_RULES_LONG = [
  {
    title: '1. Понятие категории «Rodzaj męskoosobowy» (Лично-мужской род)',
    content:
      'В польском языке во множественном числе (Mianownik l. mn. — Именительный падеж) грамматика делит все слова на две категории:\n\n' +
      '1) Rodzaj męskoosobowy (местоимения «oni / ci») — группы, в которых есть хотя бы один мужчина:\n' +
      '   • мужчины по профессии, национальности, роли (panowie, studenci, Polacy, lekarze);\n' +
      '   • смешанные группы людей (studenci = студенты и студентки, rodzice = родители, Polacy = поляки);\n' +
      '   • согласуются с прилагательными на -i / -y (dobrzy studenci, mądrzy profesorowie).\n\n' +
      '2) Rodzaj niemęskoosobowy (местоимения «one / te») — все остальные объекты мира (женщины, дети, животные, вещи).\n\n' +
      'В лично-мужском роде окончание существительного выбирается из 4 основных вариантов: -owie, -i, -y, -e.',
  },
  {
    title: '2. Четыре окончания и их логика (-owie, -i, -y, -e)',
    content:
      '1) ОКОНЧАНИЕ «-owie» — семантическое (по смыслу слова):\n' +
      '   • Степени родства: ojciec → ojcowie, syn → synowie, mąż → mężowie, dziadek → dziadkowie, wuj → wujowie, teść → teściowie.\n' +
      '   • Титулы, звания и почетные посты: król → królowie, profesor → profesorowie, inżynier → inżynierowie, generał → generałowie, minister → ministrowie, pan → panowie.\n' +
      '   • Фамилии: Nowak → Nowakowie.\n' +
      '   • Некоторые краткие названия национальностей: Arab → Arabowie, Belg → Belgowie, Fin → Finowie.\n\n' +
      '2) ОКОНЧАНИЕ «-i» — со смягчением твердых согласных:\n' +
      '   Твердый согласный основы перед -i обязательно палатализуется (смягчается):\n' +
      '   • t → ci: student → studenci, klient → klienci, poeta → poeci\n' +
      '   • d → dzi: sąsiad → sąsiedzi, inwalida → inwalidzi, Szwed → Szwedzi\n' +
      '   • st → ści: artysta → artyści, programista → programiści, turysta → turyści\n' +
      '   • ch → si: Włoch → Włosi, Czech → Czesi, mnich → mnisi\n' +
      '   • z → zi: Francuz → Francuzi\n' +
      '   • n → ni: kapitan → kapitani, blondyn → blondyni, mężczyzna → mężczyźni\n' +
      '   • ł → li: anioł → anieli / aniołowie\n\n' +
      '3) ОКОНЧАНИЕ «-y» — чередования k, g, r и суффиксы -ec, -ca:\n' +
      '   • k → cy: Polak → Polacy, muzyk → muzycy, fizyk → fizycy, prawnik → prawnicy, Anglik → Anglicy\n' +
      '   • g → dzy: kolega → koledzy, pedagog → pedagodzy, filolog → filolodzy, chirurg → chirurdzy\n' +
      '   • r → rzy: aktor → aktorzy, autor → autorzy, trener → trenerzy, kelner → kelnerzy, partner → partnerzy\n' +
      '   • суффикс -ec → -cy (беглое e выпадает): chłopiec → chłopcy, Niemiec → Niemcy, cudzoziemiec → cudzoziemcy\n' +
      '   • суффикс -ca → -cy: kierowca → kierowcy, doradca → doradcy, sprzedawca → sprzedawcy\n\n' +
      '4) ОКОНЧАНИЕ «-e» — мягкие, шипящие основы и суффикс -anin:\n' +
      '   • мягкие (l, j, ć, ń): nauczyciel → nauczyciele (буква l — мягкая!), złodziej → złodzieje, gość → goście\n' +
      '   • шипящие и отвердевшие (rz, sz, cz, ż): lekarz → lekarze, pisarz → pisarze, listonosz → listonosze, gracz → gracze, żołnierz → żołnierze\n' +
      '   • жители и национальности на -anin: суффикс -in отбрасывается: Amerykanin → Amerykanie, Rosjanin → Rosjanie, Hiszpan → Hiszpanie.',
  },
  {
    title: '3. Сводная таблица чередований согласных (Alternacje spółgłoskowe)',
    content:
      'Запомните ключевые пары переходов в лично-мужском роде:\n\n' +
      '  t  → ci     (student → studenci, klient → klienci)\n' +
      '  d  → dzi    (sąsiad → sąsiedzi, Szwed → Szwedzi)\n' +
      '  st → ści    (artysta → artyści, programista → programiści)\n' +
      '  ch → si     (Włoch → Włosi, Czech → Czesi)\n' +
      '  k  → cy     (Polak → Polacy, muzyk → muzycy)\n' +
      '  g  → dzy    (kolega → koledzy, pedagog → pedagodzy)\n' +
      '  r  → rzy    (aktor → aktorzy, trener → trenerzy)\n' +
      '  -ec → -cy   (chłopiec → chłopcy, Niemiec → Niemcy)\n' +
      '  -ca → -cy   (kierowca → kierowcy, doradca → doradcy)\n' +
      '  -anin → -anie (Amerykanin → Amerykanie, Rosjanin → Rosjanie)',
  },
  {
    title: '4. Исключения и супплетивные формы',
    content:
      'Важнейшие исключения, которые нужно выучить наизусть:\n\n' +
      '• człowiek → LUDZIE (человек → люди, супплетивизм — полная смена корня);\n' +
      '• brat → BRACIA (брат → братья, историческое окончание -a);\n' +
      '• ksiądz → KSIĘŻA (священник → священники);\n' +
      '• przyjaciel → PRZYJACIELE (друг → друзья, мягкая основа на l).',
  },
];

export const VIRILE_NOUNS_DATA: VirileNounWord[] = [
  // 1. Окончание -i (палатализация твердых согласных)
  {
    id: 'v-student',
    singular: 'student',
    plural: 'studenci',
    correctEnding: '-i',
    translation: 'студент',
    ruleExplanation: 'Чередование t → ci перед окончанием -i: student → studenci.',
    detail: 'Слово student оканчивается на твердый согласный «t». В лично-мужском роде t смягчается в «ci» перед окончанием -i: student → studenci.',
    alternation: 't → ci',
  },
  {
    id: 'v-sasiad',
    singular: 'sąsiad',
    plural: 'sąsiedzi',
    correctEnding: '-i',
    translation: 'сосед',
    ruleExplanation: 'Чередование d → dzi и a → e перед окончанием -i: sąsiad → sąsiedzi.',
    detail: 'Слово sąsiad оканчивается на твердый согласный «d». В лично-мужском роде d переходит в «dzi», а корневое ą/a чередуется с e: sąsiad → sąsiedzi.',
    alternation: 'd → dzi',
  },
  {
    id: 'v-artysta',
    singular: 'artysta',
    plural: 'artyści',
    correctEnding: '-i',
    translation: 'артист / художник',
    ruleExplanation: 'Чередование st → ści перед окончанием -i: artysta → artyści.',
    detail: 'Основа на «st» смягчается в «ści» перед окончанием -i: artysta → artyści.',
    alternation: 'st → ści',
  },
  {
    id: 'v-programista',
    singular: 'programista',
    plural: 'programiści',
    correctEnding: '-i',
    translation: 'программист',
    ruleExplanation: 'Чередование st → ści перед окончанием -i: programista → programiści.',
    detail: 'Слова на -ista смягчают группу согласных st в «ści» перед окончанием -i: programista → programiści.',
    alternation: 'st → ści',
  },
  {
    id: 'v-turysta',
    singular: 'turysta',
    plural: 'turyści',
    correctEnding: '-i',
    translation: 'турист',
    ruleExplanation: 'Чередование st → ści перед окончанием -i: turysta → turyści.',
    detail: 'Группа согласных st смягчается в «ści» перед окончанием -i: turysta → turyści.',
    alternation: 'st → ści',
  },
  {
    id: 'v-klient',
    singular: 'klient',
    plural: 'klienci',
    correctEnding: '-i',
    translation: 'клиент',
    ruleExplanation: 'Чередование t → ci перед окончанием -i: klient → klienci.',
    detail: 'Твердый согласный «t» перед окончанием -i смягчается в «ci»: klient → klienci.',
    alternation: 't → ci',
  },
  {
    id: 'v-wloch',
    singular: 'Włoch',
    plural: 'Włosi',
    correctEnding: '-i',
    translation: 'итальянец',
    ruleExplanation: 'Чередование ch → si перед окончанием -i: Włoch → Włosi.',
    detail: 'Твердый согласный «ch» в лично-мужском роде смягчается в «si»: Włoch → Włosi.',
    alternation: 'ch → si',
  },
  {
    id: 'v-czech',
    singular: 'Czech',
    plural: 'Czesi',
    correctEnding: '-i',
    translation: 'чех',
    ruleExplanation: 'Чередование ch → si перед окончанием -i: Czech → Czesi.',
    detail: 'Согласный «ch» смягчается в «si» перед окончанием -i: Czech → Czesi.',
    alternation: 'ch → si',
  },
  {
    id: 'v-francuz',
    singular: 'Francuz',
    plural: 'Francuzi',
    correctEnding: '-i',
    translation: 'француз',
    ruleExplanation: 'Смягчение z → zi перед окончанием -i: Francuz → Francuzi.',
    detail: 'Согласный «z» смягчается перед окончанием -i: Francuz → Francuzi.',
    alternation: 'z → zi',
  },
  {
    id: 'v-szwed',
    singular: 'Szwed',
    plural: 'Szwedzi',
    correctEnding: '-i',
    translation: 'швед',
    ruleExplanation: 'Чередование d → dzi перед окончанием -i: Szwed → Szwedzi.',
    detail: 'Твердый согласный «d» смягчается в «dzi»: Szwed → Szwedzi.',
    alternation: 'd → dzi',
  },
  {
    id: 'v-mezczyzna',
    singular: 'mężczyzna',
    plural: 'mężczyźni',
    correctEnding: '-i',
    translation: 'мужчина',
    ruleExplanation: 'Смягчение n → ni перед окончанием -i: mężczyzna → mężczyźni.',
    detail: 'Твердый согласный «n» смягчается в мягкий «ni» перед окончанием -i: mężczyzna → mężczyźni.',
    alternation: 'n → ni',
  },

  // 2. Окончание -y (чередования k, g, r и суффиксы -ec, -ca)
  {
    id: 'v-polak',
    singular: 'Polak',
    plural: 'Polacy',
    correctEnding: '-y',
    translation: 'поляк',
    ruleExplanation: 'Чередование k → cy с окончанием -y: Polak → Polacy.',
    detail: 'Согласный «k» в лично-мужском роде всегда чередуется в «c», принимая окончание -y: Polak → Polacy.',
    alternation: 'k → cy',
  },
  {
    id: 'v-muzyk',
    singular: 'muzyk',
    plural: 'muzycy',
    correctEnding: '-y',
    translation: 'музыкант',
    ruleExplanation: 'Чередование k → cy с окончанием -y: muzyk → muzycy.',
    detail: 'Конечный «k» основы переходит в «c» с окончанием -y: muzyk → muzycy.',
    alternation: 'k → cy',
  },
  {
    id: 'v-prawnik',
    singular: 'prawnik',
    plural: 'prawnicy',
    correctEnding: '-y',
    translation: 'юрист',
    ruleExplanation: 'Чередование k → cy с окончанием -y: prawnik → prawnicy.',
    detail: 'Основа на «k» переходит в «cy»: prawnik → prawnicy.',
    alternation: 'k → cy',
  },
  {
    id: 'v-kolega',
    singular: 'kolega',
    plural: 'koledzy',
    correctEnding: '-y',
    translation: 'коллега / друг',
    ruleExplanation: 'Чередование g → dzy с окончанием -y: kolega → koledzy.',
    detail: 'Согласный «g» в лично-мужском роде переходит в «dz» с окончанием -y: kolega → koledzy.',
    alternation: 'g → dzy',
  },
  {
    id: 'v-pedagog',
    singular: 'pedagog',
    plural: 'pedagodzy',
    correctEnding: '-y',
    translation: 'педагог',
    ruleExplanation: 'Чередование g → dzy с окончанием -y: pedagog → pedagodzy.',
    detail: 'Конечный «g» основы чередуется в «dz» перед окончанием -y: pedagog → pedagodzy.',
    alternation: 'g → dzy',
  },
  {
    id: 'v-aktor',
    singular: 'aktor',
    plural: 'aktorzy',
    correctEnding: '-y',
    translation: 'актер',
    ruleExplanation: 'Чередование r → rzy с окончанием -y: aktor → aktorzy.',
    detail: 'Твердый согласный «r» в лично-мужском роде переходит в «rz» с окончанием -y: aktor → aktorzy.',
    alternation: 'r → rzy',
  },
  {
    id: 'v-trener',
    singular: 'trener',
    plural: 'trenerzy',
    correctEnding: '-y',
    translation: 'тренер',
    ruleExplanation: 'Чередование r → rzy с окончанием -y: trener → trenerzy.',
    detail: 'Согласный «r» переходит в диграф «rz» с окончанием -y: trener → trenerzy.',
    alternation: 'r → rzy',
  },
  {
    id: 'v-chlopiec',
    singular: 'chłopiec',
    plural: 'chłopcy',
    correctEnding: '-y',
    translation: 'мальчик',
    ruleExplanation: 'Суффикс -ec → -cy (беглое e выпадает, окончание -y): chłopiec → chłopcy.',
    detail: 'Слова на суффикс «-ec» теряют беглую гласную «e» и получают окончание -y: chłopiec → chłopcy.',
    alternation: '-ec → -cy',
  },
  {
    id: 'v-niemiec',
    singular: 'Niemiec',
    plural: 'Niemcy',
    correctEnding: '-y',
    translation: 'немец',
    ruleExplanation: 'Суффикс -ec → -cy: Niemiec → Niemcy.',
    detail: 'Беглая гласная «e» выпадает, основа принимает окончание -y: Niemiec → Niemcy.',
    alternation: '-ec → -cy',
  },
  {
    id: 'v-kierowca',
    singular: 'kierowca',
    plural: 'kierowcy',
    correctEnding: '-y',
    translation: 'водитель',
    ruleExplanation: 'Суффикс -ca → -cy: kierowca → kierowcy.',
    detail: 'Существительные мужского рода на суффикс «-ca» во множественном числе принимают окончание -y: kierowca → kierowcy.',
    alternation: '-ca → -cy',
  },

  // 3. Окончание -e (мягкие, шипящие и суффикс -anin)
  {
    id: 'v-nauczyciel',
    singular: 'nauczyciel',
    plural: 'nauczyciele',
    correctEnding: '-e',
    translation: 'учитель',
    ruleExplanation: 'Мягкая основа на «l» получает окончание -e: nauczyciel → nauczyciele.',
    detail: 'В польском языке согласный «l» является мягким, поэтому существительное принимает окончание -e: nauczyciel → nauczyciele.',
  },
  {
    id: 'v-lekarz',
    singular: 'lekarz',
    plural: 'lekarze',
    correctEnding: '-e',
    translation: 'врач',
    ruleExplanation: 'Основа на шипящий «rz» получает окончание -e: lekarz → lekarze.',
    detail: 'Слово lekarz оканчивается на шипящий диграф «rz». После шипящих пишется окончание -e: lekarz → lekarze.',
  },
  {
    id: 'v-pisarz',
    singular: 'pisarz',
    plural: 'pisarze',
    correctEnding: '-e',
    translation: 'писатель',
    ruleExplanation: 'Основа на шипящий «rz» получает окончание -e: pisarz → pisarze.',
    detail: 'Шипящая основа на «rz» во множественном числе принимает окончание -e: pisarz → pisarze.',
  },
  {
    id: 'v-listonosz',
    singular: 'listonosz',
    plural: 'listonosze',
    correctEnding: '-e',
    translation: 'почтальон',
    ruleExplanation: 'Основа на шипящий «sz» получает окончание -e: listonosz → listonosze.',
    detail: 'Основа на шипящий «sz» принимает окончание -e: listonosz → listonosze.',
  },
  {
    id: 'v-gracz',
    singular: 'gracz',
    plural: 'gracze',
    correctEnding: '-e',
    translation: 'игрок',
    ruleExplanation: 'Основа на шипящий «cz» получает окончание -e: gracz → gracze.',
    detail: 'Шипящий согласный «cz» во множественном числе требует окончания -e: gracz → gracze.',
  },
  {
    id: 'v-zlodziej',
    singular: 'złodziej',
    plural: 'złodzieje',
    correctEnding: '-e',
    translation: 'вор',
    ruleExplanation: 'Мягкая основа на «j» получает окончание -e: złodziej → złodzieje.',
    detail: 'Мягкий согласный «j» требует окончания -e: złodziej → złodzieje.',
  },
  {
    id: 'v-amerykanin',
    singular: 'Amerykanin',
    plural: 'Amerykanie',
    correctEnding: '-e',
    translation: 'американец',
    ruleExplanation: 'Суффикс -anin переходит в -anie (отбрасывается -in, окончание -e): Amerykanin → Amerykanie.',
    detail: 'Названия жителей и национальностей на суффикс «-anin» во множественном числе теряют «-in» и получают окончание -e: Amerykanin → Amerykanie.',
    alternation: '-anin → -anie',
  },
  {
    id: 'v-rosjanin',
    singular: 'Rosjanin',
    plural: 'Rosjanie',
    correctEnding: '-e',
    translation: 'россиянин',
    ruleExplanation: 'Суффикс -anin → -anie: Rosjanin → Rosjanie.',
    detail: 'Суффикс «-anin» отбрасывает элемент «-in» и принимает окончание -e: Rosjanin → Rosjanie.',
    alternation: '-anin → -anie',
  },

  // 4. Окончание -owie (родство, титулы, звания)
  {
    id: 'v-pan',
    singular: 'pan',
    plural: 'panowie',
    correctEnding: '-owie',
    translation: 'господин',
    ruleExplanation: 'Семантическое окончание вежливости и статуса: pan → panowie.',
    detail: 'Слово pan как обращение и статусное обозначение принимает окончание -owie: pan → panowie.',
  },
  {
    id: 'v-ojciec',
    singular: 'ojciec',
    plural: 'ojcowie',
    correctEnding: '-owie',
    translation: 'отец',
    ruleExplanation: 'Степень родства требует окончания -owie: ojciec → ojcowie.',
    detail: 'Обозначение степени родства в семье требует окончания -owie: ojciec → ojcowie.',
  },
  {
    id: 'v-syn',
    singular: 'syn',
    plural: 'synowie',
    correctEnding: '-owie',
    translation: 'сын',
    ruleExplanation: 'Степень родства требует окончания -owie: syn → synowie.',
    detail: 'Слова, обозначающие родственников мужского пола, принимают окончание -owie: syn → synowie.',
  },
  {
    id: 'v-maz',
    singular: 'mąż',
    plural: 'mężowie',
    correctEnding: '-owie',
    translation: 'муж',
    ruleExplanation: 'Степень родства требует окончания -owie (с чередованием ą → ę): mąż → mężowie.',
    detail: 'Родственный статус требует окончания -owie. Корневая гласная ą переходит в ę: mąż → mężowie.',
  },
  {
    id: 'v-profesor',
    singular: 'profesor',
    plural: 'profesorowie',
    correctEnding: '-owie',
    translation: 'профессор',
    ruleExplanation: 'Почетное научное звание требует окончания -owie: profesor → profesorowie.',
    detail: 'Звания и высокие научные должности обычно принимают статусное окончание -owie: profesor → profesorowie.',
  },
  {
    id: 'v-krol',
    singular: 'król',
    plural: 'królowie',
    correctEnding: '-owie',
    translation: 'король',
    ruleExplanation: 'Монарший титул требует окончания -owie: król → królowie.',
    detail: 'Титулы правителей и почетных лиц принимают окончание -owie: król → królowie.',
  },

  // 5. Исключения (Nieregularne)
  {
    id: 'v-czlowiek',
    singular: 'człowiek',
    plural: 'ludzie',
    correctEnding: '-e',
    translation: 'человек → люди',
    ruleExplanation: 'Супплетивизм: полная замена корня człowiek → ludzie.',
    detail: 'Слово człowiek во множественном числе образует супплетивную форму с другим корнем: ludzie (окончание -e).',
    isException: true,
  },
  {
    id: 'v-brat',
    singular: 'brat',
    plural: 'bracia',
    correctEnding: '-i',
    translation: 'брат → братья',
    ruleExplanation: 'Историческая особая форма: brat → bracia.',
    detail: 'Слово brat во множественном числе имеет особую форму: bracia (исторически собирательное существительное).',
    isException: true,
  },
];

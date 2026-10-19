import React from 'react';
import { speakPolish } from '../utils/audio';
import { Volume2, BookCheck, AlertCircle, CheckCircle2 } from 'lucide-react';

export const RulesView: React.FC = () => {
  return (
    <div className="w-full max-w-2xl mx-auto px-3 sm:px-4 py-4 flex flex-col gap-6 text-slate-100">
      {/* Intro banner */}
      <div className="bg-gradient-to-r from-rose-950/40 via-slate-900 to-indigo-950/40 border border-rose-500/30 rounded-3xl p-5 sm:p-6 shadow-xl">
        <div className="flex items-center gap-2 mb-2 text-rose-400 font-bold text-sm uppercase tracking-wide">
          <BookCheck className="w-5 h-5" />
          <span>Грамматика: Rodzaj niemęskoosobowy</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
          Правила окончаний множественного числа
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
          В польском языке форма <strong>niemęskoosobowy</strong> используется для всех неодушевленных предметов, животных, растений и женщин (все, кроме групп, в которых есть хотя бы один мужчина).
        </p>
      </div>

      {/* Rule 1: Adjectives */}
      <section className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-base sm:text-lg font-bold text-rose-300 flex items-center gap-2">
            <span>1. Прилагательные</span>
          </h3>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-semibold border border-rose-500/30">
            2 окончания
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {/* Default -e */}
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3.5 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xl font-black text-emerald-400">-e</span>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                По умолчанию
              </span>
            </div>
            <p className="text-xs text-slate-300">
              Все прилагательные с обычными твердыми и отвердевшими основами:
            </p>
            <div className="text-xs text-slate-200 font-mono bg-slate-900/80 p-2 rounded-lg space-y-1">
              <div className="flex justify-between items-center">
                <span>nowy / nowa &rarr; <strong>nowe</strong></span>
                <button onClick={() => speakPolish('nowe')} className="text-slate-400 hover:text-rose-400">
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="flex justify-between items-center">
                <span>duży / duża &rarr; <strong>duże</strong></span>
                <button onClick={() => speakPolish('duże')} className="text-slate-400 hover:text-rose-400">
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="flex justify-between items-center">
                <span>mały / mała &rarr; <strong>małe</strong></span>
                <button onClick={() => speakPolish('małe')} className="text-slate-400 hover:text-rose-400">
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* After k/g -ie */}
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3.5 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xl font-black text-pink-400">-ie</span>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                После K и G
              </span>
            </div>
            <p className="text-xs text-slate-300">
              Прилагательные, чей корень заканчивается на <strong>k</strong> или <strong>g</strong>:
            </p>
            <div className="text-xs text-slate-200 font-mono bg-slate-900/80 p-2 rounded-lg space-y-1">
              <div className="flex justify-between items-center">
                <span>drogi / droga &rarr; <strong>drogie</strong></span>
                <button onClick={() => speakPolish('drogie')} className="text-slate-400 hover:text-rose-400">
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="flex justify-between items-center">
                <span>wysoki / wysoka &rarr; <strong>wysokie</strong></span>
                <button onClick={() => speakPolish('wysokie')} className="text-slate-400 hover:text-rose-400">
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="flex justify-between items-center">
                <span>polski / polska &rarr; <strong>polskie</strong></span>
                <button onClick={() => speakPolish('polskie')} className="text-slate-400 hover:text-rose-400">
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Rule 2: Nouns */}
      <section className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-base sm:text-lg font-bold text-sky-300 flex items-center gap-2">
            <span>2. Существительные</span>
          </h3>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-sky-500/20 text-sky-300 font-semibold border border-sky-500/30">
            4 окончания
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Neuter -a */}
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xl font-black text-amber-400">-a</span>
              <span className="text-[11px] font-semibold text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded">
                Средний род
              </span>
            </div>
            <p className="text-xs text-slate-300">
              Существительные среднего рода на <strong>-o, -e, -ę</strong> в ед. ч. всегда получают <strong>-a</strong>:
            </p>
            <div className="text-xs text-slate-200 font-mono bg-slate-900/80 p-2 rounded-lg space-y-1">
              <div>okno &rarr; <strong>okna</strong> (окна)</div>
              <div>zdjęcie &rarr; <strong>zdjęcia</strong> (фото)</div>
              <div>lusterko &rarr; <strong>lusterka</strong> (зеркала)</div>
              <div>mleko &rarr; <strong>mleka</strong> (молоко)</div>
            </div>
          </div>

          {/* Soft & Hissing -e */}
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xl font-black text-emerald-400">-e</span>
              <span className="text-[11px] font-semibold text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded">
                Шипящие и мягкие
              </span>
            </div>
            <p className="text-xs text-slate-300">
              Основы на <strong>sz, cz, rz, ż, c, dz, l</strong> или на <strong>-ia / -ja</strong>:
            </p>
            <div className="text-xs text-slate-200 font-mono bg-slate-900/80 p-2 rounded-lg space-y-1">
              <div>ulica &rarr; <strong>ulice</strong> (улицы)</div>
              <div>kawiarnia &rarr; <strong>kawiarnie</strong> (кофейни)</div>
              <div>wieża &rarr; <strong>wieże</strong> (башни)</div>
              <div>smycz &rarr; <strong>smycze</strong> (поводки)</div>
            </div>
          </div>

          {/* K / G stems -i */}
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xl font-black text-purple-400">-i</span>
              <span className="text-[11px] font-semibold text-purple-300 bg-purple-500/20 px-2 py-0.5 rounded">
                Основы на K / G
              </span>
            </div>
            <p className="text-xs text-slate-300">
              В польском языке <strong>k</strong> и <strong>g</strong> требуют мягкости (буквы <strong>i</strong>):
            </p>
            <div className="text-xs text-slate-200 font-mono bg-slate-900/80 p-2 rounded-lg space-y-1">
              <div>książka &rarr; <strong>książki</strong> (книги)</div>
              <div>kubek &rarr; <strong>kubki</strong> (кружки)</div>
              <div>droga &rarr; <strong>drogi</strong> (дороги)</div>
              <div>bułka &rarr; <strong>bułki</strong> (булочки)</div>
            </div>
          </div>

          {/* Hard consonants -y */}
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xl font-black text-blue-400">-y</span>
              <span className="text-[11px] font-semibold text-blue-300 bg-blue-500/20 px-2 py-0.5 rounded">
                Обычные твердые
              </span>
            </div>
            <p className="text-xs text-slate-300">
              Основы на твердые согласные <strong>b, d, f, ł, m, n, p, r, s, t, w, z</strong>:
            </p>
            <div className="text-xs text-slate-200 font-mono bg-slate-900/80 p-2 rounded-lg space-y-1">
              <div>szkoła &rarr; <strong>szkoły</strong> (школы)</div>
              <div>herbata &rarr; <strong>herbaty</strong> (чаи)</div>
              <div>kobieta &rarr; <strong>kobiety</strong> (женщины)</div>
              <div>woda &rarr; <strong>wody</strong> (воды)</div>
            </div>
          </div>
        </div>
      </section>

      {/* Rule 3: Exceptions */}
      <section className="bg-slate-900/80 border border-amber-500/30 rounded-2xl p-5 shadow-lg space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-base sm:text-lg font-bold text-amber-300 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-amber-400" />
            <span>3. Базовые исключения (Обязательно знать!)</span>
          </h3>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          В польском языке эти слова сохранили архаичные формы (остатки древнеславянского двойственного числа для парных органов или исторические чередования):
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-3 space-y-1">
            <div className="flex justify-between items-center text-sm font-bold text-white">
              <span>dziecko &rarr; <span className="text-amber-400 font-black">dzieci</span></span>
              <button onClick={() => speakPolish('dzieci')} className="text-slate-400 hover:text-rose-400">
                <Volume2 className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-400">
              Ребёнок &rarr; дети. Относится к niemęskoosobowy (например: <em>małe dzieci</em>).
            </p>
          </div>

          <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-3 space-y-1">
            <div className="flex justify-between items-center text-sm font-bold text-white">
              <span>oko &rarr; <span className="text-amber-400 font-black">oczy</span></span>
              <button onClick={() => speakPolish('oczy')} className="text-slate-400 hover:text-rose-400">
                <Volume2 className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-400">
              Глаз &rarr; глаза. Чередование k &rarr; cz, окончание <strong>-y</strong> (<em>niebieskie oczy</em>).
            </p>
          </div>

          <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-3 space-y-1">
            <div className="flex justify-between items-center text-sm font-bold text-white">
              <span>ucho &rarr; <span className="text-amber-400 font-black">uszy</span></span>
              <button onClick={() => speakPolish('uszy')} className="text-slate-400 hover:text-rose-400">
                <Volume2 className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-400">
              Ухо &rarr; уши. Чередование ch &rarr; sz, окончание <strong>-y</strong> (<em>małe uszy</em>).
            </p>
          </div>

          <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-3 space-y-1">
            <div className="flex justify-between items-center text-sm font-bold text-white">
              <span>ręka &rarr; <span className="text-amber-400 font-black">ręce</span></span>
              <button onClick={() => speakPolish('ręce')} className="text-slate-400 hover:text-rose-400">
                <Volume2 className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-400">
              Рука &rarr; руки. Чередование k &rarr; c, окончание <strong>-e</strong> (<em>czyste ręce</em>).
            </p>
          </div>
        </div>
      </section>

      {/* Summary matrix */}
      <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 text-xs text-slate-400 space-y-2">
        <h4 className="font-semibold text-slate-200 flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Быстрая шпаргалка:</span>
        </h4>
        <ul className="list-disc list-inside space-y-1 text-slate-300">
          <li><strong>Средний род?</strong> Всегда окончание <strong>-a</strong>.</li>
          <li><strong>Прилагательное?</strong> Обычно <strong>-e</strong>, после k/g &rarr; <strong>-ie</strong>.</li>
          <li><strong>Существительное после k/g?</strong> Всегда <strong>-i</strong>.</li>
          <li><strong>Существительное после шипящих / мягких?</strong> Окончание <strong>-e</strong>.</li>
          <li><strong>Существительное после твердых согласных?</strong> Окончание <strong>-y</strong>.</li>
        </ul>
      </section>
    </div>
  );
};

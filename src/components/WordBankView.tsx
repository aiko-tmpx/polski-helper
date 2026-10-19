import React, { useState, useMemo } from 'react';
import type { EndingType, WordCategory } from '../types';
import { POLISH_WORDS } from '../data/words';
import { speakPolish, triggerHaptic } from '../utils/audio';
import { Search, Volume2, Info, ChevronDown, ChevronUp, Sparkles, Filter } from 'lucide-react';

interface WordBankViewProps {
  onPracticeWord?: (wordId: string) => void;
}

export const WordBankView: React.FC<WordBankViewProps> = ({ onPracticeWord }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<WordCategory | 'all'>('all');
  const [activeEnding, setActiveEnding] = useState<EndingType | 'all'>('all');
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);

  const filteredWords = useMemo(() => {
    return POLISH_WORDS.filter((word) => {
      // Category filter
      if (activeCategory !== 'all' && word.category !== activeCategory) {
        return false;
      }
      // Ending filter
      if (activeEnding !== 'all' && word.correctEnding !== activeEnding) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesSingular = word.singular.toLowerCase().includes(query);
        const matchesPlural = word.plural.toLowerCase().includes(query);
        const matchesTranslation = word.translation.toLowerCase().includes(query);
        const matchesRule = word.ruleHint.toLowerCase().includes(query);
        return matchesSingular || matchesPlural || matchesTranslation || matchesRule;
      }
      return true;
    });
  }, [searchQuery, activeCategory, activeEnding]);

  const toggleExpand = (id: string) => {
    triggerHaptic('click');
    setExpandedCardId((prev) => (prev === id ? null : id));
  };

  const getEndingBadgeColor = (ending: EndingType) => {
    switch (ending) {
      case '-y':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/40';
      case '-i':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/40';
      case '-e':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case '-ie':
        return 'bg-pink-500/20 text-pink-300 border-pink-500/40';
      case '-a':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      default:
        return 'bg-slate-700 text-slate-300 border-slate-600';
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-3 sm:px-4 py-4 flex flex-col gap-4">
      {/* Title & Stats */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <span>База слов</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
              {filteredWords.length} из {POLISH_WORDS.length}
            </span>
          </h2>
          <p className="text-xs text-slate-400">
            Частая бытовая лексика для тренировки множественного числа
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Поиск слова (на польском или русском)..."
          className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500/40 focus:border-rose-500 transition-all"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-200"
          >
            ✕
          </button>
        )}
      </div>

      {/* Category Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 text-xs">
        {[
          { id: 'all', label: 'Все категории' },
          { id: 'cafe_food', label: '☕ Кафе и еда' },
          { id: 'city_transport', label: '🏙️ Город и транспорт' },
          { id: 'home_shopping', label: '🛍️ Дом и покупки' },
          { id: 'adjectives', label: '🌟 Прилагательные' },
          { id: 'exceptions', label: '⚠️ Исключения' },
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id as WordCategory | 'all')}
            className={`px-3 py-1.5 rounded-xl shrink-0 font-medium transition-all ${
              activeCategory === cat.id
                ? 'bg-rose-500 text-white shadow-sm'
                : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Ending Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 text-xs">
        <span className="text-slate-400 font-medium shrink-0 flex items-center gap-1">
          <Filter className="w-3 h-3" /> Окончание:
        </span>
        {(['all', '-y', '-i', '-e', '-ie', '-a'] as (EndingType | 'all')[]).map((ending) => (
          <button
            key={ending}
            onClick={() => setActiveEnding(ending)}
            className={`px-2.5 py-1 rounded-lg shrink-0 font-semibold transition-all ${
              activeEnding === ending
                ? 'bg-slate-200 text-slate-900 shadow-sm'
                : 'bg-slate-800/60 text-slate-400 hover:text-slate-300'
            }`}
          >
            {ending === 'all' ? 'Все' : ending}
          </button>
        ))}
      </div>

      {/* Words Grid / List */}
      <div className="flex flex-col gap-2.5">
        {filteredWords.length === 0 ? (
          <div className="text-center py-12 bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6">
            <p className="text-sm text-slate-400">Слова по вашему запросу не найдены.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveCategory('all');
                setActiveEnding('all');
              }}
              className="mt-3 text-xs text-rose-400 font-semibold underline"
            >
              Сбросить все фильтры
            </button>
          </div>
        ) : (
          filteredWords.map((word) => {
            const isExpanded = expandedCardId === word.id;
            const isException = word.ruleType === 'exception';

            return (
              <div
                key={word.id}
                className={`bg-slate-900/80 border rounded-2xl p-3 sm:p-4 transition-all duration-200 ${
                  isException
                    ? 'border-amber-500/30 bg-amber-950/10'
                    : isExpanded
                    ? 'border-slate-700 bg-slate-850'
                    : 'border-slate-800/80 hover:border-slate-750'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    {/* Word Polish Pair */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-base sm:text-lg font-bold text-white tracking-tight">
                        {word.singular}
                      </span>
                      <span className="text-slate-500 font-normal text-sm">&rarr;</span>
                      <span className="text-base sm:text-lg font-black text-rose-300">
                        {word.plural}
                      </span>

                      {/* Listen button */}
                      <button
                        onClick={() => speakPolish(word.plural)}
                        title="Прослушать форму мн. числа"
                        className="p-1 rounded-full text-slate-400 hover:text-rose-400 active:scale-95 transition-all"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Translation */}
                    <p className="text-xs sm:text-sm text-slate-400 mt-0.5 font-medium">
                      {word.translation}
                    </p>
                  </div>

                  {/* Badges on right */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded-lg border ${getEndingBadgeColor(
                        word.correctEnding
                      )}`}
                    >
                      {word.correctEnding}
                    </span>

                    <button
                      onClick={() => toggleExpand(word.id)}
                      className="p-1 rounded-lg text-slate-400 hover:text-slate-200 bg-slate-800/60 transition-all"
                      title="Подробнее о правиле"
                    >
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Expanded Details: Rule hint & notes */}
                {isExpanded && (
                  <div className="mt-3 pt-3 border-t border-slate-800/80 text-xs animate-fadeIn space-y-1.5">
                    <div className="flex items-center gap-1.5 text-rose-400 font-semibold">
                      <Info className="w-3.5 h-3.5 shrink-0" />
                      <span>Правило образования:</span>
                    </div>
                    <p className="text-slate-300 leading-relaxed pl-5 font-normal">
                      {word.ruleHint}
                    </p>
                    {word.notes && (
                      <p className="text-amber-300/90 italic pl-5">{word.notes}</p>
                    )}
                    {onPracticeWord && (
                      <div className="pt-2 flex justify-end">
                        <button
                          onClick={() => onPracticeWord(word.id)}
                          className="flex items-center gap-1 text-[11px] font-semibold text-rose-400 hover:text-rose-300 underline"
                        >
                          <Sparkles className="w-3 h-3" />
                          <span>Тренировать это слово в спринте</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

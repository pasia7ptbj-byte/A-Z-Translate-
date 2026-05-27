import { useState } from 'react';
import { ALPHABET_ASC, ALPHABET_DESC, NUMBERS_ASC, NUMBERS_DESC } from '../utils/translator';
import { Search, Info, RotateCcw, ArrowUpDown } from 'lucide-react';

export default function MappingKey() {
  const [searchChar, setSearchChar] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);

  const clearSearch = () => {
    setSearchChar('');
    setHighlightedIndex(null);
  };

  const handleSearchChange = (val: string) => {
    const clean = val.trim().toLowerCase();
    setSearchChar(val);
    if (!clean) {
      setHighlightedIndex(null);
      return;
    }
    const char = clean[0];
    
    // Find in alphabet
    const alphaIndex = ALPHABET_ASC.indexOf(char);
    if (alphaIndex !== -1) {
      setHighlightedIndex(alphaIndex);
      return;
    }

    // Find in numbers
    const numIndex = NUMBERS_ASC.indexOf(char);
    if (numIndex !== -1) {
      // Offset numerical highlight to differentiate or just use index
      setHighlightedIndex(numIndex + 100); // 100+ represents numbers index
      return;
    }

    setHighlightedIndex(null);
  };

  return (
    <div id="mapping-key-component" className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
      <div id="mapping-header" className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h2 id="mapping-title" className="text-base font-semibold text-slate-900 tracking-tight flex items-center gap-2">
            <ArrowUpDown className="w-4 h-4 text-indigo-600" />
            Alphabet & Number Mapping Schema
          </h2>
          <p className="text-xs text-slate-500 mt-1 font-light">
            Symmetric involution: characters at ascending index positions translate to their descending equivalents.
          </p>
        </div>

        {/* Quick character lookup search */}
        <div id="search-lookup" className="relative max-w-xs w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-400" />
          </div>
          <input
            id="char-lookup-input"
            type="text"
            maxLength={5}
            value={searchChar}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search character lookup..."
            className="w-full pl-9 pr-8 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 focus:bg-white transition-all text-slate-800 font-sans"
          />
          {searchChar && (
            <button
              id="clear-search-btn"
              onClick={clearSearch}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      <div id="mappings-display-grid" className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Alphabet Mapping */}
        <div id="alphabet-mapping-card" className="border border-slate-200 bg-slate-50/30 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3.5">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">
              Alphabets Model (Ascending ⇄ Descending)
            </span>
            <span className="text-[10px] font-bold bg-indigo-50 text-indigo-700 px-2.5 py-0.5 rounded uppercase tracking-wider">
              a ⇄ z
            </span>
          </div>

          {/* Letter row mapping list */}
          <div id="letters-row-mapping" className="grid grid-cols-6 sm:grid-cols-13 gap-1.5">
            {ALPHABET_ASC.map((letter, idx) => {
              const reverseLetter = ALPHABET_DESC[idx];
              const isHighlighted = highlightedIndex === idx;
              
              return (
                <div
                  key={`alpha-cell-${letter}`}
                  id={`alpha-pair-${letter}`}
                  onMouseEnter={() => setHighlightedIndex(idx)}
                  onMouseLeave={() => setHighlightedIndex(null)}
                  className={`flex flex-col items-center justify-center p-1.5 rounded-lg transition-all border text-center cursor-default ${
                    isHighlighted 
                      ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm scale-110 z-10' 
                      : 'bg-white border-slate-200 text-slate-800 hover:border-indigo-250 hover:bg-indigo-50/50'
                  }`}
                >
                  <span className={`text-[10px] uppercase font-bold ${isHighlighted ? 'text-indigo-200' : 'text-slate-400'}`}>
                    {letter}
                  </span>
                  <div className="w-3.5 h-[1px] bg-slate-100 my-1" />
                  <span className="text-xs font-semibold tracking-wide uppercase">
                    {reverseLetter}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="flex items-center gap-2 mt-4 text-[11px] text-slate-500 bg-white p-2.5 rounded-lg border border-slate-200 font-light">
            <Info className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0" />
            <span>Hover a letter cell above to see the matching mapping pairing illuminated instantly.</span>
          </div>
        </div>

        {/* Number Mapping */}
        <div id="number-mapping-card" className="border border-slate-200 bg-slate-50/30 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3.5">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">
              Numbers Model (0-9 ⇄ 9-0)
            </span>
            <span className="text-[10px] font-bold bg-indigo-50 text-indigo-700 px-2.5 py-0.5 rounded uppercase tracking-wider">
              0 ⇄ 9
            </span>
          </div>

          {/* Numbers row mapping list */}
          <div id="numbers-row-mapping" className="grid grid-cols-5 sm:grid-cols-10 gap-x-1.5 gap-y-3">
            {NUMBERS_ASC.map((number, idx) => {
              const reverseNumber = NUMBERS_DESC[idx];
              const isHighlighted = highlightedIndex === (idx + 100);
              
              return (
                <div
                  key={`num-cell-${number}`}
                  id={`num-pair-${number}`}
                  onMouseEnter={() => setHighlightedIndex(idx + 100)}
                  onMouseLeave={() => setHighlightedIndex(null)}
                  className={`flex flex-col items-center justify-center p-1.5 rounded-lg transition-all border text-center cursor-default ${
                    isHighlighted 
                      ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm scale-110 z-10' 
                      : 'bg-white border-slate-200 text-slate-800 hover:border-indigo-250 hover:bg-indigo-50/50'
                  }`}
                >
                  <span className={`text-[10px] font-bold ${isHighlighted ? 'text-indigo-200' : 'text-slate-400'}`}>
                    {number}
                  </span>
                  <div className="w-3.5 h-[1px] bg-slate-100 my-1" />
                  <span className="text-xs font-semibold tracking-wide">
                    {reverseNumber}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="flex items-center gap-2 mt-4 text-[11px] text-slate-500 bg-white p-2.5 rounded-lg border border-slate-200 font-light">
            <Info className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0" />
            <span>Example conversion rule: number <strong>3</strong> converts to <strong>6</strong>, and <strong>6</strong> converts back symmetrically.</span>
          </div>
        </div>

      </div>
    </div>
  );
}

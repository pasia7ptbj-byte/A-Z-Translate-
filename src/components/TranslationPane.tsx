import { useState, useEffect } from 'react';
import { translateText } from '../utils/translator';
import { Copy, Trash2, ArrowLeftRight, Check, BookMarked, Sparkles, Binary, Type } from 'lucide-react';

interface TranslationPaneProps {
  onSaveItem: (original: string, mirrored: string) => void;
}

export default function TranslationPane({ onSaveItem }: TranslationPaneProps) {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [copied, setCopied] = useState(false);
  const [isSwapped, setIsSwapped] = useState(false);

  // Live translate whenever input text or swap state changes
  useEffect(() => {
    const translated = translateText(inputText);
    setOutputText(translated);
  }, [inputText, isSwapped]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(outputText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text', err);
    }
  };

  const handleClear = () => {
    setInputText('');
  };

  const loadSample = (sample: string) => {
    setInputText(sample);
  };

  // Compute live stats of the text
  const getStats = () => {
    const text = inputText;
    let letterCount = 0;
    let digitCount = 0;
    let otherCount = 0;

    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const code = char.charCodeAt(0);
      if ((code >= 65 && code <= 90) || (code >= 97 && code <= 122)) {
        letterCount++;
      } else if (code >= 48 && code <= 57) {
        digitCount++;
      } else {
        otherCount++;
      }
    }

    return { letterCount, digitCount, otherCount, total: text.length };
  };

  const stats = getStats();

  const handleSave = () => {
    if (!inputText.trim()) return;
    onSaveItem(inputText, outputText);
  };

  // Label directions based on swap
  const inputLabel = isSwapped ? "Mirror Language Text" : "Standard English Text";
  const outputLabel = isSwapped ? "Standard English Text" : "Mirror Language Text";
  const inputPlaceholder = isSwapped 
    ? "Type or paste your mirrored text here... (eg: svool)"
    : "Type or paste standard English here... (eg: hello)";

  return (
    <div id="translation-pane" className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
      
      {/* Translation Inputs / Outputs Column */}
      <div id="textareas-card" className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
        <div id="panes-wrapper" className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
          
          {/* Input Box */}
          <div id="input-container" className="flex flex-col">
            <div className="flex items-center justify-between mb-2.5">
              <label htmlFor="input-textarea" className="text-[10px] uppercase font-bold text-slate-400 tracking-widest flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                {inputLabel}
              </label>
              <div className="flex items-center gap-1">
                <button
                  id="btn-sample-1"
                  onClick={() => loadSample("Hello World 123")}
                  className="text-[10px] font-semibold text-slate-500 bg-slate-50 hover:bg-slate-100 px-2 py-0.5 rounded transition-colors"
                >
                  Greetings
                </button>
                <button
                  id="btn-sample-2"
                  onClick={() => loadSample("Never give up! 999")}
                  className="text-[10px] font-semibold text-slate-500 bg-slate-50 hover:bg-slate-100 px-2 py-0.5 rounded transition-colors"
                >
                  Inspiration
                </button>
              </div>
            </div>
            
            <textarea
              id="input-textarea"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={inputPlaceholder}
              className="w-full h-52 p-4 bg-slate-50/50 border border-slate-200 focus:bg-white focus:border-indigo-500 hover:border-slate-350 rounded-xl resize-none text-xl font-light text-slate-800 placeholder-slate-400 focus:outline-none transition-all font-sans leading-relaxed"
            />
          </div>

          {/* Symmetrical Swap Divider Button (Centered on desktop, row on mobile) */}
          <div id="swap-divider" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:flex items-center justify-center z-10">
            <button
              id="desktop-swap-btn"
              onClick={() => setIsSwapped(!isSwapped)}
              title="Symmetric Cipher is reciprocal! Clicking swap flips labels."
              className="p-2.5 bg-white border border-slate-200 hover:border-indigo-500 hover:text-indigo-600 rounded-lg shadow-sm transition-all transform hover:rotate-180 duration-500 text-slate-400"
            >
              <ArrowLeftRight className="w-4 h-4" />
            </button>
          </div>

          {/* Output Box */}
          <div id="output-container" className="flex flex-col">
            <div className="flex items-center justify-between mb-2.5">
              <label htmlFor="output-textarea" className="text-[10px] uppercase font-bold text-indigo-500 tracking-widest flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                {outputLabel}
              </label>
              <span className="text-[10px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded uppercase tracking-wider">
                Live Output
              </span>
            </div>

            <div className="relative">
              <textarea
                id="output-textarea"
                readOnly
                value={outputText}
                placeholder="The live reflection translation will appear here..."
                className="w-full h-52 p-4 bg-indigo-50/10 border border-indigo-100/40 rounded-xl resize-none text-xl font-medium text-indigo-600 font-sans leading-relaxed focus:outline-none"
              />
              
              {!outputText && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-slate-300">
                  <Sparkles className="w-7 h-7 opacity-20 animate-pulse" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Translation action triggers and stats toolbar */}
        <div id="toolbar-container" className="flex flex-wrap items-center justify-between gap-4 mt-6 pt-4 border-t border-slate-100">
          <div id="live-char-counters" className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-500">
            <div className="flex items-center gap-1.5 p-1 px-2.5 bg-slate-50 rounded-lg">
              <Type className="w-3.5 h-3.5 text-indigo-500" />
              <span>Letters: <strong className="text-slate-800">{stats.letterCount}</strong></span>
            </div>
            <div className="flex items-center gap-1.5 p-1 px-2.5 bg-slate-50 rounded-lg">
              <Binary className="w-3.5 h-3.5 text-indigo-500" />
              <span>Numbers: <strong className="text-slate-800">{stats.digitCount}</strong></span>
            </div>
            <div className="text-slate-400 font-normal">
              Total: {stats.total} char{stats.total !== 1 ? 's' : ''}
            </div>
          </div>

          <div id="action-buttons-wrapper" className="flex items-center gap-2">
            <button
              id="clear-btn"
              onClick={handleClear}
              disabled={!inputText}
              className="px-4 py-2 text-xs font-bold text-slate-650 hover:text-rose-600 border border-slate-200 hover:border-rose-100 hover:bg-rose-50/50 rounded-lg transition-all flex items-center gap-2 disabled:opacity-45 disabled:hover:bg-transparent disabled:hover:text-slate-600 disabled:hover:border-slate-200 cursor-pointer disabled:cursor-not-allowed"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear
            </button>
            
            <button
              id="save-to-notebook-btn"
              onClick={handleSave}
              disabled={!inputText.trim()}
              className="px-4 py-2 text-xs font-bold text-slate-750 hover:text-indigo-700 bg-slate-50 hover:bg-indigo-50/50 border border-slate-200 hover:border-indigo-150 rounded-lg transition-all flex items-center gap-2 disabled:opacity-45 disabled:hover:bg-slate-50 disabled:hover:text-slate-750 disabled:hover:border-slate-200 cursor-pointer disabled:cursor-not-allowed"
            >
              <BookMarked className="w-3.5 h-3.5 text-indigo-600" />
              Save to Notebook
            </button>

            <button
              id="copy-btn"
              onClick={handleCopy}
              disabled={!outputText}
              className={`px-5 py-2 text-xs font-bold text-white rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
                copied 
                  ? 'bg-emerald-600 hover:bg-emerald-700' 
                  : 'bg-indigo-600 hover:bg-indigo-700 active:scale-95 disabled:opacity-45 disabled:hover:bg-indigo-600 disabled:pointer-events-none disabled:cursor-not-allowed'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copy Outcome
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Symmetrical Feature Column / Sidebar */}
      <div id="explanation-card" className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white flex flex-col justify-between">
        <div id="concept-explanation-header">
          <span className="px-2.5 py-1 text-[10px] font-bold tracking-widest text-indigo-400 bg-indigo-950 border border-indigo-900/40 rounded uppercase">
            Language Concept
          </span>
          <h3 className="text-lg font-semibold tracking-tight text-white mt-4">
            Inversion Mirror Cipher
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed mt-2 font-light">
            This written language runs on a structural <strong className="text-indigo-400 font-normal">Bi-directional Mapping Rule</strong>. 
            By flipping the standard sequences perfectly in half, the outcome preserves syntax, punctuation, spacing, and casing, whilst scrambling standard symbols into symmetric partners.
          </p>

          <div className="space-y-3 mt-6">
            <div className="flex items-start gap-3 bg-slate-800/40 p-3 rounded-xl border border-slate-700/30">
              <div className="p-1 px-2 bg-indigo-950 text-indigo-400 font-mono text-xs rounded mt-0.5 font-bold">a ⇄ z</div>
              <div>
                <h4 className="text-xs font-semibold text-slate-200">Alphabet Reflection</h4>
                <p className="text-[11px] text-slate-400 mt-1 font-light">First letter a replaces with last letter z, b with y, c with x, and so on. Highly visual & fully symmetric.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-slate-800/40 p-3 rounded-xl border border-slate-700/30">
              <div className="p-1 px-2 bg-indigo-950 text-indigo-400 font-mono text-xs rounded mt-0.5 font-bold">0 ⇄ 9</div>
              <div>
                <h4 className="text-xs font-semibold text-slate-200">Numerical Inversion</h4>
                <p className="text-[11px] text-slate-400 mt-1 font-light">Number 0 reflects to 9, 1 to 8, 2 to 7, and vice-versa. Great for coding dates or values securely.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-800 mt-6 md:mt-0">
          <div className="bg-indigo-950/20 border border-indigo-900/20 p-3.5 rounded-xl text-[11px] text-indigo-300 font-light leading-relaxed">
            <span className="font-semibold text-white block mb-0.5">Symmetry Tip</span>
            The conversion engine is self-reversing. Run mirror text or standard text through the same input and instantly view its original or encoded counterpart.
          </div>
        </div>
      </div>

    </div>
  );
}

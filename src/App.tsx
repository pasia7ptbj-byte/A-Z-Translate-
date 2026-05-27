import { useState, useEffect } from 'react';
import { TranslationItem } from './types';
import TranslationPane from './components/TranslationPane';
import MappingKey from './components/MappingKey';
import SavedVocabulary from './components/SavedVocabulary';
import PracticeHub from './components/PracticeHub';
import OfflineIndicator from './components/OfflineIndicator';
import { Sparkles, FlipHorizontal, Layers } from 'lucide-react';

const LOCAL_STORAGE_KEY = 'mirror_translation_glossary';

export default function App() {
  const [savedItems, setSavedItems] = useState<TranslationItem[]>([]);

  // Load from local storage on mount
  useEffect(() => {
    try {
      const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (cached) {
        setSavedItems(JSON.parse(cached));
      }
    } catch (err) {
      console.error('Failed to load local storage mirror database', err);
    }
  }, []);

  // Save to local storage whenever list updates
  const updateSavedItems = (newItems: TranslationItem[]) => {
    setSavedItems(newItems);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newItems));
    } catch (err) {
      console.error('Failed to save to local storage mirror database', err);
    }
  };

  // Add translation item to notebook
  const handleSaveItem = (original: string, mirrored: string) => {
    const trimmedOriginal = original.trim();
    const trimmedMirrored = mirrored.trim();
    if (!trimmedOriginal) return;

    // Avoid duplicates
    if (savedItems.some(item => item.original.toLowerCase() === trimmedOriginal.toLowerCase())) {
      alert('This translation already exists in your local Glossary notebook.');
      return;
    }

    const newItem: TranslationItem = {
      id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      original: trimmedOriginal,
      mirrored: trimmedMirrored,
      timestamp: Date.now()
    };

    updateSavedItems([newItem, ...savedItems]);
  };

  // Delete translation item
  const handleDeleteItem = (id: string) => {
    const updated = savedItems.filter(item => item.id !== id);
    updateSavedItems(updated);
  };

  // Clear all saved translations
  const handleClearAll = () => {
    updateSavedItems([]);
  };

  // Rename or attach descriptor label to translation item
  const handleRenameItem = (id: string, newLabel: string) => {
    const updated = savedItems.map(item => {
      if (item.id === id) {
        return { ...item, label: newLabel.trim() };
      }
      return item;
    });
    updateSavedItems(updated);
  };

  // Mass import items
  const handleImportItems = (imported: TranslationItem[]) => {
    // Merge without full duplicate keys
    const merged = [...imported];
    savedItems.forEach(saved => {
      if (!merged.some(m => m.original.toLowerCase() === saved.original.toLowerCase())) {
        merged.push(saved);
      }
    });
    // Sort merged items by timestamp descending
    merged.sort((a, b) => b.timestamp - a.timestamp);
    updateSavedItems(merged);
  };

  return (
    <div id="main-scaffold" className="min-h-screen bg-slate-50 font-sans selection:bg-indigo-100 text-slate-800 pb-20">
      
      {/* Brand Elegant Top Header */}
      <header id="main-header" className="bg-white border-b border-slate-200 py-4.5 sticky top-0 z-50 shadow-none backdrop-blur-md bg-white/95">
        <div id="header-container" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div id="logo-block" className="flex items-center gap-3">
            <div id="logo-icon" className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
              <FlipHorizontal className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 id="app-heading" className="text-base font-semibold tracking-tight text-slate-900 leading-tight">
                  Mirror
                </h1>
                <span id="app-badge" className="px-2 py-0.5 text-[9px] font-bold text-indigo-700 bg-indigo-50 rounded uppercase tracking-widest">
                  Language Engine
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-light">Automatic character & digit reflection translator</p>
            </div>
          </div>

          <div id="header-meta" className="hidden sm:flex items-center gap-4 text-xs font-semibold text-slate-450 border-l border-slate-200 pl-4">
            <div id="meta-engine" className="flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-indigo-600" />
              <span className="font-light">Version 1.0.0 (Local Build)</span>
            </div>
            <div id="meta-offline" className="flex items-center gap-1.5 px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded text-[10px] uppercase font-bold tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <span>Secure Local Host</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container Layout Context */}
      <main id="primary-layout" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-6">
        
        {/* Row 1: Symmetrical Live Translation Panel */}
        <section id="translation-interface" className="space-y-4">
          <TranslationPane onSaveItem={handleSaveItem} />
        </section>

        {/* Row 2: Live Offline Support Status Information Banner */}
        <section id="offline-banner">
          <OfflineIndicator />
        </section>

        {/* Row 3: Grid division for mappings, notebook and practice modules */}
        <section id="secondary-workspace" className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Symmetrical Left Deck: Key Mapping List + saved terms notebook */}
          <div id="left-workspace-deck" className="lg:col-span-8 space-y-6">
            <MappingKey />
            <SavedVocabulary 
              items={savedItems} 
              onDeleteItem={handleDeleteItem} 
              onClearAll={handleClearAll}
              onImportItems={handleImportItems}
              onRenameItem={handleRenameItem}
            />
          </div>

          {/* Symmetrical Right Deck: Practice testing game widget */}
          <div id="right-workspace-deck" className="lg:col-span-4">
            <div className="sticky top-24">
              <PracticeHub />
            </div>
          </div>

        </section>

      </main>

    </div>
  );
}

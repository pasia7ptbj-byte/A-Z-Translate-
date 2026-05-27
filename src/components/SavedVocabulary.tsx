import { useState, ChangeEvent } from 'react';
import { TranslationItem } from '../types';
import { Trash2, Search, Download, Upload, Clipboard, Check, Calendar, FolderHeart, Info } from 'lucide-react';

interface SavedVocabularyProps {
  items: TranslationItem[];
  onDeleteItem: (id: string) => void;
  onClearAll: () => void;
  onImportItems: (imported: TranslationItem[]) => void;
  onRenameItem: (id: string, newLabel: string) => void;
}

export default function SavedVocabulary({
  items,
  onDeleteItem,
  onClearAll,
  onImportItems,
  onRenameItem,
}: SavedVocabularyProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editLabel, setEditLabel] = useState('');

  // Handle individual copying of the mirrored string
  const handleCopy = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1500);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  // Filter items based on search word
  const filteredItems = items.filter(
    (item) =>
      item.original.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.mirrored.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.label && item.label.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Export saved notebook as JSON
  const handleExportJSON = () => {
    if (items.length === 0) return;
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(items, null, 2)
    )}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute('download', `mirror_language_notebook_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Import JSON backup
  const handleImportJSON = (e: ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    const files = e.target.files;
    if (!files || files.length === 0) return;

    fileReader.readAsText(files[0], "UTF-8");
    fileReader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsed)) {
          // Double check required fields
          const validated = parsed.filter(item => item && item.id && item.original && item.mirrored);
          if (validated.length > 0) {
            onImportItems(validated);
            alert(`Succeed! Imported ${validated.length} backup phrases.`);
          } else {
            alert("No valid mirror translator backup records found in this file.");
          }
        } else {
          alert("Invalid backup schema. Expected a list array of translations.");
        }
      } catch (err) {
        alert("Failed to parse the uploaded backup file. Make sure it is valid JSON.");
      }
    };
    // Clear input
    e.target.value = '';
  };

  // Inline edit rename
  const startEditing = (item: TranslationItem) => {
    setEditingId(item.id);
    setEditLabel(item.label || '');
  };

  const saveRename = (id: string) => {
    onRenameItem(id, editLabel);
    setEditingId(null);
  };

  return (
    <div id="saved-vocabulary-component" className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
      
      {/* Header and Controls */}
      <div id="vocab-header" className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h2 id="vocab-title" className="text-base font-semibold text-slate-900 tracking-tight flex items-center gap-2">
            <FolderHeart className="w-4 h-4 text-indigo-650" />
            Saved Vocabulary Notebook
          </h2>
          <p className="text-xs text-slate-500 mt-1 font-light">
            Store and manage your vocabulary list, custom idioms, and mirror code keys locally.
          </p>
        </div>

        {/* Action button grouping */}
        <div id="vocab-header-actions" className="flex flex-wrap items-center gap-2">
          {items.length > 0 && (
            <>
              <button
                id="export-btn"
                onClick={handleExportJSON}
                className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 rounded-lg border border-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
                title="Download backup file to your device"
              >
                <Download className="w-3.5 h-3.5" />
                Backup Notebook
              </button>

              <button
                id="clear-all-vocab-btn"
                onClick={() => {
                  if (confirm('Are you absolutely sure you want to delete all saved phrases from your offline notebook?')) {
                    onClearAll();
                  }
                }}
                className="px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg border border-rose-150 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Wipe Local Database
              </button>
            </>
          )}

          {/* Hidden upload file selector */}
          <label 
            htmlFor="notebook-import-input" 
            className="px-3 py-1.5 text-xs font-bold text-indigo-705 bg-indigo-50 hover:bg-indigo-100/55 rounded-lg border border-indigo-150 transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Import notebook backup on another machine"
          >
            <Upload className="w-3.5 h-3.5" />
            Restore Backup
            <input
              id="notebook-import-input"
              type="file"
              accept=".json"
              onChange={handleImportJSON}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* List controls (Search and filter) */}
      <div id="filter-wrapper" className="flex gap-4 mb-4">
        <div id="vocab-search-field" className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-400" />
          </div>
          <input
            id="vocab-search-input"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search saved words, mirror outcomes, or custom descriptions..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 focus:bg-white text-slate-800 transition-all"
          />
        </div>
      </div>

      {/* Main local list */}
      <div id="vocab-container-body" className="max-h-[460px] overflow-y-auto pr-1 space-y-3 custom-scrollbar">
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => (
            <div
              key={item.id}
              id={`vocab-item-${item.id}`}
              className="group p-4 bg-white border border-slate-200 hover:border-slate-300 rounded-xl transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
            >
              <div id="vocab-item-details" className="space-y-12 flex-grow">
                
                {/* Editable labels */}
                {editingId === item.id ? (
                  <div className="flex items-center gap-2 max-w-md">
                    <input
                      type="text"
                      value={editLabel}
                      maxLength={40}
                      onChange={(e) => setEditLabel(e.target.value)}
                      placeholder="Add a friendly label/description..."
                      className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 flex-grow"
                    />
                    <button
                      onClick={() => saveRename(item.id)}
                      className="bg-indigo-650 text-white rounded-lg px-2.5 py-1 text-xs font-bold hover:bg-indigo-700 cursor-pointer"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="bg-slate-100 text-slate-600 border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-bold hover:bg-slate-200 cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2.5">
                    <span 
                      onClick={() => startEditing(item)}
                      className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded cursor-pointer transition-colors ${
                        item.label 
                          ? 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100' 
                          : 'bg-slate-100 text-slate-400 group-hover:text-slate-500 hover:bg-slate-200'
                      }`}
                      title="Click to add custom descriptor label"
                    >
                      {item.label || "+ Add Label"}
                    </span>

                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(item.timestamp).toLocaleDateString()}</span>
                    </div>
                  </div>
                )}

                {/* Left side column: Standard English block, mirror target block */}
                <div id="vocab-comparison-texts" className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-450 tracking-wider block mb-1">Standard</span>
                    <span className="text-base font-semibold text-slate-800 select-all font-sans leading-snug">
                      {item.original}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-455 tracking-wider block mb-1">Mirrored Reflection</span>
                    <span className="text-base font-bold text-indigo-650 font-mono select-all leading-snug">
                      {item.mirrored}
                    </span>
                  </div>
                </div>

              </div>

              {/* Utility button operations per item */}
              <div id="vocab-item-actions" className="flex items-center gap-2 self-stretch md:self-auto justify-end border-t md:border-t-0 pt-2.5 md:pt-0 border-slate-100">
                <button
                  id={`vocab-copy-mirror-${item.id}`}
                  onClick={() => handleCopy(item.mirrored, item.id)}
                  title="Copy mirrored translation"
                  className={`p-1.5 rounded-lg transition-all flex items-center justify-center border cursor-pointer ${
                    copiedId === item.id 
                      ? 'bg-emerald-50 text-emerald-600 border-emerald-250' 
                      : 'bg-white text-slate-450 border-slate-200 hover:border-indigo-300 hover:text-indigo-650'
                  }`}
                >
                  {copiedId === item.id ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Clipboard className="w-4 h-4" />
                  )}
                </button>

                <button
                  id={`vocab-delete-${item.id}`}
                  onClick={() => onDeleteItem(item.id)}
                  title="Delete item"
                  className="p-1.5 bg-white text-slate-400 border border-slate-200 hover:border-rose-350 hover:bg-rose-50 hover:text-rose-650 rounded-lg transition-all cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div id="vocab-empty-placeholder" className="py-12 text-center rounded-xl border border-dashed border-slate-200 bg-slate-50/20">
            <span className="text-slate-300 text-3xl block mb-2 font-emoji">📓</span>
            <span className="font-semibold text-slate-600 block text-xs">Your Notebook is Empty</span>
            <p className="text-[11px] text-slate-400 mt-1 max-w-sm mx-auto">
              {searchTerm 
                ? "No matching keywords found. Try searching for other phrases." 
                : "Type and translate phrases above, then hit 'Save to Notebook' to create your offline glossary book!"}
            </p>
          </div>
        )}
      </div>

      {items.length > 0 && (
        <div className="flex items-center gap-2 mt-4 text-[11px] text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-200">
          <Info className="w-3.5 h-3.5 text-indigo-600 flex-shrink-0" />
          <span className="font-light">Note: Data resides securely on this machine inside LocalStorage. Clean your browser cache or use the Backup feature to migrate to another device.</span>
        </div>
      )}

    </div>
  );
}

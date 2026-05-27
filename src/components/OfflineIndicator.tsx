import { useState, useEffect } from 'react';
import { Wifi, WifiOff, ShieldCheck, Database } from 'lucide-react';
import { motion } from 'motion/react';

export default function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <div id="offline-indicator-wrapper" className="flex flex-wrap items-center justify-between gap-4 p-4 border border-slate-200 bg-white rounded-xl">
      <div id="offline-status" className="flex items-center gap-3">
        <div 
          id="status-dot" 
          className={`flex items-center justify-center p-2 rounded-lg ${
            isOnline ? 'bg-indigo-50 text-indigo-650' : 'bg-slate-100 text-slate-650'
          }`}
        >
          {isOnline ? (
            <Wifi className="w-5 h-5" />
          ) : (
            <WifiOff className="w-5 h-5" />
          )}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span id="status-text" className="font-semibold text-slate-800 text-xs uppercase tracking-wider">
              {isOnline ? 'Network Connected' : 'Offline Mode Active'}
            </span>
            <span id="badge-local" className="px-2 py-0.5 text-[10px] font-bold tracking-widest text-indigo-600 bg-indigo-50 rounded uppercase">
              100% Client-Side
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1 font-light">
            {isOnline 
              ? 'Connected to the cloud, but all calculations run strictly in your local sandbox.'
              : 'Disconnected! Your translation tool, saved notebooks, and practice logs are completely functional.'}
          </p>
        </div>
      </div>

      <div id="offline-privacy-guarantee" className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-600">
        <div id="shield-item" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span className="text-[10px] uppercase font-bold tracking-wider">Zero Server Uploads</span>
        </div>
        <div id="storage-item" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700">
          <Database className="w-3.5 h-3.5" />
          <span className="text-[10px] uppercase font-bold tracking-wider">Local Storage</span>
        </div>
      </div>
    </div>
  );
}

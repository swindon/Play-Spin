import React, { useState } from 'react';
import { Download, Share, X } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  if (isInstalled) {
    return null;
  }

  if (isInstallable) {
    return (
      <button
        type="button"
        onClick={install}
        aria-label="Install PlaySpin app"
        title="Install App"
        className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-amber-100 text-amber-900 border border-amber-300 hover:bg-amber-200 transition-colors cursor-pointer shrink-0"
      >
        <Download className="w-4 h-4" strokeWidth={2.3} />
      </button>
    );
  }

  if (isIOS) {
    return (
      <>
        <button
          type="button"
          onClick={() => setShowIOSGuide(true)}
          aria-label="Add PlaySpin to Home Screen"
          title="Add to Home Screen"
          className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-amber-100 text-amber-900 border border-amber-300 hover:bg-amber-200 transition-colors cursor-pointer shrink-0"
        >
          <Share className="w-4 h-4" strokeWidth={2.3} />
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
            <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-xl border border-slate-200">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-lg font-bold text-slate-900">
                  Save to Home Screen
                </h3>
                <button
                  type="button"
                  onClick={() => setShowIOSGuide(false)}
                  aria-label="Close install instructions"
                  className="min-w-[44px] min-h-[44px] rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-100 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="mt-2.5 text-sm text-slate-600 leading-relaxed">
                1. Tap <strong>Share</strong> in Safari.<br />
                2. Tap <strong>Add to Home Screen</strong> for offline play.
              </p>
              <button
                type="button"
                onClick={() => setShowIOSGuide(false)}
                className="mt-5 w-full min-h-[46px] rounded-full bg-slate-900 text-white font-display font-bold text-sm hover:bg-slate-800 cursor-pointer"
              >
                Got It
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};

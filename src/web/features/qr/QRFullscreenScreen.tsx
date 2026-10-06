import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCard } from '@/web/app/CardContext';
import { renderQRToCanvas } from '@/web/lib/qr-renderer';
import { buildCompactVCard } from '@/shared/vcard';
import { DeviceTools } from '@/native/device-tools';
import { useSwipeGesture } from '@/web/lib/useSwipeGesture';
import { X, Sun, ChevronDown } from 'lucide-react';

export const QRFullscreenScreen: React.FC = () => {
  const { card, style, photoDataUrl } = useCard();
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Swipe down to dismiss with haptics
  useSwipeGesture({
    onSwipeDown: () => navigate('/'),
    triggerHaptics: true,
  });

  // Keep screen awake while on fullscreen QR
  useEffect(() => {
    DeviceTools.keepScreenOn({ enabled: true });
    return () => {
      DeviceTools.keepScreenOn({ enabled: false });
    };
  }, []);

  // Render pure high-contrast QR
  useEffect(() => {
    if (!card || !canvasRef.current) return;
    const payload = buildCompactVCard(card);

    let img: HTMLImageElement | null = null;
    if (photoDataUrl && style.centerElement.type === 'photo') {
      img = new Image();
      img.src = photoDataUrl;
    }

    renderQRToCanvas({
      canvas: canvasRef.current,
      payload,
      style: {
        ...style,
        plateColor: '#FFFFFF', // Guaranteed pure white for maximum optical contrast
        plateRadius: 16,
        quietZone: 5,
      },
      size: 800,
      photoImage: img,
      forceEccH: style.centerElement.type !== 'none' || !!photoDataUrl,
    });
  }, [card, style, photoDataUrl]);

  if (!card) {
    navigate('/');
    return null;
  }

  const fullName = [card.firstName, card.lastName].filter(Boolean).join(' ');

  return (
    <div
      role="dialog"
      aria-label="Fullscreen QR Code"
      onClick={() => navigate('/')}
      className="fixed inset-0 z-50 bg-white text-slate-900 flex flex-col justify-between items-center p-6 select-none cursor-pointer animate-in fade-in zoom-in-95 duration-200"
    >
      {/* Top Controls */}
      <div className="w-full flex items-center justify-between safe-top">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <Sun className="w-4 h-4 text-amber-500 animate-pulse" />
          <span>Maximum Contrast Active</span>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate('/');
          }}
          aria-label="Close fullscreen view"
          className="p-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors touch-target"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Hero QR Canvas */}
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-sm">
        {/* Swipe down indicator cue */}
        <div className="flex items-center gap-1 text-slate-400 text-2xs mb-4 animate-bounce">
          <ChevronDown className="w-3.5 h-3.5" />
          <span>Swipe down to dismiss</span>
        </div>

        <div className="p-4 bg-white rounded-3xl shadow-2xl border border-slate-200">
          <canvas
            ref={canvasRef}
            className="w-72 h-72 sm:w-80 sm:h-80 rounded-2xl"
          />
        </div>

        {/* Identity Details */}
        <div className="mt-6 text-center space-y-1">
          <h2 className="text-2xl font-bold font-serif text-slate-900 tracking-tight">
            {fullName}
          </h2>
          {(card.jobTitle || card.company) && (
            <p className="text-sm font-medium text-slate-600">
              {[card.jobTitle, card.company].filter(Boolean).join(' · ')}
            </p>
          )}
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 pt-2">
            Tap anywhere to return
          </p>
        </div>
      </div>

      {/* Bottom Brand Monogram */}
      <div className="safe-bottom pb-4 text-center flex items-center gap-2 text-slate-400">
        <img src="/icon.svg" alt="Parichay Monogram" className="w-4 h-4 opacity-50" />
        <span className="text-2xs font-semibold tracking-wider uppercase">
          Parichay · Offline vCard 3.0
        </span>
      </div>
    </div>
  );
};

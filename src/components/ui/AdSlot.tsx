'use client';

import React, { useEffect } from 'react';
import { siteConfig } from '@/config/site';

export interface AdSlotProps {
  slotId?: string;
  format?: 'auto' | 'rectangle' | 'horizontal';
  minHeight?: number;
  className?: string;
}

export const AdSlot: React.FC<AdSlotProps> = ({
  slotId,
  format = 'auto',
  minHeight = 250,
  className = '',
}) => {
  const isDev = process.env.NODE_ENV === 'development';

  useEffect(() => {
    if (!isDev && siteConfig.adsenseId) {
      try {
        const win = window as unknown as { adsbygoogle?: unknown[] };
        win.adsbygoogle = win.adsbygoogle || [];
        win.adsbygoogle.push({});
      } catch {
        // Ignore adsbygoogle errors
      }
    }
  }, [isDev]);

  // In development, do not render ad scripts to prevent noise and CLS issues
  if (isDev) {
    return (
      <aside
        aria-label="Advertisement placeholder"
        style={{ minHeight: `${minHeight}px` }}
        className={`w-full flex items-center justify-center my-6 rounded-xl border border-dashed border-slate-300 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 text-xs text-slate-400 select-none ${className}`}
      >
        <span className="opacity-60">
          Ad Slot ({minHeight}px reserved) {siteConfig.adsenseId ? `[ID: ${siteConfig.adsenseId}]` : ''}
        </span>
      </aside>
    );
  }

  // If no AdSense ID configured in production, render nothing
  if (!siteConfig.adsenseId) {
    return null;
  }

  return (
    <aside
      aria-label="Advertisement"
      style={{ minHeight: `${minHeight}px` }}
      className={`w-full overflow-hidden my-6 flex justify-center items-center ${className}`}
    >
      <ins
        className="adsbygoogle block w-full text-center"
        style={{ display: 'block', minHeight: `${minHeight}px` }}
        data-ad-client={siteConfig.adsenseId}
        data-ad-slot={slotId || 'default'}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </aside>
  );
};

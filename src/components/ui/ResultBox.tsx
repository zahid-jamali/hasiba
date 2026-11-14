'use client';

import React, { useState } from 'react';
import { Button } from './Button';
import { Locale } from '@/i18n/types';
import { getDictionary } from '@/i18n';
import { useDigits } from '@/context/DigitsContext';

export interface ResultItem {
  label: string;
  value: string | number;
}

export interface ResultBoxProps {
  title?: string;
  primaryResult: string | number;
  unit?: string;
  items?: ResultItem[];
  notes?: string;
  shareMessage?: string;
  locale: Locale;
  className?: string;
}

export const ResultBox: React.FC<ResultBoxProps> = ({
  title,
  primaryResult,
  unit,
  items = [],
  notes,
  shareMessage,
  locale,
  className = '',
}) => {
  const t = getDictionary(locale);
  const { formatDigits } = useDigits();
  const [copied, setCopied] = useState(false);

  const formattedPrimary = formatDigits(primaryResult);

  const copyTextToClipboard = async () => {
    const textToCopy =
      shareMessage ||
      `${title ? `${title}: ` : ''}${formattedPrimary} ${unit || ''}`.trim();

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(textToCopy);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = textToCopy;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Ignore clipboard write failures
    }
  };

  const handleWhatsAppShare = () => {
    const message =
      shareMessage ||
      `${title ? `${title}: ` : ''}${formattedPrimary} ${unit || ''}\nhttps://hasiba.zetawala.com`.trim();
    const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      aria-live="polite"
      className={`rounded-2xl border-2 border-brand-700/30 dark:border-brand-600/40 bg-gradient-to-b from-brand-50/50 via-white to-surface-50 dark:from-[#0c1c15] dark:via-[#091711] dark:to-[#06140e] p-6 sm:p-8 shadow-sm ${className}`}
    >
      {title && (
        <p className="text-xs sm:text-sm font-bold uppercase tracking-wider text-brand-800 dark:text-emerald-300 mb-2">
          {title}
        </p>
      )}

      {/* Big Result Display */}
      <div className="flex items-baseline flex-wrap gap-2 my-2">
        <span className="text-4xl sm:text-5xl font-black tracking-tight text-slate-950 dark:text-white">
          {formattedPrimary}
        </span>
        {unit && (
          <span className="text-xl sm:text-2xl font-bold text-brand-800 dark:text-emerald-300">
            {unit}
          </span>
        )}
      </div>

      {/* Breakdown / Secondary items */}
      {items.length > 0 && (
        <div className="mt-5 pt-4 border-t border-brand-100 dark:border-brand-900/40 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          {items.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-2.5 rounded-xl bg-white/90 dark:bg-[#14261e]/90 border border-surface-200 dark:border-surface-800 shadow-2xs"
            >
              <span className="text-slate-600 dark:text-slate-400 font-medium">
                {item.label}
              </span>
              <span className="font-bold text-slate-900 dark:text-slate-100">
                {formatDigits(item.value)}
              </span>
            </div>
          ))}
        </div>
      )}

      {notes && (
        <p className="mt-4 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          {notes}
        </p>
      )}

      {/* Action Buttons: Copy & WhatsApp Share */}
      <div className="mt-6 pt-4 border-t border-brand-100 dark:border-brand-900/40 flex flex-wrap gap-3">
        <Button
          variant={copied ? 'success' : 'outline'}
          size="md"
          onClick={copyTextToClipboard}
          className="flex-1 min-w-[140px] font-bold"
        >
          {copied ? `✓ ${t.ui.copied}` : `📋 ${t.ui.copy}`}
        </Button>

        <Button
          variant="primary"
          size="md"
          onClick={handleWhatsAppShare}
          className="flex-1 min-w-[140px] bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold"
        >
          <span>💬 {t.ui.shareWhatsApp}</span>
        </Button>
      </div>
    </div>
  );
};

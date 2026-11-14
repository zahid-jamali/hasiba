import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'muted' | 'accent';
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  className = '',
  ...props
}) => {
  const variantStyles = {
    default:
      'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm',
    muted:
      'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800',
    accent:
      'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/50',
  };

  return (
    <div
      className={`rounded-2xl border p-5 sm:p-6 transition-colors ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

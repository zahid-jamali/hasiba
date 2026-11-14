import React from 'react';
import Link from 'next/link';

export default function ArabicNotFound() {
  const popularTools = [
    {
      title: 'حساب العمر',
      description: 'احسب عمرك بالتفصيل بالهجري والميلادي والسنوات والأشهر والأيام',
      href: '/age-calculator/',
      icon: '⏳',
    },
    {
      title: 'التاريخ الهجري اليوم',
      description: 'معرفة تاريخ اليوم بالهجري والميلادي والتقويم الإسلامي',
      href: '/hijri-date-today/',
      icon: '📅',
    },
    {
      title: 'سعر الذهب اليوم',
      description: 'أسعار الذهب والفضة في السعودية والإمارات ومصر والدول العربية',
      href: '/gold-price/',
      icon: '🪙',
    },
    {
      title: 'حاسبة الزكاة',
      description: 'حساب زكاة المال وعروض التجارة والذهب والفضة والأسهم',
      href: '/zakat-calculator/',
      icon: '⚖️',
    },
    {
      title: 'مكافأة نهاية الخدمة',
      description: 'حساب مكافأة نهاية الخدمة وفق نظام العمل السعودي وقانون العمل الإماراتي',
      href: '/end-of-service/',
      icon: '💼',
    },
    {
      title: 'حاسبة الحمل والولادة',
      description: 'احسبي موعد الولادة المتوقع وأسابيع الحمل ومراحل نمو الجنين',
      href: '/pregnancy-calculator/',
      icon: '👶',
    },
  ];

  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full text-center space-y-10">
      <div className="space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300 font-black text-2xl border border-brand-200 dark:border-brand-800">
          404
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-950 dark:text-white">
          عذراً، الصفحة غير موجودة
        </h1>
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
          الصفحة التي تحاول الوصول إليها قد تم نقلها أو حذفها، أو ربما أدخلت رابطاً غير صحيح. يمكنك تصفح حاسباتنا الشهيرة أدناه أو العودة إلى الصفحة الرئيسية.
        </p>

        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 rounded-xl font-bold text-sm bg-brand-700 hover:bg-brand-800 text-white transition-all shadow-sm active:scale-[0.99] min-h-[44px]"
          >
            العودة إلى الصفحة الرئيسية ←
          </Link>
        </div>
      </div>

      {/* Popular Tools Grid */}
      <div className="pt-8 border-t border-slate-200 dark:border-slate-800 space-y-6 text-start">
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 text-center">
          حاسبات شائعة قد تهمك
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {popularTools.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-brand-500 dark:hover:border-brand-500 hover:shadow-md transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="text-2xl mb-2">{tool.icon}</div>
                <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors mb-1">
                  {tool.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                  {tool.description}
                </p>
              </div>

              <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 text-xs font-bold text-brand-700 dark:text-brand-400 flex items-center justify-between">
                <span>فتح الحاسبة</span>
                <span>←</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

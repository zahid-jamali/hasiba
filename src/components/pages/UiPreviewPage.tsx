'use client';

import React, { useState } from 'react';
import { Locale } from '@/i18n/types';
import {
  Card,
  Button,
  NumberInput,
  Select,
  SegmentedToggle,
  DateFields,
  ResultBox,
  Breadcrumbs,
  FaqAccordion,
  RelatedTools,
  AdSlot,
  DigitsPreferenceToggle,
} from '@/components/ui';

interface UiPreviewPageProps {
  locale: Locale;
}

export const UiPreviewPage: React.FC<UiPreviewPageProps> = ({ locale }) => {
  const [numberVal, setNumberVal] = useState('1446');
  const [selectVal, setSelectVal] = useState('ksa');
  const [calendarMode, setCalendarMode] = useState<'hijri' | 'gregorian'>('hijri');
  const [day, setDay] = useState<number>(15);
  const [month, setMonth] = useState<number>(9);
  const [year, setYear] = useState<number>(1446);

  const isAr = locale === 'ar';

  const breadcrumbs = [
    { label: isAr ? 'الرئيسية' : 'Home', href: isAr ? '/' : '/en/' },
    { label: isAr ? 'دليل مكونات الواجهة' : 'UI Components', href: isAr ? '/ui-preview/' : '/en/ui-preview/' },
    { label: isAr ? 'المعاينة التفاعلية' : 'Interactive Preview' },
  ];

  const faqItems = [
    {
      question: isAr ? 'هل الحاسبة متوافقة مع الهواتف الذكية؟' : 'Is Hasiba optimized for mobile?',
      answer: isAr
        ? 'نعم، تم تصميم جميع العناصر وفق نهج Mobile-First وبأهداف لمس لا تقل عن 44 بكسل لسهولة الاستخدام.'
        : 'Yes, every component is built mobile-first with touch targets of at least 44px.',
    },
    {
      question: isAr ? 'كيف يتم التعامل مع الأرقام المشرقية (١٢٣)؟' : 'How are Eastern digits handled?',
      answer: isAr
        ? 'يتم تحويل الأرقام العربية-المشرقية والفارسية تلقائياً وبدقة إلى أرقام قياسية برمجياً بواسطة مكتبة digits.ts.'
        : 'Eastern and Persian digits are automatically normalized to Western digits for accurate computation.',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 w-full">
      {/* Page Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-6">
        <Breadcrumbs items={breadcrumbs} locale={locale} />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">
              {isAr ? 'نظام التصميم ومكونات الواجهة' : 'Design System & UI Components'}
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {isAr
                ? 'معاينة شاملة لكافة عناصر الواجهة (RTL / LTR) مع دعم الوضع الداكن'
                : 'Comprehensive component showcase (RTL / LTR) with dark mode support'}
            </p>
          </div>
          <DigitsPreferenceToggle locale={locale} />
        </div>
      </div>

      {/* 1. Buttons */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 border-s-4 border-brand-600 ps-3">
          1. Buttons (Variants, Sizes & States)
        </h2>
        <Card className="flex flex-wrap items-center gap-3">
          <Button variant="primary">{isAr ? 'زر رئيسي' : 'Primary Button'}</Button>
          <Button variant="secondary">{isAr ? 'زر ثانوي' : 'Secondary'}</Button>
          <Button variant="outline">{isAr ? 'زر إطار' : 'Outline'}</Button>
          <Button variant="ghost">{isAr ? 'زر شفاف' : 'Ghost'}</Button>
          <Button variant="success">{isAr ? 'زر نجاح' : 'Success'}</Button>
          <Button variant="primary" disabled>{isAr ? 'معطل' : 'Disabled'}</Button>
          <Button variant="primary" size="sm">{isAr ? 'صغير' : 'Small'}</Button>
          <Button variant="primary" size="lg">{isAr ? 'كبير' : 'Large'}</Button>
        </Card>
      </section>

      {/* 2. NumberInput */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 border-s-4 border-brand-600 ps-3">
          2. NumberInput (Accepts Arabic-Indic & Western Digits)
        </h2>
        <Card className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <NumberInput
            label={isAr ? 'مبلغ المال أو الراتب' : 'Salary or Amount'}
            placeholder={isAr ? 'اكتب مثلاً: ١٥٠٠٠ أو 15000' : 'Type 15000 or ١٥٠٠٠'}
            value={numberVal}
            onChange={(val) => setNumberVal(val)}
            helperText={isAr ? `القيمة المعالجة برمجياً: ${numberVal}` : `Normalized value: ${numberVal}`}
            startAdornment={<span>💰</span>}
            endAdornment={<span className="text-xs">{isAr ? 'ر.س' : 'SAR'}</span>}
          />

          <NumberInput
            label={isAr ? 'حقل به خطأ اختباري' : 'Input with Validation Error'}
            placeholder="0"
            value="abc"
            error={isAr ? 'الرجاء إدخال أرقام صحيحة فقط' : 'Please enter valid digits only'}
          />
        </Card>
      </section>

      {/* 3. SegmentedToggle & Select */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 border-s-4 border-brand-600 ps-3">
          3. SegmentedToggle & Select Dropdowns
        </h2>
        <Card className="space-y-6">
          <SegmentedToggle
            label={isAr ? 'نوع التقويم' : 'Calendar System'}
            value={calendarMode}
            onChange={(val) => setCalendarMode(val)}
            options={[
              { value: 'hijri', label: isAr ? '🌙 تقويم هجري' : '🌙 Hijri Calendar' },
              { value: 'gregorian', label: isAr ? '📅 تقويم ميلادي' : '📅 Gregorian Calendar' },
            ]}
          />

          <Select
            label={isAr ? 'الدولة ونظام العمل' : 'Country & Labor System'}
            value={selectVal}
            onChange={(e) => setSelectVal(e.target.value)}
            options={[
              { value: 'ksa', label: isAr ? 'المملكة العربية السعودية (نظام العمل السعودي)' : 'Saudi Arabia (Labor Law)' },
              { value: 'uae', label: isAr ? 'دولة الإمارات العربية المتحدة (قانون العمل الإماراتي)' : 'United Arab Emirates (Labor Law)' },
              { value: 'egypt', label: isAr ? 'جمهورية مصر العربية' : 'Egypt' },
              { value: 'kuwait', label: isAr ? 'دولة الكويت' : 'Kuwait' },
            ]}
          />
        </Card>
      </section>

      {/* 4. DateFields (Day / Month / Year) */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 border-s-4 border-brand-600 ps-3">
          4. DateFields (Day / Month / Year Selects)
        </h2>
        <Card>
          <DateFields
            locale={locale}
            calendarType={calendarMode}
            day={day}
            month={month}
            year={year}
            onDayChange={setDay}
            onMonthChange={setMonth}
            onYearChange={setYear}
            label={
              isAr
                ? `تاريخ محدد (${calendarMode === 'hijri' ? 'هجري' : 'ميلادي'}): ${day}/${month}/${year}`
                : `Selected Date (${calendarMode}): ${year}-${month}-${day}`
            }
          />
        </Card>
      </section>

      {/* 5. ResultBox */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 border-s-4 border-brand-600 ps-3">
          5. ResultBox (Prominent Typography, Copy & WhatsApp Share)
        </h2>
        <ResultBox
          locale={locale}
          title={isAr ? 'مكافأة نهاية الخدمة التقديرية' : 'Estimated End of Service Gratuity'}
          primaryResult={48500}
          unit={isAr ? 'ريال سعودي' : 'SAR'}
          items={[
            { label: isAr ? 'الراتب الأساسي المحسوب' : 'Basic Salary', value: '10,000 SAR' },
            { label: isAr ? 'مدة الخدمة الإجمالية' : 'Total Service Duration', value: isAr ? '4 سنوات و 6 أشهر' : '4 yrs, 6 mos' },
            { label: isAr ? 'طريقة انتهاء العلاقة' : 'Contract Termination', value: isAr ? 'إنهاء عقد من صاحب العمل' : 'Termination by Employer' },
          ]}
          notes={isAr ? 'ملاحظة: هذا الحساب استرشادي وفقاً للمادة 84 من نظام العمل السعودي.' : 'Note: Guidance calculation based on Article 84 of Saudi Labor Law.'}
        />
      </section>

      {/* 6. Card Variants */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 border-s-4 border-brand-600 ps-3">
          6. Card Variants (Default, Muted, Accent)
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card variant="default">
            <h3 className="font-bold mb-1">Default Card</h3>
            <p className="text-xs text-slate-500">Standard surface with gentle shadow.</p>
          </Card>
          <Card variant="muted">
            <h3 className="font-bold mb-1">Muted Card</h3>
            <p className="text-xs text-slate-500">Subtle background for secondary data.</p>
          </Card>
          <Card variant="accent">
            <h3 className="font-bold mb-1">Accent Card</h3>
            <p className="text-xs text-slate-500">Emerald-tinted card for callouts.</p>
          </Card>
        </div>
      </section>

      {/* 7. FaqAccordion */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 border-s-4 border-brand-600 ps-3">
          7. FaqAccordion (Pure CSS native details/summary)
        </h2>
        <FaqAccordion
          title={isAr ? 'الأسئلة الشائعة حول النظام' : 'Frequently Asked Questions'}
          items={faqItems}
        />
      </section>

      {/* 8. AdSlot */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 border-s-4 border-brand-600 ps-3">
          8. AdSlot (Reserved height to guarantee 0 CLS)
        </h2>
        <AdSlot minHeight={120} />
      </section>

      {/* 9. RelatedTools */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 border-s-4 border-brand-600 ps-3">
          9. RelatedTools Grid
        </h2>
        <RelatedTools currentSlug="ui-preview" category="money" locale={locale} limit={3} />
      </section>
    </div>
  );
};

import React from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import { buildMetadata } from '@/components/seo';
import { siteConfig } from '@/config/site';
import { ContentPageLayout } from '@/components/pages/ContentPageLayout';
import { Card } from '@/components/ui/Card';

export const metadata: Metadata = buildMetadata({
  slug: 'contact',
  lang: 'ar',
  customTitle: 'اتصل بنا – حاسبة',
  customDescription: 'تواصل مباشرة مع فريق حاسبة التابع لشبكة زيتاوالا للاقتراحات، الشراكات، أو الإبلاغ عن أي استفسار أو خطأ تقني.',
});

export default function ArabicContactPage() {
  const contactEmail = siteConfig.parent.email || 'support@zetawala.com';

  return (
    <ContentPageLayout
      locale="ar"
      title="اتصل بنا"
      description="نحن هنا لمساعدتكم والاستماع إلى مقترحاتكم واستفساراتكم حول كافة أدوات وحاسبات منصة حاسبة."
      badge="خدمة الزوار"
      lastUpdated="نوفمبر 2026"
    >
      {/* Static site notice & Email block */}
      <section className="space-y-4">
        <p>
          نظراً لأن منصة <strong>حاسبة</strong> هي منصة رقمية ثابتة وخفيفة (Fully Static) مصممة لحماية خصوصية زوارها بنسبة 100% دون جمع أي بيانات عبر نماذج خوادم خلفية، فإن قناة التواصل الرسمية والمباشرة مع فريق الدعم الفني والتحريري هي عبر البريد الإلكتروني.
        </p>

        <div className="p-6 rounded-2xl bg-gradient-to-br from-brand-50 to-white dark:from-slate-900 dark:to-brand-950/30 border border-brand-200 dark:border-brand-900/60 not-prose space-y-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-600 text-white flex items-center justify-center font-bold text-lg">
              ✉️
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                البريد الإلكتروني المباشر للتواصل
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                وقت الاستجابة المتوقع: خلال 24 إلى 48 ساعة عمل
              </p>
            </div>
          </div>

          <div className="pt-2">
            <a
              href={`mailto:${contactEmail}`}
              className="inline-flex items-center gap-3 px-5 py-3 rounded-xl bg-brand-700 hover:bg-brand-800 text-white font-bold text-base sm:text-lg transition-all shadow-sm active:scale-[0.99] min-h-[44px]"
            >
              <span>{contactEmail}</span>
              <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
      </section>

      {/* Inquiries Categories */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          الموضوعات التي نرحب باستقبالها
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 not-prose">
          <Card className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-brand-600 font-bold text-base">💡</span>
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
                اقتراح حاسبة جديدة
              </h3>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              إذا كانت هناك أداة حسابية أو نظام مالي أو وظيفي يهم المستخدمين في منطقتك وترغب في إضافته إلى حاسبة، يسعدنا تزويدنا بتفاصيل الفكرة والأنظمة المعتمدة.
            </p>
          </Card>

          <Card className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-amber-500 font-bold text-base">🔍</span>
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
                الإبلاغ عن خطأ أو تحديث نظامي
              </h3>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              إذا لاحظت صدور تعديل تشريعي جديد في أنظمة العمل أو أسعار الصرف أو رصدت أي خلل فني في إحدى الحاسبات، يرجى مراسلتنا فوراً لتصحيحه.
            </p>
          </Card>

          <Card className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-blue-600 font-bold text-base">🤝</span>
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
                التعاون والاستفسارات الإعلامية
              </h3>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              للاستفسارات المتعلقة بالاقتباس، الشراكات الرقمية، أو حقوق الملكية الفكرية التابعة لشبكة زيتاوالا.
            </p>
          </Card>

          <Card className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-emerald-600 font-bold text-base">🛡️</span>
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
                طلبات الخصوصية والبيانات
              </h3>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              لأي استفسار يخص سياسة الخصوصية، ملفات تعريف الارتباط، أو الامتثال للسياسات الإعلانية المعتمدة من Google AdSense.
            </p>
          </Card>
        </div>
      </section>

      {/* Parent Network Details */}
      <section className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
          معلومات الشبكة الأم
        </h2>
        <Card variant="muted" className="not-prose flex flex-col sm:flex-row items-center sm:items-start gap-4">
          <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-1 flex items-center justify-center shrink-0">
            <Image
              src={siteConfig.parent.logo}
              alt="Zetawala Logo"
              width={40}
              height={40}
              className="object-contain"
            />
          </div>
          <div className="space-y-1 text-center sm:text-start">
            <div className="font-bold text-slate-900 dark:text-slate-100 text-base">
              شبكة زيتاوالا للأدوات والخدمات الرقمية (Zetawala)
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              الموقع الرسمي:{' '}
              <a
                href={siteConfig.parent.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-brand-700 dark:text-brand-400 hover:underline"
              >
                https://zetawala.com
              </a>
            </p>
          </div>
        </Card>
      </section>
    </ContentPageLayout>
  );
}

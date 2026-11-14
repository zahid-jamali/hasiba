import React from 'react';
import type { Metadata } from 'next';
import { buildMetadata } from '@/components/seo';
import { siteConfig } from '@/config/site';
import { ContentPageLayout } from '@/components/pages/ContentPageLayout';
import { Card } from '@/components/ui/Card';

export const metadata: Metadata = buildMetadata({
  slug: 'disclaimer',
  lang: 'ar',
  customTitle: 'إخلاء المسؤولية القانونية والطبية – حاسبة',
  customDescription: 'إخلاء المسؤولية الخاص بنتائج وحسابات منصة حاسبة، وطبيعة التقديرات الاسترشادية والتعليمية غير الملزمة رسمياً.',
});

export default function ArabicDisclaimerPage() {
  const contactEmail = siteConfig.parent.email || 'support@zetawala.com';

  return (
    <ContentPageLayout
      locale="ar"
      title="إخلاء المسؤولية"
      description="توضح هذه الصفحة الطبيعة الاسترشادية لكافة نتائج الأدوات الحسابية المنشورة على منصة حاسبة التابعة لشبكة زيتاوالا."
      badge="تنبيه قانوني"
      lastUpdated="14 نوفمبر 2026"
    >
      {/* General Disclaimer */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          طبيعة الحسابات والتقديرات الاسترشادية
        </h2>
        <p>
          يتم توفير جميع الأدوات والحاسبات البرمجية على موقع <strong>حاسبة (Hasiba)</strong> لأغراض <strong>تعليمية واسترشادية وتخطيطية عامة فقط</strong>. وعلى الرغم من حرصنا البالغ وتدقيقنا المستمر للخوارزميات ومطابقتها مع الأنظمة والقوانين المعمول بها، فإن النتائج الصادرة عن هذه الأدوات لا تعتبر بديلاً بأي حال من الأحوال عن الرأي والاستشارة الرسمية المتخصصة.
        </p>

        <Card variant="muted" className="border-amber-300 dark:border-amber-800/60 bg-amber-50/50 dark:bg-amber-950/20 space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-amber-600 text-lg">⚠️</span>
            <h3 className="font-bold text-amber-900 dark:text-amber-200 text-base">
              تنبيه هام للمستخدمين:
            </h3>
          </div>
          <p className="text-sm text-amber-800 dark:text-amber-300 leading-relaxed">
            المرجعيات الرسمية الصادرة عن الوزارات والجهات الحكومية والمؤسسات الطبية والشرعية المعتمدة هي وحدها صاحبة القول الفصل في أي نزاع أو تطبيق رسمي.
          </p>
        </Card>
      </section>

      {/* Domain specific disclaimers */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          توضيحات متخصصة حسب مجالات الأدوات
        </h2>

        <div className="space-y-4 not-prose">
          {/* Labor Law */}
          <Card className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-blue-600 font-bold text-base">⚖️</span>
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
                1. استشارات العمل ومكافأة نهاية الخدمة
              </h3>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              الحسابات الصادرة عن حاسبة مكافأة نهاية الخدمة (السعودية والإمارات) مبنية على القواعد العامة لأنظمة العمل. تخضع النزاعات الفعلية وبنود العقود الخاصة والتفاصيل الدقيقة لتقديرات المحاكم العمالية وقرارات وزارة الموارد البشرية والتنمية الاجتماعية في السعودية، أو وزارة الموارد البشرية والتوطين في دولة الإمارات.
            </p>
          </Card>

          {/* Medical & Pregnancy */}
          <Card className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-rose-500 font-bold text-base">🩺</span>
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
                2. الاستشارات الطبية وحاسبة الحمل
              </h3>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              تعتبر مواعيد الولادة وتحديد أسابيع الحمل تقديرات حسابية إحصائية مبنية على قاعدة نيغلي السريرية. لا تقدم هذه الحاسبة أي تشخيص أو استشارة طبية علاجية، ويجب على المرأة الحامل استشارة طبيب النساء والتوليد المختص وإجراء فحوصات الموجات الصوتية الدورية لتأكيد صحة الأم والجنين.
            </p>
          </Card>

          {/* Religious & Zakat */}
          <Card className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-emerald-600 font-bold text-base">🤲</span>
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
                3. الأحكام الشرعية وحاسبة الزكاة
              </h3>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              تقدم حاسبة الزكاة حسابات مستندة إلى القواعد الفقهية الشائعة وأنصبة الذهب والفضة المعتمدة لدى هيئة الزكاة والضريبة والجمارك (ZATCA). في الحالات المالية أو الاستثمارية المعقدة أو المسائل الفقهية الخلافية، ننصح بالرجوع إلى دور الإفتاء الرسمية والعلماء الموثوقين.
            </p>
          </Card>

          {/* Gold & Financial */}
          <Card className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-amber-500 font-bold text-base">🪙</span>
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
                4. أسعار الذهب والقرارات الاستثمارية
              </h3>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              أسعار المعادن الثمينة مستمدة من مؤشرات البورصات العالمية، ولا تشمل أجور المصنعية وتكاليف الدمغة وضريبة القيمة المضافة التي يحددها كل صائغ أو متجر محلي. لا تعد هذه البيانات نصيحة لشراء أو بيع الذهب أو التداول في الأسواق المالية.
            </p>
          </Card>
        </div>
      </section>

      {/* Limitation of Liability */}
      <section className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          حدود المسؤولية القانونية
        </h2>
        <p>
          لا تتحمل منصة حاسبة ولا شبكة زيتاوالا أو فريق المطورين أي مسؤولية عن أي أضرار مادية، أو خسائر مالية، أو قرارات إدارية أو شخصية قد يتخذها المستخدم بناءً على مخرجات هذه الأدوات. يتحمل المستخدم وحده كامل المسؤولية عن تدقيق البيانات والتأكد من مطابقتها لحالته الخاصة.
        </p>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          لأي استفسار بخصوص هذه البنود، يرجى مراسلتنا على: {contactEmail}
        </p>
      </section>
    </ContentPageLayout>
  );
}

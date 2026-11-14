import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { buildMetadata } from '@/components/seo';
import { siteConfig } from '@/config/site';
import { ContentPageLayout } from '@/components/pages/ContentPageLayout';
import { Card } from '@/components/ui/Card';

export const metadata: Metadata = buildMetadata({
  slug: 'terms',
  lang: 'ar',
  customTitle: 'شروط الاستخدام – حاسبة',
  customDescription: 'شروط وأحكام استخدام منصة حاسبة التابعة لشبكة زيتاوالا، والقواعد المنظمة للاستخدام الشخصي والتعليمي.',
});

export default function ArabicTermsPage() {
  const contactEmail = siteConfig.parent.email || 'support@zetawala.com';

  return (
    <ContentPageLayout
      locale="ar"
      title="شروط الاستخدام"
      description="تحدد هذه الوثيقة الشروط والأحكام التي تحكم استخدامك لمنصة حاسبة وكافة الأدوات والحاسبات الرقمية التابعة لشبكة زيتاوالا."
      badge="الأحكام والشروط"
      lastUpdated="14 نوفمبر 2026"
    >
      {/* 1. Acceptance */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          1. قبول الشروط
        </h2>
        <p>
          باستخدامك لموقع <strong>حاسبة (Hasiba)</strong> التابع لشبكة زيتاوالا (Zetawala)، فإنك توافق على الالتزام الكامل بهذه الشروط والأحكام، وكافة القوانين واللوائح المعمول بها. إذا كنت لا توافق على أي من هذه الشروط، يرجى عدم استخدام الموقع.
        </p>
      </section>

      {/* 2. Permitted Use */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          2. الاستخدام المسموح به
        </h2>
        <p>
          يتم توفير حاسبة وأدواتها مجاناً للاستخدام الشخصي، التعليمي، والاسترشادي. يحظر عليك:
        </p>
        <ul className="list-disc list-inside space-y-1 text-sm text-slate-700 dark:text-slate-300 pe-2">
          <li>استخدام الموقع في أي أنشطة تنتهك القوانين والأنظمة المحلية أو الدولية.</li>
          <li>محاولة اختراق الموقع، أو تعطيل أدواته، أو إرسال طلبات آلية مكثفة (Scraping أو DDoS) تؤثر على استقرار الخوادم.</li>
          <li>إعادة هندسة الكود المصدري أو نسخ الموقع لأغراض تجارية مضللة دون إذن خطي مسبق من شبكة زيتاوالا.</li>
        </ul>
      </section>

      {/* 3. Intellectual Property */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          3. الملكية الفكرية
        </h2>
        <p>
          كافة حقوق الملكية الفكرية، بما يشمل التصاميم، النصوص، الشعارات، الهوية البصرية، والخوارزميات البرمجية في منصة حاسبة، هي ملكية حصرية لـ <strong>شبكة زيتاوالا (Zetawala Network)</strong> ومحمية بموجب أنظمة حماية حقوق المؤلف والعلامات التجارية المعمول بها دولياً.
        </p>
      </section>

      {/* 4. Accuracy & Educational Disclaimer */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          4. طبيعة النتائج وإخلاء المسؤولية
        </h2>
        <p>
          نحن نبذل أقصى جهد برمجي وبحثي لضمان دقة وصحة كافة المعادلات الحسابية والأسعار المعروضة، ومع ذلك:
        </p>
        <Card variant="muted" className="space-y-2">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            تُقدم كافة النتائج لأغراض استرشادية وتعليمية وتخطيطية عامة فقط، ولا تعتبر بديلاً عن الاستشارات القانونية أو المحاسبية أو الطبية أو الدينية الرسمية. تقع مسؤولية اتخاذ أي قرارات مالية أو مهنية على عاتق المستخدم وحده.
          </p>
        </Card>
        <p>
          يرجى مراجعة صفحة{' '}
          <Link
            href="/disclaimer/"
            className="font-bold text-brand-700 dark:text-brand-400 underline"
          >
            إخلاء المسؤولية
          </Link>{' '}
          للاطلاع على التوضيحات القانونية الكاملة.
        </p>
      </section>

      {/* 5. Advertising & Third-Party Content */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          5. الإعلانات الرقمية والروابط الخارجية
        </h2>
        <p>
          قد يعرض الموقع إعلانات تجارية لجهات خارجية عبر برنامج Google AdSense. لا تشكل هذه الإعلانات تأييداً أو تزكية من حاسبة أو شبكة زيتاوالا للمنتجات أو الخدمات المعلن عنها.
        </p>
      </section>

      {/* 6. Modifications to Terms */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          6. تعديل الشروط
        </h2>
        <p>
          تحتفظ شبكة زيتاوالا بالحق في تعديل أو تحديث هذه الشروط في أي وقت دون إشعار مسبق. ويعد استمرارك في استخدام الموقع بعد نشر أي تعديلات قبولاً ضمنياً بالشروط المعدلة.
        </p>
      </section>

      {/* 7. Contact */}
      <section className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
          7. التواصل للاستفسارات القانونية
        </h2>
        <p>
          لأي استفسارات قانونية بخصوص شروط الاستخدام، يمكنكم مراسلتنا عبر:{' '}
          <a
            href={`mailto:${contactEmail}`}
            className="font-bold text-brand-700 hover:text-brand-800 dark:text-brand-400 underline"
          >
            {contactEmail}
          </a>
        </p>
      </section>
    </ContentPageLayout>
  );
}

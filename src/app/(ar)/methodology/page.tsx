import React from 'react';
import type { Metadata } from 'next';
import { buildMetadata } from '@/components/seo';
import { ContentPageLayout } from '@/components/pages/ContentPageLayout';
import { Card } from '@/components/ui/Card';

export const metadata: Metadata = buildMetadata({
  slug: 'methodology',
  lang: 'ar',
  customTitle: 'منهجية الحساب ومصادر البيانات – حاسبة',
  customDescription: 'تعرف على المنهجية الرياضية ومصادر البيانات الرسمية والأنظمة القانونية المعتمدة في كافة حاسبات منصة حاسبة.',
});

export default function ArabicMethodologyPage() {
  return (
    <ContentPageLayout
      locale="ar"
      title="منهجية الحساب ومصادر البيانات"
      description="نلتزم بأعلى معايير الدقة والشفافية في حاسبة. إليكم التفصيل الكامل لكافة القوانين والمعادلات ومصادر البيانات المعتمدة في أدواتنا."
      badge="الشفافية والمنهجية"
      lastUpdated="نوفمبر 2026"
    >
      {/* Overview statement */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          المبادئ العامة لمنهجية حاسبة
        </h2>
        <p>
          تعتمد منصة <strong>حاسبة (Hasiba)</strong> التابعة لشبكة زيتاوالا على نهج هندسي ورياضي صارم قائم على ثلاثة مبادئ رئيسية:
        </p>
        <ol className="list-decimal list-inside space-y-2 pe-2">
          <li>
            <strong>المرجعية النظامية والتشريعية:</strong> الالتزام الحرفي بنصوص الأنظمة واللوائح الرسمية الصادرة عن الجهات الحكومية في السعودية والإمارات ومصر والدول العربية.
          </li>
          <li>
            <strong>التدفق اللحظي للبيانات:</strong> ربط مؤشرات الأسعار والعملات مع منصات التداول العالمية الموثوقة ذات التحديث المستمر.
          </li>
          <li>
            <strong>المعالجة المحلية الآمنة:</strong> تنفيذ كافة الخوارزميات الحسابية داخل متصفح المستخدم دون إرسال البيانات الشخصية أو المالية إلى أي خوادم خارجية.
          </li>
        </ol>
      </section>

      {/* Tool 1: Hijri Date & Converter */}
      <section className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 rounded-lg bg-brand-100 dark:bg-brand-900/60 text-brand-800 dark:text-brand-300 flex items-center justify-center font-bold text-sm">
            1
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
            حاسبة التاريخ الهجري وتحويل التواريخ
          </h2>
        </div>

        <p>
          يتم احتساب التاريخ الهجري وفقاً لمعيار <strong>تقويم أم القرى الرسمي</strong> المعتمد في المملكة العربية السعودية ومجلس التعاون لدول الخليج العربية.
        </p>

        <Card variant="muted" className="space-y-3">
          <h3 className="font-bold text-sm uppercase tracking-wider text-slate-700 dark:text-slate-300">
            المرجع التقني والبرمجي:
          </h3>
          <ul className="list-disc list-inside space-y-1 text-sm text-slate-600 dark:text-slate-400">
            <li>
              استخدام بروتوكول المعايير الدولية <code>Intl.DateTimeFormat</code> المعرف بالمحدد الشرعي الفلكي <code>en-u-ca-islamic-umalqura</code>.
            </li>
            <li>
              معايرة التوقيت القياسي العالمي <code>UTC noon (12:00 UTC)</code> لضمان عدم حدوث أي انزياح أو خطأ في اليوم عند التنقل بين المناطق الزمنية المختلفة في العالم العربي.
            </li>
            <li>
              تحديد أطوال الأشهر القمرية بدقة فلكية (29 يوماً أو 30 يوماً) وفق جدول الحسابات الفلكية المعتمد لمدينة مكة المكرمة.
            </li>
          </ul>
        </Card>
      </section>

      {/* Tool 2: Age Calculator */}
      <section className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 rounded-lg bg-brand-100 dark:bg-brand-900/60 text-brand-800 dark:text-brand-300 flex items-center justify-center font-bold text-sm">
            2
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
            حاسبة العمر التفصيلية (ميلادي وهجري)
          </h2>
        </div>

        <p>
          تقوم حاسبة العمر بحساب الفارق الزمني المنقضي بين تاريخ الميلاد وتاريخ اليوم بدقة الأيام والشهور والسنوات:
        </p>

        <Card variant="muted" className="space-y-3">
          <h3 className="font-bold text-sm uppercase tracking-wider text-slate-700 dark:text-slate-300">
            المنهجية الحسابية:
          </h3>
          <ul className="list-disc list-inside space-y-1 text-sm text-slate-600 dark:text-slate-400">
            <li>
              <strong>العمر الميلادي:</strong> حساب الفارق الزمني الشمسي مع مراعاة السنوات الكبيسة (366 يوماً كل 4 سنوات) واختلاف أطوال الأشهر الميلادية (28، 29، 30، 31 يوماً).
            </li>
            <li>
              <strong>العمر الهجري:</strong> التحويل الكامل لتاريخ الميلاد إلى تقويم أم القرى ثم احتساب السنوات القمرية؛ حيث يبلغ متوسط طول السنة الهجرية حوالي <code>354.36</code> يوماً مقارنة بـ <code>365.24</code> يوماً للسنة الشمسية، مما يفسر فارق الـ 11 يوماً سنوياً بين التقويمين.
            </li>
            <li>
              <strong>العد التنازلي ليوم الميلاد القادم:</strong> حساب عدد الأيام المتبقية حتى تاريخ يوم الميلاد التالي بالهجري والميلادي مع ذكر اسم اليوم.
            </li>
          </ul>
        </Card>
      </section>

      {/* Tool 3: Gold & Silver Prices */}
      <section className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200 flex items-center justify-center font-bold text-sm">
            3
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
            أسعار الذهب والفضة ومؤشرات المعادن
          </h2>
        </div>

        <p>
          يتم استخراج أسعار الذهب والفضة الخام من البورصات العالمية وتحويلها بالعملات المحلية للدول العربية وفق المعادلة الرياضية المعيارية لصناعة الصاغة:
        </p>

        <Card variant="muted" className="space-y-3">
          <h3 className="font-bold text-sm uppercase tracking-wider text-slate-700 dark:text-slate-300">
            مصادر البيانات والمعادلات:
          </h3>
          <ul className="list-disc list-inside space-y-1 text-sm text-slate-600 dark:text-slate-400">
            <li>
              <strong>السعر العالمي:</strong> التغذية المباشرة للأونصة من بورصة لندن للمعادن (LBMA) ومزودي البيانات الماليين الدوليين (GoldAPI.io).
            </li>
            <li>
              <strong>أسعار الصرف:</strong> واجهة برمجة أسعار الصرف الدولية المفتوحة (<code>open.er-api.com</code>) الصادرة عن البنوك المركزية، وتُحدث تلقائياً كل 6 ساعات.
            </li>
            <li>
              <strong>التحويل الوزني للأونصة:</strong> الأونصة الترويسية المعيارية تساوي <code>31.1034768</code> جراماً.
            </li>
            <li>
              <strong>حساب نقاء العيارات:</strong>
              <div className="font-mono text-xs mt-1 bg-white dark:bg-slate-900 p-2 rounded border border-slate-200 dark:border-slate-700">
                عيار 24 = 100% نقاء | عيار 22 = (22 ÷ 24) = 91.67%<br />
                عيار 21 = (21 ÷ 24) = 87.50% | عيار 18 = (18 ÷ 24) = 75.00%
              </div>
            </li>
            <li>
              <strong>الوحدات التراثية:</strong> تشمل الجنيه الذهب المصري (8 جرامات عيار 21)، والتولة الخليجية (11.6638 جراماً عيار 24).
            </li>
          </ul>
        </Card>
      </section>

      {/* Tool 4: Zakat Calculator */}
      <section className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-200 flex items-center justify-center font-bold text-sm">
            4
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
            حاسبة الزكاة الشرعية والأنصبة
          </h2>
        </div>

        <p>
          تمت صياغة قواعد حاسبة الزكاة بناءً على الفقه الإسلامي المعتمد وإرشادات هيئة الزكاة والضريبة والجمارك (ZATCA) في المملكة العربية السعودية:
        </p>

        <Card variant="muted" className="space-y-3">
          <h3 className="font-bold text-sm uppercase tracking-wider text-slate-700 dark:text-slate-300">
            القواعد الفقهية وأنصبة الزكاة:
          </h3>
          <ul className="list-disc list-inside space-y-1 text-sm text-slate-600 dark:text-slate-400">
            <li>
              <strong>نصاب الذهب:</strong> 20 ديناراً شرعياً، ويعادل بدقة <strong>85 جراماً</strong> من الذهب الخالص (عيار 24).
            </li>
            <li>
              <strong>نصاب الفضة:</strong> 200 درهم شرعي، ويعادل بدقة <strong>595 جراماً</strong> من الفضة الخالصة.
            </li>
            <li>
              <strong>التحديث التلقائي للنصاب:</strong> يتم حساب النصاب النقدي لحظياً بضرب سعر الجرام المباشر اليوم في قيمة النصاب بالجرامات بالعملة المختارة.
            </li>
            <li>
              <strong>نسبة الزكاة الواجبة:</strong> ربع العشر أي <strong>2.5%</strong> للسنة القمرية (الهجرية)، أو <strong>2.577%</strong> في حال اعتماد السنة الشمسية (الميلادية).
            </li>
            <li>
              <strong>الأصول المشمولة:</strong> النقد، الذهب والفضة المدخرين، عروض التجارة، الأسهم الاستثمارية والمضاربة، مع خصم الديون والالتزامات الفورية.
            </li>
          </ul>
        </Card>
      </section>

      {/* Tool 5: End of Service Gratuity */}
      <section className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-900 dark:text-blue-200 flex items-center justify-center font-bold text-sm">
            5
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
            حاسبة مكافأة نهاية الخدمة (السعودية والإمارات)
          </h2>
        </div>

        <p>
          تعد هذه الأداة من أكثر الأدوات دقة، حيث تفصل بين الأنظمة العمالية للدولتين وتراعي سبب إنهاء العلاقة التعاقدية (فسخ العقد، انتهاء المدة، أو الاستقالة):
        </p>

        <Card variant="muted" className="space-y-3">
          <h3 className="font-bold text-sm uppercase tracking-wider text-slate-700 dark:text-slate-300">
            المرجعيات القانونية المعتمدة:
          </h3>
          <div className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
            <div>
              <strong className="text-slate-900 dark:text-slate-100">المملكة العربية السعودية (نظام العمل):</strong>
              <ul className="list-disc list-inside mt-1 space-y-0.5">
                <li>المادة (84): أجر نصف شهر عن كل سنة من السنوات الخمس الأولى، وأجر شهر كامل عن كل سنة تالية.</li>
                <li>المادة (85) - في حالة الاستقالة: لا شيء للخدمة أقل من سنتين، ثلث المكافأة (من سنتين إلى 5 سنوات)، ثلثي المكافأة (من 5 إلى 10 سنوات)، والمكافأة كاملة بعد 10 سنوات.</li>
                <li>المادة (87): استثناءات استحقاق المكافأة كاملة كحالات ترك العمل لقوة قاهرة أو إنهاء المرأة لعقدها خلال 6 أشهر من الزواج أو 3 أشهر من الوضع.</li>
              </ul>
            </div>

            <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
              <strong className="text-slate-900 dark:text-slate-100">دولة الإمارات العربية المتحدة (قانون العمل):</strong>
              <ul className="list-disc list-inside mt-1 space-y-0.5">
                <li>المرسوم بقانون اتحادي رقم (33) لسنة 2021 بشأن تنظيم علاقات العمل ولائحته التنفيذية.</li>
                <li>أجر 21 يوماً عن كل سنة من السنوات الخمس الأولى، وأجر 30 يوماً عن كل سنة مما زاد عن ذلك.</li>
                <li>إلغاء التمييز القديم بين الاستقالة وإنهاء الخدمة في عقود العمل محددة المدة وفق التعديل الاتحادي الجديد.</li>
              </ul>
            </div>
          </div>
        </Card>
      </section>

      {/* Tool 6: Pregnancy Calculator */}
      <section className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 rounded-lg bg-rose-100 dark:bg-rose-950 text-rose-900 dark:text-rose-200 flex items-center justify-center font-bold text-sm">
            6
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
            حاسبة الحمل وموعد الولادة المتوقع
          </h2>
        </div>

        <p>
          تطبق حاسبة الحمل الإرشادات الطبية والسريرية المعتمدة لدى الكلية الأمريكية لأطباء النساء والتوليد (ACOG) ومنظمة الصحة العالمية (WHO):
        </p>

        <Card variant="muted" className="space-y-3">
          <h3 className="font-bold text-sm uppercase tracking-wider text-slate-700 dark:text-slate-300">
            المنهجية السريرية (قاعدة نيغلي - Naegele’s Rule):
          </h3>
          <ul className="list-disc list-inside space-y-1 text-sm text-slate-600 dark:text-slate-400">
            <li>
              <strong>فترة الحمل المعيارية:</strong> تحتسب مدة الحمل الكاملة بـ <strong>280 يوماً (40 أسبوعاً)</strong> ابتداءً من اليوم الأول لآخر دورة شهرية منتظمة (LMP).
            </li>
            <li>
              <strong>معايرة طول الدورة الشهرية:</strong> في حال كانت دورة المرأة تختلف عن المتوسط المعتاد (28 يوماً)، يتم تعديل المعادلة بإضافة أو طرح الفارق الزمني (مثلاً دورة مدتها 30 يوماً تضيف يومين إلى موعد الولادة المتوقع).
            </li>
            <li>
              <strong>تقسيم الثلث (Trimesters):</strong> الثلث الأول (الأسابيع 1 إلى 13)، الثلث الثاني (الأسابيع 14 إلى 27)، والثلث الثالث (الأسابيع 28 إلى 40 فأكثر).
            </li>
            <li>
              <strong>تنبيه طبي:</strong> تعتبر النتيجة تقديراً استرشادياً، ويجب دائماً تأكيد الموعد النهائي عبر فحص الموجات فوق الصوتية (السونار) لدى الطبيب المختص.
            </li>
          </ul>
        </Card>
      </section>
    </ContentPageLayout>
  );
}

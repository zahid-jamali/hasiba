import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { buildMetadata } from '@/components/seo';
import { siteConfig } from '@/config/site';
import { ContentPageLayout } from '@/components/pages/ContentPageLayout';
import { Card } from '@/components/ui/Card';

export const metadata: Metadata = buildMetadata({
  slug: 'about',
  lang: 'ar',
  customTitle: 'عن حاسبة – أدوات حساب مجانية ودقيقة للعالم العربي',
  customDescription: 'تعرف على حاسبة التابعة لشبكة زيتاوالا، ورسالتنا في تقديم أدوات حسابية مجانية ودقيقة تخضع للتدقيق وفق الأنظمة واللوائح الرسمية.',
});

export default function ArabicAboutPage() {
  const contactEmail = siteConfig.parent.email || 'support@zetawala.com';

  return (
    <ContentPageLayout
      locale="ar"
      title="عن حاسبة"
      description="منصة الحسابات الرقمية الدقيقة والمجانية للعالم العربي ودول الخليج، من شبكة زيتاوالا."
      badge="عن المنصة"
      lastUpdated="نوفمبر 2026"
    >
      {/* Intro & Zetawala Parent Block */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          من نحن ودورنا في شبكة زيتاوالا
        </h2>
        <p>
          <strong>حاسبة (Hasiba)</strong> هي منصة حسابية رقمية رائدة متخصصة في توفير أدوات وحسابات يومية ومهنية وشرعية فائقة الدقة والسرعة لمستخدمي العالم العربي ومواطني ومقيمي دول مجلس التعاون الخليجي.
        </p>
        <p>
          انطلقت حاسبة كإحدى المبادرات الرقمية المحورية ضمن <strong>شبكة زيتاوالا (Zetawala Network)</strong>، وهي شبكة تكنولوجية رائدة متخصصة في تطوير الأدوات والخدمات الرقمية العامة والمجانية عبر الويب، وتهدف إلى تمكين الأفراد والمهنيين من إنجاز حساباتهم المعقدة بسهولة وأمان وبلا أي قيود أو اشتراكات مدفوعة.
        </p>

        <Card variant="muted" className="my-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
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
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
                عضو معتمد في شبكة زيتاوالا
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                يمكنكم التعرف على مشاريع الشبكة ورؤيتها الشاملة للأدوات المفتوحة عبر زيارة موقعنا الأم:{' '}
                <a
                  href={siteConfig.parent.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-brand-700 hover:text-brand-800 dark:text-brand-400 underline"
                >
                  zetawala.com
                </a>
              </p>
            </div>
          </div>
        </Card>
      </section>

      {/* Mission */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          رسالتنا ورؤيتنا
        </h2>
        <p>
          لاحظنا وجود نقص واضح في الأدوات الحسابية العربية المتوافقة مع الأنظمة المحلية والتقويمات الإقليمية، حيث كانت معظم الأدوات المتاحة إما قديمة التصميم، أو تعتمد على معادلات غربية غير متوافقة مع القوانين الخليجية، أو تتطلب تسجيل حسابات معقدة واشتراكات مالية.
        </p>
        <p>
          تتمثل رسالة حاسبة في تزويد كل مستخدم عربي ومقيم بأدوات مجانية، خفيفة، سريعة التحميل، وتعمل بكفاءة تامة على الهواتف الذكية والأجهزة اللوحية، مع التزام صارم بخصوصية المستخدم حيث تتم جميع العمليات الحسابية محلياً داخل المتصفح.
        </p>
      </section>

      {/* How formulas are audited */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          كيف ندقق المعادلات الحسابية والأنظمة؟
        </h2>
        <p>
          نحن في حاسبة ندرك أن نتائج الحسابات تترتب عليها قرارات مالية وشخصية ومهنية هامة. لذلك لا نعتمد على تقديرات عامة، بل نطبق معايير تدقيق صارمة تستند إلى المرجعيات الرسمية:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 not-prose my-6">
          <Card className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-brand-600 text-lg">⚖️</span>
              <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
                أنظمة العمل ومكافأة نهاية الخدمة
              </h3>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              مدققة ومبرمجة حرفياً وفق المواد (84، 85، 87) من نظام العمل السعودي، وأحكام المرسوم بقانون اتحادي رقم (33) لسنة 2021 في دولة الإمارات العربية المتحدة.
            </p>
          </Card>

          <Card className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-brand-600 text-lg">🌙</span>
              <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
                التقويم الهجري وأم القرى
              </h3>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              تعتمد معيار تقويم أم القرى الرسمي الصادر في المملكة العربية السعودية عبر التنسيق الفلكي المعتمد دولياً في بروتوكول Intl الرسمي.
            </p>
          </Card>

          <Card className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-brand-600 text-lg">🪙</span>
              <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
                أسعار الذهب والفضة والعملات
              </h3>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              مربوطة بالتسعيرة العالمية الفورية لبورصة لندن للمعادن (LBMA) ومعدلات الصرف البنكية المحدثة دورياً كل 6 ساعات لكافة الدول العربية.
            </p>
          </Card>

          <Card className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-brand-600 text-lg">🩺</span>
              <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
                حساب الحمل ومراحل نمو الجنين
              </h3>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              مبنية على قاعدة نيغلي السريرية الموصى بها من قبل الكلية الأمريكية لأطباء النساء والتوليد (ACOG) ومنظمة الصحة العالمية.
            </p>
          </Card>
        </div>

        <p>
          لمزيد من التفاصيل الدقيقة حول المعادلات المستخدمة، ندعوكم لمراجعة صفحة{' '}
          <Link
            href="/methodology/"
            className="font-bold text-brand-700 hover:text-brand-800 dark:text-brand-400 underline"
          >
            منهجية الحساب ومصادر البيانات
          </Link>
          .
        </p>
      </section>

      {/* Suggest improvements & report errors */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          الاقتراحات والإبلاغ عن الأخطاء
        </h2>
        <p>
          التحسين المستمر هو جوهر عملنا في شبكة زيتاوالا. إذا لاحظت أي تحديث تشريعي جديد في أنظمة العمل، أو ترغب في اقتراح أداة حسابية جديدة تخدم مجتمعك، أو واجهت أي خطأ تقني، يسعدنا للغاية أن نسمع منك.
        </p>
        <p>
          يمكنكم التواصل المباشر مع فريق التطوير والتدقيق عبر البريد الإلكتروني المخصص:
        </p>

        <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 not-prose flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="text-xs text-slate-500 font-semibold mb-1">
              البريد الإلكتروني المباشر للدعم والاقتراحات:
            </div>
            <a
              href={`mailto:${contactEmail}`}
              className="text-lg font-bold text-brand-700 dark:text-brand-400 hover:underline"
            >
              {contactEmail}
            </a>
          </div>

          <Link
            href="/contact/"
            className="px-5 py-2.5 rounded-xl font-bold text-sm bg-brand-700 text-white hover:bg-brand-800 transition-colors shrink-0"
          >
            صفحة اتصل بنا ←
          </Link>
        </div>

        <p className="text-sm text-slate-500 dark:text-slate-400">
          نلتزم بمراجعة كافة الرسائل والاقتراحات والرد عليها خلال مدة تتراوح بين 24 إلى 48 ساعة عمل.
        </p>
      </section>
    </ContentPageLayout>
  );
}

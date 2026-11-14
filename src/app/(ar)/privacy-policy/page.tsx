import React from 'react';
import type { Metadata } from 'next';
import { buildMetadata } from '@/components/seo';
import { siteConfig } from '@/config/site';
import { ContentPageLayout } from '@/components/pages/ContentPageLayout';
import { Card } from '@/components/ui/Card';

export const metadata: Metadata = buildMetadata({
  slug: 'privacy-policy',
  lang: 'ar',
  customTitle: 'سياسة الخصوصية – حاسبة',
  customDescription: 'سياسة الخصوصية لمنصة حاسبة التابعة لشبكة زيتاوالا، بما يتوافق مع معايير Google AdSense وحماية بيانات الزوار والشفافية الرقمية.',
});

export default function ArabicPrivacyPolicyPage() {
  const contactEmail = siteConfig.parent.email || 'support@zetawala.com';

  return (
    <ContentPageLayout
      locale="ar"
      title="سياسة الخصوصية"
      description="نلتزم في منصة حاسبة التابعة لشبكة زيتاوالا بحماية خصوصيتك التامة وشفافية استخدام البيانات الرقمية وملفات تعريف الارتباط."
      badge="الخصوصية والأمان"
      lastUpdated="14 نوفمبر 2026"
    >
      {/* 1. Introduction */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          1. مقدمة والتزامنا بالخصوصية
        </h2>
        <p>
          تحرص منصة <strong>حاسبة (Hasiba)</strong>، وهي جزء من <strong>شبكة زيتاوالا (Zetawala Network)</strong>، على حماية خصوصية زوارها ومستخدميها بأعلى المعايير المهنية والأخلاقية. توضح هذه الوثيقة كيفية تعاملنا مع البيانات عند زيارتك للموقع واستخدامك لحاسباتنا وأدواتنا المجانية.
        </p>
      </section>

      {/* 2. Zero Personal Data Collection */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          2. المعالجة المحلية للعمليات الحسابية (Client-Side Processing)
        </h2>
        <p>
          نحن نؤمن بأن خصوصيتك المالية والشخصية خط أحمر لا يمكن المساس به:
        </p>
        <Card variant="accent" className="space-y-2">
          <h3 className="font-bold text-emerald-900 dark:text-emerald-200 text-base">
            ضمانة الخصوصية الحسابية:
          </h3>
          <p className="text-sm text-emerald-800 dark:text-emerald-300">
            تتم جميع العمليات الحسابية داخل حاسبة (كتواريخ الميلاد، وقيمة الرواتب في مكافأة نهاية الخدمة، وأصول الزكاة، وتواريخ الحمل) بنسبة <strong>100% داخل متصفحك الشخصي محلياً</strong>. لا يتم إرسال أي رقم أو مدخل شخصي إلى خوادم حاسبة أو أي جهات خارجية، ولا نقوم بتخزين أو تسجيل أي من هذه العمليات في قواعد بياناتنا.
          </p>
        </Card>
      </section>

      {/* 3. LocalStorage for UI preferences */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          3. التخزين المحلي لتفضيلات الواجهة (LocalStorage)
        </h2>
        <p>
          يستخدم موقع حاسبة خاصية التخزين المحلي في متصفحك (<code>localStorage</code>) فقط لحفظ تفضيلات واجهة المستخدم الخاصة بك، مثل:
        </p>
        <ul className="list-disc list-inside space-y-1 text-sm text-slate-700 dark:text-slate-300 pe-2">
          <li>تفضيل عرض الأرقام (الأرقام الغربية 123 أو الأرقام العربية الشرقية ١٢٣).</li>
          <li>تفضيلات الوضع الليلي (Dark Mode) إن وجدت.</li>
        </ul>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          هذه البيانات تبقى محفوظة داخل جهازك الشخصي فقط ولا يتم إرسالها إلى أي خادم، ويمكنك مسحها في أي وقت عبر إعدادات متصفحك.
        </p>
      </section>

      {/* 4. Google AdSense & Third-Party Cookies (AdSense Compliant Disclosures) */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          4. إعلانات Google AdSense وملفات تعريف الارتباط
        </h2>
        <p>
          لتقديم كافة أدواتنا مجاناً وبلا أي رسوم اشتراك، نعتمد على الإعلانات الرقمية المعتمدة من برنامج <strong>Google AdSense</strong>. وبموجب متطلبات وسياسات Google الصارمة، نلفت عنايتكم إلى الآتي:
        </p>

        <div className="space-y-3 not-prose">
          <Card className="space-y-2">
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
              استخدام ملفات تعريف الارتباط من جهات خارجية:
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              تستخدم جهات خارجية، بما في ذلك Google، ملفات تعريف الارتباط (Cookies) لعرض الإعلانات استناداً إلى زيارات المستخدم السابقة لموقعنا أو لمواقع إلكترونية أخرى على شبكة الإنترنت.
            </p>
          </Card>

          <Card className="space-y-2">
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
              الإعلانات المخصصة (Personalized Advertising):
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              تتيح ملفات تعريف الارتباط الإعلانية لشركة Google وشركائها عرض إعلانات للمستخدمين استناداً إلى زيارتهم لهذا الموقع أو مواقع أخرى عبر الويب.
            </p>
          </Card>
        </div>

        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 pt-2">
          كيفية إلغاء الاشتراك في الإعلانات المخصصة:
        </h3>
        <p>
          يمكن للمستخدمين إلغاء الاشتراك في الإعلانات المخصصة من خلال زيارة صفحة إعدادات الإعلانات التابعة لـ Google:
        </p>
        <p>
          <a
            href="https://adssettings.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-bold text-brand-700 hover:text-brand-800 dark:text-brand-400 underline min-h-[44px]"
          >
            <span>إعدادات إعلانات Google (https://adssettings.google.com)</span>
            <span aria-hidden="true">↗</span>
          </a>
        </p>

        <p>
          كما يمكنكم الاطلاع على كيفية استخدام Google للمعلومات الواردة من المواقع أو التطبيقات التي تستخدم خدماتها عبر الرابط الرسمي التالي:
        </p>
        <p>
          <a
            href="https://policies.google.com/technologies/partner-sites"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-bold text-brand-700 hover:text-brand-800 dark:text-brand-400 underline min-h-[44px]"
          >
            <span>كيف تستخدم Google المعلومات من المواقع أو التطبيقات التي تستخدم خدماتنا (partner-sites)</span>
            <span aria-hidden="true">↗</span>
          </a>
        </p>
      </section>

      {/* 5. Analytics Disclosure */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          5. إحصاءات الزوار والتحليلات (Cookieless Analytics)
        </h2>
        <p>
          نستخدم خدمة تحليلات الويب الخالية من ملفات تعريف الارتباط <strong>Cloudflare Web Analytics</strong> لقياس الأداء العام وعدد الزيارات الإجمالية للصفحات. هذه الخدمة:
        </p>
        <ul className="list-disc list-inside space-y-1 text-sm text-slate-600 dark:text-slate-400 pe-2">
          <li>لا تستخدم ملفات تعريف الارتباط (Cookieless).</li>
          <li>لا تتبع هوية الزوار عبر المواقع الأخرى.</li>
          <li>لا تجمع أو تخزن أي عناوين IP أو معلومات تحدد الهوية الشخصية للمستخدم.</li>
        </ul>
      </section>

      {/* 6. External Links */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          6. الروابط الخارجية
        </h2>
        <p>
          قد يحتوي موقعنا على روابط لمواقع خارجية (مثل موقع شبكة زيتاوالا الأم، أو مواقع الجهات والوزارات الرسمية للتوثيق). نحن غير مسؤولين عن ممارسات الخصوصية أو محتوى تلك المواقع، ونحثكم على مراجعة سياسات الخصوصية الخاصة بها عند زيارتها.
        </p>
      </section>

      {/* 7. Contact for Privacy Inquiries */}
      <section className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          7. التواصل للاستفسارات المتعلقة بالخصوصية
        </h2>
        <p>
          إذا كانت لديكم أي أسئلة أو استفسارات حول سياسة الخصوصية هذه أو ممارسات حماية البيانات في حاسبة، يسعدنا تواصلكم المباشر مع مسؤول الامتثال والخصوصية عبر البريد الإلكتروني:
        </p>
        <p>
          <a
            href={`mailto:${contactEmail}`}
            className="font-bold text-brand-700 hover:text-brand-800 dark:text-brand-400 text-lg underline min-h-[44px] inline-flex items-center"
          >
            {contactEmail}
          </a>
        </p>
      </section>
    </ContentPageLayout>
  );
}

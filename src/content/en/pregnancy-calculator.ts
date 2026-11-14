import { ToolContent } from '../types';

export const content: ToolContent = {
  title: 'Pregnancy & Due Date Calculator',
  metaTitle: 'Pregnancy Due Date Calculator & Weekly Milestones | Hasiba',
  metaDescription:
    'Calculate your estimated delivery date (EDD), current gestational week, and developmental milestones in both Gregorian and Hijri calendars using clinical Naegele’s Rule.',
  h1: 'Pregnancy Due Date & Gestational Age Calculator',
  intro:
    'A clinically validated obstetrical calculator designed to help expectant mothers and healthcare seekers track pregnancy weeks, project delivery dates via Naegele’s Rule, and seamlessly align Gregorian and Umm al-Qura Hijri milestones.',
  howItWorks: {
    formula:
      'Modified Clinical Naegele’s Rule: Adding 280 days (40 gestational weeks) to the first day of the Last Menstrual Period (LMP) with cycle length adjustment (cycle length - 28 days), or adding 266 days directly to a known conception date.',
    sourceOrLaw:
      'Clinical Guidelines from the American College of Obstetricians and Gynecologists (ACOG), the World Health Organization (WHO), and the Saudi Ministry of Health Maternal Care Protocol.',
  },
  article: `## The Comprehensive Clinical Guide to Tracking Pregnancy and Due Dates

Welcoming a newborn is one of life’s most profound milestones. From the moment fertilization occurs, expectant parents embark on a 40-week physiological journey. This clinical guide explains how obstetrical due dates are determined, how menstrual variations influence timing, what developmental changes occur during each trimester, and how astronomical conversions to the Hijri calendar are accurately executed in Saudi Arabia and the wider Gulf region.

---

### How Is an Estimated Due Date (EDD) Clinically Calculated?

In obstetrical practice, pinpointing the exact hour or day of conception is challenging for most women. Sperm cells can remain viable in the female reproductive tract for up to five days, and ovulation timing can vary subtly from cycle to cycle. Consequently, modern medicine uses the **first day of your Last Menstrual Period (LMP)** as the standard universal anchor.

In the early 19th century, German obstetrician Franz Naegele formulated **Naegele’s Rule**, which remains the clinical foundation worldwide:
1. It assumes a typical menstrual cycle length of **28 days**.
2. Ovulation occurs roughly on **day 14** of the cycle.
3. Human embryonic and fetal gestation lasts approximately **266 days** (38 weeks) from conception.
4. Adding the 14 days prior to ovulation yields an official gestational age of **280 days** (40 completed weeks, or 9 calendar months plus 7 days).

Mathematically, Naegele’s calculation can be performed by adding 7 days to the first day of your LMP, subtracting 3 calendar months, and advancing by one calendar year.

---

### Adjusting for Menstrual Cycle Length Variations

Not every woman experiences a textbook 28-day cycle; healthy menstrual cycles normally range between **21 and 35 days**. Because the luteal phase (the window between ovulation and the next period) is relatively fixed at approximately 14 days, changes in total cycle length directly reflect earlier or delayed ovulation:

- **Cycles Longer Than 28 Days (e.g., 32 days)**: Ovulation typically occurs on day 18 rather than day 14. Because fertilization takes place 4 days later, the estimated due date is adjusted forward by 4 days (284 days total from LMP).
- **Cycles Shorter Than 28 Days (e.g., 24 days)**: Ovulation occurs earlier, around day 10. Consequently, the estimated due date is advanced earlier by 4 days (276 days total from LMP).

Our calculator automatically incorporates this mathematical cycle adjustment, preventing unnecessary anxiety caused by unadjusted estimations.

---

### The Three Developmental Trimesters

Obstetricians divide human pregnancy into three distinct trimesters, each spanning approximately 13 weeks:

#### 1. First Trimester (Weeks 1 through 13): Organogenesis and Formation
- **Developmental Milestones**: The fertilized zygote implants into the uterine lining as a blastocyst. By week 6, cardiac activity begins and can be visualized via transvaginal ultrasound. By week 10, all vital organ systems—brain, heart, kidneys, and limb buds—have formed.
- **Essential Maternal Care**: Daily supplementation with **folic acid (400 to 800 mcg)** is imperative to prevent neural tube defects like spina bifida.
- **Common Symptoms**: Elevated human chorionic gonadotropin (hCG) and progesterone levels frequently cause morning sickness, olfactory sensitivity, fatigue, and breast tenderness.

#### 2. Second Trimester (Weeks 14 through 27): Rapid Growth and Stability
- **Developmental Milestones**: Facial features, delicate eyelashes, and unique fingerprints form. Fetal movement (quickening) is typically felt between weeks 18 and 22.
- **Key Clinical Diagnostics**: The comprehensive Level II Anatomy Ultrasound scan evaluates organ structural integrity, placental positioning, and amniotic fluid volume. Glucose screening is administered between weeks 24 and 28 to detect gestational diabetes.

#### 3. Third Trimester (Weeks 28 through 40+): Maturation and Preparation for Birth
- **Developmental Milestones**: Fetal lungs produce surfactant, enabling atmospheric breathing after birth. Rapid subcutaneous fat accumulation helps regulate newborn body temperature.
- **Delivery Preparation**: The fetus usually assumes a cephalic (head-down) presentation within the maternal pelvis in preparation for labor.

---

### Dual-Calendar Integration: Gregorian and Umm al-Qura Hijri

For expatriates and citizens living in Saudi Arabia and Islamic nations, administrative healthcare records, maternity leaves, and family celebrations frequently intersect between the Gregorian civil calendar and the lunar **Umm al-Qura Hijri calendar**.

Because lunar years comprise approximately 354 days (11 days shorter than solar years), months do not have static Gregorian correspondents. Our calculator bridges this gap by using astronomical Umm al-Qura conversion algorithms, delivering dual-calendar milestones and day-of-the-week synchronicity with zero guesswork.`,
  example: {
    title: 'Clinical Case Example: 30-Day Cycle Due Date Calculation',
    scenario:
      'An expectant mother reports her last menstrual period began on April 8, 2025 (corresponding to 10 Shawwal 1446 AH). Her regular menstrual cycle averages 30 days (+2 days above the standard 28-day baseline).',
    calculation:
      'Standard 280 days + 2 cycle adjustment days = 282 total gestation days from LMP. April 8, 2025 + 282 days yields January 15, 2026 (Thursday). Converting January 15, 2026 to the Umm al-Qura calendar corresponds to 26 Rajab 1447 AH.',
    result:
      'Estimated Delivery Date (EDD): Thursday, January 15, 2026 (26 Rajab 1447 AH). Gestation reaches full term (Week 40) on this date.',
  },
  faqs: [
    {
      q: 'How is the estimated due date calculated using Naegele’s rule?',
      a: 'Naegele’s rule adds 280 days (40 weeks) to the first day of your last normal menstrual period (LMP). In manual shorthand, this equals adding 1 year, adding 7 days, and subtracting 3 months from your LMP date.',
    },
    {
      q: 'What if my menstrual cycle is longer or shorter than 28 days?',
      a: 'The luteal phase remains relatively constant at 14 days, so variation occurs during the follicular phase before ovulation. If your cycle is 32 days (+4 days), ovulation and your due date are postponed by 4 days. If your cycle is 24 days (-4 days), your due date is moved forward by 4 days.',
    },
    {
      q: 'Can the due date be converted to the Hijri calendar accurately?',
      a: 'Yes. Our tool utilizes the astronomical Umm al-Qura lunar algorithm to convert your Gregorian due date into the exact Hijri day, month, year, and weekday without arbitrary rounding.',
    },
    {
      q: 'How accurate is the calculated due date compared to ultrasound?',
      a: 'LMP calculations provide an outstanding initial reference, but only about 4% to 5% of women deliver on their exact calculated day. A first-trimester dating ultrasound (measuring Crown-Rump Length between weeks 8 and 13) is the clinical gold standard for confirming or adjusting your formal due date.',
    },
    {
      q: 'How do I know which week and trimester of pregnancy I am in today?',
      a: 'Gestational age is calculated from your LMP: divide elapsed days by 7 to determine your completed weeks, with remaining days indicating progress into the current week. Weeks 1–13 comprise the 1st trimester, weeks 14–27 the 2nd, and weeks 28–40+ the 3rd trimester.',
    },
    {
      q: 'What is the difference between gestational age and fetal age?',
      a: 'Gestational age begins on the first day of your last period (used in clinical obstetrics). Fetal age (conceptional age) begins at the actual moment of fertilization, roughly two weeks later. Thus, the developing fetus is developmentally approximately two weeks younger than your clinical gestational age.',
    },
    {
      q: 'When is a pregnancy considered medically full term? (Week 37 vs 40)',
      a: 'According to ACOG and WHO guidelines, a pregnancy is considered medically full-term once you reach 37 weeks, as fetal lungs and vital systems are generally mature. The 40-week mark represents your statistical estimated due date.',
    },
    {
      q: 'What should I do if my due date passes without labor starting?',
      a: 'Passing your due date is very common, especially in first pregnancies. Most obstetricians monitor fetal well-being closely using non-stress tests (cardiotocography) and amniotic fluid index checks. If spontaneous labor has not commenced by week 41 or 42, medical induction of labor is typically recommended to protect mother and child.',
    },
  ],
  sources: [
    {
      label: 'American College of Obstetricians and Gynecologists (ACOG) - Methods for Estimating Due Date',
      url: 'https://www.acog.org',
    },
    {
      label: 'World Health Organization (WHO) - Standards for Maternal and Neonatal Care',
      url: 'https://www.who.int',
    },
    {
      label: 'Saudi Ministry of Health - Pregnancy and Maternal Care Guide',
      url: 'https://www.moh.gov.sa',
    },
  ],
  updatedAt: '2026-03-01',
};

export default content;

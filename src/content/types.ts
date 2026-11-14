export interface FaqItem {
  q: string;
  a: string;
}

export interface SourceLink {
  label: string;
  url: string;
}

export interface HowItWorksContent {
  formula: string;
  sourceOrLaw: string;
}

export interface WorkedExampleContent {
  title: string;
  scenario: string;
  calculation: string;
  result: string;
}

export interface ToolContent {
  title: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  intro: string;
  howItWorks: HowItWorksContent;
  article: string;
  example: WorkedExampleContent;
  faqs: FaqItem[];
  sources: SourceLink[];
  updatedAt: string;
}

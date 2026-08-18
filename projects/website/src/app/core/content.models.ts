export type BlockType = 'prose' | 'example' | 'list' | 'note' | 'decision-tree' | 'table' | 'links';

export interface Block {
  type: BlockType;
  paragraphs?: string[];
  items?: string[];
  lead?: string | null;
  label?: string | null;
  header?: string[];
  rows?: string[][];
  links: string[];
}

/** Points at another rule by identity; its title is read from the table of contents. */
export interface RelatedRef {
  chapterId: string;
  id: string;
}

// book.json is a table of contents, not the book: it carries what every page needs to render
// navigation and metadata, and no prose beyond a one-line summary. The blocks themselves live
// in a per-chapter file that is fetched only when a reader opens that chapter.

export interface Section {
  id: string;
  chapterId: string;
  chapterTitle: string;
  title: string;
  summary: string | null;
  exampleCount: number;
  /** Dollar and percentage figures the rule itself states, lifted at build time. */
  figures: string[];
  related: RelatedRef[];
}

export interface Chapter {
  id: string;
  title: string;
  subtitle: string | null;
  heading: string;
  sections: Section[];
  summary: string | null;
  sectionCount: number;
  exampleCount: number;
}

export interface SectionContent {
  id: string;
  blocks: Block[];
}

export interface ChapterContent {
  id: string;
  intro: Block[];
  sections: SectionContent[];
}

export interface FamilyAppendix {
  id: string;
  title: string;
  heading: string;
  lead: string[];
  items: string[];
}

export interface Book {
  title: string;
  subtitle: string;
  edition: string;
  author: string;
  taxYear: number;
  chapters: Chapter[];
  appendices: {
    plans: { id: string; title: string };
    costs: { id: string; title: string };
    family: FamilyAppendix;
  };
}

export type TaxBenefit = 'credit' | 'deduction' | 'none' | 'unstated';
export type K12Status = 'not-allowed' | 'not-listed' | 'unstated';

export interface Plan {
  name: string;
  type: 'Direct-Sold' | 'Advisor-Sold' | 'Prepaid Tuition';
  url: string | null;
  note: string | null;
}

export interface StateEntry {
  name: string;
  slug: string;
  anyPlanDeduction: boolean;
  plans: Plan[];
  taxBenefit: TaxBenefit;
  taxBenefitDetail: string | null;
  k12: K12Status;
  maxContribution: number | null;
  maxContributionNote: string | null;
  morningstarGold: boolean;
  protection: string | null;
  recapture: string[];
  notes: string[];
  flagship: { school: string; total: number | null; vsNational: number | null } | null;
}

export interface StateGroup {
  label: string;
  detail: string;
  states: string[];
}

export interface StatesDoc {
  states: StateEntry[];
  groups: Record<string, StateGroup>;
  sources: { label: string; url: string }[];
}

export interface CostRow {
  state: string;
  slug: string;
  school: string;
  tuition: number | null;
  room: number | null;
  board: number | null;
  books: number | null;
  total: number | null;
  vsNational: number | null;
}

export interface CostsDoc {
  id: string;
  title: string;
  heading: string;
  rows: CostRow[];
  national: { tuition: number; room: number; board: number; books: number; total: number } | null;
}

export interface SiteDoc {
  figures: {
    headline: { value: string; label: string; note: string; asOf: string }[];
    keyNumbers: { amount: string; label: string; sub: string; link: [string, string] }[];
    awareness: { value: string; label: string }[];
  };
  timeline: { year: string; title: string; body: string }[];
  comparison: {
    columns: string[];
    rows: { label: string; values: string[]; best: number }[];
    footnote: string;
  };
  quickAnswers: {
    item: string;
    status: 'qualified' | 'conditional' | 'not-qualified';
    detail: string;
    link: [string, string];
  }[];
  disclaimer: string;
  highlights: {
    featured: {
      name: string;
      tag: string;
      tone: 'gp' | 'parent' | 'student' | 'business';
      text: string;
      route: string[];
    }[];
  };
}

export interface SearchHit {
  kind: 'section' | 'chapter' | 'state';
  title: string;
  context: string;
  route: string[];
  fragment?: string;
  snippet: string;
  score: number;
}

/**
 * Search matches against `tokens` joined back together. They are unique and sorted, so the
 * index behaves like the prose for substring matching but cannot be read as the book.
 */
export interface SearchEntry {
  kind: SearchHit['kind'];
  title: string;
  context: string;
  route: string[];
  tokens: string[];
  excerpt: string;
}

export interface SearchIndex {
  entries: SearchEntry[];
}

// The manuscript is flat text with no markup, so the chapter/section boundaries have to be
// declared. Each `heading` below is matched against the source line verbatim (after
// normalising smart quotes, dashes and whitespace); build-content.mjs fails loudly if any
// heading stops matching, which is what keeps this file honest when the manuscript is edited.

/** @typedef {{type:'chapter'|'section'|'skip'|'appendix', id?:string, title?:string, heading:string, kind?:string}} Boundary */

/** @type {Boundary[]} */
export const outline = [
  { type: 'chapter', id: 'forward', title: 'Foreword', heading: 'Foreword' },
  { type: 'skip', heading: 'Table of Contents' },

  {
    type: 'chapter',
    id: 'federal-tips',
    title: 'Federal Plan Tip Summary',
    heading: 'Summary of Federal 529 Tips:',
  },

  {
    type: 'chapter',
    id: 'history',
    title: 'Thirty Years of 529 Plans',
    subtitle: '1996 – 2026',
    heading: 'Federal program tips:',
  },

  {
    type: 'chapter',
    id: 'state-differences',
    title: 'State Plan Differences',
    heading: 'Federal laws now give guidance, but each state has its OWN plan with its OWN rules.',
  },

  { type: 'chapter', id: 'basics', title: 'Account Basics', heading: 'Account Basics' },
  { type: 'section', id: 'you-are-in-control', heading: 'You are in control.' },
  {
    type: 'section',
    id: 'you-stay-the-owner',
    heading:
      'You are and will stay the owner of the 529 funds. Funds may be disbursed back to you at any time.',
  },
  { type: 'section', id: 'you-decide-the-beneficiary', heading: 'You decide the beneficiary.' },
  {
    type: 'section',
    id: 'name-a-successor',
    heading: 'Each account should have a Successor, in the case of the Owner’s death.',
  },
  {
    type: 'section',
    id: 'change-ownership',
    heading: 'You can decide to CHANGE your ownership to someone else without a fee at any time.',
  },
  {
    type: 'section',
    id: 'change-beneficiary',
    heading:
      'You can decide to CHANGE the Beneficiary to someone else–including yourself–without a fee at any time.',
  },
  {
    type: 'section',
    id: 'change-successor',
    heading: 'You can decide to CHANGE the Successor to someone else without a fee at any time.',
  },
  {
    type: 'section',
    id: 'unlimited-accounts-owner',
    heading: 'Account owners can have unlimited family and friend beneficiary accounts.',
  },
  {
    type: 'section',
    id: 'unlimited-accounts-beneficiary',
    heading:
      'Beneficiaries may have unlimited accounts in their name from different parents, grandparents, kind friends, etc.',
  },
  {
    type: 'section',
    id: 'deposits',
    heading:
      'Deposits are made via direct payroll deposit, check, ACH, or wire. You can link your bank account for monthly or one time contributions.',
  },
  {
    type: 'section',
    id: 'employers-and-trusts',
    heading: 'Employers, trusts, and other entities may contribute.',
  },
  {
    type: 'section',
    id: 'tax-refunds-and-pfd',
    heading: 'Tax returns or PFDs can be directly gifted to the 529 plan.',
  },
  {
    type: 'section',
    id: 'special-occasion-gifts',
    heading:
      'Special occasion gifts can be made by others for graduation, birthday, or other special days.',
  },
  {
    type: 'section',
    id: 'family-transfers',
    heading: 'Transfers may be made between accounts of family members.',
  },
  {
    type: 'section',
    id: 'able-rollovers',
    heading:
      'ABLE* accounts for disabled people may be rolled over up to $19,000 per year from a 529 plan.',
  },

  {
    type: 'chapter',
    id: 'taxes',
    title: 'Understanding Tax Differences',
    heading: 'Understanding Tax Differences',
  },
  {
    type: 'section',
    id: 'which-state-plan',
    heading: 'In which state plan should I get an account?',
  },
  {
    type: 'section',
    id: 'deduction-or-credit',
    heading: 'Is a Tax Deduction or Credit better for contributions?',
  },
  {
    type: 'section',
    id: 'tax-free-growth',
    heading: 'Understanding qualified tax-free growth–a major benefit of 529 accounts.',
  },
  {
    type: 'section',
    id: 'maximum-balance',
    heading: 'There is a high maximum amount allowed in 529 accounts.',
  },
  {
    type: 'section',
    id: 'contribution-deadlines',
    heading: 'Contribution deadlines correspond to the current calendar/tax year.',
  },
  { type: 'section', id: 'rollovers', heading: 'Account Rollovers are allowed.' },
  { type: 'section', id: 'receiving-distributions', heading: 'Receiving Distributions' },
  {
    type: 'section',
    id: 'non-qualified-withdrawals',
    heading:
      'For any non-qualified disbursement, any taxes or fees are ONLY on the earnings portion.',
  },
  {
    type: 'section',
    id: 'penalty-waivers',
    heading: 'Tax penalties on earnings are waived in some situations.',
  },

  {
    type: 'chapter',
    id: 'fund-selection',
    title: 'Fund Selection & Distribution Logistics',
    heading: 'Fund Selection and Logistics of Distribution',
  },
  {
    type: 'section',
    id: 'changing-allocation',
    heading:
      'You can change your Fund Allocation up to 2 times per year without a fee at any time.',
  },
  {
    type: 'section',
    id: 'accounts-can-lose-money',
    heading: 'Your 529 account can lose money. Most fund selections are not FDIC insured.',
  },
  { type: 'section', id: 'time-in-the-market', heading: 'Time' },

  {
    type: 'chapter',
    id: 'k-12',
    title: 'Using the 529 for K–12',
    heading: 'Using the 529 for K – 12:',
  },
  {
    type: 'section',
    id: 'state-k12-conformity',
    heading: 'Not all states allow K-12 qualified distributions.',
  },
  {
    type: 'section',
    id: 'tuition-books-software',
    heading: 'You may pay for school tuition, books, and software through a 529 account.',
  },
  { type: 'section', id: 'tutors', heading: 'You may pay for a tutor through a 529 account.' },
  { type: 'section', id: 'what-is-a-tutor', heading: 'What is a “tutor”?' },
  {
    type: 'section',
    id: 'disability-therapies',
    heading: 'Beneficiaries with disabilities can pay for treatments.',
  },
  {
    type: 'section',
    id: 'tests-and-dual-enrollment',
    heading: 'High school age benefits include test fees and advanced course tuition.',
  },

  {
    type: 'chapter',
    id: 'post-secondary',
    title: 'Post-Secondary School',
    heading: 'Post- Secondary school',
  },
  { type: 'section', id: 'getting-a-plan', heading: 'Getting a Plan' },
  { type: 'section', id: 'how-much-to-help', heading: 'How much should I help?' },
  { type: 'section', id: 'qualified-schools', heading: 'What schools are “qualified”?' },
  {
    type: 'section',
    id: 'financial-aid',
    heading: '529 accounts have limited effects on the need-based student aid calculation.',
  },
  {
    type: 'section',
    id: 'tuition-books-fees',
    heading: 'You may pay for tuition, books, or fees with a 529 account.',
  },
  {
    type: 'section',
    id: 'apprenticeships',
    heading: 'Registered apprenticeship expenses qualify.',
  },
  {
    type: 'section',
    id: 'credentials-and-licensing',
    heading: 'Postsecondary Credentialing, Certificates, or Licensing expenses qualify.',
  },
  {
    type: 'section',
    id: 'scholarships',
    heading: 'What if your beneficiary receives a scholarship?',
  },
  {
    type: 'section',
    id: 'room-and-board',
    heading: 'You may pay for room and board if the student is enrolled one-half time.',
  },
  {
    type: 'section',
    id: 'computers-and-internet',
    heading: 'You may pay for computer hardware, software and internet access fees while enrolled.',
  },
  {
    type: 'section',
    id: 'not-qualified',
    heading: 'What may you NOT spend your 529 funds on?',
  },
  {
    type: 'section',
    id: 'recordkeeping',
    heading:
      'Account owners are responsible for keeping any documents that support a qualified or nonqualified withdrawal.',
  },

  {
    type: 'chapter',
    id: 'after-graduation',
    title: 'After Graduation',
    heading: 'AFTER GRADUATION',
  },
  {
    type: 'section',
    id: 'leave-the-account-open',
    heading:
      'You should consider leaving the account open after post secondary education is finished, as there remain many benefits.',
  },
  {
    type: 'section',
    id: 'your-own-account-for-loans',
    heading:
      'You may want your OWN account after college to pay for up to $10,000 qualified education loan principal or interest.',
  },
  {
    type: 'section',
    id: 'sibling-student-loans',
    heading: 'You can repay a sibling’s student loans up to $10,000 as well.',
  },
  {
    type: 'section',
    id: 'transfer-extra-funds',
    heading:
      'You may transfer any extra funds to a family member (younger sibling?, grandchild?) who needs them.',
  },
  {
    type: 'section',
    id: 'ladder-of-giving',
    heading:
      'You could consider establishing a “ladder of giving” approach for your children and then grandchildren.',
  },
  {
    type: 'section',
    id: 'roth-rollover',
    heading: 'You may roll over any extra funds to a Roth for the beneficiary up to $35,000.',
  },
  {
    type: 'section',
    id: 'continuing-education',
    heading:
      'You may pay for continuing education through a 529 account, the rest of your entire career.',
  },
  {
    type: 'section',
    id: 'extra-credentialing',
    heading:
      'You may pay for extra credentialing, registered apprenticeship expenses, or certificates through a 529 account.',
  },
  {
    type: 'section',
    id: 'career-credentialing',
    heading:
      'You may pay for your Credentialing expenses or your occupational licensing through a 529 account, including years after graduation.',
  },
  {
    type: 'section',
    id: 'licensing',
    heading: 'You may pay for your licensing through a 529 account, throughout your career.',
  },
  {
    type: 'section',
    id: 'closing-the-account',
    heading: 'You may want to close the account and pull excess funds out:',
  },

  { type: 'chapter', id: 'estate-planning', title: 'Estate Planning', heading: 'ESTATE PLANNING' },
  {
    type: 'section',
    id: 'completed-gifts',
    heading: 'Contributions to your 529 plans are considered “completed gifts” to the beneficiary.',
  },
  {
    type: 'section',
    id: 'superfunding',
    heading: '529 plans allow up to $190,000 to be contributed without gift tax at one time.',
  },
  {
    type: 'section',
    id: 'avoiding-gst-tax',
    heading: 'A 529 account can help avoid the Generation-Skipping Transfer (GST) tax',
  },
  {
    type: 'section',
    id: 'no-gst-on-distributions',
    heading: 'There is no Generation-Skipping Transfer (GST) tax on 529 distributions.',
  },
  {
    type: 'section',
    id: 'no-rmd-no-niit',
    heading: 'There are no RMD’s or NIIT on 529 distributions',
  },
  {
    type: 'section',
    id: 'bankruptcy-protection',
    heading: 'There is bankruptcy protection through a 529 account.',
  },
  {
    type: 'section',
    id: 'multigenerational-transfer',
    heading: 'Multigenerational wealth transferred through superfunding the 529 account.',
  },

  {
    type: 'chapter',
    id: 'maximizing',
    title: 'Maximizing 529 Advantages',
    heading: 'MAXIMIZING 529 ADVANTAGES',
  },
  { type: 'section', id: 'maximizing-funding', heading: 'Maximizing Funding' },
  { type: 'section', id: 'maximizing-k-12', heading: 'Maximizing K-12 Options' },
  {
    type: 'section',
    id: 'maximizing-post-secondary',
    heading: 'Maximizing Post Secondary options',
  },
  { type: 'section', id: 'maximizing-after-graduation', heading: 'Maximizing After Graduation' },
  { type: 'section', id: 'maximizing-estate-planning', heading: 'Maximizing Estate Planning' },

  {
    type: 'chapter',
    id: 'comparisons',
    title: '529 Plans Outperform the Alternatives',
    heading: '529 PLANS OUTPERFORM ALTERNATIVE ACCOUNT TYPES',
  },
  {
    type: 'section',
    id: 'vs-prepaid-tuition',
    heading: 'A 529 investment account is better than a prepaid tuition plan.',
  },
  {
    type: 'section',
    id: 'vs-coverdell',
    heading: 'A 529 account is better than a Coverdell ESA.',
  },
  {
    type: 'section',
    id: 'vs-ugma-utma',
    heading: 'A 529 account is better than a UGMA or UTMA account.',
  },
  {
    type: 'section',
    id: 'vs-trump-account',
    heading: 'A 529 account is better than a 530A “Trump account” child IRA.',
  },
  {
    type: 'section',
    id: 'dynasty-plans',
    heading: 'Multigenerational wealth transfer through super funding the 529 account.',
  },
  {
    type: 'section',
    id: 'state-estate-tax',
    heading: 'State Estate Tax Planning Differences',
  },
  {
    type: 'section',
    id: 'penalty-free-exits',
    heading: 'Penalty-Free Exit Strategies for Unused Funds',
  },
  { type: 'section', id: 'summary', heading: 'Summary' },

  {
    type: 'appendix',
    id: 'appendix-plans',
    kind: 'plans',
    title: 'Appendix 1 · State 529 Program Descriptions',
    heading: "Appendix 1: Chart of Each State's Official 529 Program PDF",
  },
  {
    type: 'appendix',
    id: 'appendix-costs',
    kind: 'costs',
    title: 'Appendix 2 · Flagship College Cost of Attendance',
    heading: "Appendix 2: Chart of Each State's Flagship College Annual Cost of Attendance",
  },
  {
    type: 'appendix',
    id: 'appendix-family',
    kind: 'family',
    title: 'Appendix 3 · Who Is a "Member of My Family"?',
    heading: 'Appendix 3: Who Is A “Member of my Family”?',
  },
];

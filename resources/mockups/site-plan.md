# Total529.com — Site Plan

_Draft v1 · derived from `resources/full-document.md` (529 30th Anniversary Edition, C. Richard Hopkins, MD, CRPC)_

---

## 1. What this site is

An **evergreen reference site** for the 529 community. The source document is a book, but the site is not a book-reader — it is a **lookup tool with a teaching voice**. Two visitors show up:

| Visitor                                                         | Arrives from                                                                         | Wants                                                                  |
| --------------------------------------------------------------- | ------------------------------------------------------------------------------------ | ---------------------------------------------------------------------- |
| **The learner** — a parent who has heard "529" and nothing else | Search, social, word of mouth                                                        | A guided path: what it is, why it isn't only for college, how to start |
| **The looker-up** — someone mid-decision                        | Search for a specific question ("can a 529 pay for a tutor?", "Utah 529 tax credit") | One page, one answer, state caveat, an example, done                   |

Everything below optimizes for both: **pillar pages that read start-to-finish, built from atomic rule pages that stand alone in search results.**

### Positioning statement (working)

> 54% of parents say they don't know enough about 529 plans to enroll. This site is the fix.

---

## 2. The core insight: the document is already a component system

The manuscript repeats one structure ~80 times. That repetition is a gift — it becomes the site's content model.

```
RULE PAGE
├── Federal rule            "You may pay for a tutor through a 529 account."
├── The detail              plain-language explanation
├── State differences       which states diverge, and how
├── Example(s)              named story — Carrie, Bob, Vinni, Darrell…
├── Decision tree           optional, 2–4 questions
├── Watch-outs              recordkeeping, gray areas, recapture
└── Related rules           cross-links
```

Build that as **one template**, author ~80 instances, and the whole book is on the web. Every mockup below is designed around this template.

### Reusable components (design once, use everywhere)

1. **Rule card** — the federal baseline, stated as a sentence
2. **State-difference callout** — "Your state may differ" + state chips
3. **Example story card** — the named vignettes; the single most distinctive asset in the manuscript
4. **Decision tree** — interactive stepper (Which state? What's a tutor? After graduation? Roth rollover?)
5. **Figure callout** — the big numbers: `$19,000` `$95,000` `$190,000` `$35,000` `$10,000` `$20,000`
6. **Comparison table** — 529 vs. UTMA/UGMA vs. Coverdell vs. 530A vs. prepaid
7. **State chip / state detail card** — plan name, direct vs. advisor, deduction or credit, K‑12 conformity, max, PDF link
8. **Stat tile** — 17.6M accounts · $603B · $34,088 average · 54% unaware
9. **Timeline node** — the 1996→2026 history
10. **Disclaimer band** — the "no statement here is a recommendation" text, required on every money page
11. **Ladder-of-giving diagram** — sibling-to-sibling transfer web
12. **Myth/fact flip** — for the Forward's six corrections

---

## 3. Sitemap

```
/                              Home
/start-here                    Why a 529 is not just for college (the Forward, expanded)
   /start-here/myths           6 things most parents get wrong
   /start-here/how-to-open     Signing up, in order
   /start-here/glossary        Plain-English terms

/basics                        Account Basics  [hub]
   /basics/who-controls-it     Owner · beneficiary · successor
   /basics/changing-owner
   /basics/changing-beneficiary
   /basics/successor-and-trusts
   /basics/multiple-accounts
   /basics/deposits            Payroll, ACH, check, wire, tax refunds, PFD
   /basics/gifting             QR codes, birthdays, graduation
   /basics/employers-and-trusts
   /basics/able-rollovers

/taxes                         Understanding Tax Differences  [hub]
   /taxes/deduction-vs-credit
   /taxes/tax-free-growth
   /taxes/contribution-limits
   /taxes/deadlines
   /taxes/rollovers
   /taxes/distributions
   /taxes/non-qualified        Taxes & penalty on earnings only
   /taxes/penalty-waivers      Scholarship, death, disability, service academy

/investing                     Fund Selection  [hub]
   /investing/choosing-funds
   /investing/changing-allocation
   /investing/risk
   /investing/time             Start early — the compounding case

/k-12                          Using a 529 for K–12  [hub]
   /k-12/state-conformity      13 states do not allow K–12 distributions
   /k-12/tuition-and-materials
   /k-12/tutors                + "What is a tutor?" decision tree
   /k-12/disability-therapies
   /k-12/tests-and-dual-enrollment

/college                       Post-Secondary  [hub]
   /college/qualified-schools
   /college/how-much-to-help   Gifting vs. loaning (AFR)
   /college/financial-aid      EFC / SAI — 5.64% vs. 0% vs. 20%
   /college/tuition-books-fees
   /college/room-and-board
   /college/computers
   /college/apprenticeships
   /college/credentials-and-licensing
   /college/scholarships
   /college/what-you-cannot-buy
   /college/recordkeeping

/after-graduation              After Graduation  [hub]
   /after-graduation/keep-it-open
   /after-graduation/student-loans      $10,000 lifetime, incl. siblings
   /after-graduation/transfer-to-family
   /after-graduation/ladder-of-giving
   /after-graduation/roth-rollover      $35,000, 15-year rule
   /after-graduation/continuing-education
   /after-graduation/closing-the-account

/estate                        Estate Planning  [hub]
   /estate/completed-gifts
   /estate/superfunding                 $190,000 in one day
   /estate/gst-tax
   /estate/no-rmd-no-niit
   /estate/bankruptcy-protection
   /estate/multigenerational

/maximize                      Playbooks  [hub]
   /maximize/funding
   /maximize/k-12
   /maximize/college
   /maximize/after-graduation
   /maximize/estate

/compare                       529 vs. everything else  [hub]
   /compare/prepaid-tuition
   /compare/coverdell
   /compare/ugma-utma
   /compare/trump-account-530a

/states                        State Guide  [tool]
   /states/:state                       e.g. /states/utah
   /states/compare                      side-by-side picker
   /states/k-12-conformity              which states allow it
   /states/tax-benefits                 deduction vs. credit map

/tools                         Calculators & trees  [tool hub]
   /tools/which-state
   /tools/is-it-qualified
   /tools/superfunding
   /tools/growth                        start-at-birth vs. start-at-5
   /tools/roth-rollover-eligibility

/history                       30 Years of 529 Plans — 1996 → 2026
/cost-of-attendance            Appendix 2 — flagship school costs, sortable
/family-members                Appendix 3 — who counts as "family"
/about                         Author, the book, disclosures
/disclaimer                    Full legal text
```

---

## 4. Page templates (7 total)

| #   | Template         | Used by                 | Key blocks                                                                                                   |
| --- | ---------------- | ----------------------- | ------------------------------------------------------------------------------------------------------------ |
| 1   | **Home**         | `/`                     | Hero, stats band, myth flips, 8 pillar cards, state finder, featured example, book/author, disclaimer        |
| 2   | **Hub**          | 8 section landing pages | Section intro, "what you'll learn", rule list with one-line summaries, decision tree CTA, next-section link  |
| 3   | **Rule page**    | ~80 pages               | Rule statement, detail, state callout, example cards, decision tree, watch-outs, related rules, disclaimer   |
| 4   | **Tool**         | Trees, calculators      | Stepper or inputs, result panel, "here's why", links to relevant rule pages                                  |
| 5   | **State detail** | 51 pages                | Plan card(s), tax benefit, K‑12 conformity, max contribution, protections, program PDF, flagship school cost |
| 6   | **Comparison**   | `/compare/*`            | Verdict up top, feature-by-feature table, narrative, related                                                 |
| 7   | **Editorial**    | `/history`, `/about`    | Long-form with timeline / pull quotes                                                                        |

---

## 5. Navigation

**Primary (persistent):** Start Here · Basics · Taxes · Using It ▾ (K‑12 / College / After Graduation) · Estate · States · Tools

**Utility:** Search (prominent — this is a lookup site) · Glossary · About

**In-page:** sticky table of contents on rule pages; prev/next within a hub so the book can still be read in order.

**Footer:** full sitemap, disclaimer, sources, book purchase, author.

---

## 6. Content-to-site mapping

| Manuscript section              | Becomes                                     | Notes                                                                                                 |
| ------------------------------- | ------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| Forward                         | `/start-here` + `/start-here/myths`         | The 6 bullets are the site's whole value proposition — put them on the home page                      |
| Federal Tip Summary             | Home page pillar cards + hub intros         | Works as the site's skeleton, not a page of its own                                                   |
| History: 30 years               | `/history`                                  | Interactive timeline; strong shareable/PR asset for the 30th anniversary                              |
| State Plan Differences          | `/states` + every rule page's state callout | Data, not prose — belongs in a structured table                                                       |
| Account Basics                  | `/basics/*` (9 pages)                       |                                                                                                       |
| Understanding Tax Differences   | `/taxes/*` (8 pages)                        |                                                                                                       |
| Fund Selection                  | `/investing/*` (4 pages)                    |                                                                                                       |
| K–12                            | `/k-12/*` (5 pages)                         | Tutor section is the biggest traffic opportunity — it's brand new law and nobody has written about it |
| Post-Secondary                  | `/college/*` (11 pages)                     |                                                                                                       |
| After Graduation                | `/after-graduation/*` (7 pages)             | Roth rollover is the second-biggest search opportunity                                                |
| Estate Planning                 | `/estate/*` (6 pages)                       | Highest-value audience                                                                                |
| Maximizing                      | `/maximize/*` (5 playbooks)                 | Position as "advanced" — reward for scrolling                                                         |
| Account Comparisons             | `/compare/*` (4 pages)                      | Each one is a head-to-head search term                                                                |
| Appendix 1 (state PDFs)         | `/states/:state`                            | 100+ plan links, structured                                                                           |
| Appendix 2 (cost of attendance) | `/cost-of-attendance`                       | Sortable table                                                                                        |
| Appendix 3 (family members)     | `/family-members`                           | Also a reusable inline component                                                                      |
| ~100 named examples             | Example cards, sitewide                     | Tag by persona (parent / grandparent / student / business owner) and surface as a browsable library   |

---

## 7. Copy that still needs writing

Nothing on the site is blocked on new research — everything traces to the manuscript. What's missing is **web copy**, which is a different craft than book copy:

- Home page hero, subhead, section blurbs (~600 words)
- 8 hub intros (~150 words each)
- ~80 rule-page one-line summaries for hub lists and search results
- Meta titles + descriptions for ~150 pages
- Tool microcopy (question wording, result explanations)
- 51 state summaries (~60 words each — largely templatable from data)

**Recommendation:** the manuscript's sentence-case rule headings ("You may pay for a tutor through a 529 account.") already work as page titles and H1s. Keep them. They read as answers, which is exactly what search wants.

---

## 8. Functional requirements worth flagging early

- **Search is a first-class feature**, not a nicety. Half the audience arrives with a specific question.
- **State awareness.** Ask once ("Where do you file taxes?"), remember it, and personalize every state callout sitewide. This is the single biggest UX differentiator available.
- **Structured state data.** One JSON source of truth feeding the state pages, callouts, comparison tool, and conformity lists. Do not hand-write state facts into prose.
- **Annual review cadence.** Dollar figures change every year ($19,000 exclusion, $20,000 K‑12 cap, contribution maximums). Store them as named data values, render them everywhere, update once. Stamp each page with "reviewed for 2026."
- **Compliance.** The disclaimer is not optional garnish — it appears on every page that discusses money, and the site must never read as personalized advice.
- **Accessibility.** A large share of the estate-planning audience is 60+. Minimum 18px body text, WCAG AA contrast throughout, no critical information carried by color alone.

---

## 9. The three design directions

Three routes are mocked up in this folder. They differ in **layout and posture**, not just palette.

### A · Heritage — `01-heritage.html`

**Deep navy · brass · bone. Serif headlines, formal grid.**
Reads like a private bank or a university endowment. Signals permanence, fiduciary seriousness, generational wealth. Leans into the 30th anniversary and the estate-planning material.
_Best if:_ the priority audience is grandparents, high-net-worth families, and financial advisors.
_Risk:_ can feel exclusive to a 32-year-old parent opening a first account.

### B · Evergreen — `02-evergreen.html`

**Forest green · warm sand · amber. Rounded sans, soft cards, generous air.**
Warm, human, teaching-first. Growth and family without the dollar-bill-green cliché. The examples and decision trees are the heroes.
_Best if:_ the mission is closing the 54% awareness gap — reaching parents who feel intimidated by finance.
_Risk:_ the softness has to be balanced with real authority signals or it reads "blog."

### C · Almanac — `03-almanac.html`

**Ink on warm paper · vermilion accent · slate data blue. Editorial, dense, typographic.**
A reference handbook: strong hierarchy, tables, marginalia, numbered rules. Fastest to scan, best for the looker-up, cheapest to scale to 150 pages.
_Best if:_ the site is meant to be _the_ 529 reference the community links to.
_Risk:_ least "designed" at first glance; sells on use, not on the first screenshot.

**Recommendation:** **C for structure, B for warmth.** The Almanac's information density and typographic system are the right bones for 150 rule pages; Evergreen's palette and example cards are what make it inviting to the audience that doesn't know 529s exist yet. A hybrid — Almanac layout, Evergreen palette — is a legitimate fourth option worth putting to the client.

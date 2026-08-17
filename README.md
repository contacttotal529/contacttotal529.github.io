# total-529

Angular workspace for Total 529, laid out as a monorepo. Applications and libraries live under
[projects/](projects/); the public site is [projects/website/](projects/website/).

## Prerequisites

- Node.js 22+
- npm 10+

```bash
npm install
```

## Development

```bash
npm start          # dev server on http://localhost:4200
npm test           # unit tests (vitest + jsdom)
npm run lint       # eslint / angular-eslint
npm run format     # prettier --write
```

## Adding a project to the monorepo

```bash
npx ng generate application <name> --style=scss --ssr=false
npx ng generate library <name>
```

## Deployment

The site is deployed to GitHub Pages at https://contacttotal529.github.io by
[.github/workflows/deploy-pages.yml](.github/workflows/deploy-pages.yml), which runs on every push
to `develop`. The workflow lints, formats-checks, tests, builds, and uploads
`dist/website/browser` as the Pages artifact.

To reproduce the deployed bundle locally:

```bash
npm run build:pages
```

Two details make a client-side-routed Angular app work on Pages:

- `projects/website/public/.nojekyll` — stops Jekyll from dropping files that start with `_`.
- `tools/spa-fallback.mjs` — copies `index.html` to `404.html` so deep links reach the router.

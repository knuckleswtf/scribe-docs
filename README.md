# scribe-docs

This website is built using [Docusaurus 2](https://docusaurus.io/).

## Requiremrents
- Node.js 12+
- npm or Yarn (Ideally, Yarn, but npm works too.)

## Installation

```console
yarn install
```

## Local Development

```console
yarn start
```

This command starts a local development server on http://localhost:3000 and opens up a browser window. Most changes are reflected live without having to restart the server.

Note that the search bar won't be shown at all in local dev mode.

## Build

```console
yarn build
```

This command creates a production build in the `build` directory, which can then be served on localhost:3000 with `yarn serve`. 

## Deployment

The site is currently deployed to [scribe.knuckles.wtf](http://scribe.knuckles.wtf) via [Render](http://render.com). The site will build and auto-deploy on push to any branch in the repo.

## Editing
Docs are Markdown files, located within `laravel_versioned_docs/` and `nodejs_versioned_docs/`. Images and assets go in `static/`. A few custom React components, styles and pages are in `src/`.
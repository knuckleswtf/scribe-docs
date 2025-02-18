# scribe-docs

Documentation repo for [Scribe](http://scribe.knuckles.wtf). Built using [Docusaurus 2](https://docusaurus.io/).

## Requirements
- Node.js 12+
- npm or Yarn (Ideally, Yarn, but npm works too.)

## Installation

```console
yarn install
```

## Local Development

`yarn start` starts a local development server on http://localhost:3000 and opens up a browser window. Most changes are reflected live without having to restart the server.

Note that the search bar won't be shown at all in local dev mode.

## Build

`yarn build` creates a production build in the `build` directory, which can then be served on localhost:3000 with `yarn serve`. 

## Deployment

The site is currently deployed to [scribe.knuckles.wtf](http://scribe.knuckles.wtf) via [Render](http://render.com). The site will build and auto-deploy on push to any branch in the repo.

## Editing
Docs are Markdown files, located within `laravel/` and `nodejs/`. Images and assets go in `static/`. A few custom React components, styles and pages are in `src/`.

## Releasing a new version
-First, pin the _current_ docs as the old version. For example, to create docs for 6.x, tag the current ones as 5.x: `yarn run docusaurus docs:version:laravel 5.x `

- Next, add the new version to the `laravelVersionDropdown` in `docusaurus.config.js`.
- Finally, update the `versions` key for the `@docusaurus/preset-classic` section in `docusaurus.config.js`, to look something like this:

   ```
   current: {
       label: "Laravel: 6.x (current)",
       badge: true,
   },
   "4.x": {
     label: "Laravel: 5.x",
     badge: true,
     banner: 'unmaintained',
     path: '/5.x',
   }
   ```
Done! Now the docs for v5 will be in `/laravel`, and those for v5 will be in `laravel_versioned_docs/version-5.x`.

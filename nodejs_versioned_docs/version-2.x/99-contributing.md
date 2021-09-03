---
id: contributing
slug: contributing
---

# Contributing to Scribe

:::important
Please read this guide before sending in your contribution! There aren't many rules, just a few guidelines to help everyone.😄
:::

## Principles
- Don't submit sloppy work.
- Don't be a dick. You don't have to be friendly or nice, but please be respectful of other contributors.
- Focus on the contribution, not the contributor.
- Remember that people have other things to deal with in their lives, so don't expect others to respond to your PRs, issues or questions immediately.

## Tips

- If you want to make a code change, but you don't understand Scribe well enough, check out [How Scribe Works](architecture) doc.
- Before making a code change, look through open pull requests to see if there's one for the feature/fix already.
- Don't forget to update the documentation if your contribution changes some user-facing behaviour.
- Run all tests `npm test` before you modify any code. That way, if the tests fail later, you'll know it was (probably) due to something you added.
- If you change something, add tests. If you don't know how, go ahead and open a PR and ask for help.
- If your contribution changes how the generated documentation looks, please include "before" and "after" screenshots in your pull request. This will help the maintainers easily see the changes.

## Updating documentation

Documentation is powered by [Docusaurus](https://docusaurus.io) and lives as Markdown files in the [`knuckleswtf/scribe-docs`](https://github.com/knuckleswtf/scribe-docs) repository. There are two folders, `laravel` and `nodejs`. Follow the README in the docs repo for a guide on editing the docs.

:::note
The rest of this document is only important if you're making code changes.
:::

## Installing dependencies
The packages for the different supported frameworks are located in the same repository. The core package is at the root, while the framework-specific versions are in `/frameworks`.

To install dependencies for all, run `npm i` as normal. This will install dependencies for the root package and then run `npm prepare`, which will install dependencies for the framework versions.

## Local development
If you need a project to test the generated doc output on, you can use [this](https://github.com/knuckleswtf/SideProjectAPI-express) (Express). Change the path for `@knuckleswtf/scribe-express` in the `dependencies` section of the `package.json` to point to your local clone of Scribe, then run `npm i`.

The core Node.js package is written in TypeScript, while the framework versions are written in regular JavaScript. This means that you'll have to run `tsc` after editing the core files (or `tsc --watch`).

## Running tests
- To run unit tests (written with Jest): `npm run test:unit`
- To run feature tests (written with Jasmine): `npm run test:feature`
- To run all tests (unit and feature): `npm test`

## Writing tests

Tests are located in the `test/` folder. 

Feature tests are written in Jasmine, and go in `test/feature` folder. The feature tests test the framework versions of the package within the context of an application (Express/Restify).

Unit tests go in all other folders within `test/`, and are written in Jest. The Jest configuration is located in the `jest` section of the `package.json`.

When adding tests, avoid making assertions on the generated HTML output. It's a very unreliable testing approach. Instead, assert on structured, consistent data like the parsed route output and Postman collection.

## Making pull requests

Add a short description to your PR, so the reviewer knows what to look out for before looking through your changes. If you're fixing a bug, include a description of its behaviour and how your fix resolves it. If you're adding a feature, explain what it is and why.

If the PR is a simple one, you can omit the description (but don't forget to use a descriptive title).

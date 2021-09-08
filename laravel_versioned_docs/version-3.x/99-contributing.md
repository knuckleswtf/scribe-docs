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
- Run all tests (`composer test`) and linting (`composer lint`) before you modify any code. That way, if the tests fail later, you'll know it was (probably) due to something you added.
- If you change something, add tests. If you don't know how, go ahead and open a PR and ask for help.
- If your contribution changes how the generated documentation looks, please include "before" and "after" screenshots in your pull request. This will help the maintainers easily see the changes.

## Updating documentation

Documentation is powered by [Docusaurus](https://docusaurus.io) and lives as Markdown files in the [`knuckleswtf/scribe-docs`](https://github.com/knuckleswtf/scribe-docs) repository. There are two folders, `laravel_versioned_docs` and `nodejs_versioned_docs`. You can also just click on **Edit this page** at the bottom of any page to go directly to the page in the repo. Follow the README in the docs repo for a guide on editing the docs.

:::note
The rest of this document is only important if you're making code changes.
:::

## Installing dependencies
To install the regular Laravel dependencies, run `composer install`.

However, if you're testing something related to Dingo, you'll need to install the Dingo dependencies instead. To do that, set the shell variable `COMPOSER=composer.dingo.json` before running `composer install` (ie `COMPOSER=composer.dingo.json composer install`). On Windows, you can use the Node.js package [cross-env](https://npmjs.com/package/cross-env) to easily run set this.

## Local development
If you need a project to test the generated doc output on, you can use [this](https://github.com/knuckleswtf/TheSideProjectAPI) (Laravel). Change the path in the `repositories` section of the `composer.json` to point to your local clone of Scribe.

## Running tests
- To run tests for Laravel, run `composer test`. This will run all tests excluding the ones for Dingo and stop on the first failure.

- To run tests for Dingo, run `COMPOSER=composer.dingo.json composer test`. This will run only the tests for Dingo and stop on the first failure.

:::tip
You can pass options to PHPUnit by putting them after a `--`. For instance, filter by using `composer test -- --filter can_fetch_from_responsefile_tag`.
:::

:::tip
For faster test runs, you can run the tests in parallel with `composer test-parallel`. The `--filter` option is not supported here, though.
:::

## Writing tests

Tests are located in the tests/ folder. Currently, feature tests go in the `GenerateDocumentationTest` class in the base folder, unit tests go in their respective classes in the `Unit` folder, and tests for included strategies go in the `Strategies` folder.

:::note
Some tests extend `PHPUnit\Framework\TestCase` while others extend `Orchestra\Testbench\TestCase`. The first case is for tests that don't depend on any specfic Laravel functionality. The second case is for tests that depend on Laravel functionality or helpers (like `ResponseCallsTest` that depends on Laravel routing).
:::

When adding tests, avoid making assertions on the generated HTML output. It's a very unreliable testing approach. Instead, assert on structured, consistent data like the parsed route output and Postman collection.

## Linting
We use [PHPStan](https://github.com/phpstan/phpstan) for static analysis (ie to check the code for possible runtime errors without executing it).

You can run the checks by running `composer lint`.

If any errors are reported, you should normally fix the offending code. However, there are scenarios where we can't avoid some errors (for instance, due to Laravel's "magic"). In such cases, add an exception to the `phpstan.neon` file, following the examples you already see there.

## Making pull requests

Add a short description to your PR, so the reviewer knows what to look out for before looking through your changes. If you're fixing a bug, include a description of its behaviour and how your fix resolves it. If you're adding a feature, explain what it is and why.

If the PR is a simple one, you can omit the description (but don't forget to use a descriptive title).

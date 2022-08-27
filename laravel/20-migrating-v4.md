---
id: migrating-v4
---

# Migrating to v4

welcome to Scribe v4.👋 This guide aims to help you migrate from v3. Not much changed, so you should be done in less than 5 minutes. See [the release blog post](/blog/2022/08/27/laravel-v4) for the list of new features.

## Requirements
Scribe v4 requires PHP 8 and Laravel 8+. If you're on an older version, you'll need to upgrade. 

## Start
Upgrade the package version (`knuckleswtf/scribe`) in your `composer.json` to `^4.0` and then install:

```bash
composer update knuckleswtf/scribe
```

## Automated upgrade
Scribe v4 comes with an upgrade tool that will make the needed changes to your config file and inform you of any manual changes you need to make yourself:

```bash
# See what changes will be made:
php artisan scribe:upgrade --dry-run
# Run the upgrade for real
php artisan scribe:upgrade
```

The tool will back up your old config to `config/scribe.php.bak` so you can restore it if something wasn't set correctly.

:::tip
If you use multi-docs, you can run the upgrade command for each of your config files, for instance `php artisan scribe:upgrade --config scribe_admin` 
:::

## Config file changes
:::tip
`php artisan scribe:upgrade` can handle all the changes in this section. But we're listing them here for completeness.
:::

- A new `examples` key has been added, to configure how Scribe generates examples. It comes with two keys:
  - `faker_seed` (the old top-level `faker_seed` was moved here) 
  - `models_source`, for configuring how Scribe generates example models for API resources and transformers. See [the docs](/laravel/reference/config#models_source) for usage.
- A new `groups` key has been added. It comes with two items:
  - `default` (the old `default_group` was moved here)
  - `order`, where you can order your groups, subgroups and endpoints. See [the docs](/laravel/common/generating#sorting-endpoints-and-groups) for usage.


## Plugin API
If you've written custom strategies, the core API remains the same, but the class interface has changed a bit.

- The `$routeRules` parameter of `__invoke()` is now optional. This means you should replace `array $routeRules` with `array $routeRules = []`

  ```diff
  public function __invoke(
    ExtractedEndpointData $endpointData, 
  - array $routeRules
  + array $routeRules = []
  ): ?array
  ```

- There's a new instance property, `public ?ExtractedEndpointData $endpointData;`. You can add this anywhere in your class. It's not used for anything, and it's not set in the constructor, so you can ignore it, but it's a handy container to retrieve the endpoint being processed without having to pass it around.


## Blade templates
(For those who published and customized the themes' templates)

No major changes, but three things to note:
1. Because of the addition of subgroups, we had to make some changes to the `groups.blade.php` file.
2. We moved the logic that generates headings for the `sidebar.blade.php` into a `getHeadings` method in the `HtmlWriter` class.
3. We changed response fields so they can expand/collapse like body parameters. To do this, we:
   - added a `nestedResponseFields` property to the `OutputEndpointData` class.
   - renamed `body-parameters.blade.php` to `nested-fields.blad.php`, and renamed the `parameters` input parameter to `fields`.
  [Here's the commit](https://github.com/knuckleswtf/scribe/commit/00b09bbea8ec64006db864bf807004d48926c6d3).

If you're affected by these changes, ee recommend you copy the new files from the project's repo, and make any changes you had (they're relatively small files).

## Attributes (optional)
If you'd like to migrate from docblock tags to PHP 8 attributes (see [the docs on annotations](/annotations) for advantages and disadvantages), you can also do that. We've provided [a Rector rule](https://github.com/knuckleswtf/scribe-tags2attributes) to automatically convert (most of) your tags to attributes.

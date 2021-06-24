---
id: migrating-v3
---

# Migrating to v3

Hi, hello, welcome to Scribe v3.👋 While the core parts are unchanged, some parts of Scribe's behaviour have been reworked to make customization easier. This guide aims to help you migrate from v2 as easily as possible. See [the release blog post](/blog/2021/06/08/laravel-v3) for the list of new features.

## Requirements
Scribe v3 requires PHP 7.4 and Laravel/Lumen 6+. If you're on an older version, you'll need to upgrade. 

## Start
Upgrade the package version in your `composer.json` to `^3.0` and then install:

```bash
composer update knuckleswtf/scribe
```

## Automated upgrade
Scribe v3 comes with an upgrade tool that will make the needed changes to your config file and warn you of any manual changes you need to make yourself:

```bash
# See what changes will be made:
php artisan scribe:upgrade --dry-run
# Run the upgrade for real
php artisan scribe:upgrade
```

The tool will back up your old config to `config/scribe.php.bak` so you can restore it if something wasn't set correctly.

## Source files
"Source files" (you know, those weird Markdown files that Scribe generates then converts to HTML) are no longer generated to `resources/docs`. Now they will be put in a `.scribe/` folder. You can safely delete the `resources/docs` folder, unless you've manually modified some content, in which case you should see the [modifications](#modifying-the-generated-docs) section below.

## Config file changes
:::tip
The automated upgrade tool can handle most of the changes in this section. Run `php artisan scribe:upgrade`.
:::

- `router` has been removed. Scribe now auto-detects your router (yay).
- `interactive` has been replaced with `try_it_out`, which has two options:
  - `enabled`, where you enable/disable Try It Out (the old value of `interactive`), and  
  - `base_url`, that lets you set the base URL to be used for Try It Out.
- `continue_without_database_transactions` (deprecated in 2.4.0) has been removed. Instead, put the database connections you _do_ want transactions for (ie the **opposite** meaning) in `database_connections_to_transact`. If your app only uses one database setup, this should work:
  ```php
  'database_connections_to_transact' => [config('database.default')],
  ```

## Plugin API
If you've written custom strategies, the core API remains the same, but the class interface has changed a bit.

- The `$stage` property of the `Strategy` class has been removed. It wasn't used for anything.
- The `'value'` key in url/query/body parameters has been renamed to `'example'`, to make it clearer. Also, you don't need to set a `name` field anymore.
  ```php
  // in your strategy's __invoke() method
  return [
    'an_int' => [
      'type' => 'integer',
      'required' => false,
      'description' => 'An integer',
      // ❌ v2
      'value' => 12,
      // 👍 v3
      'example' => 12,
      // Unneeded in v3
      'name' => 'an_int',
    ],
  ];
  ```
- The signature of the `__invoke` method has changed. It now looks like this:
  ```php
  public function __invoke(
    Knuckles\Camel\Extraction\ExtractedEndpointData $endpointData,
    array $routeRules
  ): ?array;
  ```
  The route, http methods, controller, method, and other data about the endpoint are now properties on the `EndpointData` class. The aim here is to improve the developer experience; we've reduced the number of parameters, and switched to typed value objects over plain arrays.

See the [plugin API reference](./reference/plugin-api) and guide to [writing a plugin](./advanced/plugins) for details.

## Modifying the generated docs
Scribe has always had the concept of "intermediate" output—a place where it writes the data it has extracted about your API, giving you a chance to overwrite some things before it converts to HTML. In the past, this was a set of Markdown file (with one group of endpoints per file). Overwriting was on a per-file basis—once you edit a file, Scribe could no longer update that file (even if you changed one line), so, on future runs, all endpoints in that file would keep the same data until you discarded your changes.

In v3, Scribe now uses YAML files for intermediate output of endpoints (but "Introduction" and "Authentication" sections remain as Markdown files). This is better because YAML is structured, so it's easier for you to edit, and Scribe can also figure out what's changed, letting you overwrite parts of one endpoint, while Scribe extracts data for the rest.

For example, after generating, in your `.scribe/endpoints` folder, you'll have a file like this:

```yaml title=.scribe/endpoints/0.yaml
name: Endpoints
description: ''
endpoints:
  - httpMethods: [ "GET" ]
    uri: api/healthcheck
    metadata:
      title: Healthcheck
      description: "Check that the service is up."
      authenticated: false
    headers:
      Content-Type: application/json
      Accept: application/json
    urlParameters: []
    queryParameters: []
    bodyParameters: []
    responses:
      - status: 200
        content: '{"status":"up","services":{"database":"up","redis":"up"}}'
        headers:
          content-type: application/json
          x-ratelimit-limit: 60
          x-ratelimit-remaining: 59
        description: null
  - # Another endpoint
```

If you don't want the rate limit response headers to be included in the docs, you can just remove them (and even add new ones):

```yaml title=.scribe/endpoints/0.yaml
name: Endpoints
description: ''
endpoints:
  - httpMethods: [ "GET" ]
    # ... Endpoint info
    responses:
      - status: 200
        content: '{"status":"up","services":{"database":"up","redis":"up"}}'
        headers:
          content-type: application/json
          some-new-header: heyy
        description: null
  - # Another endpoint
```

And just like that, Scribe will show only these headers in the example response. Much better than dealing with Markdown/HTML.

For the "Introduction" and "Authentication" sections, Scribe still uses Markdown files in `.scribe`, but they are now called `intro.md` and `auth.md`. `append.md` is also still supported, but `prepend.md` has been dropped. If you were using a `prepend.md`, you should put its content in the `intro.md` file.

If you're using the old system, you'll need to run `scribe:gnerate`, then redo your changes in this new format. See [modifying docs](./generating#modifying-the-docs-after-generating) and [_What are those YAML files for?_](./architecture##what-are-those-yaml-files-for) for details.

:::note
Ideally, you shouldn't have to modify your docs after extraction. We generally recommend using annotations, config and available/custom strategies to guide Scribe _during_ extraction.  
:::

## UI customizations
### Example requests
We've made it easier to customise example requests. It's still the same basic format, but the differences are:
- Files have to end with `.md.blade.php` (eg `ruby.md.blade.php`) if you want to use Markdown.
- You still have the `$baseUrl` variable, but `$route` is now `$endpoint`, an instance of `Knuckles\Camel\Output\OutputEndpointData`, which provides the http methods, url, parameters, and other attributes as properties. This means you can now get IDE autocomplete when writing example templates (see [the guide](./advanced/example-requests)).

Additionally, you can now publish examples **only** (rather than _all_ Scribe templates) with `php artisan vendor:publish --tag=scribe-examples`. This is useful if you only want to customise example requests.

### Styling
In the past, styling was provided by Pastel, which made it difficult to customise them. Pastel is now retired, and Scribe comes with a theming system. This means that:
- There are two new folders in the `views/` directory (when you publish Scribe views): `themes/` and `markdown/`.
- The `partials/endpoint.blade.php` file has been moved into `themes/default/`. The variables it receives have also changed: `$settings` is now `$metadata`, and `$route` is now `$endpoint`, an instance of `Knuckles\Camel\Output\OutputEndpointData`.
- The `partials/group.blade.php` (template for a single group) doesn't exist anymore. Instead, the new `groups.blade.php` (in `themes/default/`) loops over each group of endpoints and renders it inline. 
- There is no more `partials/frontmatter.blade.php`. Scribe no longer uses Markdown front matter.
- `index.blade.php` and `authentication.blade.php` are now `markdown/intro.blade.php` and `markdown/auth.blade.php`.

If you've customised any of the above views, we recommend backing up your current changes and then publishing the new templates:

```bash
# Publish the files in themes/
php artisan vendor:publish --tag=scribe-themes
# Publish the files in markdown/
php artisan vendor:publish --tag=scribe-markdown
```

You can then use the new templates as a guide, and follow the [theming guide](./advanced/theming) to learn how to rework your changes.
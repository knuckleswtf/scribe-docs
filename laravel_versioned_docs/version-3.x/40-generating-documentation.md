---
id: generating
---

# Generating Docs

## First steps
After you've [documented your API](documenting), you can generate the docs using the `scribe:generate` Artisan command.

```sh
php artisan scribe:generate
```

This will:
- extract information about your API and endpoints
- transform the extracted information into a HTML docs webpage (+ Postman collection and OpenAPI spec, if enabled)
- store the extracted API details in some YAML files (in `.scribe/endpoints`), so you can manually edit them later

If you're using [`static` type](./getting-started#1-pick-a-type), your docs (`index.html`, CSS and JS files) will be generated to the `public/docs` folder.

If you're using `laravel` type:
- the Blade view will be at `resources/views/scribe/index.blade.php`
- the CSS and JS assets will be in `public/vendor/scribe`
- the Postman collection and OpenAPI spec will be in `storage/app/scribe/`.

:::note
If you're using `laravel` type, you may need to exclude `storage/app/scribe/` from the gitignore (`storage/app/.gitignore`), as it is ignored by default (meaning your Postman/OpenAPI docs won't be committed). You can add this line to your .gitignore to achieve that:
```gitignore
!scribe/
```
:::

For more details on what happens when you run `generate`, see [How Scribe Works](./architecture).

## Viewing the docs
To access your generated docs, start your Laravel app (`php artisan serve` on local), then visit the path you configured (in `static.output_path` or `laravel.docs_url`). By default, this would be `<your app url>/docs`. _This works for both types of docs._

:::tip
If you're using `static` type, you can also open the `public/docs/index.html` locally in your browser.
:::

## The `.scribe` folder
After you generate your docs, you should also have a `.scribe` folder. This folder is the "intermediate" output; it holds information about your API that Scribe has extracted, allowing you to overwrite some things before Scribe converts to HTML. See [How Scribe works](./architecture#the-scribe-folder) for details.

You can choose to commit this folder, or not. If you commit this folder, you can make edits to the info Scribe has extracted, and Scribe will respect them when generating your docs on any machine, local or server.

If you don't commit, you can't make any edits to what Scribe has extracted, so generating on a different machine might give different results. Of course, you can still use annotations and other strategies to customise the information that gets passed to Scribe.

:::note
If you commit the folder, and you generate docs on your server. and your deployment process involves a `git pull`, you might get warnings from Git about your local changes being overwritten. In that case, you should use `git restore .` before `git pull` and `scribe:generate`.
:::

## Modifying the docs after generating
The `.scribe` folder holds Scribe's intermediate output, allowing you to modify the data Scribe has extracted before it turns them into HTML. You can:
- edit the endpoint YAML files (in `.scribe/endpoints`)
- add more endpoints, following the example file at `.scribe/endpoints/custom.0.yaml`
- edit the introduction and authentication sections (`.scribe/intro.md` and `.scribe/auth.md`)
- append some content to the end of the docs (by adding a `.scribe/append.md` file)
- sort endpoints in a group (by reordering them in the appropriate YAMl file)
- sort groups (by renaming the group files)

See [sorting endpoints and groups](#sorting-endpoints-and-groups).

## Discarding your changes
On future runs, Scribe will respect your changes and try to merge them into any information it extracts. If you'd like to discard your changes and have Scribe extract afresh, you can pass the `--force` flag.

```shell
php artisan scribe:generate --force
```

## Skipping extraction
You can also use the `--no-extraction` flag. With this, Scribe will skip extracting data about your API and use the data already present in the `.scribe` folder.

```bash
php artisan scribe:generate --no-extraction
```

This allows you to quickly edit the extracted YAML and view your changes without having to extract from all your endpoints again.

## Sorting endpoints and groups
By default, endpoint groups will be ordered alphabetically in the docs, but you can customise override this by editing the files in `.scribe/endpoints/`. Groups are ordered by file name, so you can reorder groups by renaming the files. For instance, the group in `0.yaml` will always be shown before the one in `1.yaml`, and so on, so you can swap those two filenames if you want the order reversed.

Endpoints in a group are listed within one file, so to sort endpoints in a group, rearrange the items in the `endpoints` array of the group YAML file.

```yaml title=.scribe/endpoints/0.yaml
name: Endpoints
description: ''
endpoints:
  # This endpoint will be shown first
  - httpMethods: [ "GET" ]
    uri: api/healthcheck
    # ...
  # This endpoint will be shown next
  - httpMethods: [ "GET" ]
    # ...
```


## _Try It Out_
By default, your generated docs will include an API tester that lets users test your endpoints in their browser. You can set the URL that requests will be sent to with the `try_it_out.base_url` config item, or turn it off with `try_it_out.enabled`.

For _Try It Out_ to work, you'll need to make sure CORS is enabled on your endpoints. An easy package for this is [`fruitcake/laravel-cors`](https://github.com/fruitcake/laravel-cors).

If you're using [Laravel Sanctum](https://laravel.com/docs/sanctum), or another token-based SPA authentication system on your API, you'll need to set `try_it_out.use_csrf` to `true`. Scribe will then visit the `try_it_out.csrf_url` before each request, retrieve the CSRF token from the `XSRF-TOKEN` cookie, and add it as an `X-XSRF-TOKEN` header to the request.

## Postman collection and OpenAPI spec
By default, Scribe will also generate a Postman collection and OpenAPI spec which you can import into API clients like Postman or Insomnia. Scribe will include the links to them in the menu of your docs.

You can configure these in the `postman` and `openapi` sections of your `scribe.php` file.

```php title=config/scribe.php
'postman' => [
    'enabled' => true,
    'overrides' => [
        // 'info.version' => '2.0.0',
    ],
],
'openapi' => [
    'enabled' => true,
    'overrides' => [
        // 'info.version' => '2.0.0',
    ],
],
```

Each section has two options:
- `enabled`: Set it to `false` to if you don't want the collection/spec to be generated.

- `overrides`: Fields to merge with the collection/spec after generating. For instance, if you set `postman.overrides` to `['info.version' => '2.0.0']`, then the `version` key in the `info` object of your Postman collection will always be set to `"2.0.0"`.

## Customising the environment
You can pass the `--env` option to run this command with a specific env file. For instance, if you have a `.env.docs` file, running `scribe:generate --env docs` will make Laravel use the `.env.docs` file.

This is a handy way to customise the behaviour of your app for documentation purposes—for example, you can disable things like notifications when response calls are running.

## Generating multiple docs
As of version 3.29.1, you can generate multiple independent sets of docs with Scribe by using the `--config` flag. Supposing you want to have two sets of docs, one for your public API endpoints, and one for the admin endpoints. To do this:
- Create a second config file. You can name it something like `scribe_admin.php`. This file will contain the config for our admin API docs, while `scribe.php` will retain the config for the public API docs.
- Update the config in the new file. Make sure to correctly set:
  - `routes`: Configure this so the only routes matched here are your admin endpoints
  - `static.output_path`: If you're using `static` type, set this to a different path from the one in your `scribe.php` so the docs don't overwrite each other.
  - `laravel.assets_directory`: If you're using `laravel` type, you can set this to a different path from the one in your `scribe.php` so the docs' assets don't overwrite each other. This only matters if you're using different assets (CSS, JS) for each set of docs.
- Run `php artisan scribe:generate --config scribe_admin` (or whatever the name of your config file is).

:::important
The inbuilt Scribe routing (`laravel.add_routes`, `laravel.docs_url` and related settings) will not work for multiple docs. You'll need to add your own routes. You can customise the logic from [the `routes/` folder](https://github.com/knuckleswtf/scribe/blob/5fc7d2531938541a53b7155230baa0b7cf45d487/routes) and [the `Controller` class](https://github.com/knuckleswtf/scribe/blob/5fc7d2531938541a53b7155230baa0b7cf45d487/src/Http/Controller.php) in the package repo.

For example:

```php
Route::view('/docs', 'scribe.index')->name('public_docs');
Route::view('/admin/docs', 'scribe_admin.index')->name('admin_docs');
```

:::

## Running on CI/CD
You might want to generate your docs as part of your deployment process. Here are a few things to note:

If you're using [response calls](documenting/responses#response-calls), you should see the [recommended setup](documenting/responses#recommendations), to avoid any unintended side effects and get the best possible responses.

You'll also want to set your URLs:
- the base URL, which will be displayed in the docs and examples. You can set this with the config item `base_url`. You'll probably want to set this to your production URL.
- the Try It Out URL, which is the URL where the in-browser API tester's requests will go to. You can set this with the config item `try_it_out.base_url`. You could set this to your production or staging server.

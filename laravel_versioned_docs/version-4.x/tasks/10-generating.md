---
id: generating
---

# Generating docs

## First steps
After you've [documented your API](/laravel/documenting), you can generate the docs using the `scribe:generate` Artisan command.

```sh
php artisan scribe:generate
```

This will:
- extract information about your API and endpoints
- transform the extracted information into a HTML docs webpage (+ [Postman collection and OpenAPI spec](features), if enabled)
- store the extracted API details in some YAML files (in `.scribe/endpoints`), so you can manually edit them later

If you're using [`static` type](/laravel/getting-started#1-pick-a-type), your docs (`index.html`, CSS and JS files) will be generated to the `public/docs` folder.

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

For more details on what happens when you run `generate`, see [How Scribe Works](/laravel/architecture).

## Viewing the docs
To access your generated docs, start your Laravel app (`php artisan serve` on local), then visit the path you configured (in `static.output_path` or `laravel.docs_url`). By default, this would be `<your app url>/docs`. _This works for both types of docs._

:::tip
If you're using `static` type, you can also open the `public/docs/index.html` locally in your browser.
:::

## Customising the environment
You can pass the `--env` option to run this command with a specific env file. For instance, if you have a `.env.docs` file, running

```sh
php artisan scribe:generate --env docs
```

will make Laravel load the `.env.docs` file.

This is a handy way to customise the behaviour of your app for documentation purposes—for example, you can disable things like notifications when response calls are running.

## The `.scribe` folder
After you generate your docs, you should also have a `.scribe` folder. This folder is the "intermediate" output; it holds information about your API that Scribe has extracted, allowing you to overwrite some things before Scribe converts to HTML. See [Modifying the docs](/laravel/tasks/modifying) for details.

You can choose to commit this folder, or not. If you commit this folder, you can make edits to the info Scribe has extracted, and Scribe will respect them when generating your docs on any machine, local or server.

If you don't commit, you can't make any edits to what Scribe has extracted, so generating on a different machine might give different results. Of course, you can still use annotations and other strategies to customise the information that gets passed to Scribe.

:::note
If you commit the folder, and you generate docs on your server after doing a `git pull`, you might get warnings from Git about your local changes being overwritten. In that case, you should use `git restore .` to discard local changes before `git pull` and `scribe:generate`.
:::

## Generating multiple docs
You can generate multiple independent sets of docs with Scribe by using the `--config` flag. Supposing you want to have two sets of docs, one for your public API endpoints, and one for the admin endpoints. To do this:
- Create a second config file. You can name it something like `scribe_admin.php`. This file will contain the config for our admin API docs, while `scribe.php` will retain the config for the public API docs.
- Update the config in the new file. Make sure to correctly set:
  - `routes`: Configure this so the only routes matched here are your admin endpoints
  - `static.output_path`: If you're using `static` type, set this to a different path from the one in your `scribe.php` so the docs don't overwrite each other.
  - `laravel.assets_directory`: If you're using `laravel` type, you can set this to a different path from the one in your `scribe.php` so the docs' assets don't overwrite each other. This only matters if you're using different assets (CSS, JS) for each set of docs.
- If you're using `laravel` type, add a route for your docs (see the note below).
- Run `php artisan scribe:generate --config scribe_admin` (or whatever the name of your config file is).

:::important
The inbuilt Scribe routing (`laravel.add_routes`, `laravel.docs_url` and related settings) will not work for multiple docs. You'll need to add your own routes. You can customise the logic from [the `routes/` folder](https://github.com/knuckleswtf/scribe/blob/master/routes) in the package repo.

For example:

```php title="routes/web.php"
Route::view('/docs', 'scribe.index')->name('scribe');
Route::view('/admin/docs', 'scribe_admin.index')->name('scribe-admin');
```

:::

## Running on CI/CD
You might want to generate your docs as part of your deployment process. Here are a few things to note:

If you're using [response calls](/laravel/documenting/responses#response-calls), you should see the [recommended setup](/laravel/documenting/responses#recommendations), to avoid any unintended side effects and get the best possible responses.

You'll also want to set your URLs:
- the base URL, which will be displayed in the docs and examples. You can set this with the config item `base_url`. You'll probably want to set this to your production URL.
- the Try It Out URL, which is the URL where the in-browser API tester's requests will go to. You can set this with the config item `try_it_out.base_url`. You could set this to your production or staging server.

---
id: troubleshooting
slug: troubleshooting
---

# Troubleshooting and Debugging
This page contains a few tips to help you figure out what's wrong when Scribe seems to be malfunctioning.

## Update your version
First off, try updating your installed Scribe version. Maybe your problem is due to a bug we've fixed in a newer release. You can see a list of releases and major changes on [the changelog](https://github.com/knuckleswtf/scribe/blob/master/CHANGELOG.md).
- To find the exact installed version, run `composer show knuckleswtf/scribe`
- To update to the latest version, run `composer update knuckleswtf/scribe`.
- To update to a specific version (example: 3.0.1), run `composer update knuckleswtf/scribe:3.0.1`.

## Use `--verbose`
By default, Scribe will try to keep going until it processes all routes and generates your docs. If it encounters any problems while processing a route (such as a missing `@responseFile` or some invalid configuration leading to an exception being thrown), it will output a warning and the exception message, then move on to the next route.

You can turn on debug messages (such as the path Scribe takes in instantiating a model) and full stack traces with the `--verbose` flag:

```shell
php artisan scribe:generate --verbose
```

## Make sure you aren't matching `web` routes
Routes defined in Laravel's web.php typically have the `web` middleware, leading to strange behaviour, so make sure you've correctly specified the routes to be matched in your config file. See [this GitHub issue](https://github.com/knuckleswtf/scribe/issues/47).

## Be sure you're accessing your docs correctly
For `laravel` type docs, you should always start your server and visit /docs (or wherever you set as your `docs_url`). For `static` type, you should always open the `index.html` file directly (located in `public/docs` or wherever you set as your `static.output_path`).

## Turn on debug mode for your app
Sometimes you may see a 500 `null` response shown in the generated examples. This is usually because an error occurred within your application during a response call. The quickest way to debug this is by setting `app.debug` to `true` in your `response_calls.config` section in your `scribe.php` file.

Alternatively, you can set `APP_DEBUG=true` in your `.env.docs` file and run `php artisan scribe:generate --env docs`.

## Clear any cached Laravel config
Sometimes Laravel caches config files, and this may lead to Scribe failing with an error about a null `DocumentationConfig`. To fix this, clear the config cache:

```bash
php artisan config:clear
```

## Clear previously generated docs
Sometimes you may run into conflicts if you switch from one output type to another. While we try to prevent this happening, we don't guarantee it. In such cases, please try clearing the old docs generated from your previous run (`laravel` would be in `resources/docs` and `storage/docs`, `static` would be in `public/docs`) and then running again. We recommend copying these out to a different location, just to be safe.

## Increase the memory
Generating docs for large APIs can be memory intensive. If you run into memory limits, try running PHP with an increased memory limit (either by updating your CLI php.ini file or using a CLI flag):

```bash
php -d memory_limit=1G artisan scribe:generate
```
---
id: migrating-apidoc
sidebar_label: Migrating from mpociot/laravel-apidoc-generator
---

# Migrating from mpociot/laravel-apidoc-generator to Scribe v3
Scribe is a successor to `mpociot/laravel-apidoc-generator`, with a lot of improvements and changes. This guide aims to make migrating to Scribe easier and show you the key parts you need to look out for so things don't break.

The core documentation process remains largely the same. The major changes are in the config file and the advanced customization process.

## Requirements
- PHP version: 7.4+
- Laravel/Lumen version: 6+

## Before you start
- Follow the installation guide in the [introduction](./#installation).

- Remove the old package:

```bash
composer remove mpociot/laravel-apidoc-generator
```

At this point, you should have both `apidoc.php` and `scribe.php` in your config folder. This is good, so you can easily compare and copy your old config over and delete when you're done.

_After you've done the above, delete your `resources/docs/` and `public/docs` folders, to prevent any conflicts with the new ones we'll generate. If you're using `laravel` type output, you can also delete `resources/views/apidoc/`.

## Config file changes
- The `postman.name` key has been removed. Use the `title` key, which will set both Postman collection name and the generated doc's HTMl title.
- The `laravel.autoload` key is now `laravel.add_routes`, and is `true` by default.
- The `laravel.docs_url` key is now `/docs` by default (no longer `/doc`). This means if you're using `laravel` docs type, your docs will be at `<your-app>/docs`.
- The `requestHeaders` stage in the `strategies` item has been renamed to `headers`.
- Scribe no longer outputs Markdown as an intermediate step, but instead YAML. See [details](architecture#what-are-those-yaml-files-for) for how to work with them.
- The `rebuild` command has been removed. Instead, if you want Scribe to skip the extraction phase and go straight to converting the existing YAML to HTML, run `php artisan scribe:generate --no-extraction`.
- `logo` is now `false` by default, so no logo spot will be shown in the docs.
- If you specify a `logo`, it will no longer be copied to the docs folder. Rather, the path to be logo will be used as-is as the `src` for the `<img>` tag in the docs. This means that you must use a URL or a path that's publicly accessible. 

  For example, if your logo is in `public/img`:
  - set `'logo' => '../img/logo.png'` for `static` type (output folder is `public/docs`)
  - set `'logo' => 'img/logo.png'` for `laravel` type


## Advanced users
If you've written any custom strategies, you should review [Writing Plugins](./advanced/writing-plugins) to see how plugins are written now.
  
If you've published the views, you'll note that they are now in a different format. See the documentation on [customising the views](todo) to see how things are organised now.


That should be all. If you come across anything we've missed, please send in a PR! We recommend reading through our docs to see all the improvements Scribe comes with.

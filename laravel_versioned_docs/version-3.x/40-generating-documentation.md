---
id: generating
---

# Generating Docs

## First steps
After you've [documented your API](./documenting), you can generate the docs using the `scribe:generate` Artisan command.

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

## Viewing the generated docs
To access your generated docs, start your Laravel app (`php artisan serve` on local), then visit `/docs`. _This works for both types of docs._

:::tip
If you're using `static` type, you can also open the `public/docs/index.html` locally in your browser.
:::

You can change the default docs paths with the config items `static.output_path` and `laravel.docs_url`.

## The `.scribe` folder
After you generate your docs, you should also have a `.scribe` folder. This folder contains information about your API that Scribe has extracted. See [How Scribe works](./architecture#the-scribe-folder) for details.

You can choose to commit this folder, or not. If you commit this folder, you can make edits to the info Scribe has extracted, and Scribe will respect them when generating your docs on any machine, local or server.

If you don't commit, you can't make any edits to what Scribe has extracted, so generating on a different machine might give different results. Of course, you can still use annotations and other strategies to customise the information that gets passed to Scribe.

:::note
If you commit the folder, and you generate docs on your server. and your deployment process involves a `git pull`, you might encounter problems with Git warning of your local changes being overwritten. In that case, you should use `git restore .` before `git pull`.
:::

## Post-production
The `.scribe` folder allows you to edit your docs _after_ the generation process. You can do this by:
- editing the endpoint YAML files (in `.scribe/endpoints`)
- adding extra endpoints (there's an example file at `.scribe/endpoints/custom.0.yaml`)
- editing the introduction and authentication sections (`.scribe/index.md` and `.scribe/authentication.md`)
- appending some content to the end of the docs (by adding a `.scribe/append.md` file)

## _Try It Out_
By default, your generated docs will include an API tester that lets users test your endpoints in their browser. You can set the URL that requests will be sent to with the `try_it_out.base_url` config item, or turn it off with `try_it_out.enabled`.

For _Try It Out_ to work, you'll need to make sure CORS is enabled. An easy package for this is [`fruitcake/laravel-cors`](https://github.com/fruitcake/laravel-cors).

## Postman collections and OpenAPI specs
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

## Running on CI/CD
You might want to generate your docs as part of your deployment process. Here are a few things to note:

If you're using [response calls](./documenting/responses#response-calls), you should see the [recommended setup](./documenting/responses#recommendations), to avoid any unintended side effects and get the best possible responses.

You'll also want to set your URLs:
- the base URL, which will be displayed in the docs and examples. You can set this with the config item `base_url`. You'll probably want to set this to your production URL.
- the Try It Out URL, which is the URL where the in-browser API tester's requests will go to. You can set this with the config item `try_it_out.base_url`. You could set this to your production or staging server.

## Skipping the extraction phase
If you only want Scribe to transform the YAML files to the HTML output, you  can use the `--no-extraction` flag. With this, Scribe will skip extracting data from your endpoints and use the data in the YAML files.

```bash
php artisan scribe:generate --no-extraction
```

This allows you to quickly edit the extracted YAMl and view your changes without having to extract from all your endpoints again.

## Overwriting your changes
If you've modified the generated YAML files manually, Scribe will respect your changes and try to merge them into any information it extracts. If you'd like to discard your changes and have Scribe extract afresh, you can pass the `--force` flag.

```shell
php artisan scribe:generate --force
```

(Alternatively, you can just delete the `.scribe` folder.🙂)



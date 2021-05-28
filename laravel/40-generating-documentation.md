# Generating Documentation

After you've [documented your API](./documenting), you can generate the docs using the `scribe:generate` Artisan command.

```sh
php artisan scribe:generate
```

This will:
- extract information about your API and endpoints
- transform the extracted information into a HTML docs webpage (+ Postman collection and OpenAPI spec, if enabled) 
- cache the extracted API details in some YAML files (in `.scribe/endpoints`), so you can manually edit them later

For more details on what happens when you run `generate`, see [How Scribe Works](./98-architecture.md).

## Viewing the generated docs
Accessing your generated docs depends on the `type` you specified in [`scribe.php`](reference/10-config.md#type):
- If you're using `static` type, find the `docs/index.html` file in your `public/` folder and open that in your browser.
- If you're using `laravel` type, start your app (`php artisan serve`), then visit `/docs`.

:::tip
You can change these default paths in your config file, using `static.output_path` and `laravel.docs_url`.
:::

## _Try It Out_
Scribe includes an API tester that lets users test your endpoints right from the docs. Set `try_it_out.enabled` to `true` to enable it. You can also set the URL that requests will be sent to with the `try_it_out.base_url` key.

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
- `enabled`: Set it to `false` to disable the generation.

- `overrides`: Fields to merge with the collection/spec after generating. For instance, if you set `postman.overrides` to `['info.version' => '2.0.0']`, then the `version` key in the `info` object of your Postman collection will always be set to `"2.0.0"`.

## Customising the environment with `--env`
You can pass the `--env` option to run this command with a specific env file. For instance, if you have a `.env.docs` file, running `scribe:generate --env docs` will make Laravel use the `.env.docs` file.

This is a handy way to customise the behaviour of your app for documentation purposes—for example, you can disable things like notifications when response calls are running. 

## Skipping the extraction phase
If you only want Scribe to transform the YAML files to the HTML output, you  can use the `--no-extraction` flag. With this, Scribe will skip extracting data from your endpoints and use the data in the YAML files.

```bash
php artisan scribe:generate --no-extraction
```

This allows you to quickly edit the extracted YAMl and view your changes without having to extract from all your endpoints again.

## Overwriting your changes
If you've modified the generated YAML files manually, but you'd like to discard your changes and have Scribe extract afresh, you can pass the `--force` flag.

```shell
php artisan scribe:generate --force
```

(Alternatively, you can just delete the `.scribe` folder.🙂)



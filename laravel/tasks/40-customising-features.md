---
id: features
---

# Customising features

## _Try It Out_
By default, your generated docs will include an API tester that lets users test your endpoints in their browser. You can set the URL that requests will be sent to with the `try_it_out.base_url` config item, or turn it off with `try_it_out.enabled`.

```php title="config/scribe.php"
'try_it_out' => [
    'enabled' => true,
    'base_url' => 'http://my.staging.url',
],
```

:::important
For _Try It Out_ to work, you'll need to make sure CORS is enabled on your endpoints.
:::

:::note
If you're using [Laravel Sanctum](https://laravel.com/docs/sanctum), or another token-based SPA authentication system on your API, you'll need to set `try_it_out.use_csrf` to `true`. Scribe will then visit the `try_it_out.csrf_url` before each request, retrieve the CSRF token from the `XSRF-TOKEN` cookie, and add it as an `X-XSRF-TOKEN` header to the request.
:::

## Postman collection and OpenAPI specification
By default, Scribe will also generate a Postman collection and OpenAPI spec which you can import into API clients like Postman or Insomnia. Scribe will include the links to them in the menu of your docs.

You can configure these in the `postman` and `openapi` sections of your `scribe.php` file.

```php title="config/scribe.php"
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

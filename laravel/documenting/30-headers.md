---
id: headers
---


# Documenting request headers

You can use the `@header` docblock tag to specify headers for a single endpoint, in the format `@header <name> <optional example>`:

```php
/**
 * @header X-Api-Version
 * @header Content-Type application/xml
 */
```

The header will be included in example requests and [response calls](todo).

Alternatively, you can specify headers for multiple endpoints in one go by using the `apply.headers` section of the route group in `scribe.php`. For instance, with this config:

```php title=config/scribe.php
  'routes' => [
    [
      'match' => [
        'domains' => ['*'],
        'prefixes' => ['v2/'],
      ],
      'apply' => [
        'headers' => [ 'Api-Version' => 'v2']
      ]
    ]
  ]
```

All endpoints that start with `v2/` will have the header `Api-Version: v2` included in their example requests and response calls.

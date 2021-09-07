---
id: headers
---


# Request headers

You can use the `@header` docblock tag to specify headers for a single endpoint, in the format `@header <name> <optional example>`:

```js
/**
 * @header X-Api-Version
 * @header Content-Type application/xml
 */
```

The header will be included in example requests and [response calls](./responses#response-calls).

Alternatively, you can specify headers for multiple endpoints in one go by using the `apply.headers` section of the route group in `.scribe.config.js`. For instance, with this config:

```js title=.scribe.config.js
  routes: [
    {
        include: ['v2/*'],
        exclude: [],
        apply: {
            headers: {'Api-Version': 'v2'}
        }
    }
  ]
```

All endpoints that start with `v2/` will have the header `Api-Version: v2` included in their example requests and response calls.

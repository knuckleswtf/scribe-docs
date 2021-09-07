---
slug: /documenting
id: documenting
---

# Start here
Scribe tries to extract as much information about your API as it can from your code, but you can (and should) help it by providing more information.

For example, let's take a simple "healthcheck" endpoint in an Express app:

```js
app.get('/healthcheck', (req, res) => {
    return res.json({
        status: 'up',
        services: {
            database: 'up',
            redis: 'up',
        },
    });
});
```

From this, Scribe gets:

![](/img/screenshots/docs-bare-example.png)

It's not much, but it's a good start. We've got a URL, example requests, and an example response. Plus, an API tester (_Try It Out_).

With a little more work, we can make this better:


```js

/**
 * Healthcheck
 *
 * Check that the service is up. If everything is okay, you'll get a 200 OK response.
 *
 * Otherwise, the request will fail with a 400 error, and a response listing the failed services.
 *
 * @response 400 scenario="Service is unhealthy" {"status": "down", "services": {"database": "up", "redis": "down"}}
 * @responseField status The status of this API (`up` or `down`).
 * @responseField services Map of each downstream service and their status (`up` or `down`).
 */
app.get('/healthcheck', (req, res) => {
    return res.json({
        status: 'up',
        services: {
            database: 'up',
            redis: 'up',
        },
    });
});
```
We've added a title and description of the endpoint (first three lines). We've also added another example response, plus descriptions of some of the fields in the response.

Now, we get richer information:

![](/img/screenshots/docs-rich-1.png)

![](/img/screenshots/docs-rich-2.png)


Sure, our docblock is a bit noisier now, but that's not such a bad thing! In fact, you could say it's a good thing—the docs are *next to the code*, so:
- it's harder to forget to update them when you change the code
- a new dev can instantly see the docs and understand the endpoint's behaviour.

Scribe tries to keep docblocks human-readable, so they make sense to you, not just to the machine.

Apart from docblocks, Scribe supports some other ways to annotate your API. For example, you can provide general API information and defaults in your `.scribe.config.js`, add or edit YAML files containing the endpoint details (more on that [here](/nodejs/architecture#what-are-those-yaml-files-for)), or use custom strategies that read your code.

We'll demonstrate these in the next few sections.

:::tip
You can exclude an endpoint from the documentation by using the `@hideFromApiDocs` tag in its docblock.
:::

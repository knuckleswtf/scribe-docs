---
id: responses
---

# Responses

## Overview
Scribe gives you multiple ways to provide example responses for your endpoint:
- manually:
  - you can use the `@response` tag, followed by an example response
  - you can place an example in a file and reference it with the `@responseFile` tag
- automatically:
  - Scribe can generate a response by making a request to your endpoint (a "response call")

You can use all of these strategies within the same endpoint. Scribe will display all the responses it finds.

Additionally, you can [add descriptions for fields in your responses](#response-fields).

:::note
Remember, for Express and Restify, docblocks [must go on the route definition](/nodejs/documenting#an-important-note-about-docblocks).
:::

## `@response`
You can provide an example response for an endpoint by using the `@response` annotation with valid JSON (on one line or multiple):

```js
/**
 * @response {
 *  "id": 4,
 *  "name": "Jessica Jones",
 *  "roles": ["admin"]
 * }
 */
```

![](/img/screenshots/endpoint-responses-1.png)

By default, a status code of 200 is assumed, but you can specify a different one:

```js
/**
 * @response 201 {"id": 4, "name": "Jessica Jones"}
 */
```

This means you can define multiple responses from the same endpoint. You can use the `status` and `scenario` attributes to add context to them.

```js
/**
 * @response scenario=success {
 *  "id": 4,
 *  "name": "Jessica Jones"
 * }
 * @response status=404 scenario="user not found" {"message": "User not found"}
 */
```

![](/img/screenshots/endpoint-responses-2.png)

If an endpoint returns a file or some other binary response, you can use `<<binary>>` as the value of the response, followed by an optional description.

```js
/**
 * @response <<binary>> The resized image
 */
```

![](/img/screenshots/endpoint-responses-3.png)

## `@responseFile`
`@responseFile` works similarly to `@response`, but instead of inlining the response, you pass a file containing your JSON response. This can be helpful for large responses. 

To use `@responseFile`, place the response as a JSON string in a file somewhere in your project directory and specify the relative path to it. For instance, we can put this response in a file named `users.get.json` in `storage/responses/`:

```json
{"id":4,"name":"Jessica Jones"}
```

Then in the controller:

```js
/**
 * @responseFile storage/responses/users.get.json
 */
public function getUser(int $id)
{
  // ...
}
```

Like with `@response`. you can include a status code, or have multiple `@responseFile` tags on a single method, distinguished by status code and/or scenario.

```js
/**
 * @responseFile responses/users.get.json
 * @responseFile status=200 scenario="when authenticated as admin" responses/user.get.admin.json
 * @responseFile status=404 responses/user.not_found.json
 */
```

![](/img/screenshots/endpoint-responses-4.png)

With `@responseFile`, you can also "merge" responses into one. To do this, add the JSON you want to merge after the file path. For instance, supposing our generic "not found" response located in `storage/responses/model.not_found.json` says:

```json
{
  "type": "Model",
  "result": "not found"
}
```

We can change the `type` to `User` on the fly like this:

```js
/**
 * @responseFile status=404 responses/model.not_found.json {"type": "User"}
 */
```

This JSON string will be parsed and merged with the response from the file to give:
```json
{
  "type": "User",
  "result": "not found"
}
```

## Response calls
If Scribe doesn't find any 2xx responses for your endpoint, it will attempt to make a HTTP request to the endpoint in your local app to get a response (known as a "response call"). It uses the information it's extracted about your endpoints (headers, body parameters, etc) to build a HTTP request and sends it to your configured `responseCalls.baseUrl`.

:::tip
If you don't want a parameter in your docs to be included in a response call, you can specify `No-example` at the end of its description.
:::

Some key things about response calls:

1. Response calls aim to be "safe" by default. We don't want to accidentally delete a user or anything like that. By default, Scribe will only make response calls for GET endpoints.

2. Response calls are configurable. Most of the configuration is located in the [`apply.responseCalls` section](../reference/config#apply) for each route group in your Scribe config. You can:
   - choose which HTTP methods are safe for response calls, or disable it entirely (`methods`)
   - specify environment variables that should be set for the response call  (`env`)
   - specify query, body and file parameters to be included in the response call  (`queryParams`, `bodyParams`, and `fileParams`)

### Recommendations
To get the best value from response calls, you should make sure to configure your environment to return production-type responses. For instance, you'll want to turn debug mode off, so that 404/500 responses will return formatted error messages rather than exceptions and stack traces. You might also want to switch the app database to your test database. Additionally, if the endpoints that will be called trigger external services (for example, sending email), you'll want to use dummy service providers.

One way to do this is to use the `apply.responseCalls.env` key in your Scribe config to override your app's config:

   ```js title=.scribe.config.js
   responseCalls: {
       config: {
           APP_DEBUG: false,
           DB_DATABASE: 'sqlite',  
       },
   }
   ```

## Response fields
You can add descriptions for fields in your response by adding a `@responseField` annotation to your controller method.

```js
/**
 * @responseField id The id of the newly created word
 */
```

You can leave out the type, and Scribe will figure it out from your responses. 

:::tip
You don't need to specify the full field path if the field is inside an array of objects or wrapped in pagination data. For instance, the above annotation will work fine for all of these responses:

```json
{ "id": 3 }
// Array of objects
[
  { "id": 3 }
] 
// Inside "data" key
{
   "data": [
     { "id": 3 }
   ]
}
```
:::

![](/img/screenshots/response-fields-1.png)

![](/img/screenshots/response-fields-2.png)


However, you can also specify the type of the field if you wish:

```js
/**
 * @responseField {integer} id The id of the newly created word
 */
```


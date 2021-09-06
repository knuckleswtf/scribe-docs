---
id: config
reference: config
---

# .scribe.config.js
Here are the available options in the `.scribe.config.js` file. They are roughly grouped into two: settings to [customize the output](#output-settings), and settings to [customize the extraction process](#extraction-settings).

:::tip
If you aren't sure what an option does, it's best to leave it set to the default.
:::

## Output settings
### `theme`
The theme of the docs. Currently, the only included theme is the default. See the [theming guide](/laravel/advanced/theming).

Default: `"default"`

### `outputPath`
Output folder. The docs, Postman collection and OpenAPI spec will be placed in this folder.

Default: `"public/docs"`.

### `baseUrl`
The base URL to be displayed in the docs.

### `title`
The HTML `<title>` for the generated documentation, and the name of the generated Postman collection and OpenAPI spec.

### `description`
A description for your API. This will be placed in the "Introduction" section, before the `introText`. It will also be used as the `info.description` field in the generated Postman collection and OpenAPI spec.

### `introText`
The text to place in the "Introduction" section (after the `description`). Markdown and HTML are supported.

### `tryItOut`
Configure the API tester included in the docs.

- `enabled`: Set this to `true` if you'd like Scribe to add a "Try It Out" button to your endpoints so users can test them from their browser.

  Default: `true`.

:::important
For "Try It Out" to work, you'll need to make sure CORS is enabled on your endpoints. Here are some useful CORS middleware for [Adonis](https://legacy.adonisjs.com/docs/4.1/cors), [Express](http://expressjs.com/en/resources/middleware/cors.html), and [Restify](https://www.npmjs.com/package/restify-cors-middleware).
:::

- `baseUrl`: The base URL where Try It Out requests should go to. For instance, you can set this to your staging server.

### `logo`
Path to an image to use as your logo in the docs. This will be used as the value of the `src` attribute for the `<img>` tag, so make sure it points to a public URL or path accessible from your server.

If you're using a relative path, remember to make it relative to your docs output location (`static` type). For example, if your logo is in `public/img`, use `'../img/logo.png'`.

For best results, the image width should be 230px. Set this to `false` if you're not using a logo.

Default: `false`.

### `defaultGroup`
When [documenting your api](/nodejs/documenting/), you use `@group` annotations to group API endpoints. Endpoints which do not have a group annotation will be grouped under the `defaultGroup`. 

Default: `"Endpoints"`.

### `exampleLanguages`
For each endpoint, an example request is shown in each of the languages specified in this array. Currently, only `bash` (curl) and `javascript` (Fetch) are included.

Default: `["bash", "javascript"]`

### `postman`
Along with the HTML docs, Scribe can automatically generate a Postman collection for your API. This section is where you can configure or disable that. The collection will be created in `{outputPath}/collection.json`.

- `enabled`: Whether or not to generate a Postman API collection.
  
   Default: `true`

- `overrides`: Fields to merge with the collection after generating. Dot notation is supported. For instance, if you'd like to override the `version` in the `info` object, you can set `overrides` to `{'info.version': '2.0.0'}`.

### `openapi`
Scribe can also generate an OpenAPI (Swagger) spec for your API. This section is where you can configure or enable that. The spec will be created in `{outputPath}/openapi.yaml`.

:::caution
The OpenAPI spec is an opinionated spec that doesn't cover all features of APIs in the wild (such as optional URL parameters). Scribe does its best, but there's no guarantee that the spec generated will exactly match your API structure.
:::

- `enabled`: Whether or not to generate an OpenAPI spec.
  
   Default: `false`

- `overrides`: Fields to merge with the spec after generating. Dot notation is supported. For instance, if you'd like to override the `version` in the `info` object, you can set `overrides` to `{'info.version': '2.0.0'}`.

## Extraction settings
### `auth`
Specify authentication details about your API. This information will be used:
- to derive the text in the "Authentication" section in the generated docs
- to generate auth info in the Postman collection and OpenAPI spec
- to add the auth headers/query parameters/body parameters to the docs and example requests
- to set the auth headers/query parameters/body parameters for response calls

Here are the available settings:
- `enabled`: Set this to `true` if _any endpoints_ in your API use authentication.
  
   Default: `false`.

- `default`: Specify the default auth behaviour of your API.

  If you set this to `true`, _all_ your endpoints will be considered authenticated by default, and you can opt out individually with the `@unauthenticated` tag.

  If you set this to `false`, your endpoints will _not_ be authenticated by default, and you can turn on auth individually with the `@authenticated` tag.

  Default: `false`.

:::caution
Even if you set `auth.default`, you must also set `auth.enabled` to `true` if you have at least one endpoint that is authenticated!
:::

- `in`: Where is the auth value meant to be sent in a request? Options:
    - `query` (for a query parameter)
    - `body` (for a body parameter)
    - `basic` (for HTTP Basic auth via an Authorization header)
    - `bearer`(for HTTP Bearer auth via an Authorization header)
    - `header` (for auth via a custom header)

- `name`: The name of the parameter (eg `token`, `key`, `apiKey`) or header (eg `Authorization`, `Api-Key`). When `in` is set to `bearer` or `basic`, this value will be ignored, and the header used will be `Authorization`.

- `useValue`: The value of the parameter to be used by Scribe to authenticate response calls, or a function that will be called to get that value. This will **not** be included in the generated documentation. If this is empty, Scribe will use a randomly generated value.

- `placeholder`: The placeholder your users will see for the auth parameter in the example requests. If this is empty, Scribe will generate a realistic-looking auth token instead (for example, "jh86fccvbAx6CmA9VS"). 

  Default: `"{YOUR_AUTH_KEY}"`.

- `extraInfo`: Any extra authentication-related info for your users. For instance, you can describe how to find or generate their auth credentials. Markdown and HTML are supported. This will be included in the `Authentication` section.

### `routes`
The `routes` section is an array of items describing what routes in your application that should be included in the docs.

Each item in the `routes` array is a _route group_. A route group is an array containing:
- rules defining what routes belong in that group (`include`, and `exclude`), and
- any custom settings to apply to those routes (`apply`).

#### `include` and `exclude`
This is where you tell Scribe the endpoints you want to be a part of that group, by specifying patterns matching their paths. `include` adds endpoints to the group, while `exclude` removes endpoints. You can use `*` as a wildcard to mean "anything".  For instance, this config tells Scribe to include all routes starting with `api/`, but exclude those starting with `api/v1/`:

```js title=.scribe.config.js
routes: [
  {
    include: ['api/*'],
    exclude: ['api/v1/*'],
  }
]
```

The default config has `include` as `['*']`, meaning all endpoints will be included.

#### `apply`
The `apply` section of the route group is where you specify any additional settings to be applied to those routes when generating documentation. There are a number of settings you can tweak here:

- `headers`: Any headers you specify here will be added in example requests and response calls. Headers are specified as `key: value` strings.

- `response_calls`: These are the settings that will be applied when making ["response calls"](/nodejs/documenting/responses#response-calls).

```js title=.scribe.config.js
responseCalls: {
    baseUrl: "http://localhost:3000",
    methods: ['GET'],
    env: {
        // NODE_ENV: 'docs',
    },
    queryParams: {
        // key: 'value',
    },
    bodyParams: {
        // key: 'value',
    },
    fileParams: {
        // key: 'storage/app/image.png',
    },
],
```

  - The `baseUrl` key is the base URL Scribe will make requests to. Typically, this should be the URL (+ port) your app runs on locally (such as `http://localhost:3000`).

  - The `methods` key determines what endpoints allow response calls. By default, Scribe will only try response calls for GET endpoints, but you can change this as you wish. Set it to `['*']` to mean all methods. Leave it as an empty array to turn off response calls for that route group.
  
  - The `queryParams`, `bodyParams`, and `fileParams` keys allow you to set specific data to be sent in response calls. For file parameters, each value should be a valid path (absolute or relative to your project directory) to a file on the machine.

  - The `env` key allows you to set specific env variables for the response call.


:::tip
By splitting your routes into groups, you can apply different settings to different routes.
:::

### `fakerSeed`
When generating examples for parameters, this package uses the [faker.js](https://github.com/marak/Faker.js/) package to generate random values. If you would like the package to generate the same example values each time, set this to any number (eg. `1234`).

:::tip
Alternatively, you can [set example values](/nodejs/documenting/query-body-parameters#specifying-or-omitting-examples) for parameters when documenting them.
:::
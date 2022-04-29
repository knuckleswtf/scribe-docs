---
id: config
reference: config
---

# config/scribe.php
Here are the available options in the `config/scribe.php` file. They are roughly grouped into two: settings to [customize the output](#output-settings), and settings to [customize the extraction process](#extraction-settings).

:::tip
If you aren't sure what an option does, it's best to leave it set to the default.
:::

## Output settings
### `theme`
The theme of the docs. Currently, the only included theme is the default. See the [theming guide](/laravel/advanced/theming).

Default: `"default"`

### `type`
This is the type of documentation output to generate.
- `static` will generate a static HTMl page in the `public/docs` folder,
- `laravel` will generate the documentation as a Blade view within the `resources/views/scribe` folder, so you can add routing and authentication.

Default: `"static"`

### `static`
Settings for the `static` type output.

- `output_path`: Output folder. The docs, Postman collection and OpenAPI spec will be placed in this folder. We recommend leaving this as `public/docs`, so people can access your docs through `<your-app>/docs`.

   Default: `"public/docs"`.

### `laravel`
Settings for the `laravel` type output.

- `add_routes`: Set this to `true` if you want the documentation endpoint (`<your-app>/docs`) to be automatically added to your app. To use your own routing, set this to `false`.

   Default: `true`

- `docs_url`: The path for the documentation endpoint (if `add_routes` is true).

   Default: `"/docs"`.

- `assets_directory`: Specify directory within `public` in which to store Laravel Scribe assets. By default, assets are stored in `public/vendor/scribe`. If set, assets will be stored in `public/{{assets_directory}}`

   Default: `null`.

- `middleware`: List of middleware to be attached to the documentation endpoint (if `add_routes` is true).

### `base_url`
The base URL to be displayed in the docs. If you leave this empty, Scribe will use the current app URL (`config('app.url')`).

### `title`
The HTML `<title>` for the generated documentation, and the name of the generated Postman collection and OpenAPI spec. If this is `null`, Scribe will infer it from `config('app.name')`.

### `description`
A description for your API. This will be placed in the "Introduction" section, before the `intro_text`. It will also be used as the `info.description` field in the generated Postman collection and OpenAPI spec.

### `intro_text`
The text to place in the "Introduction" section (after the `description`). Markdown and HTML are supported.

### `try_it_out`
Configure the API tester included in the docs.

- `enabled`: Set this to `true` if you'd like Scribe to add a "Try It Out" button to your endpoints so users can test them from their browser.

  Default: `true`.

:::important
For "Try It Out" to work, you'll need to make sure CORS is enabled on your endpoints. An easy package for this is [fruitcake/laravel-cors](https://github.com/fruitcake/laravel-cors).
:::

- `base_url`: The base URL where Try It Out requests should go to. For instance, you can set this to your staging server. Leave as `null` to use the current app URL (`config(app.url)`).

- `use_csrf`: Fetch a CSRF token before each Try It Out request, and add it as an `X-XSRF-TOKEN` header to the request. This is needed if you're using [Laravel Sanctum](https://laravel.com/docs/sanctum),.

  Default: `false`.

- `csrf_url`: The URL to fetch the CSRF token from (if `use_csrf` is true).

  Default: `'/sanctum/csrf-cookie'`.

### `logo`
Path to an image to use as your logo in the docs. This will be used as the value of the `src` attribute for the `<img>` tag, so make sure it points to a public URL or path accessible from your server.

If you're using a relative path, remember to make it relative to your docs output location (`static` type) or app URL (`laravel` type). For example, if your logo is in `public/img`:

- for `static` type (output folder is `public/docs`), use `'../img/logo.png'`
- for `laravel` type, use `'img/logo.png'`

For best results, the image width should be 230px. Set this to `false` if you're not using a logo.

Default: `false`.

### `default_group`
When [documenting your api](/laravel/documenting/), you use `@group` annotations to group API endpoints. Endpoints which do not have a group annotation will be grouped under the `default_group`.

Default: `"Endpoints"`.

### `example_languages`
For each endpoint, an example request is shown in each of the languages specified in this array. Currently, only `bash` (curl), `javascript` (Fetch), `php` (Guzzle) and `python` (requests) are included. You can add extra languages, but you must also create the corresponding Blade view (see [Adding more example languages](/laravel/advanced/example-requests)).

Default: `["bash", "javascript"]`

### `postman`
Along with the HTML docs, Scribe can automatically generate a Postman collection for your API. This section is where you can configure or disable that.

For `static` output, the collection will be created in `{static.output_path}/collection.json`. For `laravel` output, the collection will be generated to `storage/app/scribe/collection.json`. Setting `laravel.add_routes` to `true` will add a `/collection.json` endpoint to fetch it.

- `enabled`: Whether or not to generate a Postman API collection.

   Default: `true`

- `overrides`: Fields to merge with the collection after generating. Dot notation is supported. For instance, if you'd like to override the `version` in the `info` object, you can set `overrides` to `['info.version' => '2.0.0']`.

### `openapi`
Scribe can also generate an OpenAPI (Swagger) spec for your API. This section is where you can configure or enable that.

:::caution
The OpenAPI spec is an opinionated spec that doesn't cover all features of APIs in the wild (such as optional URL parameters). Scribe does its best, but there's no guarantee that the spec generated will exactly match your API structure.
:::

For `static` output, the spec will be created in `{static.output_path}/openapi.yaml`. For `laravel` output, the spec will be generated to `storage/app/scribe/openapi.yaml`. Setting `laravel.add_routes` to `true` will add a `/openapi.yaml` endpoint to fetch it.

- `enabled`: Whether or not to generate an OpenAPI spec.

   Default: `false`

- `overrides`: Fields to merge with the spec after generating. Dot notation is supported. For instance, if you'd like to override the `version` in the `info` object, you can set `overrides` to `['info.version' => '2.0.0']`.

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

- `use_value`: The value of the parameter to be used by Scribe to authenticate response calls. This will **not** be included in the generated documentation. If this is empty, Scribe will use a randomly generated value. If you need to customize this value dynamically, you can use the [`beforeResponseCall()` method](../documenting/responses#authentication-and-customization).

- `placeholder`: The placeholder your users will see for the auth parameter in the example requests. If this is empty, Scribe will generate a realistic-looking auth token instead (for example, "jh86fccvbAx6CmA9VS").

  Default: `"{YOUR_AUTH_KEY}"`.

- `extra_info`: Any extra authentication-related info for your users. For instance, you can describe how to find or generate their auth credentials. Markdown and HTML are supported. This will be included in the `Authentication` section.

### `strategies`
A nested array of strategies Scribe will use to extract information about your routes at each stage. If you write or install a custom strategy, add it here under the appropriate stage. By default, all strategies are enabled:

```php title=config/scribe.php
'strategies' => [
    'metadata' => [
        Strategies\Metadata\GetFromDocBlocks::class,
    ],
    'urlParameters' => [
        Strategies\UrlParameters\GetFromLaravelAPI::class,
        Strategies\UrlParameters\GetFromLumenAPI::class,
        Strategies\UrlParameters\GetFromUrlParamTag::class,
    ],
    'queryParameters' => [
        Strategies\QueryParameters\GetFromQueryParamTag::class,
        Strategies\QueryParameters\GetFromFormRequest::class,
    ],
    'headers' => [
        Strategies\Headers\GetFromRouteRules::class,
        Strategies\Headers\GetFromHeaderTag::class,
    ],
    'bodyParameters' => [
        Strategies\BodyParameters\GetFromFormRequest::class,
        Strategies\BodyParameters\GetFromInlineValidator::class,
        Strategies\BodyParameters\GetFromBodyParamTag::class,
    ],
    'responses' => [
        Strategies\Responses\UseTransformerTags::class,
        Strategies\Responses\UseResponseTag::class,
        Strategies\Responses\UseResponseFileTag::class,
        Strategies\Responses\UseApiResourceTags::class,
        Strategies\Responses\ResponseCalls::class,
    ],
    'responseFields' => [
        Strategies\ResponseFields\GetFromResponseFieldTag::class,
    ],
],
```

You can remove the strategies you don't need (for instance, you can remove the `UseTransformerTags` strategy if you aren't using transformers).

### `routes`
The `routes` section is an array of items describing what routes in your application that should be included in the docs.

Each item in the `routes` array is a _route group_. A route group is an array containing:
- rules defining what routes belong in that group (`match`, `include`, and `exclude`), and
- any custom settings to apply to those routes (`apply`).

#### `match`
Let's start with the `match ` section. This is where you tell Scribe the endpoints you want to document. The default looks like this:

```php title=config/scribe.php
'match' => [
  'prefixes' => ['api/*'],
  'domains' => ['*'],
],
```

This tells Scribe to match all routes starting with `api/`. So, for instance:

```php
// 👍 Will match
Route::get('/api/users', [UserController::class, 'listUsers']);
Route::post('/api/users', [UserController::class, 'createUser']);

// ❌ Won't match
Route::get('/status', [StatusController::class, 'getStatus']);
```

:::tip
In route groups, `*` can often be used as a wildcard to mean "anything".
:::

If you're using [subdomain routing](https://laravel.com/docs/routing#route-group-subdomain-routing), you can also limit endpoints by `domains`. So, a config like this:

```php
'match' => [
  'prefixes' => ['api/*'],
  'domains' => ['v2.acme.co'],
],

// Results:

// 👍 Will match
Route::group(['domain' => 'v2.acme.co'], function () {
  Route::get('/api/users', [UserController::class, 'listUsers']);
  Route::post('/api/users', [UserController::class, 'createUser']);
});

// ❌ Won't match
Route::get('/api/getUsers', [UserControllerV::class, 'listUsers']);
```

Finally, if you're using Dingo, you can also limit the `versions` you want to match (no wildcards are not supported).

```php
'match' => [
  'prefixes' => ['api/*'],
  'domains' => ['v2.acme.co'],
  'versions' => ['v2'],
],

// 👍 Will match
$api->version('v2', function (Router $api) {
    $api->post('/api/users');
});
$api->version('v1', function (Router $api) {
    // 👍 Won't match
});
```

#### `include` and `exclude`
`include` and `exclude` allow you to override `match`. With `include`, you can add routes to the group, even if they didn't match. With `exclude`, you can remove routes that matched. Both of these take a list of route names or paths.

For example:

```php
'match' => [
  'domains' => ['v2.acme.co'],
  'prefixes' => ['*'],
],
'include' => ['public.metrics'],
'exclude' => ['internal/*'],


Route::group(['domain' => 'v2.acme.co'], function () {
  // 👍 Will match
  Route::get('/api/users', [UserController::class, 'listUsers']);
  Route::post('/api/users', [UserController::class, 'createUser']);
  // ❌ Matches, but excluded by `exclude`
  Route::get('/internal/users', [InternalController::class, 'listUsers']);
  Route::post('/internal/check', [InternalController::class, 'checkThings']);
});

// 👍 Doesn't match, but included by `include`
Route::get('/metrics', [PublicController::class, 'showMetrics'])
  ->name('public.metrics');

// ❌ Won't match
Route::get('/api/getUsers', [UserControllerV!::class, 'listUsers']);
```

#### `apply`
The `apply` section of the route group is where you specify any additional settings to be applied to those routes when generating documentation. There are a number of settings you can tweak here:

- `headers`: Any headers you specify here will be added in example requests and response calls. Headers are specified as `key => value` strings.

- `response_calls`: These are the settings that will be applied when making ["response calls"](../documenting/responses#response-calls).

```php title=config/scribe.php
'response_calls' => [
    'methods' => ['GET'],
    'config' => [
        'app.env' => 'documentation',
    ],
    'queryParams' => [
        // 'key' => 'value',
    ],
    'bodyParams' => [
        // 'key' => 'value',
    ],
    'fileParams' => [
        // 'key' => 'storage/app/image.png',
    ],
],
```

  - The `methods` key determines what endpoints allow response calls. By default, Scribe will only try response calls for GET endpoints, but you can change this as you wish. Set it to `['*']` to mean all methods. Leave it as an empty array to turn off response calls for that route group.

  - The `queryParams`, `bodyParams`, and `fileParams` keys allow you to set specific data to be sent in response calls. For file parameters, each value should be a valid path (absolute or relative to your project directory) to a file on the machine.

  - The `config` key allows you to customise your Laravel app's config for the response call.


:::tip
By splitting your routes into groups, you can apply different settings to different routes.
:::

### `faker_seed`
When generating examples for parameters, this package uses the `fakerphp/faker` package to generate random values. If you would like the package to generate the same example values each time, set this to any number (eg. `1234`).

:::tip
Alternatively, you can [set example values](../documenting/query-body-parameters#specifying-or-omitting-examples) for parameters when documenting them.
:::

### `fractal`
This section only applies if you're using [transformers](https://fractal.thephpleague.com/transformers/) for your API (via the league/fractal package), and documenting responses with `@transformer` and `@transformerCollection`. Here, you configure how responses are transformed.

- `serializer`: If you are using a custom serializer with league/fractal, you can specify it here. Leave this as `null` to use no serializer or return a simple JSON.

   Default: `null`

### `database_connections_to_transact`
To avoid modifying your database, Scribe can run response calls and example model creation (API resource and Transformer strategies) in a database transaction, and then roll it back afterwards. This item is where you specify which database connections Scribe can run transactions for.

By default, this is set to your default database connection (`config('database.default')`), so if you only use one database connection, you should be fine. If you use multiple connections, you should add them to the array. For example:

```php title=config/scribe.php
'database_connections_to_transact' => [
    config('database.default'),
    'pgsql',
],
```

### `routeMatcher`
The route matcher class is responsible for fetching the routes to be documented. The default matcher is the included `\Knuckles\Scribe\Matching\RouteMatcher`, but you can provide your own custom implementation if you wish. The provided matcher should implement `\Knuckles\Scribe\Matching\RouteMatcherInterface`.

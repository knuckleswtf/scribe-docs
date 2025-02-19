---
id: annotations
---

# Supported annotations

## PHP 8 attributes vs docblock tags
Scribe v4 introduces PHP 8 attributes that provide the same functionality as the old docblock tags. Here's a quick comparison of what they look like:



import {AttributesTagsTabs, TabItem} from '@site/src/components/AttributesTagsTabs';

<AttributesTagsTabs>
<TabItem value="attributes">

```php

#[Endpoint("Healthcheck", "
   Check that the service is up. If everything is okay, you'll get a 200 OK response.

   Otherwise, the request will fail with a 400 error, and a response listing the failed services.
")]
#[Response(["status" => "down", "services" => ["database" => "up", "redis" => "down"]], status: 400, description: "Service is unhealthy")]
#[ResponseField("status", "The status of this API (`up` or `down`).")]
#[ResponseField("services", "Map of each downstream service and their status (`up` or `down`).")]
public function healthcheck() {
    return [
        'status' => 'up',
        'services' => [
            'database' => 'up',
            'redis' => 'up',
        ],
    ];
});
```

</TabItem>

<TabItem value="tags">

```php

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
public function healthcheck() {
    return [
        'status' => 'up',
        'services' => [
            'database' => 'up',
            'redis' => 'up',
        ],
    ];
});
```

</TabItem>
</AttributesTagsTabs>

Attributes have the following advantages over tags:
1. They're less error-prone (for us). With docblocks, everything is a string, so we have to parse it, and try to guess your intentions. There's a lot that can go wrong there. With attributes, you give us the exact values you want.
2. They're less error-prone (for you). Attributes are a language feature, so you have IDE help built in. For instance, typing in `#[Response(` will bring up the list of parameters, so you don't need to memorize the specific order or field names.
3. They're programmable. Since attributes are actual PHP code (with some limits), you can do more. For instance, you can have `#[ResponseFromApiResource(paginate: self::PAGINATION_CONFIG)]`. You can create your own attributes to avoid repeating the same things.

On the flip side, attributes:
1. can be bulky. They especially don't look good for long text, such as descriptions.
2. don't look good on inline (closure) routes.
  ```php
  // This isn't valid PHP
  #[Authenticated]
  Route::get('/endpoint', function () { ... });

  // This works, but it's not very nice visually.
  Route::get(
    '/endpoint',

    #[Authenticated]
    function () { ...
    });
  ```


**The good news is that you can mix them!**

That means you can write an endpoint like this:

```php
/**
 * Healthcheck
 *
 * Check that the service is up. If everything is okay, you'll get a 200 OK response.
 *
 * Otherwise, the request will fail with a 400 error, and a response listing the failed services.
 */
#[Response(["status" => "down", "services" => ["database" => "up", "redis" => "down"]], status: 400, description: "Service is unhealthy")]
#[ResponseField("status", "The status of this API (`up` or `down`).")]
#[ResponseField("services", "Map of each downstream service and their status (`up` or `down`).")]
public function healthcheck() {
    return [
        'status' => 'up',
        'services' => [
            'database' => 'up',
            'redis' => 'up',
        ],
    ];
});
```

This way, the text part stays textual, while the structured part uses the defined attributes.

If you'd like to try attributes, we made [a Rector rule](https://github.com/knuckleswtf/scribe-tags2attributes) to automatically convert your tags to attributes. It will convert parameter tags to attributes, but leave text like endpoint titles and descriptions untouched.


## Format
Annotations in docblocks typically consist of a _tag_ (`@-something`) followed by text in a certain format. Some important details: Attributes are written like a regular PHP function call, and you can use named parameters to make the code clearer.

Some things to note about tags:
- The `@hideFromAPIDocumentation`, `@authenticated` and `@unauthenticated` tags are the only _boolean_ tags; they don't take any text after them.
- In the "Format" sections below, `?` indicates an optional value.
- Tags typically default `required` to `false`
- Most annotations are written in a "natural" format, `@tag value1 value2`, where Scribe figures out what value1 and value2 represent, based on the order. However, some tags also support _fields_ (`@tag key1=value1 value2` or `@tag value2 key1=value1`).

  Tag fields don't have to follow a specific order; they can be at the start or end of the tag (but they generally cannot be in the middle). Tag attribute values which consist of multiple words should use quotes (eg `@tag key1="this is value1" value2`).

Some things to note about attributes:
- They all live under the `Knuckles\Scribe\Attributes` namespace. So you can either write `#[Knuckles\Scribe\Attributes\Header]`, or write `#[Header]` and have an import statement (`use Knuckles\Scribe\Attributes\Header`).
- Since they're regular PHP, you can easily find out the arguments with your IDE, like you would for a normal function call. We won't list all the arguments here.
- Attributes typically default `required` to `true`

Here's a list of all the docblock annotations Scribe supports.

## Metadata

:::tip
All metadata annotations can be used on the method or class docblock. Using them on the class will make them apply to all endpoints in that class.
:::

Tag | Description | Format
----|-------------|--------
`@hideFromAPIDocumentation` | Excludes an endpoint from the docs | `@hideFromAPIDocumentation`
`@group` | Adds an endpoint to a group | `@group <groupName>` <br /> Example: `@group User management`
`@authenticated` | Indicates that an endpoint needs auth | `@authenticated`
`@unauthenticated` | Opposite of `@authenticated` | `@unauthenticated`

## Request parameters
### `@header` / `#[Header]`
Describes a request header.

Format: `@header <name> <example?>`

Examples:

<AttributesTagsTabs>
<TabItem value="tags">

```
@header Api-Version
@header Content-Type application/xml
```

</TabItem>
<TabItem value="attributes">

```php
#[Header("X-Api-Version")]
#[Header("Content-Type", "application/xml")]
public function endpoint() {...}
```
</TabItem>
</AttributesTagsTabs>

### `@urlParam`/`#[UrlParam]`
Describes a URL parameter.

Tag format: `@urlParam <name> <type?> required? <description?> Enum: <list of values?> Example: <example?>`

Notes:
- If you don't supply a `type`, `string` is assumed.
- To specify allowed values for this parameter:
  - for tags: write "Enum: ", followed by the list of values.
  - for attributes: use the `enum` parameter with either a PHP 8.1 enum or an array of values.
- To prevent Scribe from including this parameter in example requests:
  - end the description with `No-example` when using tags
  - pass`"No-example"`as the `example` parameter when using attributes
- You can also use this on Form Request classes.

Examples:


<AttributesTagsTabs>
<TabItem value="tags">

```
@urlParam id
@urlParam id int
@urlParam id int required
@urlParam id int required The user's ID.
@urlParam language The language. Enum: en, de, fr
@urlParam language The language. Enum: en, de, fr. Example: en
@urlParam id int required The user's ID. Example: 88683
@urlParam id int The user's ID. Example: 88683
@urlParam id int The user's ID. No-example
```

</TabItem>
<TabItem value="attributes">

```php
#[UrlParam("id")]
#[UrlParam("id", "int")]
#[UrlParam("id", "int")]
#[UrlParam("id", "int", "The user's ID.")]
#[UrlParam("id", "int", "The user's ID.", example: 88683)]
#[UrlParam("language", "The language.", enum: ["en", "de", "fr"])]
#[UrlParam("language", "The language.", enum: SupportedLanguage::class)]
#[UrlParam("language", "The language.", enum: SupportedLanguage::class, example: "en")]
#[UrlParam("id", "int", "The user's ID.", required: false, example: 88683)]
#[UrlParam("id", "int", "The user's ID.", required: false, example: "No-example")]
public function endpoint() {...}
```

</TabItem>
</AttributesTagsTabs>

### `@queryParam`/`#[QueryParam]`
Describes a query parameter.

Format: `@queryParam <name> <type?> required? <description?> Example: <example?>`

Notes:
- If you don't supply a `type`, `string` is assumed.
- To specify allowed values for this parameter:
  - for tags: write "Enum: ", followed by the list of values.
  - for attributes: use the `enum` parameter with either a PHP 8.1 enum or an array of values.
- To prevent Scribe from including this parameter in example requests:
  - end the description with `No-example` when using tags
  - pass`"No-example"`as the `example` parameter when using attributes
- You can also use this on Form Request classes.

Examples:

<AttributesTagsTabs>
<TabItem value="tags">

```
@queryParam date The date. Example: 2022-01-01
@queryParam language The language. Enum: en, de, fr
@queryParam language The language. Enum: en, de, fr. Example: en
@queryParam page int
@queryParam page int The page number.
@queryParam page int required The page number. Example: 4
@queryParam page int The page number. No-example
```
</TabItem>

<TabItem value="attributes">

```php
#[QueryParam("date", description: "The date.", example: "2022-01-01")]
#[QueryParam("language", "The language.", enum: ["en", "de", "fr"])]
#[QueryParam("language", "The language.", enum: SupportedLanguage::class)]
#[QueryParam("language", "The language.", enum: SupportedLanguage::class, example: "en")]
#[QueryParam("page", "int", required: false)]
#[QueryParam("page", "int", "The page number.", required: false)]
#[QueryParam("page", "int", "The page number.", example: 4)]
#[QueryParam("page", "int", "The page number.", required: false, example: "No-example")]
public function endpoint() {...}
```
</TabItem>
</AttributesTagsTabs>


### `@bodyParam`/`#[BodyParam]`
Describes a request body parameter.

Format: `@bodyParam <name> <type> required? <description?> Example: <example?>`

Notes:
- To specify allowed values for this parameter:
  - for tags: write "Enum: ", followed by the list of values.
  - for attributes: use the `enum` parameter with either a PHP 8.1 enum or an array of values.
- To prevent Scribe from including this parameter in example requests:
  - end the description with `No-example` when using tags
  - pass`"No-example"`as the `example` parameter when using attributes
- You can also use this on Form Request classes.

Examples:

<AttributesTagsTabs>
<TabItem value="tags">

```
@bodyParam language string The language. Enum: en, de, fr
@bodyParam language string The language. Enum: en, de, fr. Example: en
@bodyParam room_id string
@bodyParam room_id string required The room ID.
@bodyParam room_id string The room ID. Example: r98639bgh3
@bodyParam room_id string Example: r98639bgh3

// Objects and arrays
@bodyParam user object required The user data
@bodyParam user.name string required The user's name.
@bodyParam user.age int Example: 1000
@bodyParam people object[] required List of people
@bodyParam people[].name string Example: Deadpool

// If your entire request body is an array
@bodyParam [] object[] required List of things to do
@bodyParam [].name string Name of the thing. Example: Cook
```

</TabItem>

<TabItem value="attributes">

```php
#[BodyParam("language", "The language.", enum: ["en", "de", "fr"])]
#[BodyParam("language", "The language.", enum: SupportedLanguage::class)]
#[BodyParam("language", "The language.", enum: SupportedLanguage::class, example: "en")]
#[BodyParam("room_id", "string")]
#[BodyParam("room_id", "string", "The room ID.")]
#[BodyParam("room_id", "string", "The room ID.", required: false, example: "r98639bgh3")]
#[BodyParam("room_id", "string", required: false, example: "r98639bgh3")]
public function endpoint() {...}

// Objects and arrays
#[BodyParam("user", "object", "The user data")]
#[BodyParam("user.name", "string", "The user's name.")]
#[BodyParam("user.age", "int", required: false, example: 1000)]
#[BodyParam("people", "object[]", "List of people")]
#[BodyParam("people[].name", "string", required: false, example: "Deadpool")]
public function endpoint() {...}

// If your entire request body is an array
#[BodyParam("[]", "object[]", "List of things to do")]
#[BodyParam("[].name", "string", "Name of the thing.", required: false, example: "Cook")]
public function endpoint() {...}
```

</TabItem>
</AttributesTagsTabs>


## Responses
### `@response`/`#[Response]`
Describes an example response.

Format: `@response <status?> <response>`

Notes:
- If you don't specify a status, Scribe will assume `200`.
- Supported fields: `scenario`, `status`


Examples:

<AttributesTagsTabs>
<TabItem value="tags">

```
@response {"a": "b"}
@response 201 {"a": "b"}
@response 201 {"a": "b"} scenario="Operation successful"
@response status=201 scenario="Operation successful" {"a": "b"}
@response scenario=Success {"a": "b"}
@response 201 scenario="Operation successful" {"a": "b"}
```

</TabItem>

<TabItem value="attributes">

```php
#[Response('{"a": "b"}')]
#[Response(["a" => "b"])]
#[Response(["a" => "b"], 201)]
#[Response('{"a": "b"}', 201, "Operation successful")]
#[Response(["a" => "b"], description: "Success")]
public function endpoint() {...}
```

</TabItem>
</AttributesTagsTabs>


### `@responseFile`/`#[ResponseFile]`
Describes the path to a file containing an example response. The path can be absolute, relative to your project directory, or relative to your Laravel storage directory.

Format: `@responseFile <status?> <filePath>`

Notes:
- If you don't specify a status, Scribe will assume `200`.
- Supported fields: `scenario`, `status`

Examples:

<AttributesTagsTabs>
<TabItem value="tags">

```
@responseFile /an/absolute/path
@responseFile 400 relative/path/from/your/project/root
@responseFile status=400 scenario="Failed" path/from/your/laravel/storage/directory
@responseFile 400 scenario="Failed" path/from/your/laravel/storage/directory
```

</TabItem>

<TabItem value="attributes">

```php
#[ResponseFile("/an/absolute/path")]
#[ResponseFile("relative/path/from/your/project/root", 400)]
#[ResponseFile("path/from/your/laravel/storage/directory", 400, description: "Failed")]
public function endpoint() {...}
```

</TabItem>
</AttributesTagsTabs>

### `@responseField`/`#[ResponseField]`
Describes a field in the response.

Format: `@responseField <name> <type?> <description?>`

Notes:
- You can omit the `type`; Scribe will try to figure it out from your example responses.
- To specify allowed values for this parameter:
  - for tags: write "Enum: ", followed by the list of values.
  - for attributes: use the `enum` parameter with either a PHP 8.1 enum or an array of values.
- You can also use this on Eloquent API resource `toArray()` methods.
- From v4.38, you can also specify `required` (`@responseField total required The total number of results`/`#[ResponseField("total", "int", required: true, "The total number of results.")]`). 
- From v4.38, you can also specify `nullable` (currently only supported in the attribute). This will only show up in the OpenAPI spec. 

Examples:

<AttributesTagsTabs>
<TabItem value="tags">

```
@responseField total The total number of results.
@responseField total int The total number of results.
@responseField language The language. Enum: en, de, fr
@responseField language The language. Enum: en, de, fr. Example: en
```

</TabItem>

<TabItem value="attributes">

```php
#[ResponseField("total", "The total number of results.")]
#[ResponseField("total", "int", "The total number of results.")]
#[ResponseField("language", "The language.", enum: ["en", "de", "fr"])]
#[ResponseField("language", "The language.", enum: SupportedLanguage::class)]
#[ResponseField("language", "The language.", enum: SupportedLanguage::class, example: "en")]
public function endpoint() {...}
```

</TabItem>
</AttributesTagsTabs>

### `@apiResource`
Tells Scribe how to generate a response using an [Eloquent API resource](https://laravel.com/docs/eloquent-resources). Must be used together with [`@apiResourceModel`](#apiresourcemodel).

From 4.20.0, `@apiResource` may be used without an `@apiResourceModel` tag (in this case, an empty array will be passed to the resource if no model could be inferred).

Format: `@apiResource <status?> <resourceClass>`

Notes:
- If you don't specify a status, Scribe will assume `200`.

Examples:

```
@apiResource App\Http\Resources\UserApiResource
@apiResourceModel App\Models\User

@apiResource 201 App\Http\Resources\UserApiResource
@apiResourceModel App\Models\User
```

### `@apiResourceCollection`

Tells Scribe how to generate a response using an [Eloquent API resource](https://laravel.com/docs/eloquent-resources) collection. Must be used together with [`@apiResourceModel`](#apiresourcemodel).

Format: `@apiResourceCollection <status?> <resourceClass>`

Notes:
- If you don't specify a status, Scribe will assume `200`.

Examples:

```
@apiResourceCollection App\Http\Resources\UserApiResource
@apiResourceModel App\Models\User

@apiResourceCollection App\Http\Resources\UserApiResourceCollection
@apiResourceModel App\Models\User

@apiResourceCollection 201 App\Http\Resources\UserApiResourceCollection
@apiResourceModel App\Models\User
```

### `@apiResourceModel`
Tells Scribe the model to use when generating the [Eloquent API resource](https://laravel.com/docs/eloquent-resources) response. Can only be used together with [`@apiResource`](#apiresource) or [`@apiResourceCollection`](#apiresourcecollection).

:::note
You can omit this tag, if your API resource uses an `@mixin` tag referencing the model.
:::

Format: `@apiResourceModel <modelClass>`

Notes:
- Supported fields:
  - `states`: Comma-separated list of [states](https://laravel.com/docs/database-testing#applying-states) to be applied when creating an example model via factory.
  - `with`: Comma-separated list of relations to be loaded with the model. Works for factory (Laravel 8+) or database fetching.
  - `paginate`: The number of items per page (when generating a collection). To use [simple pagination](https://laravel.com/docs/8.x/pagination#simple-pagination) instead, add `,simple` after the number.
- You can also specify these fields directly on the `@apiResource` tag instead

```
@apiResource App\Http\Resources\UserApiResource
@apiResourceModel App\Models\User

@apiResourceCollection App\Http\Resources\UserApiResource
@apiResourceModel App\Models\User states=editor,verified

@apiResource App\Http\Resources\UserApiResource
@apiResourceModel App\Models\User with=accounts,pets

@apiResourceCollection App\Http\Resources\UserApiResource
@apiResourceModel App\Models\User paginate=5

@apiResourceCollection App\Http\Resources\UserApiResourceCollection
@apiResourceModel App\Models\User paginate=5,simple

@apiResource App\Http\Resources\UserApiResource
@apiResourceModel App\Models\User with=accounts states=editor,verified
```

### `@apiResourceAdditional`
Specifies [additional metadata](https://laravel.com/docs/8.x/eloquent-resources#adding-meta-data-when-constructing-resources) for an API resource. Can only be used with `@apiResource` and `@apiResourceCollection`. The additional metadata is specified as fields (key-value pairs).

Format: `@apiResourceAdditional <key1>=<value1> ... <keyN>=<valueN>`

Notes:
- Supported formats for key-value pairs:
  - `key=value`
  - `key="long text with spaces"`
  - `"key with spaces"="long text with spaces"`

Examples:

```
@apiResource App\Http\Resources\UserApiResource
@apiResourceModel App\Models\User
@apiResourceAdditional result=success message="User created successfully"
```

### `#[ResponseFromApiResource]`
All-in-one attribute alternative to `@apiResource`, `@apiResourceCollection`, `@apiResourceModel` and `@apiResourceAdditional`.

Examples:

```php
use App\Models\User;
use App\Http\Resources\UserApiResource;
use App\Http\Resources\UserApiResourceCollection;

#[ResponseFromApiResource(UserApiResource::class, User::class)]
#[ResponseFromApiResource(UserApiResource::class)] // You can omit the model name if your resource has an @mixin tag
#[ResponseFromApiResource(UserApiResource::class, User::class, status: 201)]
#[ResponseFromApiResource(UserApiResource::class, User::class, 201, description: "User details")]
public function endpoint() {...}

// Collections
#[ResponseFromApiResource(UserApiResource::class, User::class, 201, collection: true)]
#[ResponseFromApiResource(UserApiResourceCollection::class, User::class, 201)]
public function endpoint() {...}

// Specifying factory states and relations
#[ResponseFromApiResource(UserApiResource::class, User::class,
    factoryStates: ['editor', 'verified'], with: ['accounts', 'pets'])]
public function endpoint() {...}

// Pagination
#[ResponseFromApiResource(UserApiResourceCollection::class, User::class, paginate: 10)]
#[ResponseFromApiResource(UserApiResource::class, User::class, collection: true, paginate: 10)]
#[ResponseFromApiResource(UserApiResource::class, User::class, collection: true, simplePaginate: 10)]
public function endpoint() {...}

// Additional data
#[ResponseFromApiResource(UserApiResource::class, User::class, 201,
    merge: ["result" => "success", "message" => "User created successfully")]
public function endpoint() {...}
```


## Responses via Fractal Transformers
### `@transformer`
Tells Scribe how to generate a response using a [Fractal transformer](https://fractal.thephpleague.com/transformers/). Can be used together with [`@transformerModel`](#transformermodel).

Format: `@transformer <status?> <transformerClass>`

Notes:
- If you don't specify a status, Scribe will assume `200`.
- If you don't specify `transformerModel`, Scribe will use the first argument to your method.

Examples:

```
@transformer App\Http\Transformers\UserTransformer
@transformerModel App\Models\User

@transformer 201 App\Http\Transformers\UserTransformer
@transformerModel App\Models\User
```

### `@transformerCollection`

Tells Scribe how to generate a response using a [Fractal transformer](https://fractal.thephpleague.com/transformers/) collection. Can be used together with [`@transformerModel`](#transformermodel) and [`@transformerPaginator`](#transformerpaginator).

Format: `@transformerCollection <status?> <transformerClass>`

Examples:

```
@transformerCollection App\Http\Transformers\UserCollectionTransformer
@transformerModel App\Models\User

@transformerCollection 201 App\Http\Transformers\UserCollectionTransformer
@transformerModel App\Models\User
```


### `@transformerModel`

Tells Scribe the model to use when generating the [Fractal transformer](https://fractal.thephpleague.com/transformers/) response. Can only be used together with [`@transformer`](#transformer) or [`@transformerCollection`](#transformercollection) (along with [`@transformerPaginator`](#transformerpaginator)).

Format: `@transformerModel <modelClass>`

Notes:
- Supported fields:
    - `states`: Comma-separated list of [states](https://laravel.com/docs/database-testing#applying-states) to be applied when creating an example model via factory.
    - `with`: Comma-separated list of relations to be loaded with the model. Works for factory (Laravel 8+) or database fetching.
    - `resourceKey`: The [resource key](https://fractal.thephpleague.com/serializers/) to be used during serialization.

```
@transformer App\Http\Transformers\UserTransformer
@transformerModel App\Models\User

@transformerCollection App\Http\Transformers\UserTransformer
@transformerModel App\Models\User states=editor,verified

@transformer App\Http\Transformers\UserTransformer
@transformerModel App\Models\User with=accounts,pets
```

### `@transformerPaginator`
Tells Scribe the paginator to use when generating the [Fractal transformer](https://fractal.thephpleague.com/transformers/) response. Can only be used together with [`@transformerCollection`](#transformercollection).

Format: `@transformerPaginator <adapterClass> <perPage?>`

Examples:

```
@transformerCollection App\Http\Transformers\UserCollectionTransformer
@transformerModel App\Models\User
@transformerPaginator League\Fractal\Pagination\IlluminatePaginatorAdapter

@transformerCollection App\Http\Transformers\UserCollectionTransformer
@transformerModel App\Models\User
@transformerPaginator League\Fractal\Pagination\IlluminatePaginatorAdapter 15
```
### `#[ResponseFromTransformer]`
All-in-one attribute alternative to `@transformer`, `@transformerCollection`, `@transformerModel` and `@transformerPaginator`.

Examples:

```php
use App\Models\User;
use App\Http\Transformers\UserTransformer;
use App\Http\Transformers\UserCollectionTransformer;
use League\Fractal\Pagination\IlluminatePaginatorAdapter;

#[ResponseFromTransformer(UserTransformer::class, User::class)]
#[ResponseFromTransformer(UserTransformer::class, User::class, status: 201)]
#[ResponseFromTransformer(UserTransformer::class, User::class, 201, description: "User details")]
#[ResponseFromTransformer(UserTransformer::class, User::class, 201, resourceKey: "uuid")]
public function endpoint() {...}

// Collections
#[ResponseFromTransformer(UserTransformer::class, User::class, 201, collection: true)]
#[ResponseFromTransformer(UserCollectionTransformer::class, User::class, 201)]
public function endpoint() {...}

// Specifying factory states and relations
#[ResponseFromTransformer(UserTransformer::class, User::class,
    factoryStates: ['editor', 'verified'], with: ['accounts', 'pets'])]
public function endpoint() {...}

// Pagination
#[ResponseFromTransformer(UserCollectionTransformer::class, User::class,
    paginate: [IlluminatePaginatorAdapter::class])]
#[ResponseFromTransformer(UserTransformer::class, User::class, collection: true,
    paginate: [IlluminatePaginatorAdapter::class, 15])]
public function endpoint() {...}
```

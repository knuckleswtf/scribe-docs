---
id: annotations
---

# Supported annotations

## Format
Annotations in docblocks typically consist of a _tag_ (`@-something`) followed by text in a certain format. Some important details:

- The `hideFromAPIDocumentation`, `@authenticated` and `@unauthenticated` tags are the only _boolean_ tags; they don't take any text after them.
- In the "Format" sections below, `?` indicates an optional value.
- Most annotations are written in a "natural" format, `@tag value1 value2`, where Scribe figures out what value1 and value2 represent, based on the order. However, some tags also support _attributes_ (`@tag key1=value1 value2` or `@tag value2 key1=value1`).

  Attributes don't have to follow a specific order; they can be at the start or end of the tag. Attribute values which consist of multiple words should use quotes (eg `@tag key1="this is value1" value2`).

Here's a list of all the docblock annotations Scribe supports.

## Metadata annotations

:::tip
All metadata annotations can be used on the method or class docblock. Using them on the class will make them apply to all endpoints in that class.
:::

Tag | Description | Format
----|-------------|--------
`@hideFromAPIDocumentation` | Excludes an endpoint from the docs | -
`@group` | Adds an endpoint to a group | `{groupName}` <br />
Example: `@group User management`
`@authenticated` | Indicates that an endpoint needs auth | -
`@unauthenticated` | Opposite of `@authenticated` | -

## Request parameter annotations
### `@header`
Describes a request header.

Format: `{name} {example?}`

Examples: 

```
@header Api-Version
@header Content-Type application/xml
```

### `@urlParam`
Describes a URL parameter.

Format: `{name} {type?} required? {description?} Example: {example?}`

Notes:
- If you don't supply a `type`, `string` is assumed.
- Ending with `No-example` will prevent Scribe from including this parameter in example requests.

Examples:
```
@urlParam id int 
@urlParam id int required 
@urlParam id int The user's ID. 
@urlParam id int The user's ID. Example: 88683
@urlParam id int Example: 88683
@urlParam id int required The user's ID. Example: 88683
@urlParam id int The user's ID. No-example
```

### `@queryParam`
Describes a query parameter.

Format: `{name} {type?} required? {description?} Example: {example?}`

Notes:
- If you don't supply a `type`, `string` is assumed.
- Ending with `No-example` will prevent Scribe from including this parameter in example requests.

Examples: 
```
@queryParam page int 
@queryParam page int The page number. 
@queryParam page int required The page number. Example: 4
@queryParam page int The page number. No-example
```


### `@bodyParam`
Describes a body parameter.

Format: `{name} {type} required? {description?} Example: {example?}`

Notes:
- Ending with `No-example` will prevent Scribe from including this parameter in example requests.

Examples:

```
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

## Response annotations
### `@response`
Describes an example response.

Format: `{status?} {response}`

Notes:
- If you don't specify a status, Scribe will assume `200`.
- Supported attributes: `scenario`, `status`

Examples:

```
@response {"a": "b"}
@response 201 {"a": "b"}
@response 201 scenario="Operation successful" {"a": "b"}
@response {"a": "b"} scenario=Success
```

### `@responseFile`
Describes the path to a file containing an example response.

Format: `{status?} {filePath}`

Notes:
- If you don't specify a status, Scribe will assume `200`.
- Supported attributes: `scenario`, `status`

Examples:

```
@responseFile /an/absolute/path
@responseFile 400 relative/path/from/your/project/root
@responseFile 400 scenario="Failed" path/from/your/Laravel/storage/directory
```

### `@responseField`
Describes a field in the response.

Format: `{name} {type?} {description?}`

Notes:
- You can omit the `type`; Scribe will try to figure it out from your example responses.

Examples:
```
@responseField total The total number of results.
@responseField total int The total number of results.
```

### `@apiResource`
Tells Scribe how to generate a response using an [Eloquent API resource](https://laravel.com/docs/eloquent-resources). Must be used together with [`@apiResourceModel`](#apiresourcemodel).

Format: `{status?} {resourceClass}`

Notes:
- If you don't specify a status, Scribe will assume `200`.

Examples:

```
@apiResource App\Resources\UserApiResource
@apiResourceModel App\Models\User

@apiResource 201 App\Resources\UserApiResource
@apiResourceModel App\Models\User
```

### `@apiResourceCollection`

Tells Scribe how to generate a response using an [Eloquent API resource](https://laravel.com/docs/eloquent-resources) collection. Must be used together with [`@apiResourceModel`](#apiresourcemodel).

Format: `{status?} {resourceClass}`

Notes:
- If you don't specify a status, Scribe will assume `200`.

Examples:

```
@apiResourceCollection App\Resources\UserApiResource
@apiResourceModel App\Models\User

@apiResourceCollection App\Resources\UserApiResourceCollection
@apiResourceModel App\Models\User

@apiResourceCollection 201 App\Resources\UserApiResourceCollection
@apiResourceModel App\Models\User
```

### `@apiResourceModel`
Tells Scribe the model to use when generating the [Eloquent API resource](https://laravel.com/docs/eloquent-resources) response. Must be used together with [`@apiResource`](#apiresource) or [`@apiResourceCollection`](#apiresourcecollection).

Format: `{modelClass}`

Notes:
- Supported attributes:
  - `states`: Comma-separated list of [factory states](https://laravel.com/docs/database-testing#applying-states) to be applied when creating an example model.
  - `with`: Comma-separated list of relations to be loaded with the model (Laravel 8+).
  - `paginate`: The number of items per page (when generating a collection). To use [simple pagination](https://laravel.com/docs/8.x/pagination#simple-pagination) instead, add `,simple` after the number.

```
@apiResource App\Resources\UserApiResource
@apiResourceModel App\Models\User

@apiResourceCollection App\Resources\UserApiResource
@apiResourceModel App\Models\User states=editor,verified

@apiResource App\Resources\UserApiResource
@apiResourceModel App\Models\User with=accounts,pets

@apiResourceCollection App\Resources\UserApiResource
@apiResourceModel App\Models\User paginate=5

@apiResourceCollection App\Resources\UserApiResourceCollection
@apiResourceModel App\Models\User paginate=5,simple

@apiResource App\Resources\UserApiResource
@apiResourceModel App\Models\User with=accounts states=editor,verified
```


### `@transformer`
Tells Scribe how to generate a response using a [Fractal transformer](https://fractal.thephpleague.com/transformers/). Can be used together with [`@transformerModel`](#transformermodel).

Format: `{status?} {transformerClass}`

Notes:
- If you don't specify a status, Scribe will assume `200`.
- If you don't specify `transformerModel`, Scribe will use the first argument to your method.

Examples:

```
@transformer App\Transformers\UserTransformer
@transformerModel App\Models\User

@transformer 201 App\Transformers\UserTransformer
@transformerModel App\Models\User
```

### `@transformerCollection`

Tells Scribe how to generate a response using a [Fractal transformer](https://fractal.thephpleague.com/transformers/) collection. Can be used together with [`@transformerModel`](#transformermodel) and [`@transformerPaginator`](#transformerpaginator).

Format: `{status?} {transformerClass}`

Examples:

```
@transformerCollection App\Transformers\UserCollectionTransformer
@transformerModel App\Models\User

@transformerCollection 201 App\Transformers\UserCollectionTransformer
@transformerModel App\Models\User
```


### `@transformerModel`

Tells Scribe the model to use when generating the [Fractal transformer](https://fractal.thephpleague.com/transformers/) response. Can only be used together with [`@transformer`](#transformer) or [`@transformerCollection`](#transformercollection) (along with [`@transformerPaginator`](#transformerpaginator)).

Format: `{modelClass}`

Notes:
- Supported attributes:
    - `states`: Comma-separated list of [factory states](https://laravel.com/docs/database-testing#applying-states) to be applied when creating an example model.
    - `with`: Comma-separated list of relations to be loaded with the model (Laravel 8+).
    - `resourceKey`: The [resource key](https://fractal.thephpleague.com/serializers/) to be used during serialization.

```
@transformer App\Transformers\UserTransformer
@transformerModel App\Models\User

@transformerCollection App\Transformers\UserTransformer
@transformerModel App\Models\User states=editor,verified

@transformer App\Transformers\UserTransformer
@transformerModel App\Models\User with=accounts,pets
```

### `@transformerPaginator`
Tells Scribe the paginator to use when generating the [Fractal transformer](https://fractal.thephpleague.com/transformers/) response. Can only be used together with [`@transformerCollection`](#transformercollection).

Format: `{adapterClass} {perPage?}`

Examples:

```
@transformerCollection App\Transformers\UserCollectionTransformer
@transformerModel App\Models\User
@transformerPaginator League\Fractal\Pagination\IlluminatePaginatorAdapter

@transformerCollection App\Transformers\UserCollectionTransformer
@transformerModel App\Models\User
@transformerPaginator League\Fractal\Pagination\IlluminatePaginatorAdapter 15
```
---
id: annotations
---

# Supported annotations

## Format
Annotations in docblocks typically consist of a _tag_ (`@-something`) followed by text in a certain format. Some important details:

- The `@hideFromAPIDocumentation`, `@authenticated` and `@unauthenticated` tags are the only _boolean_ tags; they don't take any text after them.
- In the "Format" sections below, `?` indicates an optional value.
- Most annotations are written in a "natural" format, `@tag value1 value2`, where Scribe figures out what value1 and value2 represent, based on the order. However, some tags also support _attributes_ (`@tag key1=value1 value2` or `@tag value2 key1=value1`).

  Attributes don't have to follow a specific order; they can be at the start or end of the tag (but they generally cannot be in the middle). Attribute values which consist of multiple words should use quotes (eg `@tag key1="this is value1" value2`).

Here's a list of all the docblock annotations Scribe supports.

## Metadata annotations

:::tip
All metadata annotations can be used on the method or class docblock. Using them on the class will make them apply to all endpoints in that class.
:::

Tag | Description | Format
----|-------------|--------
`@hideFromAPIDocumentation` | Excludes an endpoint from the docs | `@hideFromAPIDocumentation`
`@group` | Adds an endpoint to a group | `@group <groupName>` <br /> Example: `@group User management`
`@authenticated` | Indicates that an endpoint needs auth | `@authenticated` 
`@unauthenticated` | Opposite of `@authenticated` | `@unauthenticated`

## Request parameter annotations
### `@header`
Describes a request header.

Format: `@header <name> <example?>`

Examples: 

```
@header Api-Version
@header Content-Type application/xml
```

### `@urlParam`
Describes a URL parameter.

Format: `@urlParam <{type}?> <name> required? <description?> Example: <example?>`

Notes:
- If you don't supply a `type`, `string` is assumed.
- Ending with `No-example` will prevent Scribe from including this parameter in example requests.

Examples:
```
@urlParam {int} id 
@urlParam {int} id required 
@urlParam {int} id The user's ID. 
@urlParam {int} id The user's ID. Example: 88683
@urlParam {int} id Example: 88683
@urlParam {int} id required The user's ID. Example: 88683
@urlParam {int} id The user's ID. No-example
```

### `@queryParam`
Describes a query parameter.

Format: `@queryParam <{type}?> <name> required? <description?> Example: <example?>`

Notes:
- If you don't supply a `type`, `string` is assumed.
- Ending with `No-example` will prevent Scribe from including this parameter in example requests.

Examples: 
```
@queryParam {int} page 
@queryParam {int} page The page number. 
@queryParam {int} page required The page number. Example: 4
@queryParam {int} page The page number. No-example
```


### `@bodyParam`
Describes a body parameter.

Format: `@bodyParam <{type}> <name> required? <description?> Example: <example?>`

Notes:
- Ending with `No-example` will prevent Scribe from including this parameter in example requests.

Examples:

```
@bodyParam {string} room_id 
@bodyParam {string} room_id required The room ID. 
@bodyParam {string} room_id The room ID. Example: r98639bgh3
@bodyParam {string} room_id Example: r98639bgh3

// Objects and arrays
@bodyParam {object} user required The user data 
@bodyParam {string} user.name required The user's name. 
@bodyParam {int} user.age Example: 1000 
@bodyParam {object[]} people required List of people 
@bodyParam {string} people[].name Example: Deadpool

// If your entire request body is an array
@bodyParam {object[]} [] required List of things to do 
@bodyParam {string} [].name Name of the thing. Example: Cook
```

## Response annotations
### `@response`
Describes an example response.

Format: `@response <status?> <response>`

Notes:
- If you don't specify a status, Scribe will assume `200`.
- Supported attributes: `scenario`, `status`

Examples:

```
@response {"a": "b"}
@response 201 {"a": "b"}
@response 201 {"a": "b"} scenario="Operation successful"
@response status=201 scenario="Operation successful" {"a": "b"}
@response scenario=Success {"a": "b"}
@response 201 scenario="Operation successful" {"a": "b"}
```

### `@responseFile`
Describes the path to a file containing an example response. The path can be absolute or relative to your project directory.

Format: `@responseFile <status?> <filePath>`

Notes:
- If you don't specify a status, Scribe will assume `200`.
- Supported attributes: `scenario`, `status`

Examples:

```
@responseFile /an/absolute/path
@responseFile 400 relative/path/from/your/project/root
@responseFile status=400 scenario="Failed" relative/path/from/your/project/root
@responseFile 400 scenario="Failed" relative/path/from/your/project/root
```

### `@responseField`
Describes a field in the response.

Format: `@responseField <{type}?> <name> <description?>`

Notes:
- You can omit the `type`; Scribe will try to figure it out from your example responses.

Examples:
```
@responseField total The total number of results.
@responseField {int} total The total number of results.
```
---
id: migrating-v3
---

# Migrating to v3

We've included an upgrade tool that will make the needed changes.

## New feature highlights
- More validation rules support
- Inline validators
- 3 base URLs
- Headers in response
- Infer URL parameter type and name
- Include responses in Postman collection
- Body parameters array


## Config file changes
- `router` has been removed. Scribe now auto-detects your router.
- `interactive` has been replaced with `try_it_out.enabled`.
- There's a new option, `try_it_out.base_url`, that lets you set the base URL to be used for _Try It Out_.
- The config key `continue_without_database_transactions` (deprecated in 2.4.0) has been removed. Instead, put the database connections you _do_ want transactions for (ie the **opposite** meaning) in `database_connections_to_transact`. A good default is:
  ```php
  'database_connections_to_transact' => [config('database.default')]
  ```

The config changes can be automated for you by our upgrader. Run `php artisan scribe:upgrade --scope config` to automatically upgrade your config. 

## Plugin API
- The `$stage` property of the `Strategy` class has been removed. It wasn't used for anything.
- The `'value'` key in url/query/body parameters has been renamed to `'example'`.
- The signature of the `__invoke` method has changed...significantly. It now looks like this:
  ```php
  public function __invoke(
    Knuckles\Camel\Extraction\ExtractedEndpointData $endpointData,
    array $routeRules
  ): ?array;
  ```
  The route, http methods, controller, method, and other data about the endpoint are now properties on the `EndpointData` class.

The [plugin API reference](./reference/plugin-api) explains the new plugin API in detail.

## UI customizations
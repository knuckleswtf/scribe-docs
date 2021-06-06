---
id: plugin-api
---

# Plugin API

Plugins (custom strategies) allow you tp provide Scribe with more information about your endpoints. This document describes the plugin API. For a guide to creating plugins, see [Writing Plugins](../advanced/plugins).

Each plugin must extend the base strategy class, `Knuckles\Scribe\Extracting\Strategies\Strategy`, which is an abstract class defined like this:

```php
use Knuckles\Camel\Extraction\ExtractedEndpointData;
use Knuckles\Scribe\Tools\DocumentationConfig;

abstract class Strategy
{
    /**
     * The Scribe config
     */
    protected DocumentationConfig $config;
    
    /**
     * @param ExtractedEndpointData $endpointData
     * @param array $routeRules Array of rules for this route.
     *
     * @return array|null
     */
    abstract public function __invoke(
        ExtractedEndpointData $endpointData,
        array $routeRules
    ): ?array;
}
```
:::tip
You can run `php artisan scribe:strategy <className>` to automatically generate a strategy.
:::

## `$config`
The `$config` property is an instance of the Scribe configuration (= `config('scribe')`). You can retrieve values using `get()` and dot notation. For example:

```php
// Check if "Try It Out" is enabled:
$this->config('try_it_out.enabled');
```

You can specify a default that will be returned if the value does not exist. Otherwise, `null` will be returned.

```php
$this->config('unknown_setting'); // Returns null
$this->config('unknown_setting', true); // Returns true
```

## `__invoke(ExtractedEndpointData $endpointData, array $routeRules): ?array`
This is the method that is called to process a route. Parameters:
- `$endpointData`, an instance of `Knuckles\Camel\Extraction\ExtractedEndpointData` ([source](https://github.com/knuckleswtf/scribe/blob/master/camel/Extraction/ExtractedEndpointData.php)), which contains information about the endpoint being processed.
- `$routeRules`, the rules passed in the `apply` section of the Scribe config for this route.

This method may return `null` or an empty array if it has no data to add. Otherwise, it should return an array with the relevant information, which varies depending on the type of strategy/stage of route processing:
- For `metadata`, a map (key => value) of metadata attributes.
  ```php
  return [
    'groupName' => 'User management',
    'groupDescription' => 'APis to manage users.',
    'title' => 'Shadowban a user',
    'description' => "Temporarily restrict a user's account",
    'authenticated' => true,
  ];
  ```
- For `heaaders`, a map (key => value) of headers and values.
  ```php
  return [
    'Api-Version' => null,
    'Content-Type' => 'application/xml',
  ];
  ```
- For `urlParameters`, `queryParameters`, and `bodyParameters`, a map (key => value) of parameters.
  ```php
  return [
    'room_id' => [
      'type' => 'string',
      'description' => '',
      'example' => 'r4oiu78t63ns3',
      'required' => true, 
    ]
  ];
  ```

:::note
Setting a parameter to `required => false` and `example => null` tells Scribe to omit it from example requests. It will still be present in the main docs. 
:::

- For `responses`, a list of one or more responses.
  ```php
  return [
    [
      'status' => 201,
      'headers' => ['sample-header' => ['sample-value']],
      'description' => 'Operation successful.',
      'content' => '{"room": {"id": "r4oiu78t63ns3"}}',
    ],
  ];
  ```
  
:::note
The return values from each strategy are merged with the existing extracted data. This means a later strategy can overwrite an earlier one. The exception here is the `responses` stage. The responses from all strategies will be kept. Responses cannot overwrite each other, even if they have the same status code.
:::
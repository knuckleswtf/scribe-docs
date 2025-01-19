---
id: plugins
---

# Writing plugins
You can use plugins as an alternative way to provide Scribe with more information about your endpoints.

For instance, suppose all your GET endpoints support pagination query parameters `pageSize` and `page`, and you don't want to annotate with `@queryParam` on each method. You can create a plugin that adds this to all your query parameters. Let's see how to do this.

## The stages of route processing
First, it's important to know the _stages_ of route processing:
- metadata (this includes `title`, `description`, `groupName`, `groupDescription`, and authentication status (`authenticated`))
- urlParameters
- queryParameters
- headers (headers to be added to example requests and response calls)
- bodyParameters
- responses
- responseFields (descriptions of fields in the response)

At each stage, the Extractor attempts to use various "strategies" to fetch data. The Extractor will call all the strategies configured in `scribe.php`, merging their results together to produce the final output of that stage. Later strategies can overwrite or add to the results of earlier strategies.

:::note
Unlike other stages, the `responses` stage is additive. This means that all responses from all strategies will be saved. Responses cannot overwrite each other, even if they have the same status code. By contrast, if you return a value for a body parameter from one strategy, it will overwrite any data for that parameter gotten from previous strategies.
:::

There are a number of strategies included with the package, so you don't have to set up anything to get it working.


:::tip
Check out our [community wiki](https://github.com/knuckleswtf/scribe/wiki) for a list of strategies contributed by the community.
:::

## Creating a strategy
To create a strategy, create a class that extends `\Knuckles\Scribe\Extracting\Strategies\Strategy`. You can do this manually, or by running the `scribe:strategy` command. 

```bash
php artisan scribe:strategy AddPaginationParameters
```

This will create a class like this in your `app\Docs\Strategies` folder:

```php title="app\Docs\Strategies\AddPaginationParameters.php"
namespace App\Docs\Strategies;

use Knuckles\Scribe\Extracting\ParamHelpers;
use Knuckles\Scribe\Extracting\Strategies\Strategy;
use Knuckles\Camel\Extraction\ExtractedEndpointData;

class AddPaginationParameters extends Strategy
{
    /**
     * Trait containing some helper methods for dealing with "parameters".
     * Useful if your strategy extracts information about parameters.
     */
    use ParamHelpers;

    /**
     * @param ExtractedEndpointData $endpointData The endpoint we are currently processing.
     *   Contains details about httpMethods, controller, method, route, url, etc, as well as already extracted data.
     * @param array $routeRules Array of rules for the ruleset which this route belongs to.
     *
     * @return array|null
     */
    public function __invoke(ExtractedEndpointData $endpointData, array $routeRules = []): ?array
    {
        return [];
    }

}
```

Alternatively, if you're creating a strategy that you'd like people to download and install via Composer, you can generate one from [this GitHub template](https://github.com/knuckleswtf/scribe-plugin-template).

## Writing strategies
Let's take a look at the contents of our Strategy class. There's a detailed [plugin API reference](../reference/plugin-api) (and you should check it out), but the important thing is the `__invoke` method. This is where our logic goes.

Let's add some code to make our strategy work:

```php title="app\Docs\Strategies\AddPaginationParameters.php"

public function __invoke(ExtractedEndpointData $endpointData, array $routeRules = []): ?array
{
    $isGetRoute = in_array('GET', $endpointData->httpMethods);
    $isIndexRoute = strpos($endpointData->route->getName(), '.index') !== false;
    if ($isGetRoute && $isIndexRoute) {
        return [
            'page' => [
                'description' => 'Page number to return.',
                'required' => false,
                'example' => 1,
            ],
            'pageSize' => [
                'description' => 'Number of items to return in a page. Defaults to 10.',
                'required' => false,
                'example' => null, // We don't want it to show in examples
            ],
        ];
    }

    return null;
}
```

So what's going on here? We're checking if the endpoint if a GET endpoint using the `$endpointData` object. Then we also check for the route name, via `$endpointData->route`. And finally we return the parameter info.

Note that we set our `pageSize` to `reuired => false` and `example => null`. This tells Scribe to omit it from example requests. It will still be present in the main docs.

## Using your strategy
The final step is to register the strategy in our config:.

```php {5} title="config/scribe.php"
    'strategies' => [
        // ...
        'queryParameters' => [
            \Strategies\QueryParameters\GetFromQueryParamTag::class,
            \App\Docs\Strategies\AddPaginationParameters::class,
        ],
    ],
```

:::tip
You can also publish your strategy as a Composer package. Then others can install them via `composer require` and register them in their own config. 
:::

And we're done! Now, when we run `php artisan scribe:generate`, all our GET routes that end with `.index` will have the pagination parameters added. Here we go!

![](/img/screenshots/plugins.png)

See the [plugin API reference](../reference/plugin-api) for details of what's available when writing plugins.

## Utilities
When developing strategies, you have access to a few useful tools:

### Accessing docblocks
You can use the `RouteDocBlocker` class to fetch docblocks for a route (method and class). It has this interface:

```php
namespace Knuckles\Scribe\Extracting;

use Illuminate\Routing\Route;
use Mpociot\Reflection\DocBlock;

class RouteDocBlocker
{
    /**
     * @param Route $route
     *
     * @return array<"method"|"class", DocBlock> Method and class docblocks
     */
    public static function getDocBlocksFromRoute(Route $route): array;
}
```

You pass in a route (from `$endpointData->route`), and you get an array with two keys, `method` and `class`, containing the docblocks for the method and controller handling the route respectively (instances of `\Mpociot\Reflection\DocBlock`).

This allows you to implement your own custom tags. For instance, a `@usesPagination` annotation:

```php

public function __invoke(ExtractedEndpointData $endpointData, array $routeRules = []): ?array
{
    $methodDocBlock = RouteDocBlocker::getDocBlocksFromRoute($endpointData->route)['method'];
    $tags = $methodDocBlock->getTagsByName('usesPagination');
    
    if (empty($tags)) {
        // Doesn't use pagination
        return [];
    }
    
    return [
        'page' => [
            'description' => 'Page number to return.',
            'required' => false,
            'example' => 1,
        ],
        'pageSize' => [
            'description' => 'Number of items to return in a page. Defaults to 10.',
            'required' => false,
            'example' => null, // So it doesn't get included in the examples
        ],
    ];
}
```

And in your controller method:

```php
class UserController
{
    /**
     * @usesPagination
     */
     }
    public function index()
    {
        // ...
    }
}
```

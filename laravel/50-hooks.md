---
id: hooks
---

# Hooks

Scribe allows you to modify its behaviour in many ways. Some ways are very obvious, like in the config file and via annotations (see the pages in the **Documenting your API** category in the sidebar). Others are more involved, like writing custom strategies and customising the views (the pages under **Advanced Customization**).

However, a useful in-between is **hooks**. Hooks are a way for you to run a task before or after Scribe does something. You can achieve some of that in other ways, but hooks provide a convenient point in the context of your app and allow you to harness the full power of Laravel.

Scribe currently provides four hooks:
- `beforeResponseCall()`
- `afterGenerating()`
- `normalizeEndpointUrlUsing()`
- `instantiateFormRequestUsing()`

To define a hook, call these methods and pass in a callback where you do whatever. Typically, you'd do this in the `boot()` method of your `AppServiceProvider`.

:::caution
Always wrap these method calls in an `if (class_exists(\Knuckles\Scribe\Scribe::class))` statement. That way, you can push this code to production safely, even if Scribe is installed in dev only.
:::

## `beforeResponseCall()`
`beforeResponseCall()` allows you to run some code before a response call is dispatched. You can use this to fix authentication, add parameters, or whatever you wish,

The callback you provide will be passed the current `Symfony\Component\HttpFoundation\Request` instance and the details of the current endpoint being extracted. If you have database transactions configured, they will already be activated at that point, allowing you to modify your database freely, and have your changes rolled back after the request.

```php title=app\Providers\AppServiceProvider.php

use Knuckles\Camel\Extraction\ExtractedEndpointData;
use Symfony\Component\HttpFoundation\Request;
use Knuckles\Scribe\Scribe;

public function boot()
{
  if (class_exists(\Knuckles\Scribe\Scribe::class)) {
    Scribe::beforeResponseCall(function (Request $request, ExtractedEndpointData $endpointData) {
      // Customise the request however you want (e.g. custom authentication)
      $token = User::first()->api_token;
      
      $request->headers->set("Authorization", "Bearer $token");
      // You also need to set the headers in $_SERVER
      $request->server->set("HTTP_AUTHORIZATION", "Bearer $token");
    });
  }
}
```

## `afterGenerating()`
`afterGenerating()` allows you to run some code after Scribe is done generating your docs; for instance, upload your generated docs to AWS S3, change some of the content, etc. You could do the same with a shell script, but by using `afterGenerating()`, you get to stay in PHP land, complete with all Laravel's goodness.

The callback you provide will be passed a map of the output paths generated.

```php title=app\Providers\AppServiceProvider.php

use Knuckles\Scribe\Scribe;

public function boot()
{
  if (class_exists(\Knuckles\Scribe\Scribe::class)) {
    Scribe::afterGenerating(function (array $paths) {
      dump($paths);
      // Move the files, upload to S3, etc...
      rename($paths['postman'], "some/where/else");
      Storage::disk('s3')->put('collection.json', file_get_contents($paths['postman']));
    });
  }
}
```

Here's an example of the `$paths` array passed to the callback.

```
[
  "postman" => "C:\Users\shalvah\Projects\TheSideProjectAPI\punlic\docs\collection.json"
  "openapi" => "C:\Users\shalvah\Projects\TheSideProjectAPI\punlic\docs\openapi.yaml"
  "html" => "C:\Users\shalvah\Projects\TheSideProjectAPI\docs\index.html"
  "blade" => null
  "assets" => [
    "js" => "C:\Users\shalvah\Projects\TheSideProjectAPI\docs\css"
    "css" => "C:\Users\shalvah\Projects\TheSideProjectAPI\docs\js"
    "images" => "C:\Users\shalvah\Projects\TheSideProjectAPI\docs\images"
  ]
]
```

Notes:
- The paths in `"js"`, `"css"`, and `"images"` paths point to the respective _folders_. All other paths point to specific files.
- If you're using `laravel` type, `"html"` will be null, and `"blade"` will contain the `index.blade.php` path.
- If you're using `static` type, `"blade"` will be null, and `"html"` will contain the `index.html` path.
- If you disabled Postman and/or OpenAPI generation, those paths will be null.
- Paths are generated using PHP's `realpath()`, so they'll use the appropriate directory separator for your platform (backslash on Windows, forwards slash on *nix).


## `normalizeEndpointUrlUsing()`
Laravel provides some shortcuts for writing endpoint paths, especially when using resource routes or model binding. For instance,`Route::apiResource('users.projects')` generates routes to create, update, view, list and delete a `project` resources. However, the generated parameter names aren't always obvious to non-Laravel end users. In this example, we get URLS like `users/{user}/projects/{project}`, and it isn't obvious what the parameters mean. Is the`{project}` the project ID? HashId? Slug?

Scribe tries to make things clear by normalizing endpoint URLs. By default, Scribe will rewrite this example to  `users/{user_id}/projects/{id}`. If your model uses something other than `id` for routing, Scribe will try to figure that out instead, based on things such as the model's `routeKeyName` or the key specified in the URL.

If you aren't happy with the results of this normalization, you can use the `normalizeEndpointUrlUsing()` hook to override it. Specify a callback that will be called when the `ExtractedEndpointData` object is being instantiated. The callback will be passed the default Laravel URL, the route object, the controller method and class (where available).

```php title=app\Providers\AppServiceProvider.php

use Knuckles\Scribe\Scribe;
use Illuminate\Routing\Route;
use ReflectionFunctionAbstract;
use ReflectionClass;

public function boot()
{
  if (class_exists(Scribe::class)) {
    Scribe::normalizeEndpointUrlUsing(function (string $url, Route $route, ReflectionFunctionAbstract $method, ?ReflectionClass $controller) {
      if ($url == 'things/{thing}') 
        return 'things/{the_id_of_the_thing}';

      if ($route->named('things.otherthings.destroy')) 
        return 'things/{thing-id}/otherthings/{other_thing-id}';
    
      return match ($route->name) {
        'people/{person}' => ...,
        default => $url
      };
    });
  }
}
```

This means you can disable URL normalization completely with:

```php
Scribe::normalizeEndpointUrlUsing(fn($url) => $url);
```

## `instantiateFormRequestUsing()`
`instantiateFormRequestUsing()` allows you to customise how FormRequests are created by the FormRequest strategies. By default, these strategies simply call `new $yourFormRequestClass`. This means if you're using Laravel's constructor or method injection, your dependencies won't be resolved properly, and certain request-specific functionality may not work. If that's the case, you can use this hook to override how the FormRequest is created.

The callback you provide will be passed the name of the FormRequest class, the current Laravel route being processed, and the controller method. Your callback should return a `FormRequest` instance.

```php title=app\Providers\AppServiceProvider.php

use Knuckles\Scribe\Scribe;
use Illuminate\Routing\Route;
use ReflectionFunctionAbstract;

public function boot()
{
  if (class_exists(Scribe::class)) {
    Scribe::instantiateFormRequestUsing(function (string $formRequestClassName, Route $route, ReflectionFunctionAbstract $method) {
      return app()->makeWith($formRequestClassName, $someDependencies);
    });
  }
}
```

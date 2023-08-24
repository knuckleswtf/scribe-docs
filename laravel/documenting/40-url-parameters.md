---
id: url-parameters
---

# URL parameters
Scribe automatically extracts details about your URL parameters from your routes. It can figure out the names, required/optional status and sometimes the types of your parameters. However, you can overwrite this information or add new details, such as a description, using the `@urlParam` tag (or the `#[UrlParam]` attribute).

:::tip
Scribe can figure out a few details about ID parameters in URLs. For example, if you have a route like `/users/{id}`, `/users/{user}`, `/{user_id}`, Scribe will guess the parameter name (`id`/`user_id`), type (type of your `User` model's primary key), and description ("The ID of the user."). Of course, you can use `@urlParam` to override these.
:::

The tag takes the name of the parameter, an optional type (defaults to "string"), an optional "required" label, and an optional description. Valid types are `string`, `integer`, and `number`. For instance, if you defined your Laravel route like this:

```php
Route::get("/post/{id}/{lang?}");
```

you can describe the `id` and `lang` parameters like this: 


import {AttributesTagsTabs, TabItem} from '@site/src/components/AttributesTagsTabs';

<AttributesTagsTabs>
<TabItem value="tags">

```php
/**
 * @urlParam id integer required The ID of the post.
 * @urlParam lang The language. Enum: en, fr Example: en
 */
public function getPost()
{
    // ...
}
```

</TabItem>

<TabItem value="attributes">

```php
use Knuckles\Scribe\Attributes\UrlParam;

#[UrlParam("id", "integer", "The ID of the post.")]
#[UrlParam("lang", "The language.", required: false, enum: ["en", "fr"], example: "en")]
public function getPost()
{
    // ...
}
```

</TabItem>
</AttributesTagsTabs>


:::tip
See [the reference section](/laravel/reference/annotations#urlparamurlparam) for more examples and details of all you can do with `@urlParam` and `#[UrlParam]`
:::

Scribe will generate a random example by default, but you can specify your own value in examples and response calls by ending the description with `Example: <your-example>`, as we did for the `lang` parameter above.

This gives:

![](/img/screenshots/endpoint-urlparams-1.png)

If you want Scribe to omit a certain optional parameter (`lang` in our example) in examples and response calls, end the description with `No-example`. It will still be present in the docs.


```php
/**
 * @urlParam id required The ID of the post.
 * @urlParam lang The language. No-example
 */
```

![](/img/screenshots/endpoint-urlparams-2.png)

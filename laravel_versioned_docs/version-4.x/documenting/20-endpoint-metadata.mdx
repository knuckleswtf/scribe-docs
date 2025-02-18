---
id: metadata
---

# Endpoint metadata
Endpoint metadata is primarily added via annotations, either via the docblock or PHP attributes. See [Supported annotations](../reference/annotations) for a comprehensive list.

## Title and description

import {AttributesTagsTabs, TabItem} from '@site/src/components/AttributesTagsTabs';

<AttributesTagsTabs>
<TabItem value="tags">

To set an endpoint's title and description, just write in the method's docblock. The first paragraph is the title, and the rest is the description. There must be a blank line between title and description. Markdown and HTML are also supported (see [HTML helpers](../reference/html)). 

For instance:

```php
/**
 * Add a word to the list.
 *
 * This endpoint allows you to add a word to the list.
 * It's a really useful endpoint, and you should play around 
 * with it for a bit.
 * <aside class="notice">We mean it; you really should.😕</aside>
 */
public function store(Request $request)
{
    //...
}
```

:::note
For best results, the title and description should come before any annotations (`@-tag`).
:::

</TabItem>

<TabItem value="attributes">


To set an endpoint's title and description, use the `#[Endpoint]` attribute. Markdown and HTML are also supported (see [HTML helpers](../reference/html)). 

For instance:

```php
use Knuckles\Scribe\Attributes\Endpoint;

#[Endpoint("Add a word to the list.", <<<DESC
  This endpoint allows you to add a word to the list.
  It's a really useful endpoint, and you should play around 
  with it for a bit.
  <aside class="notice">We mean it; you really should.😕</aside>
 DESC)]
public function store(Request $request)
{
    //...
}
```

</TabItem>
</AttributesTagsTabs>

This becomes:

![](/img/screenshots/endpoint-title-description.png)

## Grouping endpoints
For easy navigation, endpoints in your API are organized by groups. You can add an endpoint to a group by using the `@group` annotation (or the `#[Group]` attribute), followed by the name of the group.

:::tip
A better option is often to set `@group`/`#[Group]` on the controller instead. This will add all endpoints in that controller to the group, and you can add a group description below the group name.
:::

<AttributesTagsTabs>
<TabItem value="tags">

```php
/**
 * @group User management
 *
 * APIs for managing users
 */
class UserController extends Controller
{
	/**
	 * Create a user.
	 */
	 public function createUser()
	 {

	 }
	 
	/**
     * Change a user's password.
     * 
	 * @group Account management
	 */
	 public function changePassword()
	 {

	 }
}
```

</TabItem>

<TabItem value="attributes">

```php
use Knuckles\Scribe\Attributes\Group;


#[Group("User management", "APIs for managing users")]
class UserController extends Controller
{
	/**
	 * Create a user.
	 */
	public function createUser()
	{
	}
	 
	/**
     * Change a user's password.
	 */
    #[Group("Account management")]
	public function changePassword()
	{
	}
}
```

</TabItem>
</AttributesTagsTabs>


![](/img/screenshots/endpoint-groups.png)

Grouping endpoints is optional. Any endpoints not in a group will be placed in a default group specified in your [config](../reference/10-config.md#groups).

You can also specify subgroups, by using the `#[Subgroup]` attribute, or the `@subgroup` (and optionally `@subgroupDescription`) tag.

<AttributesTagsTabs>
<TabItem value="tags">

```php
/**
 * @group Resource management
 *
 * APIs for managing resources
 * 
 * @subgroup Servers
 * @subgroupDescription Do stuff with servers
 */
class ServersController extends Controller
{
	/**
	 * This will be in the "Servers" subgroup of "Resource management"
	 */
	 public function createServer()
	 {
	 }
	 
	/**
     * This will be in the "Stats" subgroup of "Resource management"
     * 
	 * @subgroup Stats
	 */
	 public function stats()
	 {

	 }
}
```

</TabItem>

<TabItem value="attributes">

```php
use Knuckles\Scribe\Attributes\Group;
use Knuckles\Scribe\Attributes\Subgroup;


#[Group("Resource management", "APIs for managing resources")]
#[Subgroup("Servers", "Do stuff with servers")]
class ServersController extends Controller
{
	/**
	 * This will be in the "Servers" subgroup of "Resource management"
	 */
	 public function createServer()
	 {
	 }
	 
	/**
     * This will be in the "Stats" subgroup of "Resource management"
     * 
	 * @subgroup Stats
	 */
    #[Subgroup("Stats")]
	 public function stats()
	 {

	 }
}}
```

</TabItem>
</AttributesTagsTabs>

## Indicating authentication status
If you have `auth.default` set to `false` in your config, your endpoints will be treated as open by default. You can use the `@authenticated` annotation (or `#[Authenticated]` attribute) on a method to indicate that the endpoint needs authentication.

Similarly, if you have `auth.default` set to `true` in your config, your endpoints will be treated as authenticated by default. You can use the `@unauthenticated` annotation (or `#[Unauthenticated]` attribute) on a method to indicate that the endpoint is unauthenticated.

:::tip
Like with `@group`, you can place these annotations on the controller so you don't have to write it on each method.
:::


<AttributesTagsTabs>
<TabItem value="tags">

```php
    /**
     * Create a user
     *
     * This endpoint lets you create a user.
     * @authenticated
     */
     public function create()
     {    
     }
```

</TabItem>

<TabItem value="attributes">

```php
use Knuckles\Scribe\Attributes\Authenticated;

    /**
     * Create a user
     *
     * This endpoint lets you create a user.
     */
     #[Authenticated]
     public function create()
     {    
     }
```
</TabItem>
</AttributesTagsTabs>

A "Requires authentication" badge will be added to that endpoint in the generated documentation. 

![](/img/screenshots/endpoint-auth.png)


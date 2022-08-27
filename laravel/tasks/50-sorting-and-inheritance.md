---
id: sorting-and-inheritance
---

# Sorting and inheritance

## Sorting endpoints and groups
By default, endpoint groups are ordered alphabetically in the docs, while endpoints are ordered according to your routes file. You can override this by specifying a sort order in your config file (in `groups.order`). 

List the items you wish to sort in the order you want them. All other items will be sorted as usual after  For instance, if you want the "Tokens" group first, followed by "Users" and then all other groups, that would be:

```php title=config/scribe.php
'groups' => [
  'order' => [
    'Tokens',
    'Users',
  ]
]
```

You can also order subgroups and endpoints within the groups. The format for endpoints is `HTTP_METHOD /url` (eg `"POST /tokens"`.

```php title=config/scribe.php
'groups' => [
  'order' => [
    'Tokens' => [
      'POST /tokens'
      'GET /tokens'
    ],
    'Users',
    'Instances' => [
      'Active instances', // <-- a subgroup
      'Instance stats' => [
        'GET /stats' // <- an endpoint in a subgroup
        ],
      'POST /end_all', // <-- an endpoint
    ],
  ]
]
```

Remember: any groups, subgroups or endpoints you don't specify will be arranged in the normal order after these ones.

## Overriding docs for inherited controller methods
Sometimes you have a scenario where some endpoints are very similar—the usual CRUD, just with a different resource (let's say `/users` and `/notes`), so you create a parent controller and extend from them.


import Tabs from '@theme/Tabs';

<Tabs
  defaultValue="base"
  values={[
  {label: 'Base', value: 'base'},
  {label: 'Children', value: 'children'},
]}>
<TabItem value="base">

```php title=CRUDController.php
class CRUDController
{
  public string $resource;

  public function index()
  {
    $class = $this->resource;
    return $class::paginate(20);
  }

  public function create()
  {
    // ...
  }

// ...
}
```

</TabItem>

<TabItem value="children">

```php title=UserController.php
class UserController extends CRUDController
{
  public string $resource = User::class;
}
```

```php title=NoteController.php
class NoteController extends CRUDController
{
  public string $resource = Note::class;
}
```

</TabItem>
</Tabs>

But how do you document these with Scribe? There are no methods in the child classes, so there's nowhere to put your docblocks. And if you put it in the parent class, you'll have the same docs for both users and notes, which won't be correct. To get around this, you can add a static method called `inheritedDocsOverrides`:

<Tabs
  defaultValue="base"
  values={[
  {label: 'Base', value: 'base'},
  {label: 'Users', value: 'child1'},
  {label: 'Notes', value: 'child2'},
]}>
<TabItem value="base">

```php title=CRUDController.php
class CRUDController
{
  public string $resource;

  #[QueryParam("filter")]
  #[QueryParam("sort")]
  #[Response(["status" => "unauthorized"], 401)]
  public function index()
  {
    $class = $this->resource;
    return $class::paginate(20);
  }

  public function create()
  {
    // ...
  }

// ...
}
```

</TabItem>

<TabItem value="child1">

```php title=UserController.php
class UserController extends CRUDController
{
  public string $resource = User::class;

  public static function inheritedDocsOverrides()
  {
    return [
      "index" => [
        "metadata" => [
          "title" => "List all users",
          "groupName" => "Users",
        ],
        // Merges with any queryParameters from the parent
        "queryParameters" => [
          "active" => [
            "description" => "Return only active users"
          ],
        ],
        // Using an array *adds* responses to any in the parent
        "responses" => [
          [
            "status" => 200,
            "content" => json_encode(...)
          ],
        ]
        // Using a function replaces all responses
        "responses" => function (ExtractedEndpointData $endpointData) {
          return [
            [
              "status" => 200,
              "content" => json_encode(...)
            ],
          ]:
        },
      ],

      'create' => [
        // ...
      ]
    ];
  }
}
```


</TabItem>
<TabItem value="child2">

```php title=NoteController.php
class NoteController extends CRUDController
{
  public string $resource = Note::class;

  public static function inheritedDocsOverrides()
  {
    return [
      "index" => [
        "metadata" => [
          "title" => "List all notes",
          "groupName" => "Notes",
        ],
        // Using an array *adds* responses to any in the parent
        "responses" => [
          [
            "status" => 200,
            "content" => json_encode(...)
          ],
        ]
        // Using a function replaces all responses
        "responses" => function (ExtractedEndpointData $endpointData) {
          return [
            [
              "status" => 200,
              "content" => json_encode(...)
            ],
          ]:
        },
      ],

      'create' => [
        // ...
      ]
    ];
  }
}
```

</TabItem>
</Tabs>

In the `inheritedDocsOverrides()` method, you return an array, where each key is a method in the parent controller that you want to override. Within this key, you pass an array containing the data you want to modify. The items here correspond to the [stages of route processing](/laravel/advanced/plugins#the-stages-of-route-processing). You can also look at the properties of the `ExtractedEndpointData` data object and its children to know what fields are needed.

For all stages (except `responses`), the keys you specify will overwrite the inherited ones.
This means you can do things like:
- Change only the title or group
- Overwrite a parameter
- Add a parameter,

and so on.

For the `responses` stage, the responses you specify will be _added_ to the inherited ones.

For each stage, you can use either an array or a function. The function will be called with the current extracted endpoint data, allowing you to dynamically decide what to change. Whatever you return will then *replace all the data for that stage*. You can use this option if you wish to completely replace responses.

You can also modify the `$endpointData` object directly instead (at your own risk).

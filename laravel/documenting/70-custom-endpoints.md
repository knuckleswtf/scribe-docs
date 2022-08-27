---
id: custom-endpoints
---

# Custom endpoints
Three scenarios: 
- **Scenario 1**: Scribe keeps getting something wrong. You've tried everything else, and you can't still figure out how to get Scribe to describe `some_param` correctly.

- **Scenario 2**: You want to sort your endpoints or groups in a specific order, but Scribe keeps going alphabetical. 

  :::important
  In v4, we introduced a new config item that makes this easier. You don't need to mess around with the Camel files anymore! [Check it out.](/laravel/tasks/sorting-and-inheritance)
  :::

- **Scenario 3**: Some packages (like Laravel Passport or Fortify) add extra routes to your application, but you can't document these the usual way, since you can't edit the controller's docblocks.

If you're in any of these scenarios, you can use the final resort: editing the _Camel files_.

## What are the Camel files?
They're those YAML files that show up in your `.scribe/endpoints` folder after running `php artisan scribe:generate`. They were added to solve these three exact scenarios, allowing you to override Scribe and pass in external information.

## Scenario 1: Editing an existing endpoint or group
To edit an endpoint or group's details, **edit the corresponding Camel file**. The Camel files are named `x.yaml` (where `x` is a number), and are located in `.scribe/endpoints` after generation. Each file contains one group of endpoints, and looks like this:

```yaml title=<your-app>/.scribe/endpoints/0.yaml
name: Name of the group
description: A description for the group.
endpoints:
- httpMethods: ["POST"]
  uri: api/stuff
  metadata:
    title: Do stuff
    description: 
    authenticated: false
  headers:
    Content-Type: application/json
  urlParameters: []
  queryParameters: []
  bodyParameters:
    a_param:
      name: a_param
      description: Something something
      required: true
      example: something
      type: string
  responses:
  - status: 200
    content: '{"hey": "there"}'
    headers: []
    description: '200, Success'
  responseFields: []
```

As you've probably figured, you can edit the contents of this file, and Scribe will respect your changes when next you run `scribe:generate`.

To discard your changes at any time, run `scribe:generate --force`.

## Scenario 2: Sorting your endpoints or groups
:::important
In v4, we introduced a new config item that makes this easier. You don't need to mess around with the Camel files anymore! [Check it out.](/laravel/tasks/sorting-and-inheritance)
:::

To sort the endpoints in a group, **rearrange the endpoints** in its `endpoints` array. For instance, if your "User management" group is located in `0.yaml` and looks like this:

```yaml title=<your-app>/.scribe/endpoints/0.yaml
name: User management
description: Manage users
endpoints:
- httpMethods: ["POST"]
  uri: users/edit
  metadata:
    title: Edit a user's details
  # Other details...  
- httpMethods: ["POST"]
  uri: users/create
  metadata:
    title: Create a user
  # Other details...  
```

Supposing you want to move the "create a user" endpoint to be first, then simply reorder it in the array to get this:

```yaml title=<your-app>/.scribe/endpoints/0.yaml
name: User management
description: Manage users
endpoints:
- httpMethods: ["POST"]
  uri: users/create
  metadata:
    title: Create a user
  # Other details...  
- httpMethods: ["POST"]
  uri: users/edit
  metadata:
    title: Edit a user's details
  # Other details...  
```

Now run `scribe:generate`, and Scribe will put the create a user endpoint first in the output.

If you'd like to sort the groups instead, simply **rename the files**. For instance, if "User management" is in `0.yaml` and "Posts" is in `1.yaml`, you can make "Posts" come first by renaming it to `0.yaml` and renaming "User management" to `1.yaml`.

To discard your changes at any time (to both endpoints and groups), run `scribe:generate --force`.


## Scenario 3: Adding a new endpoint
To add a new endpoint, you need to create a file in the `.scribe/endpoints` folder that's named `custom.x.yaml`, where `x` is any number. In fact, whenever you run `scribe:generate`, you'll see a `custom.0.yaml` file show up in your `.scribe/endpoints`. This file is commented out, so no changes are added, but it contains an example of how you'd add a new endpoint.

:::caution
The `custom.*` files have a different format from the other YAML files, so don't copy from one and paste directly into the other.
:::

Here's an example of a `custom.*.yaml` file. The file contains an array of endpoints, and you can simply edit the example to add yours:

```yaml title=<your-app>/.scribe/endpoints/custom.0.yaml
- httpMethods:
    - POST
  uri: api/doSomething/{param}/{optionalParam?}
  metadata:
    groupName: The group the endpoint belongs to. Can be a new group or an existing group.
    groupDescription: A description for the group. You don't need to set this for every endpoint; once is enough.
    title: 'Do something.'
    description: 'This endpoint allows you to do something.'
    authenticated: false
  headers:
    Content-Type: application/json
    Accept: application/json
  urlParameters:
    param:
      name: param
      description: A URL param for no reason.
      required: true
      example: 2
      type: integer
  queryParameters:
    speed:
      name: speed
      description: How fast the thing should be done. Can be `slow` or `fast`.
      required: false
      example: fast
      type: string
  bodyParameters:
    my_fake_param:
      name: my_fake_param
      description: The things we should do.
      required: true
      example:
        - string 1
        - string 2
      type: 'string[]'
  responses:
    - status: 200
      description: 'When the thing was done smoothly.'
      content: # Your response content can be an object, an array, a string or empty.
         {
           "hey": "ho ho ho"
         }
  responseFields:
    hey:
      name: hey
      description: Who knows?
      type: string # This is optional
```

## Extra: sorting groups in custom endpoint files
When you add custom endpoints as described above, if the `metadata.groupName` doesn't already exist, the group will be created. Unfortunately, this means the group might be placed at the bottom of your docs, or in a position you don't want. To fix this, you can use the `beforeGroup` or `afterGroup` parameters.

For example, if you're adding endpoints that will belong to a new group, "Access Tokens", a file like this...

```yaml {6} title=<your-app>/.scribe/endpoints/custom.0.yaml
- httpMethods:
    - POST
  uri: api/doSomething
  metadata:
    groupName: Access Tokens
    beforeGroup: Users
    # ...
```
...will ensure that the `Access Tokens` group is placed just before the `Users` group.

Similarly, this...

```yaml {6} title=<your-app>/.scribe/endpoints/custom.0.yaml
- httpMethods:
    - POST
  uri: api/doSomething
  metadata:
    groupName: Subscriptions
    afterGroup: Users
    # ...
```

...will place the `Subscriptions` group just after the `Users` group.

A few things to note:
- You don't need to specify `beforeGroup`/`afterGroup` on all the custom endpoints in that group. Only the first occurrence is used.
- `beforeGroup`/`afterGroup` can only reference groups that exist already (either in your main codebase or created by an earlier custom endpoint)
- You can't use both `beforeGroup` _and_ `afterGroup` on one group.
- Remember, `beforeGroup`/`afterGroup` only applies when creating new groups in your custom endpoints. For existing groups, sort them as normal by renaming the generated files.

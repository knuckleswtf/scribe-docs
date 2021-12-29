---
id: generating
---

# Generating Docs

## First steps
After you've [documented your API](/nodejs/documenting), you can generate the docs using the `generate` command.

import {AdonisExpressRestifyTabs, TabItem} from '@site/src/components/AdonisExpressRestifyTabs';

<AdonisExpressRestifyTabs>
<TabItem value="adonis">

```sh
node ace scribe:generate
```

</TabItem>
<TabItem value="express">

```sh
npx scribe generate -a <your-app-file>

# Example:
# npx scribe generate -a app.js
```

</TabItem>

<TabItem value="restify">

```sh
npx scribe generate -s <your-server-file>

# Example:
# npx scribe generate -s server.js
```

</TabItem>
</AdonisExpressRestifyTabs>

This will:
- extract information about your API and endpoints
- transform the extracted information into a HTML docs webpage (+ Postman collection and OpenAPI spec, if enabled) 
- store the extracted API details in some YAML files (in `.scribe/endpoints`), so you can manually edit them later

Your docs (`index.html`, CSS and JS files) will be generated to the `public/docs` folder.

For more details on what happens when you run `generate`, see [How Scribe Works](/nodejs/architecture).

## Viewing the generated docs
To access your generated docs, find the `index.html` file in your `outputPath` folder (by default, `public/docs`) and open that in your browser. Note that You can also add a static middleware to your 

## The `.scribe` folder
After you generate your docs, you should also have a `.scribe` folder. This folder is the "intermediate" output; it holds information about your API that Scribe has extracted, allowing you to overwrite some things before Scribe converts to HTML. See [How Scribe works](/nodejs/architecture#the-scribe-folder) for details.

You can choose to commit this folder, or not. If you commit this folder, you can make edits to the info Scribe has extracted, and Scribe will respect them when generating your docs on any machine, local or server.

If you don't commit, you can't make any edits to what Scribe has extracted, so generating on a different machine might give different results. Of course, you can still use annotations and other strategies to customise the information that gets passed to Scribe.

:::note
If you commit the folder, and you generate docs on your server. and your deployment process involves a `git pull`, you might get warnings from Git about your local changes being overwritten. In that case, you should use `git restore .` before `git pull` and `scribe:generate`.
:::

## Modifying the docs after generating
The `.scribe` folder holds Scribe's intermediate output, allowing you to modify the data Scribe has extracted before it turns them into HTML. You can:
- edit the endpoint YAML files (in `.scribe/endpoints`)
- add more endpoints, following the example file at `.scribe/endpoints/custom.0.yaml`
- edit the introduction and authentication sections (`.scribe/intro.md` and `.scribe/auth.md`)
- append some content to the end of the docs (by adding a `.scribe/append.md` file)
- sort endpoints in a group (by reordering them in the appropriate YAMl file)
- sort groups (by renaming the group files)

See [sorting endpoints and groups](#sorting-endpoints-and-groups).
  
### Discarding your changes
On future runs, Scribe will respect your changes and try to merge them into any information it extracts. If you'd like to discard your changes and have Scribe extract afresh, you can pass the `--force` flag.

<AdonisExpressRestifyTabs>
<TabItem value="adonis">

```sh
node ace scribe:generate --force
```

</TabItem>
<TabItem value="express">

```sh
npx scribe generate -a app.js --force
```

</TabItem>

<TabItem value="restify">

```sh
npx scribe generate -s server.js --force
```

</TabItem>
</AdonisExpressRestifyTabs>

### Skipping the extraction phase
You can also use the `--no-extraction` flag. With this, Scribe will skip extracting data about your API and use the data already present in the `.scribe` folder.

<AdonisExpressRestifyTabs>
<TabItem value="adonis">

```sh
node ace scribe:generate --no-extraction
```

</TabItem>
<TabItem value="express">

```sh
npx scribe generate -a app.js --no-extraction
```

</TabItem>

<TabItem value="restify">

```sh
npx scribe generate -s server.js --no-extraction
```

</TabItem>
</AdonisExpressRestifyTabs>

This allows you to quickly edit the extracted YAML and view your changes without having to extract from all your endpoints again.

## Sorting endpoints and groups
By default, endpoint groups will be ordered alphabetically in the docs, but you can customise override this by editing the files in `.scribe/endpoints/`. Groups are ordered by file name, so you can reorder groups by renaming the files. For instance, the group in `0.yaml` will always be shown before the one in `1.yaml`, and so on, so you can swap those two filenames if you want the order reversed.

Endpoints in a group are listed within one file, so to sort endpoints in a group, rearrange the items in the `endpoints` array of the group YAML file.

```yaml title=.scribe/endpoints/0.yaml
name: Endpoints
description: ''
endpoints:
  # This endpoint will be shown first
  - httpMethods: [ "GET" ]
    uri: api/healthcheck
    # ...
  # This endpoint will be shown next
  - httpMethods: [ "GET" ]
    # ...
```


## _Try It Out_
By default, your generated docs will include an API tester that lets users test your endpoints in their browser. You can set the URL that requests will be sent to with the `try_it_out.base_url` config item, or turn it off with `try_it_out.enabled`.

For _Try It Out_ to work, you'll need to make sure CORS is enabled on your API. Here are some useful CORS middleware for [Adonis](https://legacy.adonisjs.com/docs/4.1/cors), [Express](http://expressjs.com/en/resources/middleware/cors.html), and [Restify](https://www.npmjs.com/package/restify-cors-middleware).

## Postman collection and OpenAPI spec
By default, Scribe will also generate a Postman collection and OpenAPI spec which you can import into API clients like Postman or Insomnia. Scribe will include the links to them in the menu of your docs.

You can configure these in the `postman` and `openapi` sections of your `.scribe.config.js` file. 

```js title=.scribe.config.js
postman: {
    enabled: true,
    overrides: {
        // 'info.version': '2.0.0',
    },
},
openapi: {
    enabled: true,
    overrides: {
        // 'info.version': '2.0.0',
    },
},
```

Each section has two options:
- `enabled`: Set it to `false` to if you don't want the collection/spec to be generated.

- `overrides`: Fields to merge with the collection/spec after generating. For instance, if you set `postman.overrides` to `{'info.version': '2.0.0'}`, then the `version` key in the `info` object of your Postman collection will always be set to `"2.0.0"`.

## Running on CI/CD
You might want to generate your docs as part of your deployment process. Here are a few things to note:

If you're using [response calls](./documenting/responses#response-calls), you should see the [recommended setup](./documenting/responses#recommendations), to avoid any unintended side effects and get the best possible responses.

You'll also want to set your URLs:
- the base URL, which will be displayed in the docs and examples. You can set this with the config item `base_url`. You'll probably want to set this to your production URL.
- the response calls base URL (`responseCalls.baseUrl`), which is the URL your app is running on locally (for response calls)
- the Try It Out URL, which is the URL where the in-browser API tester's requests will go to. You can set this with the config item `tryItOut.baseUrl`. You could set this to your production or staging server.

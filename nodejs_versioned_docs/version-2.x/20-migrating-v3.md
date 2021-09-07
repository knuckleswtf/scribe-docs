---
id: migrating-v2
---

# Migrating to v2

Hi, hello, welcome to Scribe for JS v2.👋 While the core parts are unchanged, we've improved the overall user experience, and laid the foundation for easier customization in the future. This guide aims to help you migrate from v1 as easily as possible.

## Requirements
Scribe v2 requires Node.js 12.4.0 or higher and currently supports three frameworks: [AdonisJS v4](https://legacy.adonisjs.com/), [Express v4](https://expressjs.com/) and [Restify v8](http://restify.com/).

## Start
Upgrade the package version (`@knuckleswtf/scribe`) in your `package.json` to `^2.0` and then install:

```bash
npm i
```

## Source files
"Source files" (you know, those weird Markdown files that Scribe generates then converts to HTML) are no longer generated to `docs/`. Now they will be put in a `.scribe/` folder. You can safely delete the `docs/` folder, unless you've manually modified some content, in which case you should see the [modifications](#modifying-the-generated-docs) section below.

## Config file changes
- `interactive` has been replaced with `tryItOut`, which has two options:
  - `enabled`, where you enable/disable Try It Out (the old value of `interactive`), and  
  - `baseUrl`, that lets you set the base URL to be used for Try It Out.
  
## Modifying the generated docs
Scribe has always had the concept of "intermediate" output—a place where it writes the data it has extracted about your API, giving you a chance to overwrite some things before it converts to HTML. In the past, this was a set of Markdown file (with one group of endpoints per file). Overwriting was on a per-file basis—once you edit a file, Scribe could no longer update that file (even if you changed one line), so, on future runs, all endpoints in that file would keep the same data until you discarded your changes.

In v3, Scribe now uses YAML files for intermediate output of endpoints (but "Introduction" and "Authentication" sections remain as Markdown files). This is better because YAML is structured, so it's easier for you to edit, and Scribe can also figure out what's changed, letting you overwrite parts of one endpoint, while Scribe extracts data for the rest.

For example, after generating, in your `.scribe/endpoints` folder, you'll have a file like this:

```yaml title=.scribe/endpoints/0.yaml
name: Endpoints
description: ''
endpoints:
  - httpMethods: [ "GET" ]
    uri: api/healthcheck
    metadata:
      title: Healthcheck
      description: "Check that the service is up."
      authenticated: false
    headers:
      Content-Type: application/json
      Accept: application/json
    urlParameters: []
    queryParameters: []
    bodyParameters: []
    responses:
      - status: 200
        content: '{"status":"up","services":{"database":"up","redis":"up"}}'
        headers:
          content-type: application/json
          x-ratelimit-limit: 60
          x-ratelimit-remaining: 59
        description: null
  - # Another endpoint
```

If you don't want the rate limit response headers to be included in the docs, you can just remove them (and even add new ones):

```yaml title=.scribe/endpoints/0.yaml
name: Endpoints
description: ''
endpoints:
  - httpMethods: [ "GET" ]
    # ... Endpoint info
    responses:
      - status: 200
        content: '{"status":"up","services":{"database":"up","redis":"up"}}'
        headers:
          content-type: application/json
          some-new-header: heyy
        description: null
  - # Another endpoint
```

And just like that, Scribe will show only these headers in the example response. Much better than dealing with Markdown/HTML.

For the "Introduction" and "Authentication" sections, Scribe still uses Markdown files in `.scribe`, but they are now called `intro.md` and `auth.md`. `append.md` is also still supported, but `prepend.md` has been dropped. If you were using a `prepend.md`, you should put its content in the `intro.md` file.

If you're using the old system, you'll need to run `scribe:generate`, then redo your changes in this new format. See [modifying docs](./generating#modifying-the-docs-after-generating) and [_What are those YAML files for?_](./architecture##what-are-those-yaml-files-for) for details.

:::note
Ideally, you shouldn't have to modify your docs after extraction. We generally recommend using annotations, config and available strategies to guide Scribe _during_ extraction.  
:::

## Styling and customizations
In the past, styling was provided by Pastel, which made it difficult to customise them. Pastel is now retired, and Scribe comes with a theming system. While there's only a `default` theme included for now, we're working on adding more options and making it even easier to customise the docs yourself.
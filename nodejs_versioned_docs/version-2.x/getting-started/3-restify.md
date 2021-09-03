---
slug: restify
id: restify
---

# Restify

## Set up the package
First, install the package:

```sh
npm i @knuckleswtf/scribe-restify
```

Next, create your config file by running:

```bash
npx scribe init
```

This will ask you a few questions and create a `.scribe.config.js` file in your project directory. There are a few other useful settings you should change in that file, but we'll leave them as is for now.

## Do a test run
Now, let's do a test run. You'll need to locate your *"server file"* — the file where you set up and start your Restify server, usually an `index.js` or `server.js`. Run the `scribe generate` command to generate your docs, passing in the path to your server file (for example, `./server.js`).

```bash
npx scribe generate -s <your-server-file>

# Example:
# npx scribe generate -s server.js
```

Visit your newly generated docs. Find the `docs/index.html` file in your `public/` folder and open it in your browser.

:::tip
Your docs are always accessible by opening the `public/docs/index.html` file on your machine. However, when deployed, you'll probably want to pass it through your Restify app. To do that, you can either set up your own routing or use the [`serveStatic` plugin](http://restify.com/docs/plugins-api/#servestatic).
:::

There's also a Postman collection and OpenAPI spec generated for you, accessible at `public/docs/collection.json` and `public/docs/openapi.yaml`. There are links to these files in the sidebar of the HTML page, so you can easily click to view them.

Great! You've seen what Scribe can do. Now, let's refine our docs to match what we want.

## Add general information about your API
Here are some things you can customise with Scribe:
- The introductory text
- Authentication information
- Languages for the example requests
- A logo to show in your docs.

You can set all these in the config file. For details, see [documenting API information](/nodejs/documenting/api-information).

## Filter your routes
You might have routes in your app that aren't part of your API. By default, Scribe will try to document all of your routes, so if you're okay with that, you can leave it at that. If you'd like to exclude some routes, there are two ways:

1. In the docblock for the endpoint, add this tag: `@hideFromApiDocs`. Note that, in Restify, docblocks must be added to the route definition, not the controller/handler function.
  ```js
  class PagesController {
    /**
     * This won'r work. ❌
     * @hideFromApiDocs
     */
    homePage(req, res) {
    }   
  }
  
  /**
   * This will work.
   * @hideFromApiDocs
   */
  app.get('/home', PagesController.homePage);
  ```

2. Set the `routes` key in your `.scribe.config.js`. Here's what it looks like:

  ```js title=scribe.config.js
      routes: [
          {
              include: ['*'],
              exclude: ['*.websocket'],
              apply: {
                  headers: {
                  },
                  responseCalls: {
                      methods: ['GET'],
                  }
              }
          }
      ],
  ```

Each entry in the `routes` array defines a route _group_. The main purpose of these groups is to let you apply different settings to different sets of endpoints (for instance, adding an `Api-Version` header to some routes). By default, all your routes are in a single group. For now, let's leave them like that. See more about route groups [here](/nodejs/reference/config#routes).

The important keys here are `include` and `exclude`:
- Set `include` to a list of patterns matching your API routes
- Set `exclude` to exclude routes, even if they matched the `include`. 

`*` can be used as a wildcard for one or more characters. For instance, `include: ["api/*]` will match any endpoints that start with `<your-app-url>/api/`. To include all your routes, set `include` to `["*"]`.

[Here's the full documentation on configuring routes](/nodejs/reference/config#routes).

## Add information to your routes
Scribe tries to figure out information about your routes, but you can make it better by adding more information. Here's some information you can enrich:
- Groups (you can group your endpoints by domain eg "User management", "Order information")
- URL parameters
- Request Headers
- Body parameters
- Query parameters
- Example responses
- Fields in the response

Check out how to do this in the guide on [Documenting your API](documenting/).

## Generate and publish
After making changes as needed, you can run `node ace scribe:generate` as many times as you want.

When you're happy with how your documentation looks, you're good to go. You can add the generated documentation to your version control and deploy as normal, and your users will be able to access it as you've configured.
---
slug: getting-started
id: getting-started
---

# Getting started

## Set up the package
First, follow the installation guide in the [introduction](/laravel).

When you're done, you should have a `scribe.php` file in your config directory. Cool, now you're ready to take it for a spin. But there are two important settings we need to verify in our `scribe.php` config file first...

## 1. Pick a type
The `type` key tells Scribe the type of docs setup you want. There are two options:
- `static`: This generates a simple `index.html` file (plus CSS and JS assets) in your public/docs folder. The routing of this file does not pass through Laravel, so you can't add auth or any middleware.
- `laravel`: Scribe will generate a Blade view served via your Laravel app, allowing you to add auth or any middleware to your docs.

:::tip Which should you use?
If you need to authenticate access to your docs, use `laravel` type. Otherwise, if you don't have any special requirements, you can stick with `static` type.
:::

## 2. Choose your routes
The second thing you'll need to do is tell Scribe what routes you want to document (the `routes` key). By default, it looks similar to this:

```php title="config/scribe.php"

    'routes' => [
        [
            'match' => [
                'domains' => ['*'],
                'prefixes' => ['api/*'],
            ],
            'include' => [
                // 'users.index', 'healthcheck*'
            ],
            'exclude' => [
                // '/health', 'admin.*'
            ],
        ],
    ],
```

For historical reasons, each entry in the `routes` array defines a route _group_. However, we recommend keeping all your routes in a single group.

The important key here is the `prefixes`. Set it to a path matching your API routes. For instance, the default config (`["api/*"]`) will match any endpoints that start with `<your-app-url>/api/`. You can set it to `["*"]` to match all endpoints.

[Here's the full documentation on configuring routes](/laravel/reference/config#routes).

## Do a test run
Now, let's do a test run. Run the command to generate your docs.

```bash
php artisan scribe:generate
```

Visit your newly generated docs:
- If you're using `static` type, find the `docs/index.html` file in your `public/` folder and open it in your browser.
- If you're using `laravel` type, start your app (`php artisan serve`), then visit `/docs`.

Scribe can also generate a Postman collection and OpenAPI spec. See [generating documentation](/laravel/tasks/generating) for details.

Great! You've seen what Scribe can do. Now, let's refine our docs to match what we want.

## Add general information about your API
Here are some things you can customise with Scribe:
- The API URL shown in your docs
- The introductory text
- Authentication information
- Languages for the example requests
- A logo to show in your docs.

You can set all these in the config file. For details, see [documenting API information](/laravel/documenting/api-information).


## Add information to your routes
Scribe tries to figure out information about your routes, but you can make it better by adding more information. Here's some information you can enrich:
- Groups (you can group your endpoints by domain eg "User management", "Order information")
- URL parameters
- Request Headers
- Body parameters
- Query parameters
- Example responses
- Fields in the response

Check out how to do this in the guide on [Documenting your API](/laravel/documenting/).

## Generate and publish
After making changes as needed, you can run `php artisan scribe:generate` as many times as you want.

When you're happy with how your documentation looks, you're good to go. You can add the generated documentation to your version control and deploy as normal, and your users will be able to access it as you've configured.

## Need more customization?
Don't like how the template looks? Want to change how things are organized, or add a custom language for the examples? Need to translate the docs into a different language? Thinking of custom ways to extract more information about your routes?  Check out the guides on [localization](/laravel/advanced/localization), [plugins](/laravel/advanced/plugins), [example requests](/laravel/advanced/example-requests) and [UI customisation](/laravel/advanced/theming).

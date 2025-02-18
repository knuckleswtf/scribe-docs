---
id: architecture
slug: architecture
---

# How Scribe works
Read this page if you want a deeper understanding of how Scribe works (for instance, for the purpose of contributing).

## When you run `scribe:generate` for the first time
Here's a high-level overview of what Scribe does on first run:

1. The `GenerateDocumentationCommand` calls the `RouteMatcher` class to get the routes you want to document. The `RouteMatcher` does this by fetching all your application's routes from the router (Laravel/Dingo) and filtering them based on your config.
  ```php
  $routes = $routeMatcher->getRoutes($yourConfig);
  ```

2. Next, the `Extractor` processes each route and uses your configured strategies to extract info about it—metadata (eg name and description), parameters, and sample responses.

   ```php
   $endpoints = $this->extractEndpointsInfoFromLaravelApp($yourRoutes);
   ```
   
3. After that, the endpoints are grouped (based on their `@group` tags). The grouping makes it easy for Scribe to loop over them and generate the output.
   ```php
   $groupedEndpoints = Camel::groupEndpoints($endpoints);
   ```
   
   The grouped endpoints are written to a bunch of YAML files, in a `.scribe/endpoints` directory in your app. We don't need them right now, but we'll come back to those files later. See [What are those YAML files for?](#what-are-those-yaml-files-for)
 
   Alright, the extraction phase is done. Over to output. 
   
4. When it's time for output, we call the `Writer` class, and pass in those grouped endpoints. It uses a couple of Blade templates to generate the HTML output.

5. Finally, the writer copies the generated HTMl, plus the included CSS and JS to your configured `static.output_path` folder (typically `public/docs`), and your docs are ready!

   If you enabled Postman or OpenAPI generation, the writer will also generate those. If you chose `laravel`-type docs, the writer will convert the generated HTMl back into Blade files, and move them into the `resources/views/scribe` folder.

## On subsequent runs
On subsequent runs, the same thing happens. The only difference is that Scribe first checks to see if there are any YAML files present. If there are, it merges whatever it finds there with what it can extract from your endpoints.

Now, about those YAML files...

## What are those YAML files for?
Earlier, we said that the grouped endpoints are written to some YAML files, in a `.scribe/endpoints` directory in your app. Each group of endpoints goes into one file, and looks like this:

   ```yaml title="<your-app>/.scribe/endpoints/0.yaml"
   name: 'Name of the group'
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

Internally, we call these _Camel_ files, and they're very useful! They're _intermediate output_, which means they let you modify the data Scribe has extracted, before Scribe goes on to convert to HTML. This means:

1. You can **edit an endpoint's details**. For instance, if Scribe made a mistake, or wasn't able to figure out some data, you can just find the YAML file and edit it. Then when you run `scribe:generate` again, Scribe will use _your_ changes instead of what it figured out.

:::tip
You can run `php artisan scribe:generate --no-extraction` for Scribe to completely skip the extraction step and just use the YAML files.
:::

2. You can **sort your endpoints**. If you want one endpoint to appear before another, just edit the `endpoints` key in the YAML and arrange them how you prefer.

3. You can also **sort groups**. You'll notice the example above is `0.yaml`. To sort groups, just rename the files how you wish, since it's one group per file. For instance, if I rename this file to `1.yaml`, and another file to `0.yaml`, that group will appear before this one in the docs.

4. You can **add new endpoints**. This is useful if you're using a package that adds extra routes (like Laravel Passport), and you want to document those. Custom endpoint files use a slightly different format from regular endpoints, so Scribe automatically adds an example `custom.0.yaml` file to the `.scribe/endpoints` folder, and you can edit it to add additional endpoints.


## The `.scribe` folder
The `.scribe` folder contains intermediate output—information about your API that Scribe has extracted.

```
.scribe/
|- endpoints/
   |- 0.yaml
   |- 1.yaml
   |- custom.0.yaml
|- endpoints.cache/
   |- 0.yaml
   |- 1.yaml
|- auth.md
|- intro.md
|- .filehashes

```

- The `endpoints` folder holds the endpoints information as YAML files. You can edit them to add/overwrite endpoints.
- The `endpoints.cache` folder _also_ holds endpoints information, but these files are not meant to be edited by the user. Scribe uses the files here to figure out when you've edited something in `endpoints`.
- The `auth.md` and `intro.md` files contain the generated text for the "Authentication" and "Introduction" section of your docs. You can edit these.
- The `.filehashes` file is how Scribe keeps track of changes you make to `auth.md` and `intro.md`.

Scribe regenerates the `.scribe` folder on every run, while preserving any changes you've made to endpoints or Markdown files. Special cases:
- When you specify `--no-extraction`, Scribe will not go through an extraction phase or regenerate the folder. Instead, it will use the information here to generate the output (HTML, Postman, OpenAPI). 
- When you specify `--force`, Scribe will overwrite your changes to this folder.

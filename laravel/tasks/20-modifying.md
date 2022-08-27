---
id: modifying
---

# Modifying docs

[The `.scribe` folder](/laravel/tasks/generating) holds Scribe's intermediate output, allowing you to modify the data Scribe has extracted before it turns them into HTML. You can:
- edit the endpoint YAML files (in `.scribe/endpoints`)
- add more endpoints, following the example file at `.scribe/endpoints/custom.0.yaml` (see [Custom endpoints](/laravel/documenting/custom-endpoints))
- edit the introduction and authentication sections (`.scribe/intro.md` and `.scribe/auth.md`)
- append some content to the end of the docs (by adding a `.scribe/append.md` file)

When you make changes to this folder, Scribe will try to merge your changes into any information it extracts on future runs.

:::tip
You can also use the [`aftergenerating()` hook](/laravel/hooks#aftergenerating) as an option for programmatically modify the docs' output once generation is finished.
:::

If you don't want to wait for Scribe to extract from all your endpoints again. you can use the `--no-extraction` flag. With this, Scribe will skip extracting data about your API and use the data already present in the `.scribe` folder.

```bash
php artisan scribe:generate --no-extraction
```

If you change your mind and want to start afresh, you can pass the `--force` flag to discard your changes.

```shell
php artisan scribe:generate --force
```

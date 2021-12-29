---
id: html
---

# HTML helpers

Scribe supports Markdown (and, by extension, HTML) in a couple of places:
- the `description` and `introText` in your config file 
- the endpoint title and description in docblocks 
- the group name and description in docblocks (`@group`) 
- parameter descriptions in docblocks


Scribe provides some custom HTML and CSS styling that you can use to highlight information in your docs:

:::note
The specific styling of these items will depend on your chosen theme. Examples are shown here using the default theme.
:::

## Badges
You can add badges by using the `badge` CSS class, along with one of the `badge-{colour}` classes.

```html
<small class="badge badge-green">GET</small>
<small class="badge badge-darkred">REQUIRES AUTHENTICATION</small>
```

![](/img/screenshots/html-badges.png)
![](/img/screenshots/html-badges2.png)

Available colours:
- darkred
- red
- blue
- darkblue
- green
- darkgreen
- purple
- black
- grey

## Notes and warnings
You can add little highlighted warnings and notes using the `<aside>` tag and either of the classes `notice`, `warning`, or `success`.


```html
<aside class="warning">Don't do this.</aside>
<aside class="success">Do this.</aside>
<aside class="notice">You should know this.</aside>
```

![](/img/screenshots/html-aside.png)


If you don't specify a class, `"notice"` is assumed.

## Fancy headings
You can help your lower-level headings stand out by using the fancy-heading-panel class:

```html
<h4 class="fancy-heading-panel"><b>Body Parameters</b></h4>
```

![](/img/screenshots/html-fancyheading.png)
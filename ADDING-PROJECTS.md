# Adding a New Project

The project cards and galleries are generated from `assets/projects.js`.
You normally only need to edit that file and add images to `assets/images/`.

## Fastest method

1. Open `assets/projects.js`.
2. Go to the bottom of the file.
3. Find the block labelled `NEW PROJECT PLACEHOLDER`.
4. Duplicate the entire object from `{` to `}`.
5. Add a comma between project objects.
6. Replace all placeholder values.
7. Add the image files to `assets/images/`.
8. Remove the line `"placeholder": true` when the project is ready.

## Copy-ready project object

```js
{
  "slug": "project-name-here",
  "title": "Project Name Here",
  "category": "Residential",
  "style": "Contemporary Tropical",
  "description": "Write a concise description of the concept, materials, planning, atmosphere, and purpose of the project.",
  "images": [
    "assets/images/project-name-01.webp",
    "assets/images/project-name-02.webp",
    "assets/images/project-name-03.webp"
  ]
}
```

## Rules for each field

- `slug`: Must be unique. Use lowercase letters and hyphens only, such as `canggu-family-villa`.
- `title`: The project name shown to visitors.
- `category`: The filter group. A new category button is now created automatically.
- `style`: A short design-style label.
- `description`: One concise paragraph. Avoid quotation marks unless they are escaped.
- `images`: Relative paths to the project images. The first image becomes the card cover.

## Image naming

Use a consistent pattern:

```text
project-name-01.webp
project-name-02.webp
project-name-03.webp
```

Recommended preparation:

- Landscape images work best for the cover.
- Use WebP or compressed JPEG files.
- Keep each image reasonably sized for faster loading.
- Do not use spaces in filenames.

## Example with a new category

```js
{
  "slug": "studio-apartment-bandung",
  "title": "Studio Apartment Bandung",
  "category": "Apartment",
  "style": "Warm Minimalist",
  "description": "A compact apartment organized around efficient storage, warm timber finishes, neutral fabrics, and flexible furniture for comfortable everyday living.",
  "images": [
    "assets/images/studio-apartment-bandung-01.webp",
    "assets/images/studio-apartment-bandung-02.webp"
  ]
}
```

Because the filter buttons are generated automatically, `Apartment` will appear as a new filter without editing `projects.html`.

## Common errors

- Missing comma between two project objects.
- Reusing a slug that already exists.
- Image path does not exactly match the filename.
- Filename contains spaces or different capitalization.
- Missing closing bracket or quotation mark.

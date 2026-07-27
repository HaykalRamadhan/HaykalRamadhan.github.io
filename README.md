# Nabila Azmi Interior Portfolio — Editable Version

This copy contains the same website, but the HTML, CSS, and JavaScript have been expanded and formatted for manual editing.

## Main files

- `index.html` — Home page content
- `projects.html` — Projects page structure, filters, and project dialog
- `contact.html` — Contact details and inquiry form
- `assets/styles.css` — All colors, typography, spacing, and responsive styles
- `assets/projects.js` — Project names, categories, descriptions, and image lists
- `assets/script.js` — Navigation, filtering, gallery, animations, and contact-form behavior
- `assets/images/` — Portfolio images

## Common edits

### Change the main colors
Open `assets/styles.css` and edit the variables at the beginning:

```css
:root {
  --bg: #f7f2ed;
  --surface: #fffdf9;
  --text: #231d1b;
  --accent: #a5141a;
  --accent-dark: #781014;
}
```

### Change profile text
Edit the visible text inside `index.html`.

### Change contact information
Search these files for the old email address, phone number, or social-media username:

- `contact.html`
- `assets/script.js`

### Edit a project
Open `assets/projects.js`. Each project is one object with this structure:

```js
{
  "slug": "villa-nyanyi",
  "title": "Villa Nyanyi",
  "category": "Villa",
  "style": "Rustic Japanese",
  "description": "Project description...",
  "images": [
    "assets/images/villa-nyanyi-01.webp"
  ]
}
```

Keep each `slug` unique. Category names must match the filter values used in `projects.html`.

## Previewing the website

You can open `index.html` directly. For the most reliable preview, run a local web server in this folder, for example:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000` in a browser.


## Adding more projects

See `ADDING-PROJECTS.md` for the copy-ready template and step-by-step instructions.

## Mouse-wheel image browsing

While a project dialog is open, move the pointer over the image gallery and use the mouse wheel or a vertical touchpad gesture to move through its images. The page behind the dialog is locked so it cannot scroll accidentally. Hover over the description panel when you need to scroll a long project description.

## Read-only website text

Visible website copy is configured as read-only: it cannot be selected and does not show a text caret. Search, contact inputs, selects, and textareas remain editable.

# Guidelines: Where to Store Files

### Where does frontend stuff go?

- If you are working on a specific feature, check the `features` folder first:

  `frontend/src/features`

  There is a high chance that a folder for that feature already exists. If the feature folder is missing, create a new directory inside `features` and follow the same naming style as the other folders.

- If you are working on a specific page, put the page itself inside:

  `frontend/src/pages`

  Any components made for that page should go inside:

  `frontend/src/components`

  Create a folder with the matching page name, like:

  `page-pagename-components`

- Stylesheets should go inside:

  `frontend/src/style`

  Follow the same naming idea as the components.

- If you are working with any API code, add it inside:

  `frontend/src/services`
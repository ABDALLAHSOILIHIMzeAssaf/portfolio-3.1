   # Portfolio Mze.dev

Site one-page : HTML5 sémantique, Tailwind CSS v4, JavaScript ES6+ (sans framework).

## Structure
- `index.html` – page unique (SEO, JSON-LD, un seul `<h1>`)
- `src/input.css` → `css/styles.css` – `npm install && npm run build:css` pour recompiler Tailwind
- `js/main.js`, `js/theme.js` – carrousels, master-detail, veille Dev.to, FormSubmit, Docs +
- `public/docs/` – déposez ici vos PDF ; `manifest.json` est régénéré à chaque déploiement (`scripts/build-docs.mjs`)
- `netlify.toml` (en-têtes de sécurité + CSP), `_redirects`, `robots.txt`, `sitemap.xml`

## À faire
1. FormSubmit : au tout premier envoi, un e-mail d'activation arrive sur mze.abdallahsoilihi@gmail.com → cliquer sur le lien de confirmation.
2. Remplacer `img/projets/*.svg` par de vraies captures si vous le souhaitez (garder les attributs `alt`).
3. Si l'URL Netlify change, mettre à jour `canonical`, `og:url`, `sitemap.xml`, `robots.txt` et `_redirects`.

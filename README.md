# ProMouser

ProMouser is a lightweight static website for gamers and PC users who want practical guidance on mice and peripherals, plus simple tools for measuring and improving performance.

## What the website offers

- Gaming mouse recommendations and guides
- Setup and peripheral content
- Performance-focused tools (e.g., CPS test)
- Lightweight UI and fast page loads
- Responsive layout for mobile and desktop

## Website

[promouser.shop](https://www.promouser.shop/)

## Built with

- HTML
- CSS
- JavaScript

## Design goal

Keep the site simple, lightweight, and easy to use without unnecessary clutter, while maintaining a modern and consistent visual style.

## Running locally

```bash
git clone https://github.com/froodyofficial-maker/promouser.git
cd promouser
```

Open `index.html` in your browser, or serve the folder with any static server:

```bash
python3 -m http.server 8000
```

Then visit http://localhost:8000.

## Project structure

- Root HTML files contain the main pages and tools.
- `mice/` contains individual mouse guides and comparisons.
- `blog/` contains mouse advice articles.
- `assets/images/` and `assets/icons/` contain optimized images, branding, favicons, and app icons.
- `robots.txt` and `sitemap.xml` provide basic search engine discovery.
- `manifest.webmanifest` describes the site when added to a supported device home screen.
- `contact.html`, `privacy.html`, and `terms.html` provide contact options and site policies.
- `script.js` and `style.css` provide shared behavior and styling.

The site is static and does not currently use a server-side contact form, account system, or
offline service worker. The contact page links to the project's public feedback channels.

## Contributing

See [CONTRIBUTING.md](docs/CONTRIBUTING.md) for contribution guidelines. Bug reports, content
corrections, and focused improvements are welcome. Please keep changes lightweight, accessible,
responsive, and consistent with the existing static-site structure.

## Security

Please review [SECURITY.md](SECURITY.md) before reporting a vulnerability.

## Accessibility

Read the [accessibility statement](docs/ACCESSIBILITY.md) for supported environments, known
limitations, and how to report barriers.

## License

ProMouser is dedicated to the public domain under [CC0 1.0 Universal](LICENSE).

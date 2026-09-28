# Project visual quality rules

## Non-negotiable webpage standard

Never deliver an HTML page that looks like a plain-text document, loader card, bare form, or unstyled content dump.

Every user-facing HTML route must be a complete, visually designed webpage with:

- A clear visual hierarchy: branded header, intentional hero or page introduction, meaningful content sections, and a finished footer.
- A deliberate page-specific design system. Routes must not be clones of one another: vary the composition, grid, typography pairing, color palette, visual focal point, and interaction model.
- At least one visible visual focal point above the fold: an editorial graphic, service console, typographic maze, app mockup, illustration, animated field, or equivalent designed graphic.
- Interactive behavior where appropriate: hover/focus states, animated transitions, expandable cards/details, pointer response, navigation states, or a custom control.
- Responsive styling for mobile and desktop.
- Accessible semantics, visible focus states, readable contrast, and reduced-motion support.

## Before delivery

For every changed HTML route:

1. Open it in a browser at desktop width and mobile width.
2. Confirm the stylesheet and scripts load successfully.
3. Confirm the first viewport is visually designed—not mostly unstyled text or empty space.
4. Test at least one route-specific interaction on the page.
5. Check every local HTML route and redirect destination, not just the homepage.
6. Compare routes side by side. If they reuse the same layout, palette, hero graphic, or composition, stop and redesign them.

## User preference

The user wants polished, eye-catching, animated, interactive websites. The pages must be **completely different from one another**, not merely different text inside the same template. Current intended directions:

- `index.html`: warm editorial orange/cream composition with asymmetrical art direction.
- `support.html`: cobalt modular service-console composition with yellow signal core.
- `404.html`: violet typographic maze composition with neon-lime route choices.

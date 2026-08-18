# Exchange Footer Block

## Overview

Provides concept-only legal and navigation content. On product paths it renders the compact PDP footer.

## Integration

- Homepage contact emits `bcg-exchange:open-ask`.
- Product context is detected from `/products/` in the pathname.

## Error Handling

External BCG links remain normal links; no global Commerce footer content is changed.

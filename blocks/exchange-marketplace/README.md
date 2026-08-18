# Exchange Marketplace Block

## Overview

Renders six fixed-price offers with category filtering and proposal-workspace actions.

## Integration

- One authored row represents an offer: identity, copy, commercials, and optional badge/action.
- Listens for `bcg-exchange:marketplace-filter` and workspace changes.
- Adds normalized `offer` items through the shared `bcg-exchange-cart` state module.

## Error Handling

Unknown filters yield an empty grid; optional badges and actions do not leave layout gaps.

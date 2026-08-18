# Exchange Hero Block

## Overview

Renders the orbital BCG IQ hero, signal cards, ambition links, actions, and proof statistics.

## Integration

- Ambition links emit `bcg-exchange:marketplace-filter` and scroll to the marketplace.
- Ask actions emit `bcg-exchange:open-ask`.
- The authored contract contains hero copy/actions, two signals, four ambitions, and four statistics.

## Error Handling

Missing authored presentation content does not affect rendering because the block uses the shared, approved Exchange content set.

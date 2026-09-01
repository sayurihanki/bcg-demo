# Exchange Cart Block

## Overview

Renders the full-page BCG Exchange proposal workspace between product selection and checkout. It replaces the generic Adobe Commerce cart for Exchange items.

## Integration

- Reads and updates the shared `bcg-exchange-cart` local workspace.
- Supports item removal and procurement-mode changes.
- Routes to the Exchange checkout content document.
- Uses `/drafts/cart` and `/drafts/checkout` on localhost for local content previews.

## Error Handling

An empty or malformed workspace renders a branded discovery state with a route back to the BCG X product catalog.

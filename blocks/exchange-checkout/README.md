# Exchange Checkout Block

## Overview

Turns the Exchange proposal workspace into a complete enterprise checkout flow. It carries locally stored portfolio items into a dedicated request page, collects request-owner and procurement details, and renders a local confirmation state.

## Integration

- Reads the versioned `bcg-exchange-cart` workspace state.
- Switches between procurement and commercial-proposal fields without losing the cart.
- Final submission clears the completed portfolio and creates a local request reference.
- The flow intentionally takes no payment and transmits no personal or procurement data.

## Error Handling

An empty or malformed workspace renders an empty-checkout state with a route back to the product catalog. Native form validation prevents incomplete requests from advancing.

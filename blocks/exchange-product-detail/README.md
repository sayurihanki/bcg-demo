# Exchange Product Detail Block

## Overview

Renders the shared PDP layout for all eight BCG X products, including capabilities, outcomes, deployment, configurator, and related products.

## Integration

- Reads the slug from the first authored cell, falling back to the final pathname segment.
- Pilot options are 8/12/16 weeks, 1–12 markets, and 25/50/100 seats.
- Adds or replaces configured products in `bcg-exchange-cart` through the shared state module.

## Error Handling

An unknown slug falls back to the first product; commercial terms are always presented as a custom quote and no payment is taken.

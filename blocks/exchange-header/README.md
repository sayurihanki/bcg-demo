# Exchange Header Block

## Overview

Provides concept-only navigation, mobile menu, Ask BCG dialog, proposal badge, and proposal drawer. It also activates the page-scoped Exchange template styling.

## Integration

- Reads `?cart=1` to open the proposal drawer after workspace hydration.
- Routes a populated proposal to `/cart` for portfolio review, then to `/checkout`, where the Exchange checkout block completes the request.
- Matches Ask BCG text locally against BCG X PDPs, marketplace offers, and supporting site content, with direct links and match explanations.
- Uses versioned local storage at `bcg-exchange-cart`; blocked storage falls back to memory.
- Listens for `bcg-exchange:workspace-change`, `bcg-exchange:open-ask`, and `bcg-exchange:open-workspace`.
- Focus is trapped in dialogs, Escape and outside-click close them, and focus returns to the trigger.

## Error Handling

Malformed legacy state becomes an empty workspace. Ask BCG uses deterministic in-browser intent matching; no entered text, payment, or personal data is transmitted.

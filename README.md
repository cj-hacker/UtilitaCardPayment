# Utilita Demo Payment App

A static, browser-only demonstration payment page.

## How to run

Open `index.html` directly in a browser, or host the folder using any static web server.

Example URL:

    index.html?amount=25.00&reference=UTILITA-DEMO-001

The `amount` parameter is displayed as a GBP payment amount.

The optional `reference` parameter is displayed as the payment reference.

## Example links

    index.html?amount=10
    index.html?amount=25.50&reference=LISA-TOPUP
    index.html?amount=40&reference=COLIN-PAYMENT

## Data handling

This app:

- Does not send form data to a server.
- Does not use `fetch`, `XMLHttpRequest`, or a form action.
- Does not use cookies, analytics, local storage, or session storage.
- Clears the entered values after the simulated payment succeeds.
- Clears the entered values when the page is left or refreshed.

It is a demonstration only and must not be used to collect real payment-card data.

## Dummy details

Suggested dummy values:

- Name: Demo Customer
- Card number: 4242 4242 4242 4242
- Expiry: 12/30
- Security code: 123

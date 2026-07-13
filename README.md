# Utilita Demo Payment App v2

This static demo payment page sends an SMS confirmation request through Webex Connect after a simulated payment.

## Example

    index.html?amount=25.00&reference=LISA-TOPUP

## Webhook payload

    {
      "number": "[Customer Mobile Number]",
      "payment": "[Payment Amount]",
      "reference": "[Reference supplied in the URL]"
    }

Webhook:

    https://hooks.uk.webexconnect.io/events/FI7EANSH9O

## Data handling

- Card details are never transmitted or stored.
- The app sends only the customer mobile number, amount and reference.
- It uses no cookies, analytics, local storage or session storage.
- Inputs are cleared after submission and when the page is left.
- It is a demo only. Do not enter real card details.

## Dummy values

- Mobile: 07700 900123
- Name: Demo Customer
- Card number: 4242 4242 4242 4242
- Expiry: 12/30
- Security code: 123

## Hosting note

Serve this folder from a web server. The webhook must allow browser requests from the domain hosting the app. If the browser reports a CORS error, the Webex Connect endpoint must return the appropriate CORS headers or the request must be sent through a server-side proxy.

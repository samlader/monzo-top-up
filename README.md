# Monzo Money Mover

A simple Node.js application that listens to webhook events from Monzo and transfers funds from a designated pot when your account balance falls below a specified threshold.

This enables you to take advantage of the higher interest rates available on instant access pots (by holding most of your funds in one without the worry of your account balance falling too low). 💸

## Requirements

- Node.js
- Monzo API credentials
- Vercel project with KV storage enabled

## Quick Start

1. Install dependencies:

   ```
   npm install
   ```

2. Run the application:

   ```
   vercel dev
   ```

## Deploy

1. Setup a **confidential** OAuth2 client using your Monzo developer account [here](https://developers.monzo.com/apps/new).

2. Click the button below and enter the required configuration to deploy on **Vercel**. This application requires **KV storage** to be setup for your project. <br> <br> [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fsamlader%2Fmoneymover&env=POT_ID,CLIENT_ID,CLIENT_SECRET&envDescription=Monzo%20Developer%20Client&envLink=https%3A%2F%2Fdevelopers.monzo.com%2Fapps%2Fhome)
   <br><br>
   (This application can run for **free** on a Vercel hobby tier account)

3. Manually register webhook events to the `/monzo` endpoint of your deployment using the Monzo API.

## Disclaimer

This project and is **not** endorsed by or affiliated with Monzo Bank. Use at your own risk.

## License

This project is licensed under the [MIT License](LICENSE).

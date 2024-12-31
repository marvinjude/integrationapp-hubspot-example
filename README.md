## Integration app + Hubspot Example

This example demonstrates how to use Integration.app with Hubspot. To test the integration, you need a Hubspot account. If you don't have one, you can create it [here](https://www.hubspot.com/).

### Prerequisites

#### Clerk (Authentication)

We use clerk for authentication. You need to create an account in [Clerk](https://clerk.dev/). Once you have an account, you need to create a new application. You will need your public and secret key (`NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY`) to authenticate get authentication working in the app.

#### Integration app (Data Integration)

Integration.app lets to integrate data into your app from different data sources. You can sign up for a free account [here](https://integration.app/).

Once your account is created you will need to setup add the Hubpot app and create two actions:

- list-data-records (to list all the contacts)
- create-contact (to create a new contact)

_You can also import this template into your workspace: [Import template](https://integration.app/templates/60f3b3b3b3b3b30001f3b3b3) — This doesn't actually work yet, it's only a proposal._

### Installation

1. Clone the repo
   ```sh
   git clone
   ```
2. Install NPM packages

   ```sh
   npm install
   ```

3. Enter your Integration.app and Clerk keys in `.env.local`

```env
 NEXT_PUBLIC_INTEGRATION_APP_WORKSPACE_KEY=your-workspace-key
 INTEGRATION_APP_SECRET_KEY=your-secret-key
 NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your-clerk-public-key
 CLERK_SECRET=your-clerk-secret-key
```

5. Run the app
   ```sh
   npm run dev
   ```
6. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

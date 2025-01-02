## Nextjs + Integration app + Hubspot Example

This example demonstrates how to use Integration.app with Hubspot. To test the integration, you need a Hubspot account. If you don't have one, you can create it [here](https://www.hubspot.com/).

<img width="1512" alt="Screenshot 2025-01-01 at 00 40 53" src="https://github.com/user-attachments/assets/4f679dbc-b582-4399-8734-66d74fa78042" />

### Prerequisites

#### Clerk (Authentication)

We use clerk for authentication. You need to create an account in [Clerk](https://clerk.dev/). Once you have an account, you need to create a new application. You will need your public and secret key (`NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY`) to authenticate get authentication working in the app.

#### Integration app (Data Integration)

Integration.app lets to integrate data into your app from different data sources. You can sign up for a free account [here](https://integration.app/).

Once your account is created you will need to setup add the Hubpot app and create two actions:

- **list-contacts** (to list all the contacts)
- **create-contact** (to create a new contact)

If you actions have different names, you'll need to update your `.env.local` file with the correct action names.

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

3. Enter your Integration.app and Clerk keys in `.env.local`. Copy the `.env.local.example` file and rename it to `.env.local` to get started:

```sh
cp .env.local.example .env.local
```

5. Run the app
   ```sh
   npm run dev
   ```
6. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### Suggested Improvements to integration.app

- Enhance TypeScript support by developing a CLI tool that generates types based on the user's output schema.
- Provide extensive usage examples to help users understand various use cases.
- Establish a Discord community to offer support and foster engagement with customers.
- Improve the existing documentation to make it more comprehensive and user-friendly.
- Ensure the authenticated workspace ID is passed back to the URI as current Hubspot URI is missing the workspace ID.
- Fix the UI issue that prevents creating an output schema from being created, as the interface is currently unstable.
- Implement a feature to clone actions, which would be beneficial for testing and experimenting with different examples.

### Todo

- Use integration.app pagination in the UI
- Make UI responsive

# Training Calendar — Explicit Save/Load Workflow

## User workflow

1. Open the site. A blank calendar appears immediately.
2. Add entries to any dates across any months.
3. Enter a code at the top.
4. Press **Save**.
5. Later, on any computer, open the site, enter the same code, and press **Load**.
6. The complete saved calendar replaces the blank workspace.

The browser does not use localStorage. Unsaved edits disappear when the page is closed or refreshed.

## Storage model

One database row is stored for each code. That row contains the complete calendar as JSON,
including entries across all months.

Saving again under the same code replaces that code's prior server copy with the currently shown
full calendar.

## Security

This is not authentication. Anyone who knows or guesses the code can load or overwrite that
calendar. Use a long code.

## Setup

1. Run `supabase_setup.sql` in the Supabase SQL Editor.
2. Deploy the `training-calendar` Edge Function with JWT verification disabled.
3. Paste the deployed function URL into `API_URL` in `index.html`.
4. Publish `index.html` with GitHub Pages.

# Visual Query
This experimental app facilitates query-building for systematic reviews on Scopus. Connecting to the Scopus API requires an API key, which you can obtain on the [Elsevier Developer Portal](https://api.elsevier.com). Copy `.env.example` to `.env` and add your key as `SCOPUS_API_KEY`.

![Screenshot of the VisualQuery interface](/screenshotVisualQuery.png)

## Functionalities
The app contains some basic functionalities to get insights in the search query hits on Scopus. There are two panels.

### Left panel
* You can construct a search query broken down into categories. Terms inside a categories are combined with an "OR" and categories are combined with an "AND". Categories can also be named for convenience.
* The final search query for Scopus is displayed at the bottom. Click it to copy to the clipboard.
* Export and import search queries as .csv files to save different iterations.
* Upload a .csv file of "seed papers", which are papers that you would definitely like to include in the review. See the example file called "exampleSeedPapers.csv".

### Right panel
* A bar chart shows how many hits each keyword added to the total number of hits. Click bars to copy the underlying query to the clipboard.
* Seed papers are checked for being included in the hits. During the checking process, the app shows the list of seed papers that still need to be checked.

## Tech stack
This app is built with [SvelteKit](https://svelte.dev/docs/kit) and styled with [Skeleton](https://www.skeleton.dev/) on top of Tailwind CSS. There is no database — all state lives in the browser for the current session, and the only server-side code is a couple of thin API routes (`src/routes/api/search`, `src/routes/api/abstract`) that proxy requests to the Scopus API so your API key is never exposed to the browser.

## Launching the app
Run `npm install` to install dependencies.

Copy `.env.example` to `.env` and fill in your `SCOPUS_API_KEY`.

Then run `npm run dev` to start the app in development mode, or `npm run build` followed by `npm run preview` to run a production build. The app runs on [http://localhost:5173](http://localhost:5173) in development.

# Visual Query
This experimental app facilitates query-building for systematic reviews on Scopus. Connecting to the Scopus API requires an API key, which you can obtain on the [Elsevier Developer Portal](https://api.elsevier.com). For now, I have added my own key. If it doesn't work, try changing it to your own key (search for `"key ="` in the App.jsx file).

![Screenshot of the VisualQuery interface](/screenshotVisualQuery.png)

## Functionalities
The app contains some basic functionalities to get insights in the search query hits on Scopus. There are two panels.

### Left panel
* You can construct a search query broken down into categories. Terms inside a categories are combined with an OR and categories are combined with an AND. Categories can also be named.
* The final search query for Scopus is displayed at the bottom. Click it to copy to the clipboard.
* Export and import search queries as .csv files to save different iterations.
* Upload a .csv file of "seed papers", which are papers that you would definitely like to include in the review.

### Right panel
* A bar chart shows how many hits each keyword added to the total number of hits. Click bars to copy the underlying query to the clipboard.
* Seed papers are checked for being included in the hits. During the checking process, the app shows the list of seed papers that still need to be checked.


## Launching the app
The app uses a React-Express architecture (see [FreeCodeCamp](https://www.freecodecamp.org/news/create-a-react-frontend-a-node-express-backend-and-connect-them-together-c5798926047c/)) so you need to start an Express back-end and a React front-end.

### Run the API
1. In your terminal, navigate to the `api` directory.
2. Run `npm install` to install all dependencies.
3. Run `npm start` to start the api.

### Run the Client
1. In another terminal, navigate to the `client` directory.
2. Run `npm install` to install all dependencies.
3. Run `npm start` to start the app.

With the `api` and `client` running, navigate to [http://localhost:3000](http://localhost:3000).

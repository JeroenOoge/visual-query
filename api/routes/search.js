var express = require("express");
var router = express.Router();
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

// https://stackoverflow.com/questions/68552379/how-to-use-fetch-from-node-fetch-inside-an-express-router-get-request
router.get("/:str/:key/:count/:start", async function (req, res) {
    const httpAccept = "httpAccept=application/json",
        query = "&query=" + req.params["str"],
        key = "&apiKey=" + req.params["key"],
        count = "&count=" + req.params["count"],
        start = "&start=" + req.params["start"],
        url = "https://api-elsevier-com.kuleuven.e-bronnen.be/content/search/scopus?" + httpAccept + query + key + count + start;
    const response = await fetch(url)
        .then(res => res.json())
        .catch((error) => {
            console.error('Error while fetching content from Scopus:', error);
            console.error('Was trying to fetch this url:', url);
        });
    return res.json(response);
});

module.exports = router;
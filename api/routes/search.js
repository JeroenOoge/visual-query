var express = require("express");
var router = express.Router();
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

// https://stackoverflow.com/questions/68552379/how-to-use-fetch-from-node-fetch-inside-an-express-router-get-request
router.get("/:str/:key/:count", async function (req, res) {
    const httpAccept = encodeURIComponent("httpAccept=application/json"),
        query = "&query=" + req.params["str"],
        key = "&apiKey=" + req.params["key"],
        count = "&count=" + req.params["count"],
        cursor = encodeURIComponent("&cursor=*");
    const response = await fetch("https://api.elsevier.com/content/search/scopus?" + httpAccept + query + key + count + cursor)
        .then(res => res.json());
    return res.json(response);
});

module.exports = router;
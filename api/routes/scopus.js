var express = require("express");
var router = express.Router();
const https = require('https');

router.get("/:str/:key", async function (req, res, next) {
    const httpAccept = encodeURIComponent("httpAccept=application/json"),
        queryString = "&query=" + req.params["str"],
        key = "&apiKey=" + req.params["key"],
        countString = "&count=" + 1;
    let response = await https.get("https://api-elsevier-com.kuleuven.e-bronnen.be/content/search/scopus?" + httpAccept + queryString + key + countString);
    // let response = [queryString, key, countString];
    res.send(response);
});

module.exports = router;
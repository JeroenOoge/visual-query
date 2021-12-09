var express = require("express");
var router = express.Router();
const https = require('https');

router.get("/:str/:key", function (req, result, next) {
    const httpAccept = encodeURIComponent("httpAccept=application/json"),
        queryString = "&query=" + req.params["str"],
        key = "&apiKey=" + req.params["key"],
        countString = "&count=" + 1;
    https.get("https://api-elsevier-com.kuleuven.e-bronnen.be/content/search/scopus?" + httpAccept + queryString + key + countString, (res) => {
        console.log('statusCode:', res.statusCode);
        console.log('headers:', res.headers);

        res.on('data', (d) => {
            result.send(d);
        });

    }).on('error', (e) => {
        console.error(e);
    });
});

module.exports = router;
var express = require("express");
var router = express.Router();

router.get("/:str/:key", function (req, res, next) {
    const httpAccept = encodeURIComponent("httpAccept=application/json"),
        queryString = "&query=" + req.params["str"],
        key = "&apiKey=" + req.params["key"],
        countString = "&count=" + 1;
    // let response = await fetch("https://api-elsevier-com.kuleuven.e-bronnen.be/content/search/scopus?" + httpAccept + queryString + key + countString);
    let response = [queryString, key, countString];
    res.send(response);
});

module.exports = router;
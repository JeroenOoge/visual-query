var express = require("express");
var router = express.Router();
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const config = require('../config.json');

// https://stackoverflow.com/questions/68552379/how-to-use-fetch-from-node-fetch-inside-an-express-router-get-request
router.get("/:doi([^/]+/[^/]+)", async function (req, res) {
    const httpAccept = "httpAccept=application/json",
        doi = req.params["doi"];
    const response = await fetch(`https://api.elsevier.com/content/abstract/doi/${doi}?${httpAccept}&apiKey=${config.scopusApiKey}`)
        .then(res => res.json());
    return res.json(response);
});

module.exports = router;
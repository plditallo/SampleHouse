const router = require("express").Router();
const path = require('path');
const fs = require('fs');

const htmlRoot = path.dirname(require.main.filename) + "/public/html"
router.get("/", (req, res) => {
    res.sendFile(path.join(htmlRoot + '/index.html'));
})
router.get("/:file", (req, res) => {
    // fetching favicon.ico??
    const file = req.params.file;
    const filePath = path.join(htmlRoot + `/${file}.html`);
    const catchPath = path.join(htmlRoot + "/404.html")
    console.log("FILE", file)
    console.log("EXISTS", fs.existsSync(filePath))
    if (fs.existsSync(filePath)) {
        if (file.includes(".html") || !file.includes(".ico")) res.sendFile(filePath);
    } else res.sendFile(catchPath)
})

module.exports = router;

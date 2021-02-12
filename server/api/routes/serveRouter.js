const router = require("express").Router();
const path = require('path');
const fs = require('fs');
//todo can I set path root?
const htmlRoot = path.dirname(require.main.filename) + "/public/html"
router.get("/", (req, res) => {
    res.sendFile(path.join(htmlRoot + '/index.html'));
})

const otherPaths = {
    auth: ["login", "register"]
}
router.get("/:file", (req, res) => {
    // fetching favicon.ico??
    let file = req.params.file;
    if (file.includes(".")) file = file.slice(0, file.indexOf("."))
    if (otherPaths.auth.includes(file)) file = "authentication";

    const filePath = path.join(htmlRoot + `/${file}.html`);
    console.log("FILE:", file, "EXISTS:", fs.existsSync(filePath)) //! testing
    if (fs.existsSync(filePath)) {
        if (file.includes(".html") || !file.includes(".ico")) res.sendFile(filePath);
    } else res.sendFile(path.join(htmlRoot + "/404.html"))
})

module.exports = router;

const router = require("express").Router();
var path = require('path');

router.get("/", (req, res) => {
    const htmlRoot = path.dirname(require.main.filename) + "/public/html"
    // console.log(path.join(__dirname + '/index.html'))
    console.log(path.join(htmlRoot + '/index.html'))
    res.sendFile(path.join(htmlRoot + '/index.html'));
})

module.exports = router;

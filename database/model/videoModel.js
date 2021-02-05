const db = require("../database-config.js")
module.exports = {
    getVideos
};

function getVideos() {
    return db("Video")
}

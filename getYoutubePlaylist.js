const YouTube = require('simple-youtube-api');
const youtube = new YouTube('AIzaSyBhZBV2zn9CP92Pn-I8u0hdorwNMWpzFrY');
//! This is a private playlist... It can't fetch that
youtube.getPlaylist('https://www.youtube.com/playlist?list=PLdHoHdRswuPf7MFG7fmjciudGvwuijLnM')
    .then(playlist => {
        console.log(`The playlist's title is ${playlist.title}`);
        console.log({
            playlist
        })
        playlist.getVideos()
            .then(videos => {
                console.log(`This playlist has ${videos.length === 50 ? '50+' : videos.length} videos.`);
                console.log({
                    videos
                })
            })
            .catch(console.log);
    })
    .catch(console.log);

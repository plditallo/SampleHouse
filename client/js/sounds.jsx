"use strict";
//todo download sounds and update database
class Sounds extends React.Component {
  constructor(props) {
    const token = window.localStorage.getItem("samplehousetoken");
    super(props);
    this.state = {
      limit: 10,
      offset: 0,
      page: 1,
      curMaxPage: 1,
      maxPage: null,
      soundList: [],
      isTruncated: false,
      covers: {},
      soundSourceNode: null,
      token,
      loadingSoundList: true,
      loadingSoundStream: false,
      userId: jwt_decode(token).subject,
      message: "",
    };
  }
  //! key = SH%20Essential%20Drums%2FSH_Essential_Hat_02.wav
  nextBtnHandler = () => {
    window.scrollTo(0, 0);
    const {
      limit,
      offset,
      page,
      curMaxPage,
      isTruncated,
      nextContinuationToken,
    } = this.state;
    const needToFetch = page === curMaxPage && isTruncated;
    if (needToFetch) this.fetchSoundList();
    this.setState({
      ...this.state,
      offset: offset + limit,
      page: page + 1,
      curMaxPage:
        page === curMaxPage && nextContinuationToken
          ? curMaxPage + 1
          : curMaxPage,
      loadingSoundList: needToFetch,
    });
  };

  prevBtnHandler = () => {
    window.scrollTo(0, 0);
    const { limit, offset, page } = this.state;
    if (page > 1)
      this.setState({
        ...this.state,
        offset: offset - limit,
        page: page - 1,
      });
  };

  async fetchSoundList() {
    const {
      limit,
      offset,
      // nextContinuationToken,
      soundList,
      page,
    } = this.state;

    const { status, sounds } = await fetch(
      `http://localhost:5000/api/audio?limit=${limit}&offset=${offset}`,
      {
        method: "GET",
        type: "cors",
        headers: {
          "Content-Type": "application/json",
          authorization: this.state.token,
        },
      }
    ).then(async (res) => ({
      status: res.status,
      sounds: await res.json(),
    }));

    if (status !== 200)
      return window.localStorage.removeItem("samplehousetoken");

    const packList = [];
    sounds.forEach(async (e) => {
      if (!packList.includes(e.pack)) {
        console.log("packList", e.pack);
        packList.push(e.pack);
        this.fetchCover(e.pack);
      }
    });
    const isTruncated = sounds.length < limit;
    console.log({ isTruncated });
    this.setState({
      ...this.state,
      soundList: [...soundList, ...sounds],
      isTruncated,
      maxPage: IsTruncated ? null : page + 1,
    });

    // await fetch(
    //   `http://localhost:5000/api/audio?limit=${
    //     limit + 1
    //   }&ContinuationToken=${nextContinuationToken}`,
    //   {
    //     method: "GET",
    //     type: "cors",
    //     headers: {
    //       "Content-Type": "application/json",
    //       authorization: this.state.token,
    //     },
    //   }
    // )
    //   .then(async (res) => ({
    //     status: res.status,
    //     data: await res.json(),
    //   }))
    // .then(({ status, data }) => {
    //   if (status !== 200)
    //     return window.localStorage.removeItem("samplehousetoken");

    // const { IsTruncated, sounds, NextContinuationToken } = data;
    // const wavSoundList = [];
    // sounds.forEach((e) => {
    //   if (e.endsWith(".wav")) wavSoundList.push(e);
    // });
    // this.setState({
    //   ...this.state,
    //   soundList: [...soundList, ...wavSoundList],
    //   nextContinuationToken: IsTruncated ? NextContinuationToken : "",
    //   isTruncated: IsTruncated,
    //   maxPage: IsTruncated ? null : page + 1,
    // });
    // return wavSoundList;
    // })
    // .then((sounds) => {
    //   const coverList = [];
    //   sounds.forEach(async (e) => {
    //     const cover = getPackName(e);
    //     if (!coverList.includes(cover)) {
    //       coverList.push(cover);
    //       this.fetchCover(cover);
    //     }
    //   });
    //   return sounds;
    // })
    // .then(async (sounds) => {
    //   await fetch(`http://localhost:5000/api/audio/tags`, {
    //     method: "POST",
    //     type: "cors",
    //     headers: {
    //       "Content-Type": "application/json",
    //       authorization: this.state.token,
    //     },
    //     body: JSON.stringify(sounds),
    //   })
    //     .then(async (resp) => await resp.json())
    //     .then((dynamoSoundArr) =>
    //       this.setState({
    //         ...this.state,
    //         dynamoSoundList: [
    //           ...this.state.dynamoSoundList,
    //           ...dynamoSoundArr,
    //         ],
    //         loadingSoundList: false,
    //       })
    //     );
    // });
  }

  async streamSound(path, evt) {
    // todo this is still playing over itself when spammed?
    const { soundSourceNode } = this.state;
    if (soundSourceNode) soundSourceNode.stop(0);
    this.setState({ ...this.state, loadingSoundStream: true });
    const loadingSpinner = evt.target.classList;
    loadingSpinner.add("load-spinner");

    const data = await fetch(
      `http://localhost:5000/api/audio/stream/${encodeURIComponent(path)}`,
      {
        method: "GET",
        type: "cors",
        headers: {
          "Content-Type": "application/octet-stream",
          authorization: this.state.token,
        },
      }
    );

    const context = new AudioContext();
    const source = context.createBufferSource(); //Create Sound Source
    this.setState({
      ...this.state,
      soundSourceNode: source,
      loadingSoundStream: false,
    });
    loadingSpinner.remove("load-spinner");
    return context.decodeAudioData(await data.arrayBuffer(), (buffer) => {
      source.buffer = buffer;
      source.connect(context.destination);
      source.start(context.currentTime);
    });
  }

  async fetchCover(cover) {
    if (!(cover in this.state.covers)) {
      let res = await fetch(
        `http://localhost:5000/api/audio/cover/${encodeURIComponent(cover)}`,
        {
          method: "GET",
          type: "cors",
          headers: {
            "Content-Type": "image/png",
            authorization: this.state.token,
          },
        }
      );
      res = await res.json();
      const url = "data:image/png;base64," + encode(res.data);
      console.log("fetch cover url", url);
      this.setState({
        ...this.state,
        covers: {
          ...this.state.covers,
          [cover]: url,
        },
      });
    }
  }

  async download(sound) {
    if (sound.toLowerCase().includes("midi"))
      sound = sound.replace(".wav", ".mid");
    console.log({ sound });

    const res = await fetch(
      `http://localhost:5000/api/audio/download/${encodeURIComponent(sound)}`,
      {
        method: "GET",
        type: "cors",
        headers: {
          "Content-Type": "application/octet-stream",
          authorization: this.state.token,
        },
      }
    );
    if (res.status === 222) {
      const data = await res.json();
      return this.setState({ ...this.state, message: data.msg });
    }
    const blob = new Blob([await res.arrayBuffer()], {
      type: `audio/${sound.includes("midi") ? "midi" : "wav"}`,
    });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = sound;
    link.click();
    console.log("link clicked for download");
    // todo this is refreshing when an update in the database occurs
  }

  async componentDidMount() {
    this.fetchSoundList();
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
  }
  render() {
    // console.log(this.state.message);
    console.log(this.state);
    const {
      soundList,
      dynamoSoundList,
      covers,
      page,
      maxPage,
      offset,
      limit,
      loadingSoundList,
      loadingSoundStream,
      message,
    } = this.state;
    return (
      <div className="sound-wrapper">
        {/* todo search bar/functionality */}
        {/* todo color exclusive different color */}
        {message ? <h2>{message}</h2> : null}
        <table>
          <thead>
            <tr>
              <th>cover</th>
              <th></th>
              <th>File Name</th>
              <th>BPM</th>
              <th>KEY</th>
              <th>Instrument_type</th>
              <th>type</th>
            </tr>
          </thead>
          {loadingSoundList ? <div className="load-spinner" /> : null}
          <tbody>
            {soundList.slice(offset, offset + limit).map((sound, i) => {
              //only pull songs that are in dynamoDb
              // const soundData = dynamoSoundList.find((e) => {
              //   // e //!testing for exclusives
              //   //   ? console.log(e.exclusive.BOOL)
              //   //   : null;
              //   return e ? e.name.S === getSoundName(sound) : null;
              // });
              return (
                <tr key={i} className={sound.exclusive ? "exclusive" : null}>
                  <td>
                    <a href={`#${sound.pack}`}>
                      <img
                        id="cover"
                        src={covers[sound.pack]}
                        style={{ width: "3em", height: "3em" }}
                      />
                    </a>
                  </td>
                  <td>
                    <img
                      src="../assets/music-note.png"
                      alt="Play Button"
                      className={"play-btn"}
                      onClick={(evt) => this.streamSound(sound, evt)}
                    />
                  </td>
                  <td>{sound.name}</td>
                  <td>{soundData.tempo ? soundData.tempo.N : ""}</td>
                  <td>{soundData.key ? soundData.key.S : ""}</td>
                  <td>
                    {soundData.instrument_type
                      ? Array(soundData.instrument_type.SS).map((e) => {
                          if (e.length > 1) {
                            let i = 1;
                            let str = "";
                            // console.log(e);
                            e.forEach((el) => {
                              if (i !== e.length) {
                                str += `${el}, `;
                                i++;
                              } else return (str += el);
                            });
                            return str;
                          } else return e;
                        })
                      : "null"}
                  </td>
                  <td>{soundData.type ? soundData.type.S : "null"}</td>
                  <td>
                    <img
                      src="../assets/download-icon.png"
                      alt="download"
                      onClick={() => this.download(sound)}
                      className="download-btn"
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="pagination">
          <button
            onClick={page > 1 ? this.prevBtnHandler : null}
            style={{ color: page === 1 ? "grey" : "red" }}
          >
            Back
          </button>
          {page}
          <button
            onClick={page === maxPage ? null : this.nextBtnHandler}
            style={{
              color: page === maxPage ? "grey" : "red",
            }}
          >
            Next
          </button>
        </div>
      </div>
    );
  }
}

const domContainer = document.querySelector("#sounds");
ReactDOM.render(React.createElement(Sounds), domContainer);

function encode(data) {
  var str = data.reduce(function (a, b) {
    return a + String.fromCharCode(b);
  }, "");
  return btoa(str).replace(/.{76}(?=.)/g, "$&\n");
}

function getPackName(path) {
  return path.slice(0, path.indexOf("/"));
}
function getSoundName(path) {
  // if (path.endsWith(".mid")) path = path.slice(0, path.length - 4) + ".wav";
  return path.substring(path.lastIndexOf("/") + 1);
}

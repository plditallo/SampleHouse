"use strict";
//todo download sounds and update database
class Sounds extends React.Component {
  constructor(props) {
    const token = window.localStorage.getItem("samplehousetoken");
    super(props);
    this.state = {
      limit: 3,
      offset: 0,
      page: 1,
      curMaxPage: 1,
      maxPage: null,
      soundsList: [],
      dynamoSoundList: [],
      nextContinuationToken: "",
      isTruncated: false,
      covers: {},
      soundSourceNode: null,
      token,
      loadingSoundList: true,
      userId: jwt_decode(token).subject,
      message: "",
    };
  }
  nextBtnHandler = () => {
    window.scrollTo(0, 0);
    const { limit, offset, page, curMaxPage, isTruncated } = this.state;
    const needToFetch = page === curMaxPage && isTruncated;
    if (needToFetch) this.fetchSoundList();
    this.setState({
      ...this.state,
      offset: offset + limit,
      page: page + 1,
      curMaxPage: page === curMaxPage ? curMaxPage + 1 : curMaxPage,
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
    const { limit, nextContinuationToken, soundsList, page } = this.state;
    await fetch(
      `http://localhost:5000/api/audio?limit=${
        limit + 1
      }&ContinuationToken=${nextContinuationToken}`,
      {
        method: "GET",
        type: "cors",
        headers: {
          "Content-Type": "application/json",
          authorization: this.state.token,
        },
      }
    )
      .then(async (res) => ({
        status: res.status,
        data: await res.json(),
      }))
      .then(({ status, data }) => {
        if (status !== 200)
          return window.localStorage.removeItem("samplehousetoken");

        const { IsTruncated, sounds, NextContinuationToken } = data;
        const wavSoundList = [];
        sounds.forEach((e) => {
          if (e.endsWith(".wav")) wavSoundList.push(e);
        });
        this.setState({
          ...this.state,
          soundsList: [...soundsList, ...wavSoundList],
          nextContinuationToken: IsTruncated ? NextContinuationToken : "",
          isTruncated: IsTruncated,
          maxPage: IsTruncated ? null : page + 1,
        });
        return wavSoundList;
      })
      .then((sounds) => {
        const coverList = [];
        sounds.forEach(async (e) => {
          const cover = getCoverName(e);
          if (!coverList.includes(cover)) {
            coverList.push(cover);
            this.fetchCover(cover);
          }
        });
        return sounds;
      })
      .then(async (sounds) => {
        await fetch(`http://localhost:5000/api/audio/tags`, {
          method: "POST",
          type: "cors",
          headers: {
            "Content-Type": "application/json",
            authorization: this.state.token,
          },
          body: JSON.stringify(sounds),
        })
          .then(async (resp) => await resp.json())
          .then((dynamoSoundArr) =>
            this.setState({
              ...this.state,
              dynamoSoundList: [
                ...this.state.dynamoSoundList,
                ...dynamoSoundArr,
              ],
              loadingSoundList: false,
            })
          );
      });
  }

  async streamSound(path) {
    // todo this is still playing over itself?
    const { soundSourceNode } = this.state;
    if (soundSourceNode) soundSourceNode.stop(0);
    // console.log(soundSourceNode);
    // if (path.endsWith(".mid")) console.log("fetchSound-.mid", path);

    await fetch(
      `http://localhost:5000/api/audio/stream/${encodeURIComponent(path)}`,
      {
        method: "GET",
        type: "cors",
        headers: {
          "Content-Type": "application/octet-stream",
          authorization: this.state.token,
        },
      }
    ).then(async (Data) => {
      const context = new AudioContext();
      const source = context.createBufferSource(); //Create Sound Source
      this.setState({ ...this.state, soundSourceNode: source });
      return context.decodeAudioData(await Data.arrayBuffer(), (buffer) => {
        source.buffer = buffer;
        source.connect(context.destination);
        source.start(context.currentTime);
      });
    });
  }

  async fetchCover(cover) {
    if (!(cover in this.state.covers)) {
      await fetch(
        `http://localhost:5000/api/audio/cover/${encodeURIComponent(cover)}`,
        {
          method: "GET",
          type: "cors",
          headers: {
            "Content-Type": "image/png",
            authorization: this.state.token,
          },
        }
      )
        .then(async (res) => await res.json())
        .then(({ data }) => {
          const url = "data:image/png;base64," + encode(data);
          this.setState({
            ...this.state,
            covers: {
              ...this.state.covers,
              [cover]: url,
            },
          });
        });
    }
  }

  async fetchSoundData(sound) {}

  async download(sound) {
    if (sound.toLowerCase().includes("midi"))
      sound = sound.replace(".wav", ".mid");

    await fetch(
      `http://localhost:5000/api/audio/download/${encodeURIComponent(sound)}/${
        this.state.userId
      }`,
      {
        method: "GET",
        type: "cors",
        headers: {
          "Content-Type": "application/octet-stream",
          authorization: this.state.token,
        },
      }
    ).then(async (res) => {
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
      console.log("link clicked");
      // todo this is refreshing the page for some reason... (I think the update user function)
    });
  }

  async componentDidMount() {
    this.fetchSoundList();
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
  }
  // todo scroll to top after page change
  render() {
    // console.log(this.state.message);
    const {
      soundsList,
      covers,
      page,
      maxPage,
      offset,
      limit,
      loadingSoundList,
      message,
    } = this.state;
    // if (this.state.count !== 1 && !loadingSoundList) {
    //   this.download("SH Radio Piano/SH_RaPiano_01_F#m_75_MIDI.midi.wav");
    //   this.state.count++;
    // }
    return (
      <div className="sound-wrapper">
        {/* todo search bar/functionality */}
        {/* todo color exclusive different color */}
        {loadingSoundList ? <div className="loader" /> : null}
        {message ? <h2>{message}</h2> : null}
        <table>
          <thead>
            <tr>
              <th>cover</th>
              <th>sound</th>
              <th>BPM</th>
              <th>KEY</th>
              <th>Instrument_type</th>
              <th>type</th>
            </tr>
          </thead>
          <tbody>
            {soundsList.slice(offset, offset + limit).map((sound, i) => (
              <tr key={i}>
                {/* {console.log(sound)} */}
                <td>
                  <a href={`#${getCoverName(sound)}`}>
                    <img
                      id="cover"
                      src={covers[getCoverName(sound)]}
                      style={{ width: "3em", height: "3em" }}
                    />
                  </a>
                </td>
                <td>
                  <img
                    src="../assets/music-note.png"
                    alt="Play Button"
                    className="download-btn" //todo change this
                    onClick={() => this.streamSound(sound)}
                  />
                </td>
                <td>{getSoundName(sound)}</td>
                <td>bpm</td>
                <td>key</td>
                <td>instrument</td>
                <td>loop</td>
                <td>
                  <img
                    src="../assets/download-icon.png"
                    alt="download"
                    onClick={() => this.download(sound)}
                    className="download-btn"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/*{soundsList.slice(offset, offset + limit).map((sound, i) => {
          // console.log(Object.entries(sound)[0][0]);
          // sound = Object.entries(sound)[0][0];
          return (
            <div className="sound" key={i}>
              {/* todo link this to a packs page 
              {i === 0 ? <h2>Cover</h2> : null}
              <a href={`#${getCoverName(sound)}`}>
                <img
                  id="cover"
                  src={covers[getCoverName(sound)]}
                  style={{ width: "3em", height: "3em" }}
                />
              </a>
              <p id={sound} key={i} onClick={() => this.streamSound(sound)}>
                {getSoundName(sound)}
              </p>
              <p>BPM</p>
              <p>KEY</p>
              <p>Instrument_type</p>
              <p>exclusive?(1/15 credits)</p>
              <p>type (One Shot/Loop)</p>
              <img
                src="../assets/download-icon.png"
                alt="download"
                onClick={() => this.download(sound)}
                className="download"
              />
            </div>
          );
        })} */}
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
            style={{ color: page === maxPage ? "grey" : "red" }}
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

function getCoverName(path) {
  return path.slice(0, path.indexOf("/"));
}
function getSoundName(path) {
  // if (path.endsWith(".mid")) path = path.slice(0, path.length - 4) + ".wav";
  return path.substring(path.lastIndexOf("/") + 1);
}

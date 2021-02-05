"use strict";
//todo download sounds and update database
class Sounds extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      limit: 25,
      offset: 0,
      page: 1,
      curMaxPage: 1,
      maxPage: null,
      soundsList: [],
      nextContinuationToken: "",
      isTruncated: false,
      covers: {},
      soundSourceNode: null,
      token: window.localStorage.getItem("samplehousetoken"),
      loadingSoundList: true,
      count: 0,
    };
  }
  nextBtnHandler = () => {
    const { limit, offset, page, curMaxPage, isTruncated } = this.state;
    if (page === curMaxPage && isTruncated) this.fetchSoundList();
    this.setState({
      ...this.state,
      offset: offset + limit,
      page: page + 1,
      curMaxPage: page === curMaxPage ? curMaxPage + 1 : curMaxPage,
      loadingSoundList: true,
    });
  };

  prevBtnHandler = () => {
    // console.log("BACK");
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
        this.setState({
          ...this.state,
          soundsList: [...soundsList, ...sounds],
          nextContinuationToken: IsTruncated ? NextContinuationToken : "",
          isTruncated: IsTruncated,
          maxPage: IsTruncated ? null : page + 1,
        });
        // console.log(newState);
        // this.setState(newState);
        return sounds;
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
      })
      .then(() => this.setState({ ...this.state, loadingSoundList: false }));
  }

  async fetchSound(path) {
    const { soundSourceNode } = this.state;
    if (soundSourceNode) soundSourceNode.stop(0);
    // console.log(soundSourceNode);
    // if (path.endsWith(".mid")) console.log("fetchSound-.mid", path);

    await fetch(`http://localhost:5000/api/audio/${encodeURIComponent(path)}`, {
      method: "GET",
      type: "cors",
      headers: {
        "Content-Type": "application/octet-stream",
        authorization: this.state.token,
      },
    }).then(async (Data) => {
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

  async download(sound) {
    return await fetch(
      `http://localhost:5000/api/audio/${encodeURIComponent(sound)}`,
      {
        method: "GET",
        type: "cors",
        headers: {
          "Content-Type": "audio/wav",
          authorization: this.state.token,
        },
      }
    ).then(async (res) => {
      const blob = new Blob([await res.arrayBuffer()], { type: "audio/wav" });
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = sound;
      link.click();
      // return buffer;
    });
  }

  componentDidMount() {
    this.fetchSoundList();
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
  }
  // todo scroll to top after page change
  render() {
    const {
      soundsList,
      covers,
      page,
      maxPage,
      offset,
      limit,
      loadingSoundList,
    } = this.state;
    return (
      <div>
        {/* todo search bar/functionality */}
        {loadingSoundList ? <div className="loader" /> : null}

        {soundsList.slice(offset, offset + limit).map((sound, i) => {
          // console.log(Object.entries(sound)[0][0]);
          // sound = Object.entries(sound)[0][0];
          return sound.endsWith(".wav") ? (
            <div className="sound" key={i} style={{ display: "flex" }}>
              <a href={`#${getCoverName(sound)}`}>
                <img
                  id="testImg"
                  src={covers[getCoverName(sound)]}
                  style={{ width: "3em", height: "3em" }}
                />
              </a>
              <p id={sound} key={i} onClick={() => this.fetchSound(sound)}>
                {getSoundName(sound)}
              </p>
              <p>BPM</p>
              <p>KEY</p>
              <p>Instrument_type</p>
              <p>exclusive?(1/15 credits)</p>
              <p>download btn</p>
              <p>type (One Shot/Loop)</p>
              <img
                src="../assets/lock.png"
                alt="download"
                onClick={() => this.download(sound)}
              />
            </div>
          ) : null;
        })}
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

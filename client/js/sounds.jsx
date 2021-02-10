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
      maxPageFetched: 1,
      maxPages: null,
      soundList: [],
      covers: {},
      soundSourceNode: null,
      token,
      loadingSoundList: true,
      loadingSoundStream: false,
      userId: jwt_decode(token).subject,
      message: "",
    };
  }

  nextBtnHandler = () => {
    window.scrollTo(0, 0);
    const { limit, offset, page, maxPageFetched, maxPages } = this.state;
    const needToFetch = page === maxPageFetched && page <= maxPages;

    if (needToFetch) this.fetchSoundList(offset + limit);
    this.setState({
      ...this.state,
      offset: offset + limit,
      page: page + 1,
      maxPageFetched:
        page === maxPageFetched && needToFetch
          ? maxPageFetched + 1
          : maxPageFetched,
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

  async fetchSoundList(offset) {
    const { soundList, soundCount, limit } = this.state;

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
    console.log("fetch", sounds); //! testing
    if (status !== 200)
      return window.localStorage.removeItem("samplehousetoken");

    const packList = [];
    sounds.forEach((e) => {
      if (!packList.includes(e.pack)) {
        packList.push(e.pack);
        this.fetchCover(e.pack);
      }
    });
    this.setState({
      ...this.state,
      soundList: [...soundList, ...sounds],
      loadingSoundList: false,
    });
  }

  async streamSound(sound, evt) {
    // todo this is still playing over itself when spammed?
    if (this.state.soundSourceNode) soundSourceNode.stop(0);
    this.setState({ ...this.state, loadingSoundStream: true });

    const loadingSpinner = evt.target.classList;
    loadingSpinner.add("load-spinner");

    if (sound.name.toLowerCase().includes("midi")) {
      const index = sound.name.lastIndexOf(".mid");
      sound.name = sound.name.slice(0, index) + ".wav";
    }

    const data = await fetch(
      `http://localhost:5000/api/audio/stream/${encodeURIComponent(
        `${sound.pack}/${sound.name}`
      )}`,
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
    // todo change to a post w/ cover list
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
    if (sound.name.toLowerCase().includes("midi"))
      sound.name = sound.name.replace(".wav", ".mid");
    console.log("download:", sound);

    const res = await fetch(
      `http://localhost:5000/api/audio/download/${encodeURIComponent(
        `${sound.pack}/${sound.name}`
      )}`,
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
    const { token, limit, offset } = this.state;
    const soundCount = await fetch(`http://localhost:5000/api/audio/count`, {
      method: "GET",
      type: "cors",
      headers: {
        "Content-Type": "application/octet-stream",
        authorization: token,
      },
    }).then(async (res) => await res.json());
    this.setState({
      ...this.state,
      maxPages: Math.ceil(soundCount / limit),
    });
    this.fetchSoundList(offset);
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
  }
  render() {
    const {
      soundList,
      dynamoSoundList,
      covers,
      page,
      maxPages,
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
        {loadingSoundList ? <div className="load-spinner" /> : null}
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
          <tbody>
            {soundList.slice(offset, offset + limit).map((sound, i) => {
              console.log(sound.id);
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
                  <td>{sound.tempo}</td>
                  <td>{sound.key}</td>
                  <td>
                    {typeof sound.instrument_type === "string"
                      ? sound.instrument_type.replace(",", ", ")
                      : null}
                  </td>
                  <td>{sound.type}</td>
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
            onClick={page === maxPages ? null : this.nextBtnHandler}
            style={{
              color: page === maxPages ? "grey" : "red",
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

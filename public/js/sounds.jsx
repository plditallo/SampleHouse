"use strict";
class Sounds extends React.Component {
  constructor(props) {
    const token = window.localStorage.getItem("samplehousetoken");
    super(props);
    this.state = {
      limit: 4, //!testing change to 20-25
      offset: 0,
      page: 1,
      maxPageFetched: 1,
      maxPages: null,
      soundList: [],
      covers: {},
      tags: [],
      instruments: [],
      soundSourceNode: null,
      token,
      userId: jwt_decode(token).subject,
      user: {},
      loadingSoundList: true,
      loadingSoundStream: false,
      message: "",
      filtering: false,
      tagFilters: [],
      userDownloads: [],
    };
  }

  nextBtnHandler = async () => {
    this.stopStreaming();
    window.scrollTo(0, 0);
    const { limit, offset, page, maxPageFetched, maxPages } = this.state;
    let needToFetch = page === maxPageFetched && page <= maxPages;
    if (this.state.tagFilters.length) needToFetch = false;
    console.log({ needToFetch });
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
    if (needToFetch) await this.fetchSoundList(offset + limit);
  };

  prevBtnHandler = () => {
    this.stopStreaming();
    window.scrollTo(0, 0);
    const { limit, offset, page } = this.state;
    if (page > 1)
      this.setState({
        ...this.state,
        offset: offset - limit,
        page: page - 1,
      });
  };

  async fetchSoundList(offset, tags) {
    // console.log({ tags });
    if (tags && !tags.length) offset = 0;

    const { status, sounds } = await fetch(
      `http://localhost:5000/api/audio?limit=${
        this.state.limit
      }&offset=${offset}&tags=${tags && tags.length ? tags : ""}`,
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
    sounds.forEach((e) => {
      if (!packList.includes(e.pack)) {
        packList.push(e.pack);
        this.fetchCover(e.pack);
      }
    });
    const newSoundList = [...this.state.soundList];
    // if (sounds)
    sounds.forEach((e) => {
      if (!this.state.soundList.includes(e)) newSoundList.push(e);
    });
    console.log({ sounds });
    // const soundCount = await this.getSoundCount();
    const soundCount = 11;
    this.setState({
      ...this.state,
      soundList: tags && tags.length ? sounds : newSoundList,
      // soundList: newSoundList,
      loadingSoundList: false,
      message: sounds.length ? "" : "No Sounds Found.",
      maxPages:
        tags && tags.length
          ? Math.ceil(sounds.length / this.state.limit)
          : Math.ceil(soundCount / this.state.limit),
      page: tags && tags.length ? 1 : this.state.page,
      offset: tags && tags.length ? 0 : this.state.offset,
    });
    // console.log(this.state.loadingSoundList);
  }

  async streamSound(sound, evt) {
    // todo this is still playing over itself when spammed?
    this.stopStreaming();
    const loadingSpinner = evt.target.classList;
    loadingSpinner.add("stream-spinner");

    //* make copy of sound to not overwrite .mid w/ .wav
    let soundName = sound.name;
    if (soundName.toLowerCase().includes("midi")) {
      const index = soundName.lastIndexOf(".mid");
      soundName = soundName.slice(0, index) + ".wav";
    }

    const data = await fetch(
      `http://localhost:5000/api/audio/stream/${encodeURIComponent(
        `${sound.pack}/${soundName}`
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
      // loadingSoundStream: false,
    });
    return context.decodeAudioData(await data.arrayBuffer(), (buffer) => {
      source.buffer = buffer;
      source.connect(context.destination);
      source.start(context.currentTime);
      loadingSpinner.remove("stream-spinner");
    });
  }

  stopStreaming() {
    const { soundSourceNode } = this.state;
    if (soundSourceNode) soundSourceNode.stop(0);
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
      //* insufficient balance
      const data = await res.json();
      return this.setState({ ...this.state, message: data.msg });
    } else if (res.status === 225) {
      const creditCost = sound.exclusive ? 15 : 1;
      this.setState({
        ...this.state,
        user: {
          ...this.state.user,
          balance: this.state.user.balance - creditCost,
        },
      });
    }
    const blob = new Blob([await res.arrayBuffer()], {
      type: `audio/${sound.name.includes("midi") ? "midi" : "wav"}`,
    });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = sound.name;
    link.click();
    // console.log("link clicked for download");
  }

  toggleTagFilter = async (tag) => {
    let tagFilters = this.state.tagFilters;
    if (!tagFilters.includes(tag)) tagFilters.push(tag);
    else tagFilters = tagFilters.filter((e) => e !== tag);
    this.setState({ ...this.state, tagFilters, page: 1, offset: 0 });
    this.fetchSoundList(this.state.offset, tagFilters);
  };

  resetTagFilter = () => {
    if (this.state.tagFilters.length) {
      this.setState({ ...this.state, tagFilters: [], page: 1, offset: 0 });
    }
    this.fetchSoundList(this.state.offset, []);
  };

  async componentDidMount() {
    const { token, limit, offset, userId } = this.state;
    const soundCount = await getSoundCount(token);
    const user = await fetch(`http://localhost:5000/api/user/${userId}`, {
      method: "GET",
      type: "cors",
      headers: {
        "Content-Type": "application/json",
      },
    }).then(async (res) => await res.json());

    const tags = await fetch("http://localhost:5000/api/audio/tags", {
      method: "GET",
      type: "cors",
      headers: {
        "Content-Type": "application/json",
        authorization: token,
      },
    }).then(async (res) => await res.json());

    const instruments = await fetch(
      "http://localhost:5000/api/audio/instruments",
      {
        method: "GET",
        type: "cors",
        headers: {
          "Content-Type": "application/json",
          authorization: token,
        },
      }
    ).then(async (res) => await res.json());
    this.setState({
      ...this.state,
      maxPages: Math.ceil(soundCount / limit),
      user,
      tags,
      instruments,
    });
    this.fetchSoundList(offset);
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
  }

  render() {
    const {
      soundList,
      covers,
      page,
      maxPages,
      offset,
      limit,
      loadingSoundList,
      // loadingSoundStream,
      message,
      user,
      tags,
      instruments,
      tagFilters,
    } = this.state;
    // console.log(this.state);
    // console.log(
    //   { soundList },
    //   "soundListSlice",
    //   soundList.sort((a, b) => a.id - b.id).slice(offset, offset + limit)
    // );

    return (
      <div className="home-wrapper">
        {/* todo search bar/functionality */}
        {/* todo color exclusive different color */}
        <div className="search-wrapper">
          <h1>SOUNDS</h1>
          <div className="search-bar">SEARCH</div>
          <h3>{user.balance} credits</h3>
        </div>
        {message ? <h2>{message}</h2> : null}
        {loadingSoundList ? <div className="load-spinner" /> : null}
        <div className="sound-wrapper">
          <aside>
            <h2>Filters</h2>
            <h3 onClick={() => toggleFilterMenu("tag")}>Tags</h3>
            <ul className="filter tag-filter">
              {tags.map((e, i) => (
                <li
                  key={i}
                  onClick={() => this.toggleTagFilter(e)}
                  className={tagFilters.includes(e) ? "selected" : ""}
                >
                  {e}
                </li>
              ))}
            </ul>
            <h3 onClick={() => toggleFilterMenu("instrument")}>Instruments</h3>
            <ul className="filter instrument-filter">
              {instruments.map((e, i) => (
                <li
                  key={i}
                  onClick={() => this.toggleTagFilter(e)}
                  className={tagFilters.includes(e) ? "selected" : ""}
                >
                  {e}
                </li>
              ))}
            </ul>
            <button
              onClick={() => this.resetTagFilter()}
              className="reset-tags"
            >
              reset filters
            </button>
          </aside>
          <div className="table-wrapper">
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
                  <th></th>
                  {/* <th></th> */}
                </tr>
              </thead>
              <tbody>
                {soundList
                  .sort((a, b) => a.pack - b.pack)
                  // todo sort by name after pack
                  .slice(offset, offset + limit)
                  .map((sound, i) => {
                    return (
                      <tr
                        key={i}
                        className={sound.exclusive ? "exclusive" : null}
                      >
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
                            className="play-btn"
                            onClick={(evt) => this.streamSound(sound, evt)}
                          />
                        </td>
                        <td>
                          <p className="name">{sound.name}</p>
                          {typeof sound.tags === "string"
                            ? sound.tags.split(",").map((e, i) => (
                                <span
                                  key={i}
                                  className="tag"
                                  onClick={() => this.toggleTagFilter(e)}
                                >
                                  {e}
                                </span>
                              ))
                            : null}
                          {/* {typeof sound.instrument_type === "string"
                      ? sound.instrument_type.replace(",", ", ")
                      : null} */}
                        </td>
                        <td className="tempo">{sound.tempo}</td>
                        <td className="key">{sound.key}</td>
                        <td className="instrument-type">
                          {typeof sound.instrument_type === "string"
                            ? sound.instrument_type.replace(",", ", ")
                            : null}
                        </td>
                        <td className="type">{sound.type}</td>
                        <td>
                          {/* //todo already downloaded? */}
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
                onClick={
                  page === maxPages || loadingSoundList
                    ? null
                    : this.nextBtnHandler
                }
                style={{
                  color: page === maxPages ? "grey" : "red",
                }}
              >
                Next
              </button>
            </div>
          </div>
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

async function getSoundCount(token) {
  return await fetch(`http://localhost:5000/api/audio/count`, {
    method: "GET",
    type: "cors",
    headers: {
      "Content-Type": "application/octet-stream",
      authorization: token,
    },
  }).then(async (res) => await res.json());
}

function toggleFilterMenu(filterType) {
  const selectedMenu = document.querySelector(`.${filterType}-filter`).style;
  if (selectedMenu.display === "block") selectedMenu.display = "none";
  else selectedMenu.display = "block";
}

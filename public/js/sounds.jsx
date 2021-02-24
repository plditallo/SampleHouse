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
      genres: [],
      soundSourceNode: null,
      token,
      userId: jwt_decode(token).subject,
      user: {},
      loadingSoundList: true,
      loadingSoundStream: false,
      message: "",
      filtering: false,
      tagFilters: [],
      filters: { tags: [], instrument_type: [], genres: [] },
      userDownloads: [],
      searchQuery: "",
    };
  }

  nextBtnHandler = async () => {
    this.stopStreaming();
    window.scrollTo(0, 0);
    let {
      limit,
      offset,
      page,
      maxPageFetched,
      maxPages,
      searchQuery,
    } = this.state;

    let needToFetch = page === maxPageFetched && page <= maxPages;
    if (searchQuery) needToFetch = false;
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
    if (needToFetch) this.fetchSoundList(offset + limit);
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

  async fetchSoundList(offset, searchQuery) {
    const { filters } = this.state;
    let filtering = false;
    Object.values(filters).forEach((e) => {
      if (e.length && filtering === false) filtering = true;
    });
    if (searchQuery === null) filtering = false;
    // console.log({ filtering });
    let url = new URL("http://localhost:5000/api/audio");
    url.search = new URLSearchParams({
      limit: this.state.limit,
      offset,
      tags: filtering ? filters.tags : [],
      instrument_type: filtering ? filters.instrument_type : [],
      genres: filtering ? filters.genres : [],
      searchQuery: searchQuery ? searchQuery : "",
    });
    const { status, sounds } = await fetch(url, {
      method: "GET",
      type: "cors",
      headers: {
        "Content-Type": "application/json",
        authorization: this.state.token,
      },
    }).then(async (res) => ({
      status: res.status,
      sounds: await res.json(),
    }));
    console.log({ sounds });
    // if no sounds set message
    // if (status !== 200)
    //   return window.localStorage.removeItem("samplehousetoken");

    const packList = [];
    sounds.forEach((e) => {
      if (!packList.includes(e.pack)) {
        packList.push(e.pack);
        this.fetchCover(e.pack);
      }
    });
    let newSoundList = [...this.state.soundList];
    if (
      (filtering === false && this.state.filtering) ||
      searchQuery === null ||
      searchQuery
    )
      newSoundList = [];
    sounds.forEach((e) => {
      if (!this.state.soundList.includes(e)) newSoundList.push(e);
    });
    this.setState({
      ...this.state,
      soundList: sounds.length ? (filtering ? sounds : newSoundList) : [],
      filtering,
      loadingSoundList: false,
      message: sounds.length ? "" : "No Sounds Found.",
    });
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

  toggleFilter = (type, value) => {
    let filters = this.state.filters;
    if (!filters[type].includes(value)) filters[type].push(value);
    else filters[type] = filters[type].filter((e) => e !== value);
    document.getElementById("search").value = "";
    this.setState({
      ...this.state,
      filters,
      page: 1,
      offset: 0,
      searchQuery: "",
    });
    this.fetchSoundList(this.state.offset);
  };

  resetFilter = () => {
    const { filters } = this.state;
    document.getElementById("search").value = "";
    if (
      filters.tags.length ||
      filters.instrument_type.length ||
      filters.genres.length
    ) {
      this.setState({
        ...this.state,
        filters: { tags: [], instrument_type: [], genres: [] },
        page: 1,
        offset: 0,
        filtering: false,
        searchQuery: "",
      });
    }
    this.fetchSoundList(0, null);
  };

  searchHandler = () => {
    const searchQuery = document.getElementById("search").value;
    this.setState({
      ...this.state,
      filters: { tags: [], instrument_type: [], genres: [] },
      page: 1,
      offset: 0,
      filtering: false,
      searchQuery,
    });
    this.fetchSoundList(0, searchQuery);
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

    const genres = await fetch("http://localhost:5000/api/audio/genres", {
      method: "GET",
      type: "cors",
      headers: {
        "Content-Type": "application/json",
        authorization: token,
      },
    }).then(async (res) => await res.json());

    window.document
      .getElementById("search")
      .addEventListener("keyup", function (e) {
        var code;
        if (e.key !== undefined) {
          code = e.key; //Enter
        } else if (e.keyIdentifier !== undefined) {
          code = e.keyIdentifier; //13
        } else if (e.keyCode !== undefined) {
          code = e.keyCode;
        }
        if (code === "Enter" || code === 13)
          document.getElementById("search-btn").click();
      });

    this.setState({
      ...this.state,
      maxPages: Math.ceil(soundCount / limit),
      user,
      tags,
      instruments,
      genres,
    });
    this.fetchSoundList(offset);
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
  }

  render() {
    let {
      soundList,
      covers,
      page,
      maxPages,
      offset,
      limit,
      loadingSoundList,
      message,
      user,
      tags,
      instruments,
      genres,
      filters,
      filtering,
      searchQuery,
    } = this.state;

    if (filtering || searchQuery) {
      maxPages = Math.ceil(soundList.length / limit);
    }

    return (
      <div className="home-wrapper">
        {/* todo search bar/functionality */}
        {/* todo color exclusive different color */}
        <div className="search-wrapper">
          <h1>SOUNDS</h1>
          <input id="search" type="text" name="search" />
          <button id="search-btn" onClick={this.searchHandler}>
            Search
          </button>
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
                  onClick={() => this.toggleFilter("tags", e)}
                  className={filters["tags"].includes(e) ? "selected" : ""}
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
                  onClick={() => this.toggleFilter("instrument_type", e)}
                  className={
                    filters["instrument_type"].includes(e) ? "selected" : ""
                  }
                >
                  {e}
                </li>
              ))}
            </ul>
            <h3 onClick={() => toggleFilterMenu("genre")}>Genres</h3>
            <ul className="filter genre-filter">
              {genres.map((e, i) => (
                <li
                  key={i}
                  onClick={() => this.toggleFilter("genres", e)}
                  className={filters["genres"].includes(e) ? "selected" : ""}
                >
                  {e}
                </li>
              ))}
            </ul>
            <button onClick={() => this.resetFilter()} className="reset-tags">
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
                                  onClick={() => this.toggleFilter("tags", e)}
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

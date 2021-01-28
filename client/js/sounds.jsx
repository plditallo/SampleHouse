"use strict";
// todo add spinner
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
        },
      }
    )
      .then(async (resp) => await resp.json())
      .then(({ IsTruncated, sounds, NextContinuationToken }) => {
        // console.log({ sounds });
        // const newState = {
        //   ...this.state,
        //   // soundsList: [...soundsList, ...sounds],
        //   soundsList: [...soundsList],
        //   nextContinuationToken: IsTruncated ? NextContinuationToken : "",
        //   isTruncated: IsTruncated,
        //   maxPage: IsTruncated ? null : page,
        // };
        // sounds.forEach(async (e) =>
        //   newState.soundsList.push({ [e]: await this.fetchTags(e) })
        // );
        this.setState({
          ...this.state,
          soundsList: [...soundsList, ...sounds],
          nextContinuationToken: IsTruncated ? NextContinuationToken : "",
          isTruncated: IsTruncated,
          maxPage: IsTruncated ? null : page,
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
          // console.log(this.fetchTags(e));
          // newState.soundsList.push({
          //   [getSoundName(e)]: this.fetchTags(e),
          // });
          // this.fetchTags(e);
        });
        // console.log(newState);
      });
    // .then(() => console.log(this.state));
  }

  async fetchSound(path) {
    const { soundSourceNode } = this.state;
    if (soundSourceNode) soundSourceNode.stop(0);
    // console.log(soundSourceNode);
    // todo spinner.show()
    // if (path.endsWith(".mid")) console.log("fetchSound-.mid", path);

    await fetch(`http://localhost:5000/api/audio/${encodeURIComponent(path)}`, {
      method: "GET",
      type: "cors",
      headers: {
        "Content-Type": "application/octet-stream",
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
            "Content-Type": "image/png", //? application/json?
          },
        }
      )
        .then(async (resp) => await resp.json())
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

  async fetchTags(path) {
    await fetch(
      `http://localhost:5000/api/audio/tag/${encodeURIComponent(path)}`,
      {
        method: "GET",
        type: "cors",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then(async (resp) => await resp.json())
      .then((tags) => {
        // console.log(getSoundName(path), tags);
        return tags;
      });
  }

  componentDidMount() {
    this.fetchSoundList();
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    // this.fetchTags("SH Essential Drums/SH_Essential_Hat_01.wav"); //! testing
  }
  //todo  pagination btn still going up if no more pages
  // todo pagination button spammed causes getSounds not to work
  render() {
    const { soundsList, covers, page, maxPage, offset, limit } = this.state;
    return (
      <div>
        <div className="pagination">
          <button
            onClick={page > 1 ? this.prevBtnHandler : null}
            style={{ color: page === 1 ? "grey" : "red" }}
          >
            Back
          </button>
          <button
            onClick={page === maxPage ? null : this.nextBtnHandler}
            style={{ color: page === maxPage ? "grey" : "red" }}
          >
            Next
          </button>
        </div>

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
            </div>
          ) : null;
        })}
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

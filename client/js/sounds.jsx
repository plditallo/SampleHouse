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
    await fetch(
      `http://localhost:5000/api/audio?limit=${
        this.state.limit + 1
      }&ContinuationToken=${this.state.nextContinuationToken}`,
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
        this.setState({
          ...this.state,
          soundsList: [...this.state.soundsList, ...sounds],
          nextContinuationToken: IsTruncated ? NextContinuationToken : "",
          isTruncated: IsTruncated,
          maxPage: IsTruncated ? null : this.state.page,
        });
        // console.log(sounds);
        return sounds;
      })
      .then((sounds) => {
        // console.log({ sounds });
        const coverList = [];
        sounds.forEach((e) => {
          const cover = getCoverName(e);
          if (!coverList.includes(cover)) {
            coverList.push(cover);
            this.fetchCover(cover);
          }
        });
      });
  }

  async fetchSound(path) {
    //todo set path/arrayBuffer in state to reuse w/ excess calls
    const { soundSourceNode, soundFetchData } = this.state;
    if (soundSourceNode) soundSourceNode.stop(0);
    console.log(soundSourceNode);
    // spinner.show()
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

  componentDidMount() {
    this.fetchSoundList();
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
  }

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

        {soundsList.slice(offset, offset + limit).map((sound, i) =>
          sound.endsWith(".wav") ? (
            <div className="sound" key={i} style={{ display: "flex" }}>
              <img
                id="testImg"
                src={covers[getCoverName(sound)]}
                style={{ width: "3em", height: "3em" }}
              />
              <p id={sound} key={i} onClick={() => this.fetchSound(sound)}>
                {getSoundName(sound)}
              </p>
            </div>
          ) : null
        )}
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

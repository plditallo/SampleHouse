"use strict";
// todo add spinner
class Sounds extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      limit: 25,
      offset: 0,
      page: 1,
      soundsList: [],
      nextContinuationToken: "",
      isTruncated: false,
      covers: {},
    };
  }

  previousBtnHandler = () => {
    const { limit, offset, page } = this.state;
    this.setState({
      ...this.state,
      offset: offset - limit,
      page: page - 1,
    });
  };

  nextBtnHandler = () => {
    const { limit, offset, page } = this.state;
    this.setState({
      ...this.state,
      offset: offset + limit,
      page: page + 1,
    });
  };
  //todo check if Continuation Token works
  fetchSoundList = async () =>
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
        });
        return sounds;
      })
      .then((sounds) => {
        // console.log({ sounds });
        const coverList = [];
        sounds.forEach((e) => {
          const cover = getCover(e);
          if (!coverList.includes(cover)) {
            coverList.push(cover);
          }
        });
        coverList.forEach((e) => this.fetchCover(e));
      });

  async fetchSound(path) {
    // spinner.show()
    await fetch(`http://localhost:5000/api/audio/${encodeURIComponent(path)}`, {
      method: "GET",
      type: "cors",
      headers: {
        "Content-Type": "application/octet-stream",
      },
    })
      .then(async (resp) => await resp.arrayBuffer())
      .then((Data) => {
        // spinner.hide()
        const context = new AudioContext();
        const source = context.createBufferSource(); //Create Sound Source
        context.decodeAudioData(Data, (buffer) => {
          source.buffer = buffer;
          source.connect(context.destination);
          source.start(context.currentTime);
        });
      });
  }

  async fetchCover(cover) {
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

  componentDidMount() {
    this.fetchSoundList();
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
  }

  render() {
    return (
      <div>
        {this.state.isTruncated ? (
          <button onClick={this.fetchSoundList}>Next</button>
        ) : (
          "no more"
        )}
        {this.state.soundUrl ? (
          <audio controls>
            <source src={this.state.soundUrl} type="audio/wav" />
            Your browser does not support the audio element.
          </audio>
        ) : null}
        {this.state.soundsList.map((sound, i) => (
          <div className="sound" key={i} style={{ display: "flex" }}>
            <img id="testImg" />
            <p id={sound} key={i} onClick={() => this.fetchSound(sound)}>
              {sound.substring(sound.lastIndexOf("/") + 1)}
            </p>
          </div>
        ))}
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

function getCover(path) {
  return path.slice(0, path.indexOf("/"));
}

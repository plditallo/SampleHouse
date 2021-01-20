"use strict";

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
      soundPlaying: null,
      soundUrl: null,
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
      `http://localhost:5000/api/sounds?limit=${
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
      .then((res) => {
        console.log(res);
        const { IsTruncated, Sounds, NextContinuationToken } = res;

        console.log({ Sounds });
        this.setState({
          ...this.state,
          soundsList: [...this.state.soundsList, ...Sounds],
          nextContinuationToken: IsTruncated ? NextContinuationToken : "",
          isTruncated: IsTruncated,
        });
      });

  // fetchSoundObject = async (path) =>
  //   await fetch(
  //     `http://localhost:5000/api/sounds/${encodeURIComponent(path)}`,
  //     {
  //       method: "GET",
  //       type: "cors",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     }
  //   )
  //     // .then(async (resp) => await resp.json())
  //     .then((data) => {
  //       console.log({ data });
  //       source = this.context.createBufferSource();
  //       this.context.decodeAudioData(data, (buffer) => {
  //         source.buffer = buffer;
  //         source.connect(this.context.destination);
  //         source.start(this.context.currentTime);
  //       });
  //     });
  // ).then(async (resp) => console.log(resp));
  //     .then(async (resp) => await resp.json())
  //     .then((res) => {
  //       // console.log(res.Body.data);
  //       // this.setState({ ...this.state, soundPlaying: res.Body.data });
  //       // const blob = new Blob([res.Body.data], { type: "audio/wav" });
  //       // const url = window.URL.createObjectURL(blob);
  //       // this.setState({ ...this.state, soundUrl: url });
  //       // audioElement.src = url;
  //     });

  componentDidMount() {
    this.fetchSoundList();
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
  }
  componentWillUnmount() {
    window.URL.revokeObjectURL(this.state.soundUrl);
  }

  render() {
    // console.log(this.state);

    let context = new AudioContext();

    function processData(data) {
      var source = context.createBufferSource(); // Create Sound Source
      context.decodeAudioData(data, function (buffer) {
        source.buffer = buffer;
        source.connect(this.context.destination);
        source.start(this.context.currentTime);
      });
    }

    function playTunes(path) {
      var request = new XMLHttpRequest();
      request.open(
        "GET",
        `http://localhost:5000/api/sounds/${encodeURIComponent(path)}`,
        true
      );
      request.responseType = "arraybuffer";

      request.onload = () => {
        var Data = request.response;
        processData(Data);
      };
      request.send();
    }

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
          <div className="sound" key={i}>
            {/* <img src="../assets/half-man.png" /> */}
            <p
              id={sound}
              key={i}
              onClick={() => {
                return playTunes(sound);
                // this.fetchSoundObject(sound);
              }}
            >
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

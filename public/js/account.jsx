"use strict";
class Account extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      token: window.localStorage.getItem("samplehousetoken"),
      user: {},
    };
  }
  unsubscribe = async () => {
    const creds = await fetch(`http://localhost:5000/api/paypal/creds`, {
      method: "GET",
      type: "cors",
      headers: {
        "Content-Type": "application/json",
      },
    }).then(async (res) => await res.json());
    // console.log(subscription_id, await getCreds());
    // subscription_id = "I-R5MYP1JUL3LC"; //! testing (use other subscriptions)

    fetch(
      `https://api-m.sandbox.paypal.com/v1/billing/subscriptions/${this.state.user.payPal_subscription_id}/cancel`,
      {
        method: "POST",
        type: "cors",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${creds}`,
        },
      }
    ).then(({ status }) => {
      if (status === 204) return (window.location = "success#unsubscribe");
      else return (window.location = "404#error");
    });
  };

  async componentDidMount() {
    const id = jwt_decode(this.state.token).subject;
    const user = await fetch(`http://localhost:5000/api/user/${id}`, {
      method: "GET",
      type: "cors",
      headers: {
        "Content-Type": "application/json",
        Authorization: this.state.token,
      },
    }).then(async (res) => {
      const user = await res.json();
      if (user.active_subscription)
        await fetch(
          `http://localhost:5000/api/product/plan/${user.currentPlanId}`,
          {
            method: "GET",
            type: "cors",
            headers: {
              "Content-Type": "application/json",
              Authorization: this.state.token,
            },
          }
        ).then(async (res) => {
          const plan = await res.json();
          return (user.plan_name = plan[0].name);
        });
      return user;
    });
    const downloads = await fetch(
      `http://localhost:5000/api/user/${id}/downloads`,
      {
        method: "GET",
        type: "cors",
        headers: {
          "Content-Type": "application/json",
          Authorization: this.state.token,
        },
      }
    ).then(async (res) => await res.json());
    downloads.push({
      id: 1,
      name: "SH_TropS_Instru_02_Am_105.wav",
      pack: "SH Tropical Storm",
      type: "loop",
      exclusive: 1,
      genre: "pop,tropical,tropical house",
      tempo: 105,
      duration: 9,
      key: "am",
      instrument_type: "marimba,vocal",
      tags: "pluck,trop,vocal chop,hats,hh",
      s3_uri:
        "s3://samplehouse/packs/SH Tropical Storm/SH_TropS_Instru_02_Am_105.wav",
      download_count: 0,
      date_added: null,
      date_modified: null,
      sound_id: 7,
      tag_id: 2,
      tag_name: "hats",
      instrument_id: 7,
      instrument_name: "vocal",
      genre_id: 1,
      genre_name: "pop",
    });
    user.downloads = downloads;
    this.setState({ ...this.state, user });
  }
  //todo finish component
  // todo can I just filter the user's downloaded sounds on the sounds page?
  render() {
    const {
      active_subscription,
      first_name,
      last_name,
      plan_name,
      balance,
      downloads,
    } = this.state.user;
    console.log(downloads);
    return (
      <div>
        <h1>Account</h1>
        <h3>
          Welcome {first_name} {last_name}
        </h3>
        {active_subscription ? (
          <p className="plan">You are subscribed to {plan_name}.</p>
        ) : (
          <p className="plan">
            You are not currently subscribed to a plan.{" "}
            <a href="subscriptions">Click here to view subscriptions.</a>
          </p>
        )}
        <p className="balance">Your balance is: {balance} credits.</p>
        <button id="cancel-btn" onClick={this.unsubscribe}>
          Cancel Subscription
        </button>
        <div className="downloads">
          {downloads && downloads.length ? (
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
          ) : (
            <h3>You have not purchased any sounds.</h3>
          )}
        </div>
      </div>
    );
  }
}

const domContainer = document.querySelector("#account");
ReactDOM.render(React.createElement(Account), domContainer);

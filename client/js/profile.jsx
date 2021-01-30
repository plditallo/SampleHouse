"use strict";

class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      token: window.localStorage.getItem("samplehousetoken"),
      user: {},
    };
  }
  componentDidMount() {
    const id = jwt_decode(this.state.token).subject;
    fetch(`http://localhost:5000/api/user/${id}`, {
      method: "GET",
      type: "cors",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(async (res) => await res.json())
      .then((user) => this.setState({ ...this.state, user }));
  }

  render() {
    return (
      <div>
        <button
          id="cancel-btn"
          onClick={() => unsubscribe(this.state.user.payPal_subscription_id)}
        >
          Cancel Subscription
        </button>
      </div>
    );
  }
}

const domContainer = document.querySelector("#profile");
ReactDOM.render(React.createElement(Profile), domContainer);

// todo change all sandbox.paypal
async function unsubscribe(subscription_id) {
  let creds = null;

  await fetch(`http://localhost:5000/api/paypal/creds`, {
    method: "GET",
    type: "cors",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then(async (res) => await res.json())
    .then((resp) => (creds = resp));

  console.log(subscription_id, creds);
  // this.state.user. = "I-94BT1KUWKGL1"; //! testing (use other subscriptions)

  fetch(
    `https://api-m.sandbox.paypal.com/v1/billing/subscriptions/${subscription_id}/cancel`,
    {
      method: "POST",
      type: "cors",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${creds}`,
      },
    }
  ).then(({ status }) => {
    if (status === 204) return (window.location.hash = "successful-cancel");
    // todo redirect to success.html#cancel
    //todo catch error just in case
    else return (window.location.hash = "error");
  });
}

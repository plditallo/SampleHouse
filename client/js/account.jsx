"use strict";
class Account extends React.Component {
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

const domContainer = document.querySelector("#account");
ReactDOM.render(React.createElement(Account), domContainer);

async function unsubscribe(subscription_id) {
  const creds = await fetch(`http://localhost:5000/api/paypal/creds`, {
    method: "GET",
    type: "cors",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then(async (res) => await res.json())
    .then((resp) => resp);
  // console.log(subscription_id, await getCreds());
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
    if (status === 204) return (window.location = "success.html#cancel");
    else return (window.location = "404.html#error");
  });
}

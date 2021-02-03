"use strict";
class Account extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      token: window.localStorage.getItem("samplehousetoken"),
      user: {},
    };
  }
  async unsubscribe() {
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
      if (status === 204) return (window.location = "success.html#unsubscribe");
      else return (window.location = "404.html#error");
    });
  }

  componentDidMount() {
    const id = jwt_decode(this.state.token).subject;
    fetch(`http://localhost:5000/api/user/${id}`, {
      method: "GET",
      type: "cors",
      headers: {
        "Content-Type": "application/json",
      },
    }).then(async (res) =>
      this.setState({ ...this.state, user: await res.json() })
    );
  }
  //todo finish component
  render() {
    return (
      <div>
        <button id="cancel-btn" onClick={this.unsubscribe}>
          Cancel Subscription
        </button>
      </div>
    );
  }
}

const domContainer = document.querySelector("#account");
ReactDOM.render(React.createElement(Account), domContainer);

"use strict";
// todo how to navigate here?
// todo download sounds w/o charging credits
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
      if (status === 204) return (window.location = "success.html#unsubscribe");
      else return (window.location = "404.html#error");
    });
  };

  componentDidMount() {
    const id = jwt_decode(this.state.token).subject;
    fetch(`http://localhost:5000/api/user/${id}`, {
      method: "GET",
      type: "cors",
      headers: {
        "Content-Type": "application/json",
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
      this.setState({ ...this.state, user });
    });
  }
  //todo finish component
  render() {
    const {
      active_subscription,
      first_name,
      last_name,
      plan_name,
      balance,
    } = this.state.user;
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
            You are not subscribed to a plan.{" "}
            <a href="subscriptions.html">Click here to view subscriptions.</a>
          </p>
        )}
        <p className="balance">Your balance is: {balance} credits.</p>
        <button id="cancel-btn" onClick={this.unsubscribe}>
          Cancel Subscription
        </button>
      </div>
    );
  }
}

const domContainer = document.querySelector("#account");
ReactDOM.render(React.createElement(Account), domContainer);

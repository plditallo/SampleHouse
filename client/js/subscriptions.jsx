"use strict";

// todo setup subscription upgrade/downgrade
class Subscriptions extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      plan_name: "",
      payPal_id: "",
      user: {},
      userCurrentPlan: "",
      token: window.localStorage.getItem("samplehousetoken"),
    };
  }

  selectSubscription = (cardIndex, plan_name, payPal_id) => {
    if (plan_name !== this.state.plan_name) {
      this.setState({
        ...this.state,
        payPal_id,
        plan_name,
      });
      const cards = document.querySelectorAll(".card");
      cards.forEach((e) => (e.style.border = "1px solid #c3c1c1"));
      cards[cardIndex].style.border = "3px solid #c3c1c1";
      // select current plan
      if (this.state.user.plan_id)
        document.querySelectorAll(".card")[
          this.state.user.plan_id - 1
        ].style.border = "2px solid lime";
    }
  };

  async componentDidMount() {
    const id = jwt_decode(this.state.token).subject;
    let user;
    await fetch(`http://localhost:5000/api/user/${id}`, {
      method: "GET",
      type: "cors",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(async (res) => await res.json())
      .then((resp) => (user = resp));

    await fetch("http://localhost:5000/api/plan", {
      method: "GET",
      type: "cors",
      headers: {
        "Content-Type": "application/json",
        authorization: this.state.token,
      },
    })
      .then(async (res) => await res.json())
      .then((resp) => {
        const data = [];
        let userCurrentPlan = "";
        // console.log("id", user);
        resp.forEach((e) => {
          if (user.plan_id && e.id == user.plan_id) userCurrentPlan = e;
          return data.push(e);
        });
        this.setState({
          ...this.state,
          data,
          user,
          plan_name: data[0].name,
          payPal_id: data[0].payPal_id,
          userCurrentPlan,
        });
      })
      .then(() => {
        document.querySelector(".card").style.border = "3px solid #c3c1c1";
        if (this.state.user.plan_id)
          document.querySelectorAll(".card")[user.plan_id - 1].style.border =
            "3px solid lime";
      });
  }

  componentDidUpdate() {
    const { user, payPal_id, plan_name } = this.state;
    if (!user.active_subscription) {
      const payPalBtnContainer = document.querySelector(
        "#paypal-button-container"
      );
      if (payPalBtnContainer) payPalBtnContainer.innerHTML = "";
      createPayPalButtons(payPal_id, plan_name, user.id);
    }
  }

  render() {
    const { userCurrentPlan, payPal_id } = this.state;
    const { active_subscription, payPal_subscription_id } = this.state.user;
    // console.log(this.state.user);

    return (
      <div>
        {active_subscription ? (
          <h3>Your current subscription plan is: {userCurrentPlan.plan}</h3>
        ) : null}
        <div id="subscription-cards">
          {this.state.data.map(
            ({ name, credits, price, discount, included, payPal_id }, i) => (
              <div
                className="card"
                key={i}
                onClick={() => this.selectSubscription(i, name, payPal_id)}
              >
                {i > 0 ? (
                  <span className="discount">Save {discount}%</span>
                ) : null}
                <h2>{name}</h2>
                <div className="info">
                  <p className="download">
                    MONTHLY
                    <br />
                    SAMPLEHOUSE
                    <br />
                    DOWNLOAD CREDITS
                  </p>
                  <p className="credits">{credits} Credits</p>
                  <p className="price">${price}</p>
                  <span>per month</span>
                  <p className="included">INCLUDED IN PACKAGE</p>
                  <ul>
                    {included.split(",").map((e, i) => (
                      <li key={i}>{e}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )
          )}
        </div>
        {!active_subscription ? (
          <div className="payment">
            <h3>Choose Your Payment Type</h3>
            <div id="paypal-button-container"></div>
          </div>
        ) : (
          <button
            onClick={() => {
              console.log(userCurrentPlan.id == this.state.user.plan_id);
              updateSubscription(payPal_subscription_id, payPal_id);
            }}
          >
            Update Subscription
          </button>
        )}
      </div>
    );
  }
}

const domContainer = document.querySelector("#subscriptions");
ReactDOM.render(React.createElement(Subscriptions), domContainer);

function createPayPalButtons(plan_id, plan_name, user_id) {
  // console.log(plan_id, plan_name);
  paypal
    .Buttons({
      createSubscription: function (data, actions) {
        return actions.subscription.create({
          plan_id,
        });
      },
      onApprove: function (data, actions) {
        console.log("onApprove", data);
        const { subscriptionID } = data;
        fetch(`http://localhost:5000/api/paypal/subscribe`, {
          method: "POST",
          type: "cors",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id,
            subscriptionID,
          }),
        })
          // .then(async (res) => await res.json())
          .then(() => (window.location = "success.html#subscribe"));
      },
      onCancel: function (data) {
        console.log("onCancel", data);
        // Show a cancel page, or return to cart
        alert(`You have canceled the subscription to ${plan_name}`);
        // todo redirect to somewhere on cancel
        window.location.hash = "cancel"; //404.html#error-cancel
      },
    })
    .render("#paypal-button-container");
}

async function updateSubscription(userPayPalId, planId) {
  const creds = await fetch(`http://localhost:5000/api/paypal/creds`, {
    method: "GET",
    type: "cors",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then(async (res) => await res.json())
    .then((resp) => resp);

  console.log({ creds, userPayPalId, planId });
  // console.log(subscription_id, await getCreds());
  // this.state.user. = "I-94BT1KUWKGL1"; //! testing (use other subscriptions)

  // fetch(
  //   `https://api-m.sandbox.paypal.com/v1/billing/subscriptions/${subscription_id}/cancel`,
  //   {
  //     method: "POST",
  //     type: "cors",
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: `Bearer ${creds}`,
  //     },
  //   }
  // ).then(({ status }) => {
  //   if (status === 204) return (window.location = "success.html#cancel");
  //   else return (window.location = "404.html#error");
  // });
  // only update if selected card is different than current subscription
  //   fetch(`http://localhost:5000/api/paypal/subscribe`, {
  //     method: "POST",
  //     type: "cors",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({
  //       user_id,
  //       subscriptionID,
  //     }),
  //   })
  //     // .then(async (res) => await res.json())
  //     .then(() => (window.location = "success.html#subscribe"));
}

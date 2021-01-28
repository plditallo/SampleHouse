"use strict";

// todo setup subscription upgrade/downgrade
class Subscriptions extends React.Component {
  constructor(props) {
    super(props);
    // todo get data from database
    this.state = {
      data: [],
      plan_name: "",
      payPal_id: "",
      user: {},
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
    }
  };

  componentDidMount() {
    //todo don't allow payment method if already have a subscription
    // <script src="../js/utils/jwt-decode.js"></script>;
    // <script src="../js/utils/jwt-verify.js"></script>;
    const token = window.localStorage.getItem("samplehousetoken");
    let user;
    if (token) {
      user = jwt_decode(token);
    }
    fetch("http://localhost:5000/api/plan", {
      method: "GET",
      type: "cors",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(async (res) => await res.json())
      .then((resp) => {
        const data = [];
        resp.forEach((e) => data.push(e));
        this.setState({
          ...this.state,
          data,
          user,
          plan_name: data[0].name,
          payPal_id: data[0].payPal_id,
        });
      })
      .then(() => {
        document.querySelector(".card").style.border = "3px solid #c3c1c1";
        console.log(this.state.data[0]);

        // document.querySelector("#paypal-button-container").innerHTML = "";
        // createPayPalButtons(this.state.payPal_id, this.state.plan_name);
      });
  }

  componentDidUpdate() {
    //! testing change to !this.
    if (this.state.user.active_subscription) {
      const payPalBtnContainer = document.querySelector(
        "#paypal-button-container"
      );
      if (payPalBtnContainer) payPalBtnContainer.innerHTML = "";
      createPayPalButtons(
        this.state.payPal_id,
        this.state.plan_name,
        this.state.user
      );
    }
  }

  render() {
    const { active_subscription } = this.state.user;
    return (
      <div>
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
            // todo change link in headers to go to home/index based on loggin
          )}
        </div>
        {active_subscription ? ( //!testing change to !active_subscription
          <div className="payment">
            <h3>Choose Your Payment Type</h3>
            <div id="paypal-button-container"></div>
          </div>
        ) : (
          <div>Upgrade Subscription</div>
        )}
      </div>
    );
  }
}

const domContainer = document.querySelector("#subscriptions");
ReactDOM.render(React.createElement(Subscriptions), domContainer);

function createPayPalButtons(plan_id, plan_name, user) {
  paypal
    .Buttons({
      createSubscription: function (data, actions) {
        return actions.subscription.create({
          plan_id,
        });
      },
      onApprove: function (data, actions) {
        // todo purchase router here
        // todo redirect to somewhere on success
        //todo update database with updated subscription and listen for any unsubscribes
        // todo IPN https://developer.paypal.com/docs/api-basics/notifications/ipn/
        // fetch(`http://localhost:5000/api/purchase/subscribe/${plan_name}`, {
        //   method: "GET",
        //   type: "cors",
        //   headers: {
        //     "Content-Type": "application/json",
        //     Authorization: window.localStorage.getItem("samplehousetoken"),
        //   },
        // })
        //   .then(async (res) => await res.json())
        //   .then((resp) => alert(resp.msg));
        console.log("onApprove paypal Btns");
        window.location.hash = "success"; // home.html
      },
      onCancel: function (data) {
        // Show a cancel page, or return to cart
        alert(`You have canceled the subscription to ${plan_name}`);
        // todo redirect to somewhere on cancel
        window.location.hash = "cancel";
      },
    })
    .render("#paypal-button-container");
}

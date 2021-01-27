"use strict";

// todo setup subscription upgrade/downgrade
class Subscriptions extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [
        {
          name: "Basic",
          credits: 100,
          price: 5.99,
          included: [
            "Samples (one shots)",
            "Loops",
            "MIDI Files",
            "Private Discord",
          ],
          // todo change payPal_id to live ID
          payPal_id: "P-5NY36749SE7475025MAIOEJI",
          // todo change stipe_id to live ID
          stripe_id: "price_1I48QkBPBM0JAFXGWczaXWy5",
        },
        {
          name: "Standard",
          credits: 250,
          price: 10.99,
          discount: 15, //todo find discount
          included: [
            "VST Access",
            "Instructional Videos",
            "Samples (one shots)",
            "Loops",
            "Exclusive Loops",
            "MIDI Files",
            "Private Discord",
          ],
          payPal_id: "P-03Y07993KV0411933MAIOETA",
          stripe_id: "price_1I48RIBPBM0JAFXGmk4lEPOD",
        },
        {
          name: "Studio",
          credits: 500,
          price: 19.99,
          discount: 20, //todo find discount
          included: [
            "VST Access",
            "Instructional Videos",
            "Samples (one shots)",
            "Loops",
            "Exclusive Loops",
            "MIDI Files",
            "Private Discord",
          ],
          payPal_id: "P-1V678195DT9234000MAIOEYA",
          stripe_id: "price_1I48RvBPBM0JAFXG5XSFHyq6",
        },
      ],
      plan_name: "Basic",
      payPalPlanId: "P-5NY36749SE7475025MAIOEJI", //todo change this to Basic for init plan_id,
      stripe_id: "price_1I48QkBPBM0JAFXGWczaXWy5",
    };
  }

  selectSubscription = (cardIndex, payPalId, plan_name) => {
    if (payPalId !== this.state.payPalPlanId) {
      this.setState({
        ...this.state,
        payPalPlanId: payPalId,
        plan_name,
        stripe_id,
      });
      const cards = document.querySelectorAll(".card");
      cards.forEach((e) => (e.style.border = "1px solid #c3c1c1"));
      cards[cardIndex].style.border = "3px solid #c3c1c1";
    }
  };

  componentDidUpdate() {
    document.querySelector("#paypal-button-container").innerHTML = "";
    createPayPalButtons(this.state.payPalPlanId, this.state.plan_name);
  }
  componentDidMount() {
    document.querySelector(".card").style.border = "3px solid #c3c1c1";
    createPayPalButtons(this.state.payPalPlanId, this.state.plan_name);
  }

  render() {
    return (
      <div>
        <div id="subscription-cards">
          {this.state.data.map(
            ({ name, credits, price, discount, included, payPal_id }, i) => (
              <div
                className="card"
                key={i}
                onClick={() => this.selectSubscription(i, payPal_id, name)}
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
                    {included.map((e, i) => (
                      <li key={i}>{e}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )
          )}
        </div>
        <div className="payment">
          <h3>Choose Your Payment Type</h3>
          <div>
            <div id="paypal-button-container"></div>
            <img
              src="../assets/stripe_logo.png"
              alt="Stripe Logo"
              className="stripe-logo"
            />
          </div>
        </div>
      </div>
    );
  }
}

const domContainer = document.querySelector("#subscriptions");
ReactDOM.render(React.createElement(Subscriptions), domContainer);

function createPayPalButtons(plan_id, plan_name) {
  paypal
    .Buttons({
      createSubscription: function (data, actions) {
        return actions.subscription.create({
          plan_id,
        });
      },

      onApprove: function (data, actions) {
        alert(`You have successfully subscribed to the ${plan_name} plan.`);
        // todo redirect to somewhere on success
        //todo how to update database with updated subscription??
        window.location.hash = "success";
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

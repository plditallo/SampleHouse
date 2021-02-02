"use strict";

class Offers extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      user: {},
      token: window.localStorage.getItem("samplehousetoken"),
    };
  }

  selectOffer = (index, name, payPal_id) => {
    console.log("select", { index, name, payPal_id });
    // if (plan_name !== this.state.plan_name) {
    //   this.setState({
    //     ...this.state,
    //     payPal_id,
    //     plan_name,
    //   });
    //   const cards = document.querySelectorAll(".card");
    //   cards.forEach((e) => (e.style.border = "1px solid #c3c1c1"));
    //   cards[cardIndex].style.border = "3px solid #c3c1c1";
    //   // select current plan
    //   if (this.state.user.currentPlanId)
    //     document.querySelectorAll(".card")[
    //       this.state.user.currentPlanId - 1
    //     ].style.border = "2px solid lime";
    // }
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
    }).then(async (res) => (user = await res.json()));

    await fetch("http://localhost:5000/api/product/offers", {
      method: "GET",
      type: "cors",
      headers: {
        "Content-Type": "application/json",
        authorization: this.state.token,
      },
    }).then(async (res) => {
      res = await res.json();
      const data = [];
      res.forEach((e) => data.push(e));
      this.setState({
        ...this.state,
        data,
        user,
      });
    });
  }

  // componentDidUpdate() {
  //   const { user, payPal_id, plan_name } = this.state;
  //   if (!user.active_subscription) {
  //     const payPalBtnContainer = document.querySelector(
  //       "#paypal-button-container"
  //     );
  //     if (payPalBtnContainer) payPalBtnContainer.innerHTML = "";
  //     createPayPalButtons(payPal_id, plan_name, user.id);
  //   }
  // }

  render() {
    console.log(this.state);
    return (
      <div>
        <div id="offer-cards">
          {this.state.data.map(
            ({ name, credits, price, discount, payPal_id }, i) => (
              <div
                className="card"
                key={i}
                onClick={() => this.selectOffer(i, name, payPal_id)}
              >
                {i > 0 ? (
                  <span className="discount">Save {discount}%</span>
                ) : null}
                <h2>{name}</h2>
                <div className="info">
                  <p className="download">
                    SAMPLEHOUSE
                    <br />
                    DOWNLOAD CREDITS
                  </p>
                  <p className="credits">{credits} Credits</p>
                  <p className="price">${price}</p>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    );
  }
}

const domContainer = document.querySelector("#offers");
ReactDOM.render(React.createElement(Offers), domContainer);

"use strict";

class Subscriptions extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [
        {
          title: "Basic",
          credits: 100,
          price: 5.99,
          included: [
            "Samples (one shots)",
            "Loops",
            "MIDI Files",
            "Private Discord",
          ],
        },
        {
          title: "Standard",
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
        },
        {
          title: "Studio",
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
        },
      ],
    };
  }

  render() {
    return this.state.data.map(
      ({ title, credits, price, discount, included }, i) => (
        <div className="card" key={i}>
          {i > 0 ? <span className="discount">Save {discount}%</span> : null}
          <h2>{title}</h2>
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
    );
  }
}

const domContainer = document.querySelector("#subscription-cards");
ReactDOM.render(React.createElement(Subscriptions), domContainer);

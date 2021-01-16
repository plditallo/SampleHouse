"use strict";

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    if (this.state.liked) {
      return "You liked this.";
    }
    return (
      <div>
        <a href="index.html">
          <div className="logo">
            <img
              src="../assets/sample_house_logo.png"
              alt="sample.House Logo"
            />
            <h1>SampleHouse</h1>
          </div>
        </a>
        <div className="right">
          <div className="top-actions">
            <a className="email" href="mailto:support@sample.house">
              <img src="../assets/envelope-square.png" alt="Square Envelope" />
              support@sample.house
            </a>
            <div className="buttons">
              <a href="authentication.html">LOGIN</a>
              <a href="authentication.html">SIGN UP</a>
            </div>
          </div>

          <nav>
            <ul>
              <li>
                <a href="index.html">HOME</a>
              </li>
              <li>
                <a href="index.html#about">ABOUT</a>
              </li>
              <li>
                <a href="index.html#products">PRODUCTS</a>
              </li>
              <li>
                <a href="index.html#pricing">PRICING</a>
              </li>
              <li>
                <a href="index.html#faq">FAQ's</a>
              </li>
              <li>
                <a href="contact.html">CONTACT</a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    );
  }
}

const domContainer = document.querySelector("#header");
ReactDOM.render(React.createElement(Header), domContainer);

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
        <div className="logo">
          <img src="../assets/sample_house_logo.png" alt="sample.House Logo" />
          <h1>SampleHouse</h1>
        </div>
        <div className="right">
          <div className="top-actions">
            <a className="email" href="mailto:support@sample.house">
              <img src="../assets/envelope-square.png" alt="Square Envelope" />
              support@sample.house
            </a>
            <div className="buttons">
              <a href="login.html">LOGIN</a>
              <a href="register.html">SIGN UP</a>
            </div>
          </div>

          <nav>
            <ul>
              <li>
                <a href="index.html">HOME</a>
              </li>
              <li>
                <a href="#about">ABOUT</a>
              </li>
              <li>
                <a href="#products">PRODUCTS</a>
              </li>
              <li>
                <a href="#pricing">PRICING</a>
              </li>
              <li>
                <a href="#faq">FAQ's</a>
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

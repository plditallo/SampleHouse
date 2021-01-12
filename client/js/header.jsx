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
          <h1>Sample House</h1>
        </div>
        <div className="right">
          <div className="top-actions">
            <a className="email">
              {/* //todo change to icon? */}
              <img src="../assets/envelope-square.png" alt="" />
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
                <a href="#Home">HOME</a>
              </li>
              <li>
                <a href="#About">ABOUT</a>
              </li>
              <li>
                <a href="#Products">PRODUCTS</a>
              </li>
              <li>
                <a href="#Pricing">PRICING</a>
              </li>
              <li>
                <a href="#FAQ">FAQ's</a>
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

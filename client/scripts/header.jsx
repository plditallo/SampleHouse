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
        <div>
          <img src="../assets/logo.png" alt="sample.House Logo" />
          <h5>Sample House</h5>
        </div>

        <div>
          <a>
            {/* //todo change to icon? */}
            <img src="../assets/envelope-square.png" alt="" />
            support@sample.house
          </a>
          <div>
            <a href="#login.html">Login</a>
            <a href="#register.html">Sign Up</a>
          </div>
        </div>

        <nav>
          <ul>
            <li>
              <a href="#Home">Home</a>
            </li>
            <li>
              <a href="#About">About</a>
            </li>
            <li>
              <a href="#Products">Products</a>
            </li>
            <li>
              <a href="#Pricing">Pricing</a>
            </li>
            <li>
              <a href="#FAQ">FAQ's</a>
            </li>
            <li>
              <a href="#Contact">Contact</a>
            </li>
          </ul>
        </nav>
      </div>
    );
  }
}

const domContainer = document.querySelector("#header");
ReactDOM.render(React.createElement(Header), domContainer);

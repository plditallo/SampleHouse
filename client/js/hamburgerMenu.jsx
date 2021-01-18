"use strict";

class HamburgerMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
    };
  }

  render() {
    const menu = document.querySelector("#menu");
    const links = document.querySelectorAll("#menu a");

    //* On click of link, close navigation
    if (links.length && !links[0].onclick)
      links.forEach((l) => (l.onclick = () => this.setState({ open: false })));

    if (this.state.open) menu.style.display = "block";
    else if (!this.state.open && menu) menu.style.display = "none";

    // document.addEventListener("click");
    return (
      <div className="menu-wrapper">
        <div id="menuToggle">
          {/* <!--
    A fake / hidden checkbox is used as click reciever,
    so you can use the :checked selector on it.
    --> */}

          <input
            type="checkbox"
            onClick={() => this.setState({ open: !this.state.open })}
          />
          {/* Spans act as a hamburger */}
          <span className="hamburger-span" />
          <span className="hamburger-span" />
          <span className="hamburger-span" />

          <ul id="menu">
            <li>
              <a href="index.html#">HOME</a>
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
        </div>
        <div className="right">
          <div className="actions">
            <a href="authentication.html#">LOGIN</a>
            <a href="authentication.html#">SIGN UP</a>
          </div>
          <a href="index.html#">
            <img src="../assets/sample_house_logo.png" alt="SampleHouse Logo" />
          </a>
        </div>
      </div>
    );
  }
}

const domContainer = document.querySelector("#hamburger-menu");
ReactDOM.render(React.createElement(HamburgerMenu), domContainer);

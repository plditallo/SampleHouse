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
    const spans = document.querySelectorAll(".hamburger-span");
    console.log(spans);
    if (this.state.open) {
      menu.style.display = "block";
      // console.log(spans[1].style.display);
      // spans.forEach((e) => (e.style.display = "none"));
    } else if (!this.state.open && menu) {
      menu.style.display = "none";
      // spans.forEach((e) => (e.style.display = "block"));
    }
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
        </div>
        <div className="right">
          <div className="actions">
            <a href="authentication.html">LOGIN</a>
            <a href="authentication.html">SIGN UP</a>
          </div>
          <img src="../assets/sample_house_logo.png" alt="SampleHouse Logo" />
        </div>
      </div>
    );
  }
}

const domContainer = document.querySelector("#hamburger-menu");
ReactDOM.render(React.createElement(HamburgerMenu), domContainer);

// const observer = new IntersectionObserver(
//   (entries) => {
//     const nav = document.querySelector("#sticky-nav").style;
//     // isIntersecting is true when element and viewport are overlapping
//     // isIntersecting is false when element and viewport don't overlap
//     if (entries[0].isIntersecting === false) nav.display = "block";
//     else nav.display = "none";
//   },
//   { threshold: [0] }
// );

// observer.observe(document.querySelector("#header"));

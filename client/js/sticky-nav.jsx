"use strict";

class StickyNav extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <ul>
        <a href="index.html">
          <img src="../assets/sample_house_logo.png" alt="SoundHouse Logo" />
        </a>
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
        {/* <li> */}
        {/* <a href="contact.html" style={{}}>LOGIN / REGISTER</a> */}
        {/* </li> */}
      </ul>
    );
  }
}

const domContainer = document.querySelector("#sticky-nav");
ReactDOM.render(React.createElement(StickyNav), domContainer);

const observer = new IntersectionObserver(
  (entries) => {
    const nav = document.querySelector("#sticky-nav").style;
    // isIntersecting is true when element and viewport are overlapping
    // isIntersecting is false when element and viewport don't overlap
    if (entries[0].isIntersecting === false) nav.display = "block";
    else nav.display = "none";
  },
  { threshold: [0] }
);

observer.observe(document.querySelector("#header"));

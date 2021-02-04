"use strict";

class HamburgerMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      loggedIn: false,
    };
  }
  componentDidMount() {
    const token = window.localStorage.getItem("samplehousetoken");
    if (token && jwt_verify(jwt_decode(token)))
      this.setState({ loggedIn: true });
  }

  render() {
    const { loggedIn } = this.state;

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

          {!loggedIn ? (
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
          ) : (
            <ul id="menu">
              <li>
                <a href="home.html#">SOUNDS</a>
              </li>
              <li>
                <a href="#PLUGINS">PLUGINS</a>
                {/* download link for VST IMG w/ Title, Desc w/ download button*/}
              </li>
              <li>
                <a href="#SAMPLEPACKS">SAMPLEPACKS</a>
                {/* grid out with pack's img and title --> packs page */}
              </li>
              <li>
                <a href="#VIDEOS">VIDEOS</a>
                {/* grid out video w/ img and title */}
                {/* tier 2+ only, w/ upgrade btn  and go back btn-->  */}
                {/* youtube private channel link */}
              </li>
              <li>
                <a href="https://discord.gg/GwTBeZjb" target="_blank">
                  DISCORD
                </a>
              </li>
              <li>
                <a href="contact.html">CONTACT</a>
              </li>
            </ul>
          )}
        </div>
        <div className="right">
          {!loggedIn ? (
            <div className="actions">
              <a href="authentication.html#">LOGIN</a>
              <a href="authentication.html#">SIGN UP</a>
            </div>
          ) : (
            <div className="actions">
              <a href="account.html" className="profile-btn"></a>
              <a
                href="index.html"
                onClick={() =>
                  window.localStorage.removeItem("samplehousetoken")
                }
              >
                LOGOUT
              </a>
            </div>
          )}
          <a href={!loggedIn ? "index.html#" : "home.html#"}>
            <img src="../assets/sample_house_logo.png" alt="SampleHouse Logo" />
          </a>
        </div>
      </div>
    );
  }
}

const domContainer = document.querySelector("#hamburger-menu");
ReactDOM.render(React.createElement(HamburgerMenu), domContainer);

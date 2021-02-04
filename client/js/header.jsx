"use strict";
class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false,
    };
  }
  componentDidMount() {
    const token = window.localStorage.getItem("samplehousetoken");
    if (token && jwt_verify(jwt_decode(token)))
      this.setState({ loggedIn: true });
  }

  render() {
    // console.log(this.state.loggedIn);
    const { loggedIn } = this.state;
    return (
      <div>
        <a href={!loggedIn ? "index.html#" : "home.html#"}>
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
            {!loggedIn ? (
              <div className="buttons">
                <a href="authentication.html#" className="login-btn">
                  LOGIN
                </a>
                <a href="authentication.html#">SIGN UP</a>
              </div>
            ) : (
              <div className="buttons">
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
          </div>
          <nav>
            {!loggedIn ? (
              <ul>
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
              <ul>
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
                  <a href="#DISCORD">DISCORD</a>
                </li>
                <li>
                  <a href="contact.html">CONTACT</a>
                </li>
              </ul>
            )}
          </nav>
        </div>
      </div>
    );
  }
}

const domContainer = document.querySelector("#header");
ReactDOM.render(React.createElement(Header), domContainer);

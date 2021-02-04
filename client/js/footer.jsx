"use strict";

class Footer extends React.Component {
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
    const { loggedIn } = this.state;
    return (
      <div>
        <div className="top">
          <a href={!loggedIn ? "index.html#" : "home.html#"}>
            <div className="logo">
              <img
                src="../assets/sample_house_logo.png"
                alt="Sample.House Logo"
              />
              <h1>SampleHouse</h1>
            </div>
          </a>
          <div className="right">
            <p>
              Contact us through our
              <a href="contact.html">CONTACT FORM</a>
              or E-mail at:
              <a href="mailto:support@sample.house">support@sample.house.</a>
            </p>
            <div className="sm">
              <a href="https://www.youtube.com/c/SampleHouse" target="_blank">
                <img src="../assets/youtube_icon.png" alt="Youtube Icon" />
              </a>
              <a href="https://twitter.com/Sample_House" target="_blank">
                <img src="../assets/twitter_icon.png" alt="Twitter Icon" />
              </a>
              <a
                href="https://www.facebook.com/SampleHouseOfficial"
                target="_blank"
              >
                <img src="../assets/facebook_icon.png" alt="Facebook Icon" />
              </a>
            </div>
          </div>
        </div>
        <div className="bottom">
          <a
            href="https://www.bluesmokedigitalandprintedmedia.com"
            target="_blank"
          >
            <p>
              Organic SEO, Web Design and Development by Blue Smoke Digital and
              Printed Media
            </p>
          </a>
          <a
            href="https://www.bluesmokedigitalandprintedmedia.com"
            style={{ margin: "auto" }}
          >
            <img
              src="../assets/blue_smoke_media_graphic_link.png"
              alt="Blue Smoke Logo"
            />
          </a>
          <p>© Copyright 2021 SampleHouse</p>
        </div>
      </div>
    );
  }
}

const domContainer = document.querySelector("#footer");
ReactDOM.render(React.createElement(Footer), domContainer);

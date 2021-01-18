"use strict";

class Footer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div>
        <div className="top">
          <a href="index.html">
            <div className="logo">
              <img
                src="../assets/sample_house_logo.png"
                alt="Sample.House Logo"
              />
              <h1>SampleHouse</h1>
            </div>
          </a>
          <div className="right">
            //todo change all email to E-mail
            <p>
              Contact us through our
              <a href="contact.html">CONTACT FORM</a>
              or Email at:
              <a href="mailto:support@sample.house">support@sample.house.</a>
            </p>
            {/* //todo links */}
            <div className="sm">
              <a href="#youtubeLink">
                <img src="../assets/youtube_icon.png" alt="Youtube Icon" />
              </a>
              <a href="#twitterLink">
                <img src="../assets/twitter_icon.png" alt="Twitter Icon" />
              </a>
              <a href="#FacebookLink">
                <img src="../assets/facebook_icon.png" alt="Facebook Icon" />
              </a>
            </div>
          </div>
        </div>
        <div className="bottom">
          <a href="https://www.bluesmokedigitalandprintedmedia.com">
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
          {/* todo sample.house? legal branding */}
          <p>© Copyright 2021 SampleHouse</p>
        </div>
      </div>
    );
  }
}

const domContainer = document.querySelector("#footer");
ReactDOM.render(React.createElement(Footer), domContainer);

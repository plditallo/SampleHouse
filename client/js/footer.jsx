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
          <div className="logo">
            <img
              src="../assets/sample_house_logo.png"
              alt="Sample.House Logo"
            />
            <h1>SampleHouse</h1>
          </div>
          <div className="right">
            <p>
              If you should need to contact us, please do so by filling out our
              <a href="#contact"> CONTACT FORM </a>
              or by dropping us an E-mail at:
              <a href="mailto:support@sample.house"> support@sample.house</a>.
            </p>
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
          <p>
            Organic SEO, Web Design and Development by Blue Smoke Digital and
            Printed Media
          </p>
          <img
            src="../assets/blue_smoke_media_graphic_link.png"
            alt="Blue Smoke Logo"
          />
          {/* todo sample.house? legal branding */}
          <p>© Copyright 2021 SampleHouse</p>
        </div>
      </div>
    );
  }
}

const domContainer = document.querySelector("#footer");
ReactDOM.render(React.createElement(Footer), domContainer);

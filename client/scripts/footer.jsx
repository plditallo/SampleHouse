"use strict";

class Footer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      clicked: false,
    };
  }

  render() {
    return (
      <div>
        <div>
          <img
            src="../assets/logo.png"
            alt="sample.House Logo"
            style={{ width: "2em", height: "2em" }}
          />
          <h5>Sample House</h5>
        </div>
        <div>
          <p>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Saepe amet{" "}
            <a href="#contact">Contact Form</a>
            explicabo iste delectus aliquam obcaecati dolorem.{" "}
            <a href="mailto:support@sample.house">support@sample.house</a>
          </p>
          <div>
            <a href="#youtubeLink">YouTube</a>
            <a href="#twitterLink">twitter</a>
            <a href="#FacebookLink">Facebook</a>
          </div>
        </div>
        <p>
          Organic SEO, Web Design and Development by Blue Smoke Digital and
          Printed Media
        </p>
        <img src="../assets/logo.png" alt="Blue Smoke Logo" />
        <p>© Copyright 2021 Sample House</p>
      </div>
    );
  }
}

const domContainer = document.querySelector("#footer");
ReactDOM.render(React.createElement(Footer), domContainer);

"use strict";

class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      logEmail: "",
      logPassword: "",
      errorMsg: null,
      resendSuccessMsg: null,
      verified: true,
      validEmail: true,
    };
  }
  verifyEmail = () => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (re.test(this.state.logEmail.toLowerCase())) return true;
    this.setState({
      ...this.state,
      errorMsg: "Please enter a valid Email address.",
      verified: true,
    });
    return false;
  };

  onSubmitHandler = (evt) => {
    evt.preventDefault();
    this.setState({ ...this.state, resendSuccessMsg: null });
    if (!this.verifyEmail()) return;

    const submitFetch = async () =>
      //todo change url
      await fetch("http://localhost:5000/api/user/login", {
        method: "POST",
        type: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: this.state.logEmail,
          password: this.state.logPassword,
        }),
      });

    submitFetch()
      .then(async (res) => ({ status: res.status, data: await res.json() }))
      .then(({ status, data }) => {
        // console.log(status, data);
        this.setState({ ...this.state, verified: true });
        if (status === 401) this.setState({ ...this.state, verified: false });
        if (status !== 200)
          this.setState({ ...this.state, errorMsg: data.msg });
        else {
          console.log(data);
          //todo catch token and save somewhere (for continuous login)(keychain?? (and pc))
          window.location.href = "home.html";
        }
      });
  };

  resendVerification = (evt) => {
    evt.preventDefault();
    const regSuccess = document.querySelector(".success");
    // console.log(regSuccess);
    if (regSuccess) regSuccess.style.display = "none";
    if (!this.verifyEmail()) return;
    // todo add response to hash and do same as register to display message
    const submitFetch = async () =>
      //todo change url
      await fetch("http://localhost:5000/api/token/resend", {
        method: "POST",
        type: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: this.state.logEmail,
        }),
      }).then(async (res) => ({ status: res.status, data: await res.json() }));
    // todo can't see response, reloading page
    submitFetch().then(({ status, data }) => {
      console.log(status, data.msg);
      if (status !== 200)
        return this.setState({ ...this.state, errorMsg: data.msg });
      // this.setState({
      //   ...this.state,
      //   errorMsg: null,
      // });
      window.location.hash = `resend=${this.state.logEmail}`;
    });
  };

  onChangeHandler = (evt) => {
    this.setState({
      ...this.state,
      [evt.target.name]: evt.target.value,
    });
  };

  componentDidMount() {
    if (window.location.hash) {
      if (window.location.hash.includes("#email")) {
        const emailHash = window.location.hash.replace("#email=", "");
        this.setState({ ...this.state, logEmail: emailHash });
      } else if (window.location.hash.includes("#resend")) {
        const resendHash = window.location.hash.replace("#resend=", "");
        // console.log(resendHash);
        this.setState({
          ...this.state,
          resendSuccessMsg: `A confirmation email has been sent to ${resendHash}.`,
          logEmail: resendHash,
        });
      }
      window.location.hash = "#";
    }
  }

  render() {
    return (
      <form name="loginForm" id="loginForm" onSubmit={this.onSubmitHandler}>
        <div className="errors">
          <p className="error">
            {this.state.errorMsg}{" "}
            {!this.state.verified ? (
              <span onClick={this.resendVerification}>
                Click here to resend confirmation email.
              </span>
            ) : null}
          </p>
        </div>
        <p
          className="success"
          style={{ display: this.state.resendSuccessMsg ? "block" : "none" }}
        >
          {this.state.resendSuccessMsg}
        </p>
        <label htmlFor="logEmail">Email Address</label>
        <input
          type="text"
          name="logEmail"
          onChange={this.onChangeHandler}
          value={this.state.logEmail}
        />
        <label htmlFor="logPassword">Password</label>
        <input
          type="password"
          name="logPassword"
          onChange={this.onChangeHandler}
          value={this.state.logPassword}
        />
        <a href="forgot-password.html">Forgot Password?</a>
        <button type="submit">
          <img src="../assets/lock.png" alt="lock"></img>SIGN IN
        </button>
      </form>
    );
  }
}

const domContainer = document.querySelector("#login");
ReactDOM.render(React.createElement(LoginForm), domContainer);

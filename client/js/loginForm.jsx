"use strict";

class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      logEmail: "jack@testing.com", //! testing
      logPassword: "password", //!testing
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
      errorMsg: "Please enter a valid E-mail address.",
      verified: true,
    });
    return false;
  };

  onSubmitHandler = (evt) => {
    evt.preventDefault();
    this.setState({ ...this.state, resendSuccessMsg: null });
    if (!this.verifyEmail()) return;
    // todo if confirmation email from register, remove
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
          window.localStorage.setItem("samplehousetoken", data.token);
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

    submitFetch().then(({ status, data }) => {
      // console.log(status, data.msg);
      if (status !== 200) this.setState({ ...this.state, errorMsg: data.msg });
      else window.location.hash = `resend=${this.state.logEmail}`;
    });
  };

  onChangeHandler = (evt) => {
    this.setState({
      ...this.state,
      [evt.target.name]: evt.target.value,
    });
  };

  componentDidMount() {
    // todo catch #reset/#forgot from successful reset
    if (window.location.hash) {
      //* autofill email on successful register
      if (window.location.hash.includes("#emailSucReg=")) {
        const emailHash = window.location.hash.replace("#emailSucReg=", "");
        this.setState({ ...this.state, logEmail: emailHash });
      }
      //* autofill email on successful verification resend
      else if (window.location.hash.includes("#resend")) {
        const resendHash = window.location.hash.replace("#resend=", "");
        this.setState({
          ...this.state,
          resendSuccessMsg: `A confirmation E-mail has been re-sent to ${resendHash}. If  you did not receive the verification E-mail, please be sure to check your spam folder.`,
          logEmail: resendHash,
        });
      } else if (window.location.hash.includes("#emailSucReset=")) {
        const emailSucResetHash = window.location.hash.replace(
          "#emailSucReset=",
          ""
        );
        // console.log(window.location.hash, emailSucResetHash);
        this.setState({ ...this.state, logEmail: emailSucResetHash });
      }
      window.location.hash = "#";
    }
  }

  render() {
    const { logEmail } = this.state;
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
        <label htmlFor="logEmail">E-mail Address</label>
        <input
          type="text"
          name="logEmail"
          onChange={this.onChangeHandler}
          value={this.state.logEmail}
          required
        />
        <label htmlFor="logPassword">Password</label>
        <input
          type="password"
          name="logPassword"
          onChange={this.onChangeHandler}
          value={this.state.logPassword}
          required
        />
        {/* //todo check if all links are accessable via TAB */}
        <a
          href={`forgot-password.html${logEmail ? "#forgot=" + logEmail : ""}`}
        >
          Forgot Password?
        </a>
        <button type="submit">
          <img src="../assets/lock.png" alt="lock"></img>SIGN IN
        </button>
      </form>
    );
  }
}

const domContainer = document.querySelector("#login");
ReactDOM.render(React.createElement(LoginForm), domContainer);

"use strict";

class resetPassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      token: null,
      email: "",
      newPassword: "",
      confirmPassword: "",
      errorMsg: null,
      successMsg: null,
      redirecting: false,
      redirectingPage: null,
      redirectingUrl: null,
    };
  }
  verifyEmail = () => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (re.test(this.state.email.toLowerCase())) {
      this.setState({ ...this.state, errorMsg: null });
      return true;
    }
    this.setState({
      ...this.state,
      errorMsg: "Please enter a valid E-mail address.",
    });
    return false;
  };

  onSubmitHandler = (evt) => {
    evt.preventDefault();
    //? evt.returnValue = false;
    // window.location.hash = "#";
    // // console.log(this.state);
    // this.setState({ ...this.state, errorMsg: null });
    const { email, newPassword, confirmPassword, token } = this.state;
    if (!this.verifyEmail()) return;
    if (newPassword.length < 7)
      return this.setState({
        ...this.state,
        errorMsg: "Password must have a minimum of 6 characters.",
      });
    if (newPassword !== confirmPassword)
      return this.setState({
        ...this.state,
        errorMsg: "The confirm password confirmation does not match.",
      });

    const submitFetch = async () =>
      await fetch("http://localhost:5000/api/user/resetPassword", {
        method: "POST",
        type: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password: newPassword,
          token,
        }),
      }).then(async (res) => ({ status: res.status, data: await res.json() }));

    submitFetch().then(({ status, data }) => {
      console.log(status, data);
      //? Same code, no changes, sometimes resets form, sometimes it doesn't
      //? Does state have to change to be able to send correctly to API???
      if (status === 403) this.setState({ ...this.state, errorMsg: data.msg });
      else if (status !== 200) {
        window.location.hash = `#errType=${data.type}`;
        // console.log(data.msg);
        //* this is here as catch if page doesn't refresh...
        this.setState({ ...this.state, errorMsg: data.msg });
      }
      //* redirect to login page and autofill email
      // ? Save as a hash and send over? (only if refresh on 200)
      else window.location.hash = "#resetSuccess";
      // window.location.hash = `authentication.html#forgot=${this.state.email}`;
    });
  };

  onChangeHandler = (evt) => {
    this.setState({
      ...this.state,
      [evt.target.name]: evt.target.value,
    });
  };

  componentDidMount() {
    let localRedirectingState = false;
    // console.log(window.location.hash);
    //! Later implement userId in hash to remove need for email
    if (window.location.hash) {
      console.log("hash", window.location.hash);
      if (window.location.hash.includes("#token=")) {
        const token = window.location.hash.replace("#token=", "");
        this.setState({ ...this.state, token });
      }
      //* Page refreshes on submit, so use hash to set error
      else if (window.location.hash.includes("#errType")) {
        const errTypeHash = window.location.hash.replace("#errType=", "");
        let errMsg = null;
        if (errTypeHash === "token-expired") {
          errMsg = "Your forgot password link has expired.";
        } else if (errTypeHash === "wrong-token")
          errMsg =
            "We were unable to find a valid token. Please try the reset password link again in your E-mail.";
        localRedirectingState = errTypeHash === "token-expired" ? true : false;
        this.setState({
          ...this.state,
          errorMsg: errMsg,
          redirecting: errTypeHash === "token-expired" ? true : false,
          redirectingPage: "forgot password",
          redirectingUrl: `forgot-password.html#forgot=${this.state.email}`,
        });
      } else if (window.location.hash.includes("#resetSuccess")) {
        localRedirectingState = true;
        this.setState({
          ...this.state,
          successMsg: "Password has been successfully been changed.",
          redirecting: true,
          redirectingPage: "login",
          redirectingUrl: `authentication.html#emailSucReset=${this.state.email}`,
        });
        // todo add redirect w/ timeout
      }
      //* redirect to authentication form if no token
    } else window.location = "authentication.html";
    if (localRedirectingState)
      setTimeout(() => {
        console.log("REDIRECT");
        window.location = this.state.redirectingUrl;
      }, 5000);
    //   }
    // if (window.location.hash && window.location.hash.includes("forgot=")) {
    //   const hash = window.location.hash.replace("#forgot=", "");
    //   this.setState({
    //     ...this.state,
    //     successMsg: `A email as been sent to ${hash} with a link to reset your password. This link will expire in 6 hours.`,
    //     redirectingForgot: true,
    //   });
    //   window.location.hash = "#";
    //   setTimeout(
    //     () => (window.location = `authentication.html#forgot=${hash}`),
    //     5000
    //   );
    // }
  }

  render() {
    console.log("state", this.state);
    // console.log("errorMsg", this.state.errorMsg);
    return (
      <form
        name="resetPasswordForm"
        id="resetPasswordForm"
        onSubmit={this.onSubmitHandler}
      >
        <h1>Reset Password</h1>
        <p className="error">{this.state.errorMsg}</p>
        <p
          className="success"
          style={{ display: this.state.successMsg ? "block" : "none" }}
        >
          {this.state.successMsg}
        </p>
        {this.state.redirecting ? (
          <p className="redirect">
            You will be redirected to the {this.state.redirectingPage} page in 5
            seconds. If not redirected:{" "}
            <a href={this.state.redirectingUrl}>click here</a>.
          </p>
        ) : null}
        <label htmlFor="email">
          E-mail Address
          <input
            type="text"
            name="email"
            onChange={this.onChangeHandler}
            value={this.state.email}
            required
          />
        </label>
        <label htmlFor="newPassword">
          New Password
          <input
            type="password"
            name="newPassword"
            onChange={this.onChangeHandler}
            value={this.state.newPassword}
            required
          />
        </label>
        <label htmlFor="confirmPassword">
          Confirm Password
          <input
            type="password"
            name="confirmPassword"
            onChange={this.onChangeHandler}
            value={this.state.confirmPassword}
            required
          />
        </label>
        <button type="submit">
          {/* todo change icon */}
          <img src="../assets/lock.png" alt="lock"></img>Reset Password
        </button>
      </form>
    );
  }
}

const domContainer = document.querySelector("#resetPassword");
ReactDOM.render(React.createElement(resetPassword), domContainer);

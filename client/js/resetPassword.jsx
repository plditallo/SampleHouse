"use strict";

class resetPassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "fish0859@gmail.com",
      newPassword: "password",
      confirmPassword: "password",
      errorMsg: null,
      successMsg: null,
      redirecting: false,
      token: null,
    };
  }
  verifyEmail = () => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (re.test(this.state.email.toLowerCase())) return true;
    this.setState({
      ...this.state,
      errorMsg: "Please enter a valid Email address.",
    });
    return false;
  };

  onSubmitHandler = (evt) => {
    evt.preventDefault();
    // window.location.hash = "#";
    // // console.log(this.state);
    this.setState({ ...this.state, errorMsg: null });
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
        errorMsg: "The Confirm Password confirmation does not match.",
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
      console.log(status, data.msg);
      if (status === 403)
        return this.setState({ ...this.state, errMessage: data.msg });
      if (status !== 200) return (window.location.hash = "#token=err");
      // return this.setState({ ...this.state, errorMsg: data.msg });
      else
        window.location.hash = `authentication.html#forgot=${this.state.email}`;
    });
  };

  onChangeHandler = (evt) => {
    this.setState({
      ...this.state,
      [evt.target.name]: evt.target.value,
    });
  };

  componentDidMount() {
    // console.log(window.location.hash);
    //! Later implement userId in hash to remove need for email
    if (window.location.hash && window.location.hash.includes("#token=")) {
      const token = window.location.hash.replace("#token=", "");
      if (token === "err") {
        // todo check this
        this.setState({
          ...this.state,
          errorMsg:
            "We were unable to find a valid token. Your link may have expired. You will be redirected in 5 seconds. If you are not redirected: 'click here'",
        });
        return setTimeout(
          () =>
            (window.location = `forgot-password.html#reset=${this.state.email}`),
          5000
        );
      }
      this.setState({ ...this.state, token });
    } else window.location = "authentication.html";

    // if (window.location.hash && window.location.hash.includes("forgot=")) {
    //   const hash = window.location.hash.replace("#forgot=", "");
    //   this.setState({
    //     ...this.state,
    //     successMsg: `A email as been sent to ${hash} with a link to reset your password. This link will expire in 6 hours.`,
    //     redirecting: true,
    //   });
    //   window.location.hash = "#";
    //   setTimeout(
    //     () => (window.location = `authentication.html#forgot=${hash}`),
    //     5000
    //   );
    // }
  }

  render() {
    //todo find out where this errorMsg from (no email associated with account) is being overridden
    console.log(this.state.errorMsg);
    return (
      <form
        name="resetPasswordForm"
        id="resetPasswordForm"
        onSubmit={this.onSubmitHandler}
      >
        <p className="error">{this.state.errorMsg}</p>
        <p
          className="success"
          style={{ display: this.state.successMsg ? "block" : "none" }}
        >
          {this.state.successMsg}
        </p>
        {this.state.redirecting ? (
          <p className="redirect">
            You will be redirected to the login page in 5 seconds. If not
            redirected: <a href="authentication.html">click here</a>.
          </p>
        ) : null}
        <label htmlFor="email">Email Address</label>
        <input
          type="text"
          name="email"
          onChange={this.onChangeHandler}
          value={this.state.email}
          required
        />
        <label htmlFor="newPassword">New Password</label>
        <input
          type="password"
          name="newPassword"
          onChange={this.onChangeHandler}
          value={this.state.newPassword}
          required
        />
        <label htmlFor="confirmPassword">Confirm Password</label>
        <input
          type="password"
          name="confirmPassword"
          onChange={this.onChangeHandler}
          value={this.state.confirmPassword}
          required
        />
        <button type="submit">
          <img src="../assets/lock.png" alt="lock"></img>Reset Password
        </button>
      </form>
    );
  }
}

const domContainer = document.querySelector("#resetPassword");
ReactDOM.render(React.createElement(resetPassword), domContainer);

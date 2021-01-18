"use strict";

class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      logEmail: "0.joddme99oko@testing.com",
      logPassword: "password",
      errorMsg: null,
      resendMsg: null,
      verified: true,
      validEmail: true,
    };
  }
  render() {
    const verifyEmail = () => {
      const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (!re.test(this.state.logEmail.toLowerCase()))
        this.setState({
          ...this.state,
          errorMsg: "Please enter a valid Email address.",
          validEmail: false,
        });
      else this.setState({ ...this.state, validEmail: true });
    };
    const onSubmitHandler = (evt) => {
      console.log("SUBMIT HANDLER");
      evt.preventDefault();
      verifyEmail();
      if (!this.state.validEmail) return;

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

    const resendVerification = (evt) => {
      evt.preventDefault();
      verifyEmail();
      if (!this.state.validEmail) return;

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
        });
      // todo can't see response, reloading page
      submitFetch()
        .then(async (res) => ({ status: res.status, data: await res.json() }))
        .then(({ status, data }) => {
          console.log(status, data);
          if (status !== 200)
            this.setState({ ...this.state, errorMsg: data.msg });
          else
            this.setState({
              ...this.state,
              errorMsg: null,
              resendMsg: data.msg,
            });
        });
    };

    const onChangeHandler = (evt) => {
      this.setState({
        ...this.state,
        [evt.target.name]: evt.target.value,
      });
    };

    return (
      <form name="loginForm" id="loginForm" onSubmit={onSubmitHandler}>
        <div className="errors">
          <p className="error">
            {this.state.errorMsg}{" "}
            {!this.state.verified ? (
              <span onClick={resendVerification}>
                Click here to resend confirmation email.
              </span>
            ) : null}
          </p>
        </div>
        <label htmlFor="logEmail">Email Address</label>
        <input
          type="text"
          name="logEmail"
          onChange={onChangeHandler}
          value={this.state.logEmail}
        />
        <label htmlFor="logPassword">Password</label>
        <input
          type="password"
          name="logPassword"
          onChange={onChangeHandler}
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

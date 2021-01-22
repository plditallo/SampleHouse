"use strict";

class forgotPassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "fish0859@gmail.co",
      errorMsg: null,
      successMsg: null,
      redirecting: false,
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
  // todo add 'check junk mailbox if you don't receive email'
  onSubmitHandler = (evt) => {
    evt.preventDefault();
    window.location.hash = "#";
    // console.log(this.state);
    this.setState({ ...this.state, successMsg: null });
    if (!this.verifyEmail()) return;
    // console.log(this.state);
    const submitFetch = async () =>
      await fetch("http://localhost:5000/api/user/forgotPassword", {
        method: "POST",
        type: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: this.state.email,
        }),
      });

    submitFetch()
      .then(async (res) => ({ status: res.status, data: await res.json() }))
      .then(({ status, data }) => {
        console.log(status, data);
        if (status !== 200)
          this.setState({ ...this.state, errorMsg: data.msg });
        window.location.hash = `forgot=${this.state.email}`;
      });
  };

  onChangeHandler = (evt) => {
    this.setState({
      ...this.state,
      [evt.target.name]: evt.target.value,
    });
  };

  componentDidMount() {
    if (window.location.hash && window.location.hash.includes("forgot=")) {
      const hash = window.location.hash.replace("#forgot=", "");
      this.setState({
        ...this.state,
        successMsg: `A email as been sent to ${hash} with a link to reset your password. This link will expire in 6 hours.`,
        redirecting: true,
      });
      window.location.hash = "#";
      setTimeout(
        () => (window.location = `authentication.html#forgot=${hash}`),
        5000
      );
    }
  }

  render() {
    return (
      <form
        name="passwordForm"
        id="passwordForm"
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
        />
        <button type="submit">
          <img src="../assets/lock.png" alt="lock"></img>Reset Password
        </button>
      </form>
    );
  }
}

const domContainer = document.querySelector("#forgotPassword");
ReactDOM.render(React.createElement(forgotPassword), domContainer);

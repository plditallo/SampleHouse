"use strict";

class RegisterForm extends React.Component {
  constructor(props) {
    super(props);
    // todo remove state
    this.state = {
      // regEmail: `${Math.random().toString(32)}@testing.com`,
      regEmail: "",
      regPassword: "",
      fname: "",
      lname: "",
      errors: [],
      successMsg: null,
    };
  }

  onSubmitHandler = (evt) => {
    evt.preventDefault();
    // console.log(evt);

    const errState = { ...this.state, errors: [] };
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!re.test(this.state.regEmail.toLowerCase()))
      errState.errors = ["Please enter a valid Email address."];
    if (this.state.regPassword.length < 7)
      errState.errors = [
        ...errState.errors,
        "Password must have a minimum of 6 characters.",
      ];
    if (this.state.fname.length < 3)
      errState.errors = [...errState.errors, "Please enter your first name."];
    if (errState.errors.length) return this.setState(errState);

    const submitFetch = async () =>
      //todo change url
      await fetch("http://localhost:5000/api/user/register", {
        method: "POST",
        type: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: this.state.regEmail,
          password: this.state.regPassword,
          first_name: this.state.fname,
          last_name: this.state.lname.length ? this.state.lname : null,
        }),
      }).then(async (res) => ({ status: res.status, data: await res.json() }));

    submitFetch().then(({ status, data }) => {
      window.location.hash = "#";
      if (status !== 200)
        return this.setState({ ...this.state, errors: [data.msg] });
      console.log(data.msg);
      window.location.hash = this.state.regEmail;
    });
    //todo prevent window from refreshing on successful register
  };
  onChangeHandler = (evt) => {
    this.setState({
      ...this.state,
      [evt.target.name]: evt.target.value,
    });
  };

  componentDidMount() {
    const hash = window.location.hash.replace("#", "");
    if (hash && !this.state.successMsg)
      this.setState({
        ...this.state,
        successMsg: `A confirmation email has been sent to ${hash}.`,
      });
  }

  render() {
    return (
      <form
        name="registerForm"
        id="registerForm"
        onSubmit={this.onSubmitHandler}
      >
        <p>
          Please enter your Email address and a password to create an account.
        </p>
        <span className="success">{this.state.successMsg}</span>
        <div className="errors">
          {this.state.errors.map((e, i) => (
            <p key={i} className="error">
              &#42;{e}
            </p>
          ))}
        </div>
        <div className="name">
          <div>
            <label htmlFor="fname">&#42;First Name</label>
            <input
              type="text"
              name="fname"
              onChange={this.onChangeHandler}
              value={this.state.fname}
              required={true}
            />
          </div>
          <div>
            <label htmlFor="lname">Last Name</label>
            <input
              type="text"
              name="lname"
              onChange={this.onChangeHandler}
              value={this.state.lname}
            />
          </div>
        </div>
        <label htmlFor="regEmail">&#42;Email Address</label>
        <input
          type="text"
          name="regEmail"
          onChange={this.onChangeHandler}
          value={this.state.regEmail}
          required={true}
        />
        <label htmlFor="regPassword">&#42;Password</label>
        <input
          type="password"
          name="regPassword"
          onChange={this.onChangeHandler}
          value={this.state.regPassword}
          required={true}
        />
        <button type="submit">
          <img src="../assets/half-man.png" alt="half-man" />
          CREATE YOUR ACCOUNT
        </button>
      </form>
    );
  }
}

const domContainer = document.querySelector("#register");
ReactDOM.render(React.createElement(RegisterForm), domContainer);

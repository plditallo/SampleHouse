"use strict";

class RegisterForm extends React.Component {
  constructor(props) {
    super(props);
    // todo remove state
    this.state = {
      // regEmail: `${Math.random().toString(32)}@testing.com`,
      regEmail: "0.joddme99oko@testing.com",
      regPassword: "password",
      fname: "",
      lname: "",
      errors: [],
      successMsg: null,
    };
  }
  render() {
    // const form = document.getElementById("registerForm");
    const onSubmitHandler = (evt) => {
      evt.preventDefault();

      const errState = { ...this.state, errors: [] };
      const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (!re.test(this.state.regEmail.toLowerCase()))
        errState.errors = ["Please enter a valid Email address."];
      if (this.state.regPassword.length < 7)
        errState.errors = [
          ...errState.errors,
          "Password must have a minimum of 6 characters.",
        ];
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
            first_name: this.state.fname.length ? this.state.fname : null,
            last_name: this.state.lname.length ? this.state.lname : null,
          }),
        });

      submitFetch()
        .then(async (res) => ({ status: res.status, data: await res.json() }))
        .then(({ status, data }) => {
          if (status !== 200)
            this.setState({ ...this.state, errors: [data.msg] });
          else this.setState({ successMsg: data.msg, errors: [] });
          // window.location.href = "#login";
        });
      //todo prevent window from refreshing on successful register
    };
    const onChangeHandler = (evt) => {
      this.setState({
        ...this.state,
        [evt.target.name]: evt.target.value,
      });
    };

    return (
      <form name="registerForm" id="registerForm" onSubmit={onSubmitHandler}>
        <p>
          Please enter your Email address and a password to create an account.
        </p>
        <span className="success">{this.state.successMsg}</span>
        <div className="errors">
          {this.state.errors.map((e, i) => (
            <p key={i}>&#42;{e}</p>
          ))}
        </div>
        <div className="name">
          <div>
            <label htmlFor="fname">First Name</label>
            <input
              type="text"
              name="fname"
              onChange={onChangeHandler}
              value={this.state.fname}
            />
          </div>
          <div>
            <label htmlFor="lname">Last Name</label>
            <input
              type="text"
              name="lname"
              onChange={onChangeHandler}
              value={this.state.lname}
            />
          </div>
        </div>
        <label htmlFor="regEmail">&#42;Email Address</label>
        <input
          type="text"
          name="regEmail"
          onChange={onChangeHandler}
          value={this.state.regEmail}
        />
        <label htmlFor="regPassword">&#42;Password</label>
        <input
          type="password"
          name="regPassword"
          onChange={onChangeHandler}
          value={this.state.regPassword}
        />
        <button type="submit">
          <img src="../assets/half-man.png" alt="half-man" />
          Create Your Account
        </button>
      </form>
    );
  }
}

const domContainer = document.querySelector("#register");
ReactDOM.render(React.createElement(RegisterForm), domContainer);

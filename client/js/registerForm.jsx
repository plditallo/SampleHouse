"use strict";

class RegisterForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      regEmail: "",
      regPassword: "",
      fName: null,
      lName: null,
      errors: [],
    };
  }
  render() {
    const onSubmitHandler = (evt) => {
      evt.preventDefault();
      //todo check backend for taking fname and lname
      console.log("click");
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

      const Http = new XMLHttpRequest();
      Http.open("POST", "http://localhost:5000/api/user/register", false); //todo change url
      Http.setRequestHeader("Content-Type", "application/json");
      Http.onreadystatechange = (e) => {
        // if (this.readyState === XMLHttpRequest.DONE && this.status === 200)
        // if (this.readyState === XMLHttpRequest.DONE && this.status === 400)
        console.log(Http.responseText);
        alert(Http.responseText);
      };
      Http.send(
        JSON.stringify({
          email: this.state.regEmail,
          password: this.state.regPassword,
          first_name: this.state.fname,
          last_name: this.state.lName,
        })
      );
      //todo redirect after submit or don't refresh and pass "msg": "verification email"
      // return false;
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
        <div className="errors">
          {this.state.errors.map((e, i) => (
            <p key={i}>&#42;{e}</p>
          ))}
        </div>
        <div className="name">
          <div>
            <label htmlFor="fname">First Name</label>
            <input type="text" name="fname" onChange={onChangeHandler} />
          </div>
          <div>
            <label htmlFor="lname">Last Name</label>
            <input type="text" name="lname" onChange={onChangeHandler} />
          </div>
        </div>
        <label htmlFor="regEmail">&#42;Email Address</label>
        <input type="text" name="regEmail" onChange={onChangeHandler} />
        <label htmlFor="regPassword">&#42;Password</label>
        <input type="password" name="regPassword" onChange={onChangeHandler} />
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

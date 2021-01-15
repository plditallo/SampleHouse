"use strict";

class RegisterForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      regEmail: "",
      regPassword: "",
      errors: [],
    };
  }
  render() {
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

      const Http = new XMLHttpRequest();
      Http.open("POST", "http://localhost:5000/api/user/register"); //todo change url
      Http.setRequestHeader("Content-Type", "application/json");
      Http.onreadystatechange = (e) => {
        // if (this.readyState === XMLHttpRequest.DONE && this.status === 200)
        // if (this.readyState === XMLHttpRequest.DONE && this.status === 400)
        console.log(Http.responseText);
      };
      Http.send(
        JSON.stringify({
          email: this.state.regEmail,
          password: this.state.regPassword,
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
        {/* <span>{this.state.errorEmail}</span>
        <span>{this.state.errorPassword}</span> */}
        <input type="text" name="regEmail" onChange={onChangeHandler} />
        <input type="password" name="regPassword" onChange={onChangeHandler} />
        <button type="submit">Create An Account</button>
        <div>
          errors
          {this.state.errors.map((e, i) => (
            <p key={i}>{e}</p>
          ))}
        </div>
      </form>
    );
  }
}

const domContainer = document.querySelector("#register-wrapper");
ReactDOM.render(React.createElement(RegisterForm), domContainer);

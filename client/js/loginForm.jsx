"use strict";

class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const onSubmitHandler = (evt) => {
      evt.preventDefault();
      // console.log(document.querySelector('input[name="email"]').value);
      console.log(this.state);
    };
    const onChangeHandler = (evt) => {
      this.setState({
        ...this.state,
        [evt.target.name]: evt.target.value,
      });
    };
    return (
      <form name="loginForm" id="loginForm" onSubmit={onSubmitHandler}>
        <label htmlFor="logEmail">Email Address</label>
        <input type="text" name="logEmail" onChange={onChangeHandler} />
        <label htmlFor="logPassword">Password</label>
        <input type="password" name="logPassword" onChange={onChangeHandler} />
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

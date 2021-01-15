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
        <input type="text" name="logEmail" onChange={onChangeHandler} />
        <input type="password" name="logPassword" onChange={onChangeHandler} />
        <button type="submit">Create An Account</button>
      </form>
    );
  }
}

const domContainer = document.querySelector("#login-wrapper");
ReactDOM.render(React.createElement(LoginForm), domContainer);

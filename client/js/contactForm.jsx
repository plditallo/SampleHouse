"use strict";

class ContactForm extends React.Component {
  constructor(props) {
    super(props);
    // todo remove state
    this.state = {
      name: "",
      email: "",
      subject: "",
      message: "",
      errors: [],
      successMsg: null,
    };
  }
  onSubmitHandler = (evt) => {
    evt.preventDefault();
    const { email, name, subject, message } = this.state;
    const errState = { ...this.state, errors: [] };
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!re.test(email.toLowerCase()))
      errState.errors = ["Please enter a valid Email address."];
    if (name.length < 3)
      errState.errors = [...errState.errors, "Please enter your name."];
    if (errState.errors.length) return this.setState(errState);

    const submitFetch = async () =>
      //todo change url
      await fetch("http://localhost:5000/api/contact", {
        method: "POST",
        type: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          subject,
          message,
        }),
      }).then(async (res) => ({ status: res.status, data: await res.json() }));
    submitFetch().then(({ status, data }) => {
      if (status !== 200)
        return this.setState({ ...this.state, errors: [data.msg] });
      // window.location.hash = `contactSuccessful`;
      return this.setState({
        ...this.state,
        successMsg: data.msg,
        name: "",
        email: "",
        subject: "",
        message: "",
        errors: [],
      });
    });
  };
  onChangeHandler = (evt) => {
    this.setState({
      ...this.state,
      [evt.target.name]: evt.target.value,
    });
  };

  // componentDidMount() {
  //   if (
  //     window.location.hash &&
  //     window.location.hash.includes("#contactSuccessful")
  //   ) {
  //     window.location.hash = "#";
  //     this.setState({
  //       ...this.state,
  //       successMsg: `Successfully submitted. Please expect a reply within 48-72 hours.`,
  //     });
  //   }
  // }

  render() {
    return (
      <form name="contactForm" id="contactForm" onSubmit={this.onSubmitHandler}>
        <span className="success">{this.state.successMsg}</span>
        <div className="errors">
          {this.state.errors.map((e, i) => (
            <p key={i} className="error">
              &#42;{e}
            </p>
          ))}
        </div>
        <label htmlFor="name">&#42;Name</label>
        <input
          type="text"
          name="name"
          onChange={this.onChangeHandler}
          value={this.state.name}
          required
        />
        <label htmlFor="email">&#42;Email Address</label>
        <input
          type="text"
          name="email"
          onChange={this.onChangeHandler}
          value={this.state.email}
          required
        />
        <label htmlFor="subject">&#42;Subject</label>
        <input
          type="text"
          name="subject"
          onChange={this.onChangeHandler}
          value={this.state.subject}
          required
        />
        <label htmlFor="message">&#42;Message</label>
        <textarea
          type="textarea"
          name="message"
          onChange={this.onChangeHandler}
          value={this.state.message}
          //   rows="4"
          //   cols="40"
          maxLength="250"
          required
        />
        <input
          type="hidden"
          class="anti-spam"
          style={{ display: "none", position: "absolute" }}
        />
        <span className="text-counter">{250 - this.state.message.length}</span>
        <button type="submit">
          <img src="../assets/half-man.png" alt="half-man" />
          Submit
        </button>
      </form>
    );
  }
}

const domContainer = document.querySelector("#contact");
ReactDOM.render(React.createElement(ContactForm), domContainer);

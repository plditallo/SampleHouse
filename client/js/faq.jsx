"use strict";

class Faq extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const data = [
      {
        question: "question 1",
        answer:
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugiat possimus amet magnam nulla nihil velit dolore sequi soluta fuga omnis dolores.",
      },
      {
        question: "question 2",
        answer:
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugiat possimus amet magnam nulla nihil velit dolore sequi soluta fuga omnis dolores.",
      },
      {
        question: "question 3",
        answer:
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugiat possimus amet magnam nulla nihil velit dolore sequi soluta fuga omnis dolores.",
      },
      {
        question: "question 4",
        answer:
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugiat possimus amet magnam nulla nihil velit dolore sequi soluta fuga omnis dolores.",
      },
    ];
    return (
      <div>
        <h2>FAQ's</h2>
        {data.map((e, i) => (
          <div className="question" key={i}>
            <p>{e.question}</p>
            <p>{e.answer}</p>
          </div>
        ))}
      </div>
    );
  }
}

const domContainer = document.querySelector("#faq");
ReactDOM.render(React.createElement(Faq), domContainer);

"use strict";

class Product extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const data = [
      {
        img: "../assets/logo.png",
        alt: "img alt",
        title: "Title1",
        text:
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. Aut cumque,temporibus iure facere asperiores illo,",
      },
      {
        img: "../assets/logo.png",
        alt: "img alt",
        title: "Title2",
        text:
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. Aut cumque,temporibus iure facere asperiores illo,",
      },
      {
        img: "../assets/logo.png",
        alt: "img alt",
        title: "Title3",
        text:
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. Aut cumque,temporibus iure facere asperiores illo,",
      },
      {
        img: "../assets/logo.png",
        alt: "img alt",
        title: "Title4",
        text:
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. Aut cumque,temporibus iure facere asperiores illo,",
      },
    ];
    return data.map((e, i) => (
      <div class="product" key={i}>
        <img src={e.img} alt={e.alt} />
        <h5>{e.title}</h5>
        <p>{e.text}</p>
      </div>
    ));
  }
}

const domContainer = document.querySelector("#products");
ReactDOM.render(React.createElement(Product), domContainer);

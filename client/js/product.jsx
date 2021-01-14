"use strict";

class Product extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const data = [
      {
        img: "../assets/music_recording_studio_closeup.png",
        alt: "img alt",
        title: "Inspiring Creativity",
        text:
          "Royalty-free loops,samples, and MIDI files to start your projects. State-of-the-art VST instruments. Exclusive loops limited to one user and then removed from the site.",
      },
      {
        img: "../assets/subscription.png",
        alt: "img alt",
        title: "Subscription",
        text: `Your monthly subscription plan includes pre-loaded credits that allow you to download Sample.House products. If you don’t use all of your credits, they will roll over into the next month. Choose from one of our three subscription plans.`,
        // todo get anchor tag working here for subscription plans
      },
      {
        img: "../assets/vst_sound_mixing_board.png",
        alt: "img alt",
        title: "VST's & Virtual Instruments",
        text:
          "We develop customized VST’s & VSTi’s that provide unique sounds for any genre of music. Best of all, every plugin is free with our Standard & Studio plans!",
      },
      {
        img: "../assets/blue_sound_wave_form.png",
        alt: "img alt",
        title: "One-Shot Samples",
        text:
          "Browse our catalog of thousands of one-shot samples. From drums and percussion, to brass and woodwinds. We have your covered.",
      },
      {
        img: "../assets/blue_sound_wave_form.png",
        alt: "img alt",
        title: "Loops & MIDI Files",
        text:
          "Our unique loops & MIDI files are composed with the modern producer in mind. We upload the highest quality of sounds to get your projects started.",
      },
      {
        img: "../assets/demos_videos_courses.png",
        alt: "img alt",
        title: "Demonstration Videos & Courses",
        text:
          "Watch our demonstration videos & courses to discover the best production tips& tricks to make a better composition.",
      },
      // {
      //   img: "../assets/exclusive_loops.png",
      //   alt: "img alt",
      //   //todo span bold here
      //   text:
      //     "<span>No more duplicate samples</span> used on hundreds of songs. Once a loop is downloaded,it is removed from the site.You will be the only person with that loop!Search our exclusive loops library with new loops added every day!",
      // },
    ];
    return data.map((e, i) => (
      <div className="product" key={i}>
        <img src={e.img} alt={e.alt} />
        <h3>{e.title}</h3>
        <p>{e.text}</p>
      </div>
    ));
  }
}

const domContainer = document.querySelector("#products");
ReactDOM.render(React.createElement(Product), domContainer);

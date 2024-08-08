import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const TestimonialData = [
  {
    id: 1,
    name: "Rakesh",
    text: "  Lorem ipsum dolor sit amet consectetur adipisicing elit. Perferendis quasi dignissimos nihil quo voluptates tenetur aspernatur earum recusandae et aliquid.",
    img: "https://picsum.photos/101/101",
  },
  {
    id: 2,
    name: "Rameshwor",
    text: "  Lorem ipsum dolor sit amet consectetur adipisicing elit. Perferendis quasi dignissimos nihil quo voluptates tenetur aspernatur earum recusandae et aliquid.",
    img: "https://picsum.photos/102/102",
  },
  {
    id: 3,
    name: "Jaydev",
    text: "  Lorem ipsum dolor sit amet consectetur adipisicing elit. Perferendis quasi dignissimos nihil quo voluptates tenetur aspernatur earum recusandae et aliquid.",
    img: "https://picsum.photos/103/103",
  },
];

const Testimonial = () => {
  var settings = {
    dots: true,
    arrows: false,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    cssEase: "linear",
    pauseOnHover: true,
    pauseOnFocus: true,
    responsive: [
      {
        breakpoint: 10000,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };
  return (
    <div className="py-10">
      <div className="container">
        <div className=" md:text-center font-public_sans">
          <h1 className="text-4xl md:text-5xl font-bold mt-2 text-gray-800">
            What Our Customer Says
          </h1>
          <p className="text-xs text-gray-400 pt-4 ">
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Minima
            voluptas ex sint? Praesentium, dolor odio veritatis laudantium
            pariatur inventore voluptates obcaecati illum accusantium a culpa.
          </p>
        </div>

        <Slider {...settings}>
          {TestimonialData.map(({ id, name, text, img }) => {
            return (
              <div key={id} className="my-6">
                <div className="flex flex-col justify-center items-center gap-4 text-center shadow-lg p-4 mx-4 rounded-xl bg-primary/10 relative">
                  <img
                    src={img}
                    alt=""
                    className="rounded-full block mx-auto"
                  />
                  <h1 className="text-xl font-bold "> {name}</h1>
                  <p className="text-gray-500 text-sm">{text}</p>
                  <p className=" text-black/20 text-9xl font-serif absolute top-0 right-0">
                    ,,
                  </p>
                </div>
              </div>
            );
          })}
        </Slider>
      </div>
    </div>
  );
};

export default Testimonial;

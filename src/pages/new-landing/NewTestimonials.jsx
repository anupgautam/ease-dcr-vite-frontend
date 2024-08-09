import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import PersonIcon from "@mui/icons-material/Person";
import PlaceIcon from "@mui/icons-material/Place";
const TestimonialData = [
  {
    id: 1,
    name: "Rakesh",
    place: "London",
    text: "  Lorem ipsum dolor sit amet consectetur adipisicing elit. Perferendis quasi dignissimos nihil quo voluptates tenetur aspernatur earum recusandae et aliquid.",
    // img: "https://picsum.photos/101/101",
  },
  {
    id: 2,
    name: "Rameshwor",
    place: "Belgium",
    text: "  Lorem ipsum dolor sit amet consectetur adipisicing elit. Perferendis quasi dignissimos nihil quo voluptates tenetur aspernatur earum recusandae et aliquid.",
    // img: "https://picsum.photos/102/102",
  },
  {
    id: 3,
    name: "Jaydev",
    place: "Dubai",
    text: "  Lorem ipsum dolor sit amet consectetur adipisicing elit. Perferendis quasi dignissimos nihil quo voluptates tenetur aspernatur earum recusandae et aliquid.",
    // img: "https://picsum.photos/103/103",
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
          <h1 className="text-[28px] md:text-[38px] font-bold mt-2 text-[#3e3d48]">
            What Our Customer Says
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-gray-600 ">
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Minima
            voluptas ex sint? Praesentium, dolor odio veritatis laudantium
            pariatur inventore voluptates obcaecati illum accusantium a culpa.
          </p>
        </div>

        <Slider {...settings}>
          {TestimonialData.map(({ id, name, text, place }) => {
            return (
              <div key={id} className="my-6">
                <div className="flex flex-col justify-center items-center gap-1 text-center shadow-lg p-4 mx-4 rounded-xl relative">
                  <PersonIcon className="rounded-full text-8xl   mx-auto" />

                  <h1 className="text-xl font-bold "> {name}</h1>
                  <div className="flex gap-1 justify-start items-center text-gray-500">
                    <PlaceIcon fontSize="30px" />
                    <h3>{place}</h3>
                  </div>
                  <p className="text-gray-500 text-sm mt-4">{text}</p>
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

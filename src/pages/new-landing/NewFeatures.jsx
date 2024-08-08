import Img1 from "../../../public/assets/images/features/invoice-create.png";
import Img2 from "../../../public/assets/images/features/chatbox.png";
import Img3 from "../../../public/assets/images/features/dashboard.png";
import Img4 from "../../../public/assets/images/features/leads.png";

const images = [
  {
    src: Img1,
    title: "Interesting quotes in two clicks",
    description:
      "Create professional-looking quotations quickly using a user-friendly interface.",
  },
  {
    src: Img2,
    title: "Seamless communication",
    description:
      "Communication is key. Incoming emails are automatically added to your pipeline, and all contact with your team and customers is made from one place.",
  },
  {
    src: Img3,
    title: "Efficient Dashboard",
    description:
      "Manage and analyze your sales data effectively with a comprehensive dashboard.",
  },
  {
    src: Img4,
    title: "Lead Management",
    description:
      "Organize and track your leads to convert more prospects into customers.",
  },
];

const NewFeature = () => {
  return (
    <div className="py-10">
      <div className="container ">
        <div className="md:text-center font-public_sans">
          <h1 className="text-4xl md:text-5xl font-bold mt-2 text-gray-800">
            Features of Ease SFA
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-gray-600">
            All our features are the best in Sales Management to date,
            <br />
            learn now to be more confident
          </p>
        </div>

        <div className="grid grid-cols-1  lg:grid-cols-3 gap-8 mt-4 md:mt-10">
          {images.map((image, index) => (
            <div
              key={index}
              className={`border p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 ${
                index === 1 || index === 2 ? "lg:col-span-2" : "lg:col-span-1"
              }`}
            >
              <img
                src={image.src}
                alt={`Feature ${index}`}
                className="w-full object-cover h-40 sm:h-48 md:h-56 lg:h-64 rounded-t-lg"
              />
              <div className="p-4 text-left">
                <h2 className="text-lg font-semibold">{image.title}</h2>
                <p className="text-sm text-gray-500 mt-2">
                  {image.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NewFeature;

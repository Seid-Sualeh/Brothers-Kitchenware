import { Carousel } from "react-responsive-carousel";
import { img } from "./Images/data";
import "react-responsive-carousel/lib/styles/carousel.min.css";
const CarouselEffect = () => {
  return (
    <Carousel
      autoPlay={true}
      infiniteLoop={true}
      showIndicators={false}
      showThumbs={false}
      showStatus={false}
      className="absolute inset-0 w-full h-full"
    >
      {img?.map((imageItemLink, index) => {
        return (
          <div key={index} className="h-full">
            <img
              src={imageItemLink}
              className="w-full h-full object-cover opacity-90"
              alt={`Carousel ${index + 1}`}
            />
          </div>
        );
      })}
    </Carousel>
  );
};

export default CarouselEffect;

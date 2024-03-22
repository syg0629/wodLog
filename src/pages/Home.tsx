import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import crossfit1 from "../assets/crossfit1.jpg";
import crossfit2 from "../assets/crossfit2.jpg";
import crossfit3 from "../assets/crossfit3.jpg";
import "./Home.css";
import Wod from "./Wod";
import Notice from "./Notice";

const Home = () => {
  return (
    <div>
      <Swiper
        spaceBetween={10}
        centeredSlides={true}
        autoplay={{
          delay: 8000,
          disableOnInteraction: false,
        }}
        loop={true}
        pagination={{
          clickable: true,
        }}
        navigation={true}
        modules={[Autoplay, Pagination, Navigation]}
        className="mySwiper"
      >
        <SwiperSlide>
          <img src={crossfit1} />
        </SwiperSlide>
        <SwiperSlide>
          <img src={crossfit2} />
        </SwiperSlide>
        <SwiperSlide>
          <img src={crossfit3} />
        </SwiperSlide>
      </Swiper>

      <div className="home_menu_wrapper">
        <div className="notice">
          <Notice />
        </div>
        <div className="wod">
          <Wod />
        </div>
      </div>
    </div>
  );
};

export default Home;
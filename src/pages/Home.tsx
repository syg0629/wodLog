import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import crossfit1 from "../assets/crossfit1.jpg";
import crossfit2 from "../assets/crossfit2.jpg";
import crossfit3 from "../assets/crossfit3.jpg";
import "./Home.css";
import ContentList from "../components/common/Content/ContentList";
import DetailContent from "../components/common/Content/DetailContent";

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
          <img src={crossfit1} alt="박스 점프를 하는 사람" />
        </SwiperSlide>
        <SwiperSlide>
          <img src={crossfit2} alt="데드리프트를 하는 사람" />
        </SwiperSlide>
        <SwiperSlide>
          <img src={crossfit3} alt="백스쿼트를 하는 사람" />
        </SwiperSlide>
      </Swiper>

      <div className="home_menu_wrapper">
        <div className="wod">
          <DetailContent contentType="wod" />
        </div>
        <div className="notice">
          <ContentList contentType="notice" />
        </div>
      </div>
    </div>
  );
};

export default Home;
